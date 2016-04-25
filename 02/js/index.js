(function() {
  'use strict';

  var
    context, analyser, frequencies, getInputVolumeTotal, draw,
    elImages, index, remap, getRandomInt, volumeBefore;
  
  // 音量取得準備
  context = new AudioContext();
  analyser = context.createAnalyser();
  analyser.maxDecibels = -50;
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

  // 音量を取得し、画像の透明度に反映する
  elImages = document.getElementsByClassName('image');
  index = 0;
  remap = function(value, start1, stop1, start2, stop2) {
    return ((stop2 - start2) / (stop1 - start1)) * (value - start1) + start2;
  };
  getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  (draw = function() {
    var volumeTotal;
    volumeTotal = getInputVolumeTotal();
    elImages[index].style.opacity =
      remap(volumeTotal, 0, frequencies.length * 255, 0, 1);
    elImages[index].style.transform =
      'rotate(' + getRandomInt(-1, 1) + 'deg)';
    if (volumeBefore !== volumeTotal && volumeTotal === 0) {
      index = getRandomInt(0, elImages.length - 1);
    }
    volumeBefore = volumeTotal;
    requestAnimationFrame(draw);
  })();
})();