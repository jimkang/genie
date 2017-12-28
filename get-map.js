var request = require('basic-browser-request');
var RoteResponse = require('./rote-response');
var callNextTick = require('call-next-tick');

const initialMap = `
      xoxxxvxxx
      xxmxxxxoxx
      moxxo
      xxovpxxxxx
      oxvxo
    `;

function getMap(url, done) {
  if (!url) {
    callNextTick(done, null, initialMap);
  } else {
    request({ url, method: 'GET' }, RoteResponse({ url, done }));
  }
}

module.exports = getMap;
