
var assert = require('assert');
var events = require('events');
var EventEmitter = events.EventEmitter;

var MSG = require('./msg');

var READ = new Buffer('65877856', 'hex'); // 87655678

module.exports = Protocol;

function Protocol(port) {

  this.CS = port.pin['G1'];
  this.IRQ = port.pin['G2'];
  this.nHIB = port.pin['G3'];

  this.spi = new port.SPI({
    // clockSpeed: 20*1E6, // 20MHz
    clockSpeed: 4*1E6, // 4MHz
    cpol: 0,
    cpha: 0,
    bitOrder: 'MSB',
    chipSelect: this.CS,
    chipSelectActive: 'low'
  });

  var reponseHandlers = {};
  this.reponseHandlers = reponseHandlers;

  this.once('ready', function () {
    this.on('message', function (msg) {
      if (reponseHandlers[msg.opcode]) {
        reponseHandlers[msg.opcode](msg);
      } else {
        throw new Error('FIXME');
      }
    });
  });

  this.setupLogging();
  this.setupIRQ();

  this.init();

}

Protocol.prototype = Object.create(EventEmitter.prototype);

Protocol.prototype.init = function () {

  var done = this.emit.bind(this, 'ready');
  var pull = this.nHIB.pull.bind(this.nHIB);

  setTimeout(pull,  0, 'pulldown');
  setTimeout(pull, 10, 'pullup');

  this.once('message', function (msg) {
    assert.equal(msg.opcode, 0x0008); // sl_Start
    assert.equal(msg.status, 0x0000);
    assert.equal(msg.data.readUInt32LE(0), 0x11111111);
    done();
  });

}

Protocol.prototype.setupLogging = function () {

  this.IRQ.on('change', console.log.bind(console, 'IRQ'));

  var oSend = this.spi.send;
  this.spi.send = function (buf, cb) {
    console.log('spi.send', buf);
    oSend.apply(this, arguments);
  };

  var oReceive = this.spi.receive;
  this.spi.receive = function (len, cb) {
    oReceive.call(this, len, function (err, buf) {
      if (err) { return cb(err); }
      console.log('spi.receive', buf);

      cb(null, buf);
    });
  };

}

Protocol.prototype.setupIRQ = function () {

  var irq = this.IRQ;
  var spi = this.spi;
  var emit = this.emit.bind(this);

  function doTheRead(cb) {
    spi.send(READ, function (err) {
      if (err) { return cb(err); }

      function receive(bytes, cb) {
        spi.receive(bytes, cb);
      }

      MSG.parse(receive, function (err, msg) {
        if (err) { return cb(err); }

        console.log('MSG.parse', msg);
        cb(null, msg);
      });

    });
  }

  function readCompleted(err, msg) {
    if (err) { return emit('error', err); }

    emit('message', msg);
    scheduleNext();
  }

  function scheduleNext() {
    if (irq.read() === 1) {
      console.log('The CC3100 wants your attention!');
      doTheRead(readCompleted)
    } else {
      irq.once('rise', function () {
        console.log('The CC3100 wants your attention!');
        doTheRead(readCompleted);
      });
    }
  }

  irq.once('rise', function () {
    console.log('The CC3100 wants your attention!');
    doTheRead(readCompleted);
  });

}

Protocol.prototype.send = function (opcode, descriptors, payload, cb) {

  var raw = MSG.create(opcode, descriptors, payload);
  var resId = (opcode ^ 0x8000);
  var handleTable = this.reponseHandlers;

  function done(err, msg) {
    handleTable[resId] = null;
    cb(err, msg);
  }

  handleTable[resId] = function (msg) {
    done(null, msg);
  };

  this.spi.send(raw, function (err) {
    if (err) { return done(err); }
  });

  setTimeout(function () {
    done(new Error('Timeout waiting for response to 0x' + opcode.toString(16)));
  }, 5000);

};
