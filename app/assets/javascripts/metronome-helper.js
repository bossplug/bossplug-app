import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default


var metronome;


var lastRender = 0;

export default class MetronomeHelper {
  constructor(audioPlayer){
    this.audioPlayer=audioPlayer;
  }

  async init()
  {


    metronome = new Vue({
       el: '#metronome',
       data: {
         enabled: true
       },
       methods: {

        }
     })



    // window.requestAnimationFrame(this.loop.bind(this))
     window.requestAnimationFrame(  this.loop.bind(this) );

     metronome.$on('activate-sound', sfx => {
           console.log('activate audio file  ', sfx) // should return 'I am being fired here'

          this.audioPlayer.playSound(self.socketClient,sfx)
          self.setAlertMessage('blue',sfx.label)
     });

  }

  loop(timestamp )
  {
 

    var progress = timestamp - lastRender;

     this.update(progress)
     this.draw()

     lastRender = timestamp;

    window.requestAnimationFrame(  this.loop.bind(this) );
  }

  update(progress) {
    //console.log('update',progress)
    // Draw the state of the world
  }

  draw() {
    // Draw the state of the world
  }


}
