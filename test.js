
var CC3100 = require('./');
var tessel = require('tessel');

var wlan = CC3100.use(tessel.port['B']);

wlan.on('ready', function () {
  console.log('Ready!');

  setTimeout(function () {


    // wlan.getVersion(function (err, ver) {
    //   console.log('.getVersion', err, ver);
    // });


    wlan.connect('FlatRoof', null, function (err) {
      console.log('wlan.connect', err);
    });


  }, 1000);

});

// setTimeout(function () {
//
//   console.log('Connecting...');
//
//   wlan.connect('FlatRoof', null, function (err) {
//     console.log('wlan.connect', err);
//   });
//
// }, 5000);
