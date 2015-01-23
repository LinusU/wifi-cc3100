
var WRITE = new Buffer('21433412', 'hex'); // 43211234

function MSG() {}

MSG.create = function (opcode, descriptors, payload) {

  var header = new Buffer(8);
  var length = descriptors.length + payload.length;

  WRITE.copy(header, 0, 0, 4);
  header.writeUInt16LE(opcode, 4);
  header.writeUInt16LE(length, 6);

  return Buffer.concat([header, descriptors, payload]);
};

// MSG.parse = function (raw) {
//
//   var start;
//
//   for (start=0; start<raw.length; start+=4) {
//     if (raw[start + 1] === 0xdc && raw[start + 2] === 0xcd && raw[start + 3] === 0xab) {
//       break;
//     }
//   }
//
//   var opcode = raw.readUInt16LE(start + 4);
//   var length = raw.readUInt16LE(start + 6);
//   var status = raw.readUInt32LE(start + 8);
//
//   var data = raw.slice(start + 12, start + 8 + length);
//
//   return {
//     opcode: opcode,
//     status: status,
//     data: data
//   };
// };

MSG.parse = function (receive, cb) {

  var tries = 0, sync = false;
  var opcode, length, status;

  function isD2H(data) {
    return (data[1] === 0xDC && data[2] === 0xCD && data[3] === 0xAB);
  }

  function searchForSync() {

    if (tries++ > 32) {
      return cb(new Error('Timeout waiting for sync'));
    }

    receive(4, function (err, data) {
      if (err) { return cb(err); }

      if (!sync && isD2H(data)) {
        sync = true;
      }

      if (sync && !isD2H(data)) {
        readHeader(data);
      } else {
        searchForSync();
      }
    });
  }

  function readHeader(data) {

    opcode = data.readUInt16LE(0);
    length = data.readUInt16LE(2);

    console.log('length', length);

    readBody();
  }

  function readBody() {
    receive(length, function (err, data) {
      if (err) { return cb(err); }

      cb(null, {
        opcode: opcode,
        status: data.readUInt32TI(0),
        data: data.slice(4)
      });
    });
  }

  searchForSync();
};

// MSG.parse = function (receive, cb) {
//   receive(256, function (err, raw) {
//     if (err) { return cb(err); }
//
//     var start, found = false;
//
//     for (start=0; start<raw.length; start+=4) {
//       var inHere = (raw[start + 1] === 0xdc && raw[start + 2] === 0xcd && raw[start + 3] === 0xab);
//
//       if (!found && inHere) {
//         found = true;
//       }
//
//       if (found && !inHere) {
//         break;
//       }
//
//     }
//
//     var opcode = raw.readUInt16LE(start + 0);
//     var length = raw.readUInt16LE(start + 2);
//     var status = raw.readUInt32LE(start + 4);
//
//     var data = raw.slice(start + 8, start + 4 + length);
//
//     cb(null, {
//       opcode: opcode,
//       status: status,
//       data: data
//     });
//   });
// }

module.exports = MSG;
