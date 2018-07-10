import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default



var sfxEventQueue = [];

export default class MusicMan {
  constructor(audioPlayer){
    this.audioPlayer=audioPlayer;
  }

  init(metronomeComponent)
  {

  }


  async queueSFXEvent(sfx)
  {

    /*if(sfx.attributes.fadeIn ) //temp
    {
       this.audioPlayer.stopActivePlayback()
    }
    if(sfx.attributes.fadeOut ) //temp
    {
      sfxEventQueue = []; //empty

    }*/



    if(sfx.attributes.waitForBeat || sfx.attributes.pulse)
    {
      this.addToQueue(sfx)
      return {success:true, sfx:sfx}
    }

      this.audioPlayer.playSound(sfx)

      return {success:true, sfx:sfx}
  }

  // array.splice(i, 1);  remove specific element  at key i

  addToQueue(sfx)
  {
     sfxEventQueue.push(sfx)
  }

  //the metronome calls this method
  beat(undershoot)
  {
    //music man learned of a new music beat :)
    console.log('queue', sfxEventQueue)

    //flush sfx
    for(var i in sfxEventQueue)
    {
      var sfx = sfxEventQueue[i];


      if(sfx.attributes.waitForBeat || sfx.attributes.pulse)
      {
         this.audioPlayer.playSound(sfx)
        if(sfx.attributes.waitForBeat)
        {
          sfxEventQueue.splice(i, 1); //remove it from the array
        }
      }


    }

  }


}
