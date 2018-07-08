
const StorageHelper = require('./storage-helper')

const AppHelper = require('./app-helper')
const fs = require("fs");

  var server = require('./webserver')

  //const context = require('audio-context')
//  const Generator = require('audio-generator')
  //const {Readable, Writable} = require('web-audio-stream/stream')

  const Readable = require('stream').Readable;


var Speaker = require('speaker')
var WavDecoder = require('wav-decoder')
 var wav = require('wav')

var appRoot = require('app-root-path');


//node-speaker
/*

  Manages the queue of beats to play

https://stackoverflow.com/questions/32012695/nodejs-streaming-for-audio-video-with-client-side-control
https://stackoverflow.com/questions/16927394/node-js-audio-player

*/

var AV = require('av');


var bufferedAudioFiles = {};




/*
//TODO support mort channels ?

node-pcm-utils  https://github.com/xdissent/node-pcm-utils



*/

//require('mp3');

module.exports =  class BeatQueue {


    constructor( ){

    }

     async  init()
    {
      console.log('init beatqueue')

      var testaudio = {path:'/home/andy/Music/BroodwarSound/Zerg/Hydra/zhyYes00.wav'};

      var player = AV.Player.fromFile(testaudio);
      // player.play();  //test  -- should send stream out ?

      try{
          this.playStreamed(testaudio)
      }catch(e){
        console.error(e)
      }


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
/*
    async play(sfx)
    {
      console.log('playin',sfx)
      const audioData = context.exportAsAudioData();

      context.encodeAudioData(audioData).then((arrayBuffer) => {
        fs.writeFile(sfx.path, new Buffer(arrayBuffer));
      });

      // https://github.com/audiocogs/aurora.js/ ?

    //  var player = AV.Player.fromFile(sfx.path);
    //   player.play();  //test  -- should send stream out ?

     var player;

     player = AV.Player.fromFile(sfx.path);


       //asset.start();
     this.playToSpeaker(sfx);

     return {success:true}

    }
*/
    //play a preloaded track based on hash


    async playToBuffer(sfx)
    {
      console.log('playin',sfx)


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

    async playPreloaded(sfx)
    {
      console.log('playin preloaded',sfx)
      var hash = sfx.hash;

      if(!bufferedAudioFiles[hash])
      {
        return {success:false,message: sfx.label + ' not preloaded.'}
      }

      var buffer = bufferedAudioFiles[hash].bufferedData;
      var format = bufferedAudioFiles[hash].format;

      // var bufferStream = fs.createReadStream( buffer );

    //  console.log('meep1', buffer)

       const readable = new Readable( )
       readable._read = () => {}
       readable.push(buffer)
       readable.push(null);



        //format.channels .. The number of audio channels. PCM data must be interleaved. Defaults to 2

          console.log('format', format)
       var speaker = new Speaker(format);

      // pipe the buffered data to the speaker
      try{
        readable.pipe(speaker);
      }catch(e){console.error(e)}



    }
    //https://stackoverflow.com/questions/16927394/node-js-audio-player

      playStreamed(sfx)
    {

      //Probably should pre-buffer all of the sound files so we dont need to do that on the fly  !!!


      // Create Decoder and Speaker


      var file = fs.createReadStream( sfx.path );


      var reader = new wav.Reader(   );

      // the "format" event gets emitted at the end of the WAVE header
      reader.on('format', function (format) {

        console.log('format',format)
        // the WAVE header is stripped from the output of the reader


          reader.pipe(new Speaker(format));

      });

      reader.on('flush', function ( ) {

        console.log('done' )

      });

      // pipe the WAVE file to the Reader instance
      try{
        file.pipe(reader);
      }catch(e){console.error(e)}


      /*

      var audioOptions = {channels: 2, bitDepth: 16, sampleRate: 44100};

      // Recursive function that plays song with index 'i'.
      function playSong(i) {
        var speaker     = new Speaker(audioOptions);
        // Read the first file
        var inputStream = fs.createReadStream(songs[i]);
        // Pipe the read data into the decoder and then out to the speakers



        inputStream.pipe(dec).pipe(speaker);
        speaker.on('flush', function(){
          // Play next song, if there is one.
          if (i < songs.length - 1)
            playSong(i + 1);
        });
      }

      // Start with the first song.
      playSong(0);

      */
    }

    async preloadAudio(audioFiles)
    {
      //console.log('beat preload audio ',audioFiles);

      for(var file of audioFiles)
      {
        //consider not doing this ...
        var data = await this.getBufferedAudioFromFileAtPath( file.path )

        var url = await this.storeAudioFileForWeb( file.path, file.hash )

        bufferedAudioFiles[file.hash] = {
          hash: file.hash,
          path: file.pash,
          label: file.label,
          bufferedData: data.buf,
          format: data.format,
          url: url
        }
      }

      return {success:true, preloadedAudio: bufferedAudioFiles}
      //preload all the audio files that are in

    }

    async storeAudioFileForWeb(path,hash)
    {
      var dest = appRoot+'/public/'+hash+'.wav';

      StorageHelper.copyFileSync(path, dest )

      return dest;

    }

    async getBufferedAudioFromFileAtPath(path)
    {

       var response = await new Promise(async (resolve, reject) => {



        var result ={
          buf:''
        }
        const chunks = [];

        var file = fs.createReadStream( path );


        var reader = new wav.Reader(   );

        // the "format" event gets emitted at the end of the WAVE header
        reader.on('format', function (format) {

          console.log('format',format)
          // the WAVE header is stripped from the output of the reader
          result.format = format;

        //    reader.pipe(new Speaker(format));

        });

        reader.on('data', function (chunk) {

           chunks.push(chunk);

        });

        reader.on('end', function ( ) {
          result.buf = Buffer.concat(chunks);

          resolve(result)
        });

        // pipe the WAVE file to the Reader instance
        try{
          file.pipe(reader);
        }catch(e){console.error(e)}


      });

      return response;
    }



}
