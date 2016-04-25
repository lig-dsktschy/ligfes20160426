(function() {
  'use strict';

  var context, analyser, frequencies, getInputVolumeTotal, elVolumeTotal, draw;
  
  // AudioContext: WebAudioAPI 利用に必要なオブジェクト
  context = new AudioContext();

  // AnalyserNode: WebAudioAPI で音声の解析情報を表現するオブジェクト
  analyser = context.createAnalyser();

  // 解析対象の音声データを格納するための型付き配列(Uint8Array: 符号なし8bit整数の配列)
  // 要素数は AnalyserNode.frequencyBinCount(=== AnalyserNode.fftSize / 2) 個に設定
  //   参考: http://curtaincall.weblike.jp/portfolio-web-sounder/webaudioapi-visualization/draw-wave
  //   参考: http://www.tij.co.jp/lsds/ti_ja/analog/glossary/nyquist_frequency.page
  frequencies = new Uint8Array(analyser.frequencyBinCount);

  // 各周波数の音量を合計した総音量を取得
  getInputVolumeTotal = function() {
    // 引数で指定した配列に周波数ごとの音量を格納
    analyser.getByteFrequencyData(frequencies);
    // 周波数ごとの音量を合計して返す
    return frequencies.reduce(function(previous, current) {
      return previous + current;
    });
  };

  // プロンプトでマイクの使用許可を尋ねる
  navigator.mediaDevices.getUserMedia({audio: true})
    // 許可された場合、引数に LocalMediaStream オブジェクトが渡される
    // LocalMediaStream: デバイスのカメラやマイクで取得するデータへのインターフェース
    .then(function(stream) {
      // Firefox のみ時間経過で LocalMediaStream への参照が切れてしまうバグへの対策
      //   参考: https://support.mozilla.org/en-US/questions/984179
      window.hackForMozzila = stream;
      // MediaStreamAudioSourceNode:
      //   WebAudioAPI でデバイスのカメラやマイクで取得した音声情報を表現するオブジェクト
      // AnalyserNode に接続して音声情報の解析を可能にする
      context.createMediaStreamSource(stream).connect(analyser);
    })
    // 許可されなかった場合、デバイスが非対応の場合
    .catch(function(e) {
      alert(e.message);
    });

  // 音量を表示する要素
  elVolumeTotal = document.getElementsByClassName('volume-total')[0];

  // requestAnimationFrame を使って秒間約60回、マイクからの総音量を取得し、表示を更新する
  (draw = function() {
    elVolumeTotal.innerHTML = getInputVolumeTotal();
    requestAnimationFrame(draw);
  })();
})();