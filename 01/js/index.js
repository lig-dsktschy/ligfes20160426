(function() {
  'use strict';

  var context, analyser, frequencies, getInputVolumeTotal, elVolumeTotal, draw;
  
  // 音量取得準備
  context = new AudioContext();
  analyser = context.createAnalyser();
  frequencies = new Uint8Array(analyser.frequencyBinCount);
  getInputVolumeTotal = function() {
    analyser.getByteFrequencyData(frequencies);
    return frequencies.reduce(function(previous, current) {
      return previous + current;
    });
  };
  navigator.mediaDevices.getUserMedia({audio: true})
    .then(function(stream) {
      window.hackForMozzila = stream;
      context.createMediaStreamSource(stream).connect(analyser);
    })
    .catch(function(e) {
      alert(e.message);
    });

  // 音量を取得し、表示する
  elVolumeTotal = document.getElementsByClassName('volume-total')[0];
  (draw = function() {
    elVolumeTotal.innerHTML = getInputVolumeTotal();
    requestAnimationFrame(draw);
  })();
})();