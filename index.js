
// Monkey patch Buffer
require('./lib/monkey');

var assert = require('assert');
var events = require('events');
var EventEmitter = events.EventEmitter;

var Protocol = require('./lib/protocol');

var EMPTY = new Buffer(0);
var WRITE = new Buffer('21433412', 'hex'); // 43211234
var READ = new Buffer('65877856', 'hex'); // 87655678

var SL_SEC_TYPE_OPEN = 0x00;
var SL_SEC_TYPE_WPA_WPA2 = 0x02;

var SL_DEVICE_GENERAL_CONFIGURATION = 0x01;
var SL_DEVICE_STATUS = 0x02;

var SL_DEVICE_GENERAL_CONFIGURATION_DATE_TIME = 0x0B;
var SL_DEVICE_GENERAL_VERSION = 0x0C;

var SL_EVENT_CLASS_WLAN = 0x02;

var SL_POLICY_CONNECTION = 0x10;
var SL_POLICY_SCAN       = 0x20;
var SL_POLICY_PM         = 0x30;
var SL_POLICY_P2P        = 0x40;

function CC3100(port) {
  EventEmitter.call(this);

  this.protocol = new Protocol(port);

  this.protocol.on('ready', this.emit.bind(this, 'ready'));

}

CC3100.prototype = Object.create(EventEmitter.prototype);

CC3100.prototype.getVersion = function (cb) {

  var desc = new Buffer(8);

  desc.writeUInt16LE(0x0000, 0);
  desc.writeUInt16LE(SL_DEVICE_GENERAL_CONFIGURATION, 2);
  desc.writeUInt16LE(SL_DEVICE_GENERAL_VERSION, 4);
  desc.writeUInt16LE(0x0000, 6);

  this.protocol.send(0x8466, desc, EMPTY, function (err, msg) {
    if (err) { return cb(err); }

    var payload = msg.data.slice(8);

    cb(null, {
      chipId: payload.readUInt32TI(0),
      fwVersion: [
        payload.readUInt32TI( 4),
        payload.readUInt32TI( 8),
        payload.readUInt32TI(12),
        payload.readUInt32TI(16)
      ],
      phyVersion: [
        payload.readUInt8(20),
        payload.readUInt8(21),
        payload.readUInt8(22),
        payload.readUInt8(23)
      ],
      nwpVersion: [
        payload.readUInt32TI(24),
        payload.readUInt32TI(28),
        payload.readUInt32TI(32),
        payload.readUInt32TI(36)
      ],
      romVersion: payload.readUInt16LE(40)
    });
  });

};

CC3100.prototype.connect = function (ssid, password, cb) {
  if (!password) { password = ''; }

  var desc = new Buffer(3 + ssid.length + password.length);

  if (password) {
    desc[0] = SL_SEC_TYPE_WPA_WPA2;
    desc[2] = password.length;
  } else {
    desc[0] = SL_SEC_TYPE_OPEN;
    desc[2] = 0;
  }

  desc[1] = ssid.length;

  desc.write(ssid, 3, ssid.length, 'ascii');
  desc.write(password, 3 + ssid.length, password.length, 'ascii');

  this.protocol.send(0x8C80, desc, EMPTY, cb);
};

CC3100.prototype.scanForNetworks = function (cb) {

  SL_POLICY_SCAN


};


exports.use = function (port) {
  return new CC3100(port);
};
