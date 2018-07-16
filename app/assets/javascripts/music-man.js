import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default



var sfxEventQueue = [];
var eventsDelayedUntilBeat = [];

export default class MusicMan {
  constructor(audioPlayer){
    this.audioPlayer=audioPlayer;

  }

  init( socketClient )
  {
    this.socketClient=socketClient;
  }

  setMetronomeComponent(metronomeComponent)
  {
    this.metronomeComponent = metronomeComponent;
  }


  async queueSFXEvent(sfx,activate)
  {


    var immediatePlay = true;
    var queue = false;

    if(sfx == null){
      console.error('cannot handle sfx',sfx);
      return;
    }

    console.log('queue',sfx,activate )

    if(sfx.attributes.waitForBeat.enabled || sfx.attributes.pulse.enabled)
    {
      immediatePlay = false;

        queue = true;


    }


    if(immediatePlay){




      if( activate == false && sfx.attributes.momentary.enabled  )
      {

          this.audioPlayer.stopActivePlayback(sfx.sfxHash, null,true);

      }else if(activate == true ){

          this.handleAllSFXEvents(sfx,false)

          this.audioPlayer.playSound(sfx)
      }



    }




    if(queue ){

      //We don't want this to keep occuring !!
      this.handleAllSFXEvents(sfx,true)


      if( activate == false && sfx.attributes.momentary.enabled  )
      {
          this.cancelSpecificLoop(sfx.sfxHash)

          if(sfx.attributes.sticky.enabled)
          {
              //delay until beat
             //this.handleSFXEvent(sfx, 'cancelSelf', true  )
             console.log('push cancelSelf')
             eventsDelayedUntilBeat.push({sfx:sfx, eventName:'cancelSelf'});
          }else{
            this.audioPlayer.stopActivePlayback(sfx.sfxHash, null,true);
          }


      }else if(activate == true ){
          if(!this.sfxWithHashIsQueued(sfx.sfxHash))
          {
            this.addToQueue(sfx)
          }
      }





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
       await  this.handleSFXEvent(sfx, attr.name,delayUntilBeat)
      }
    }


  }

  async handleSFXEvent(sfx, eventName,delayUntilBeat)
  {

    if(delayUntilBeat)
    {
      eventsDelayedUntilBeat.push({sfx:sfx, eventName:eventName});
      return;
    }

    var sfxHash = sfx ? sfx.sfxHash : null;

    if(this.metronomeComponent)
    { //dont await this
        this.metronomeComponent.handleMetronomeEvent(sfx,eventName)
    }


    switch(eventName)
    {
      case 'cancelChannel':
          this.audioPlayer.stopActivePlayback(sfxHash,sfx.attributes.cancelChannel.value);
          this.cancelQueuedLoops(sfx);
           break;
      case 'cancelAll': this.audioPlayer.stopActivePlayback(sfxHash,null,false); break;
      case 'cancelSelf': this.audioPlayer.stopActivePlayback(sfxHash, null,true); break;
      case 'cancelLoops': this.cancelQueuedLoops(sfx);  break;
    }
  }

  cancelSpecificLoop(sfxHash)
  {

    for(var i in sfxEventQueue)
    {

        var sfxEvent = sfxEventQueue[i];
        if(sfxEvent.sfx.sfxHash == sfxHash)
        {
          sfxEventQueue.splice(i,1);  //only remove this one event
          console.log('splicing', sfxEvent.sfx.sfxName)
        }


    }

  }


  cancelQueuedLoops(sfx)
  {
    var cancelChannel;
    var channel;

    if(sfx )
    {
      cancelChannel = sfx.attributes.cancelChannel.enabled;
      channel = sfx.attributes.cancelChannel.value;
    }


      for(var i in sfxEventQueue)
      {
        var sfxEvent = sfxEventQueue[i];
        var sfxEventActivated = (sfxEvent.properties) ? sfxEvent.properties.activated : null;

       if(cancelChannel == false || ( channel == sfxEvent.sfx.attributes.channel.value ) )
       {


        if( sfxEventActivated )
        {
          sfxEventQueue.splice(i,1);  //only remove this one event
            console.log('splicing', sfxEvent.sfx.sfxName)
        }
        }

      }

  }

  // array.splice(i, 1);  remove specific element  at key i

  addToQueue(sfx)
  {
     sfxEventQueue.push({sfx:sfx,properties:{}})

     //tell deviceManager about this queued sfx
     //this.announceDeviceEvent({sfx: sfx, eventName: 'sfxQueued'} )
  }

  //the metronome calls this method
  async beat(undershoot)
  {
    //music man learned of a new music beat :)

  console.log('event queue ', sfxEventQueue.length)
  if(sfxEventQueue.length > 0)
  {
    console.log(sfxEventQueue[0])
  }


    console.log('events delayed   ', eventsDelayedUntilBeat.length)


    //kill activated beats
    for(var i in eventsDelayedUntilBeat )
    {

      var event = eventsDelayedUntilBeat.pop();

      console.log('pop delayed event ', event.sfx.sfxName , event.eventName)

      await this.handleSFXEvent(event.sfx, event.eventName)
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



          if(sfx.attributes.pulse && sfx.attributes.pulse.value
            && (parseInt(properties.beatsWaited) < parseInt(sfx.attributes.pulse.value)) )
          {
              var beatsValue = properties.beatsWaited ;
              properties.beatsWaited = parseInt(properties.beatsWaited) + 1;

             if(parseInt(beatsValue)!=0) continue eachEvent;

          }


          //mark as activated, can be killed from a 'cancel loops' now
        sfxEventQueue[i].properties.activated = true;

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
