
CC3100.prototype._interrupt = function () {

  return ;

  //
  // spi.lock(function (err, lock) {
  //   if (err) { return onError(err); }
  //
  //   console.log(1);
  //
  //   function receive(bytes, cb) {
  //     lock.rawReceive(bytes, cb);
  //   }
  //
  //   lock.rawSend(READ, function (err) {
  //     if (err) { return onError(err); }
  //     console.log(2);
  //     MSG.parse(receive, function (err, msg) {
  //       if (err) { return onError(err); }
  //
  //       console.log('MSG.parse', msg);
  //
  //       lock.release(function (err) {
  //         if (err) { return onError(err); }
  //
  //         // FIXME: deal with the data
  //       });
  //     });
  //   });
  //
  // });

  //
  // spi.send(READ, function (err) {
  //   if (err) { return onError(err); }
  //
  //   irq.once('fall', function () {
  //
  //     function receive(bytes, cb) {
  //       spi.receive(bytes, cb);
  //     }
  //
  //     MSG.parse(receive, function (err, msg) {
  //       if (err) { return onError(err); }
  //
  //       console.log('MSG.parse', msg);
  //       onMsg(msg);
  //     });
  //
  //   });
  //
  // });



  //
  // spi.send(READ, function (err) {
  //   console.log('spi.send', err, READ);
  //
  //   function again() {
  //     spi.receive(4, function (err, data) {
  //       console.log('spi.receive', err, data);
  //       again();
  //     });
  //   }
  //
  //   again();
  //
  //   // spi.receive(256, function (err, data) {
  //   //   console.log('spi.receive', err, data);
  //   //
  //   //
  //   //   console.log('MSG.parse', MSG.parse(data));
  //   //
  //   //
  //   // });
  // });

};

CC3100.prototype.init = function () {

};
