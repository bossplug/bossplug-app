
const StorageHelper = require('./storage-helper')

const AppHelper = require('./app-helper')
const fs = require("fs");

  var server = require('./webserver')

  const context = require('audio-context')
  const Generator = require('audio-generator')
  const {Readable, Writable} = require('web-audio-stream/stream')

var Speaker = require('speaker')
var WavDecoder = require('wav-decoder')
 var wav = require('wav')
//node-speaker
/*

  Manages the queue of beats to play

https://stackoverflow.com/questions/32012695/nodejs-streaming-for-audio-video-with-client-side-control
https://stackoverflow.com/questions/16927394/node-js-audio-player

*/

var AV = require('av');
//require('mp3');

module.exports =  class PadConfigManager {


    constructor( ){

    }

     async  init()
    {
      console.log('init PadConfigManager')

      //check for existing config file 

    }



}
