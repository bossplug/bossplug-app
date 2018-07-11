import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default


var metronome;


const MetronomeChart = require('./metronome-chart').default
var metronomeChart;



var lastRender = 0;

var beatsPerBar = 4;
var beatCount = 0;

var beatMilliseconds = 0;

export default class MetronomeComponent {
  constructor(audioPlayer,musicMan){
    this.audioPlayer=audioPlayer;
    this.musicMan=musicMan;
  }

  async init( )
  {
    var self = this;

    metronome = new Vue({
       el: '#metronome',
       data: {
         enabled: true,
         masterVolume:50,
         beatsPerMinute: 120,
         active: false
       },

       methods: {
         setMetronomeBPM: function(event){
          var val = parseInt(event.target.value);
           console.log('set bpm',val);
           if(!isNaN(val))
           {
             this.beatsPerMinute = val;
           }

         },
         clickedButton: async function(buttonName){

           self.handleMetronomeEvent(null,buttonName)
         },
         setMasterVolume: function(element)
         {
           var value = element.target.value;
           self.audioPlayer.setMasterVolume(value)
         }
        }
     })


     metronomeChart = new MetronomeChart()
     metronomeChart.init();


     window.requestAnimationFrame( this.loop.bind(this) );

     /*metronome.$on('activate-sound', sfx => {
           console.log('activate audio file  ', sfx) // should return 'I am being fired here'

          this.audioPlayer.playSound(self.socketClient,sfx)
          self.setAlertMessage('blue',sfx.label)
     });*/

  }


  async handleMetronomeEvent(sfx,name)
  {
    var self = this;

    console.log('handle sfx ', sfx )

    switch(name)
    {
      case 'play':
          beatMilliseconds = 0.9 *  this.getMillisecondsPerBeat();
          beatCount = 3;
          metronome.active=true;
          break;
      case 'pause':
          metronome.active=false;
          break;
      case 'stop':
           metronome.active=false;
           beatMilliseconds = 0;
           beatCount = 0;
           await self.musicMan.handleSFXEvent(sfx,'cancelLoops');
           await self.musicMan.handleSFXEvent(sfx,'cancelAll');
           break;
      case 'setBPM':
           var bpm = sfx.attributes.setBPM.value;
           metronome.beatsPerMinute=bpm;
           break;
    }
  }

  loop(timestamp )
  {
    var progress = timestamp - lastRender;

    if(metronome.active)
    {
      this.update(progress);
    }else{
      if(beatMilliseconds ==0) metronomeChart.setChartValue( 0, 0, 0 ); //if stopped
    }


     lastRender = timestamp;

    window.requestAnimationFrame( this.loop.bind(this) );
  }

  update(progressMilliseconds) {

    beatMilliseconds += progressMilliseconds;

    if(beatMilliseconds+progressMilliseconds > this.getMillisecondsPerBeat())
    {

      var undershoot = (beatMilliseconds - this.getMillisecondsPerBeat() );
      this.beat(undershoot)
    }

    var beatPercent = (beatMilliseconds/this.getMillisecondsPerBeat())
    var barBeatCount = beatCount % 4;

    metronomeChart.setChartValue( beatPercent, beatMilliseconds, barBeatCount )

  }

  beat(undershoot)
  {


    beatCount++;
    beatMilliseconds = undershoot; //reset to 0

    this.musicMan.beat(undershoot)


  }

  getBeatsPerMinute() {

    if( metronome && metronome.beatsPerMinute   )
    {
      return metronome.beatsPerMinute
    }

    return 120;
  }

  getMillisecondsPerBeat() {
    return Math.ceil( (1.0 / this.getBeatsPerMinute() ) * 60 * 1000 );
  }




}
