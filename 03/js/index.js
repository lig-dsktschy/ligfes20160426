(function() {
  'use strict';

  var
    context, analyser, frequencies, getInputVolumeTotal, draw,
    elementsMaps, getRandomInt, positionRandomly, scrollObj, remap;
  
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

  // svg要素をランダムに配置する
  elementsMaps = [
    {
      elements: document.getElementsByClassName('star'),
      top: {unit: 'em', min: 200, max: 500 - 1},
      left: {unit: '%', min: 0, max: 100 - 6},
      width: {unit: '%', min: 3, max: 6}
    },
    {
      elements: document.getElementsByClassName('cloud'),
      top: {unit: 'em', min: 500, max: 800 - 1},
      left: {unit: '%', min: 0, max: 100 - 24},
      width: {unit: '%', min: 16, max: 24}
    },
    {
      elements: document.getElementsByClassName('drop'),
      top: {unit: 'em', min: 800, max: 1100 - 1},
      left: {unit: '%', min: 0, max: 100 - 4},
      width: {unit: '%', min: 1, max: 4}
    },
    {
      elements: document.getElementsByClassName('zawa'),
      top: {unit: 'em', min: 1150, max: 1450 - 1},
      left: {unit: '%', min: 0, max: 100 - 18},
      width: {unit: '%', min: 10, max: 18}
    }
  ];
  getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  positionRandomly = function(argMap) {
    Array.prototype.slice.call(argMap.elements).forEach(function(element) {
      element.style.top = 
        getRandomInt(argMap.top.min, argMap.top.max) + argMap.top.unit;
      element.style.left = 
        getRandomInt(argMap.left.min, argMap.left.max) + argMap.left.unit;
      element.style.width = 
        getRandomInt(argMap.width.min, argMap.width.max) + argMap.width.unit;
    });
  };
  elementsMaps.map(positionRandomly);
  document.getElementsByClassName('svg-container')[0].classList.remove('is-hide');

  // 音量を取得し、スクロール量に反映する
  document.body.scrollTop = 1;
  scrollObj = document.body.scrollTop ? document.body : document.documentElement;
  document.body.scrollTop = 0;
  remap = function(value, start1, stop1, start2, stop2) {
    return ((stop2 - start2) / (stop1 - start1)) * (value - start1) + start2;
  };
  (draw = function() {
    scrollObj.scrollTop +=
      remap(getInputVolumeTotal(), 0, frequencies.length * 255, 0, 100);
    requestAnimationFrame(draw);
  })();
})();