import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default



var sfxEventQueue = [];

export default class MusicMan {
  constructor(audioPlayer){
    this.audioPlayer=audioPlayer;

  }

  init( )
  {

  }

  setMetronomeComponent(metronomeComponent)
  {
    this.metronomeComponent = metronomeComponent;
  }


  async queueSFXEvent(sfx)
  {

    var immediatePlay = true;
    var queue = false;

    for(var key in  sfx.attributes)
    {
      var attr = sfx.attributes[key]
      if(attr.enabled)
      {
        this.handleSFXEvent(attr.name)
      }
    }


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
      immediatePlay = false;
      if(!this.sfxWithHashIsQueued(sfx.sfxHash))
      {
        queue = true;
      }

    }

    if(immediatePlay)this.audioPlayer.playSound(sfx)
    if(queue)this.addToQueue(sfx)

    return {success:true, sfx:sfx}
  }


  async handleSFXEvent(eventName)
  {
    if(this.metronomeComponent)
    {
      this.metronomeComponent.handleMetronomeEvent(eventName)
    }

    switch(eventName)
    {
      case 'cancelAllPlayback': this.audioPlayer.stopActivePlayback(); break;
      case 'cancelAllLoops': sfxEventQueue = []; break;
    }
  }



  // array.splice(i, 1);  remove specific element  at key i

  addToQueue(sfx)
  {
     sfxEventQueue.push({sfx:sfx,properties:{}})
  }

  //the metronome calls this method
  beat(undershoot)
  {
    //music man learned of a new music beat :)
  //  console.log('queue', sfxEventQueue)

    //flush sfx
    for(var i in sfxEventQueue)
    {
      var sfx = sfxEventQueue[i].sfx;
      var properties = sfxEventQueue[i].properties;

      if(sfx.attributes.waitForBeat || sfx.attributes.pulse)
      {


        if( isNaN(parseInt(properties.beatsWaited)) ) properties.beatsWaited = 0;

          if(sfx.attributes.pulse && sfx.attributes.pulse.value
            && parseInt(properties.beatsWaited) < parseInt(sfx.attributes.pulse.value))
          {
            properties.beatsWaited = parseInt(properties.beatsWaited) + 1;
            continue;
          }

        this.audioPlayer.playSound(sfx)
        if(sfx.attributes.waitForBeat)
        {
          sfxEventQueue.splice(i, 1); //remove it from the array
        }


      }


    }

  }


  sfxWithHashIsQueued(hash)
  {

    for(var i in sfxEventQueue)
    {
      var sfx = sfxEventQueue[i].sfx;

      if(sfx.attributes.waitForBeat || sfx.attributes.pulse)
      {
        if(sfx.sfxHash == hash)
        {
          return true;
        }
      }

    }
      return false;
  }


}
