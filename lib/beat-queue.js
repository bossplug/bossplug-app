
const StorageHelper = require('./storage-helper')

const AppHelper = require('./app-helper')
const fs = require("fs");

  var server = require('./webserver')

  const context = require('audio-context')
  const Generator = require('audio-generator')
  const {Readable, Writable} = require('web-audio-stream/stream')

//node-speaker
/*

  Manages the queue of beats to play


*/

var AV = require('av');
//require('mp3');

module.exports =  class BeatQueue {


    constructor( ){

    }

     async  init()
    {
      console.log('init beatqueue')

      var testaudio = '/home/andy/Music/Function Loops - FREE SAMPLES - Future Music/Festival Trance 2/DRUMS/DRUM_03_TRIO_STRIPPED_138bpm.wav';
      testaudio = '/home/andy/Music/BroodwarSound/Zerg/Hydra/zhyPss00.wav'
      var player = AV.Player.fromFile(testaudio);
       player.play();  //test  -- should send stream out ?

  /*    let oscillator = context.createOscillator()
          oscillator.type = 'sawtooth'
          oscillator.frequency.value = 440
          oscillator.start()

          //pipe oscillator audio data to stream
          Readable(oscillator).on('data', (audioBuffer) => {
              console.log(audioBuffer.getChannelData(0))
          })

          //pipe generator stream to audio destination
          Generator(time => Math.sin(Math.PI * 2 * time * 440))
          .pipe(Writable(context.destination))*/

    }

    //https://github.com/audiocogs/aurora.js/wiki/Getting-Started
    //https://github.com/fabslab/aurora-websocket

    async play(sfx)
    {
      console.log('playin',sfx.path)
      /*const audioData = context.exportAsAudioData();

      context.encodeAudioData(audioData).then((arrayBuffer) => {
        fs.writeFile(sfx.path, new Buffer(arrayBuffer));
      });*/

      // https://github.com/audiocogs/aurora.js/ ?

    //  var player = AV.Player.fromFile(sfx.path);
    //   player.play();  //test  -- should send stream out ?

    var player;

    player = AV.Player.fromFile(sfx.path);

    //player.preload();
     player.play()
       //asset.start();


    }


    async playToBuffer(sfx)
    {
      console.log('playin',sfx.path)


    var player;

       var asset = AV.Asset.fromFile(sfx.path);
        var list = new AV.BufferList;

       asset.on('data', function(buffer) {
         console.log('ON BUF DATA', buffer )
          //  list.push(new AV.Buffer(buffer));
        });


        asset.decodeToBuffer(function(buffer) {
          console.log('buf', buffer.length)

            player = AV.Player.fromBuffer(buffer);
            console.log(player.buffered)
            //player.preload();
             player.play()

          // buffer is now a Float32Array containing the entire decoded audio file
        });

          asset.start();


    }



}
