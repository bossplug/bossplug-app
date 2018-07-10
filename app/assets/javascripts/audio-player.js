import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default


import {Howl, Howler} from 'howler';

  //goes by hash
var preloadedSoundMap = {};

//var channelHowls = {};
var activeHowls = {};  //clear this out on a full stop
var allHowls = {}; //clear this out on a full stop

var audioIdCounter = 0;

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

   playSound(sfx)
  {

    if(!sfx.preloaded)
    {
    //  var response = await socketClient.emit('queueSound',sfx);
    //  console.log('got ',response)
      return;
    }

     var howlId = audioIdCounter++;

     var channelVolume = 1.0;

    console.log('howl',sfx)

    var current_hostname = window.location.hostname;

    const socketServer = 'http://'+current_hostname+':3000/audio';
    var socketsPath ;


    var socketsPath =  socketServer+'/'+sfx.sfxHash+'.wav'
      // Setup the new Howl.
      var audio = new Howl({
          src: socketsPath,
          html5: true,
          preload: false,
          loop:  sfx.attributes.loop,
          volume: channelVolume,
          onend: function() {
            activeHowls[howlId] = null;
          }
        })

      allHowls[howlId] = {sfx: sfx, howl: audio};
      activeHowls[howlId] = {sfx: sfx, howl: audio};


      audio.play()

      return {success:true, sfx:sfx}



  }



  stopActivePlayback(channel)
  {
    //if channel is null then all channels

    for(var howlId in allHowls)
    {
      var resource = allHowls[howlId];

      console.log('active howls ', resource )

      if(resource && resource.howl)
      {
        resource.howl.stop()
        allHowls[howlId] = null;
      }

    }

    //if no channel..
     activeHowls = {};
     allHowls = {};
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
