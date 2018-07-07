import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default


const Howler = require('howler')
var Howl = Howler.Howl;

export default class AudioHelper {
  constructor( ){

  }


  static async playSound(socketClient,sfx)
  {
    var response = await socketClient.emit('queueSound',sfx);
    console.log('got ',response)


    var stream = new Howl({
        src: [sfx.path],
        ext: ['wav'],
        autoplay: true,
        html5: true
    });


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
