import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default



var sfxEventQueue = [];
var eventsDelayedUntilBeat = [];

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

    if(sfx == null){
      console.error('cannot handle sfx',sfx);
      return;
    }

    if(sfx.attributes.waitForBeat.enabled || sfx.attributes.pulse.enabled)
    {
      immediatePlay = false;
      if(!this.sfxWithHashIsQueued(sfx.sfxHash))
      {
        queue = true;
      }

    }


    if(immediatePlay){

      this.handleAllSFXEvents(sfx,false)

      this.audioPlayer.playSound(sfx)
    }




    if(queue){

      //We don't want this to keep occuring !!
      this.handleAllSFXEvents(sfx,true)

      this.addToQueue(sfx)
    }


    return {success:true, sfx:sfx}
  }


  async handleAllSFXEvents(sfx,delayUntilBeat)
  {

    //We don't want this to keep occuring !!
    for(var key in  sfx.attributes)
    {
      var attr = sfx.attributes[key]
      if(attr.enabled)
      {
        this.handleSFXEvent(sfx, attr.name,delayUntilBeat)
      }
    }


  }

  async handleSFXEvent(sfx, eventName,delayUntilBeat)
  {
      //preserve the sfx by hash
    if(delayUntilBeat)
    {
      eventsDelayedUntilBeat.push({sfx:sfx, eventName:eventName});
      return;
    }

    var sfxHash = sfx ? sfx.sfxHash : null;

    if(this.metronomeComponent)
    {
      this.metronomeComponent.handleMetronomeEvent(sfx,eventName)
    }


    switch(eventName)
    {
      case 'cancelAll': this.audioPlayer.stopActivePlayback(sfxHash); break;
      case 'cancelLoops': this.cancelQueuedLoops(sfxHash);  break;
    }
  }

  cancelQueuedLoops(preservedHash)
  {
      for(var i in sfxEventQueue)
      {
        var sfxEvent = sfxEventQueue[i];
        var sfxEventHash = (sfxEvent.sfx) ? sfxEvent.sfx.sfxHash : null;
        if(preservedHash == null || preservedHash != sfxEventHash )
        {
          sfxEventQueue.splice(i,1);
        }
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
  console.log('event queue ', sfxEventQueue.length)


    //we do NOT want to cancel this current queued sfx tho ...
    for(var i in eventsDelayedUntilBeat)
    {
      console.log('pop delayed event ', )
      var event = eventsDelayedUntilBeat.pop();
      this.handleSFXEvent(event.sfx, event.eventName)
    }



    //flush sfx
    eachEvent:
    for(var i in sfxEventQueue)
    {
      var sfx = sfxEventQueue[i].sfx;
      var properties = sfxEventQueue[i].properties;

      if(sfx.attributes.waitForBeat.enabled || sfx.attributes.pulse.enabled)
      {


          if( isNaN(parseInt(properties.beatsWaited))
          || parseInt(properties.beatsWaited) >= parseInt(sfx.attributes.pulse.value))
          {
            properties.beatsWaited = 0;
          }

          console.log(properties.beatsWaited)

          if(sfx.attributes.pulse && sfx.attributes.pulse.value
            && (parseInt(properties.beatsWaited) < parseInt(sfx.attributes.pulse.value)) )
          {
              var beatsValue = properties.beatsWaited ;
              properties.beatsWaited = parseInt(properties.beatsWaited) + 1;

             if(parseInt(beatsValue)!=0) continue eachEvent;

          }





          console.log('play sound')
        this.audioPlayer.playSound(sfx)
        if(sfx.attributes.waitForBeat.enabled)
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
