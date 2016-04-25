(function() {
  'use strict';
  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {};
  }
  if (navigator.mediaDevices.getUserMedia) {
    return;
  }
  navigator.mediaDevices.getUserMedia = function(constraints) {
    var getUserMedia = 
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      null;
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }
    return new Promise(function(resolve, reject) {
      getUserMedia.apply(navigator, [constraints, resolve, reject]);
    });
  };
})();