import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default


import {Howl, Howler} from 'howler';

  //goes by hash
var preloadedSoundMap = {};

export default class AudioPlayer {
  constructor( ){

  }

  init()
  {

  }

  async preloadSounds()
  {
    console.log('preload')
  }

  //https://medium.com/@SrvZ/build-a-audio-player-in-electron-e1b133776c6

    async playSound(socketClient,sfx)
  {
    //var response = await socketClient.emit('queueSound',sfx);
    //console.log('got ',response)

    console.log('howl',sfx)

    var current_hostname = window.location.hostname;

    const socketServer = 'http://'+current_hostname+':3000';
    var socketsPath = socketServer+'/'+'01a44c3ec60726bce9d890ec5e2747b4a4058cd2f271933424d7827c95464ff8'+'.wav'
    console.log(socketsPath)

    socketsPath =  socketServer+'/'+sfx.hash+'.wav'
      // Setup the new Howl.
      const audio = new Howl({
          src: socketsPath,
          html5: true,
          preload: false,
        }).play();

  /*
  const audio = new Howl({
src: 'https://howlerjs.com/assets/howler.js/examples/player/audio/rave_digger.webm',
html5: true,
preload: false,
}).play();

  */

 

  /*  var stream = new Howl({
        src: [sfx.path],
        ext: ['wav'],
        autoplay: true,
        html5: true
    });*/


  }

  /*


  //stream   https://github.com/goldfire/howler.js/issues/378
  var stream = new Howl({
    src: ['...'],
    ext: ['mp3'],
    autoplay: true,
    html5: true
});



  */


}
