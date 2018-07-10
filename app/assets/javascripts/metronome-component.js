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
         masterVolume:100,
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
           console.log('btnn',buttonName)
           switch(buttonName)
           {
             case 'play': this.active=true; console.log(this); break;
             case 'pause': this.active=false; break;
             case 'stop':
                    this.active=false;
                    beatMilliseconds = 0;
                    beatCount = 0;
                    await self.musicMan.triggerSFXEvent('cancelAllPlayback');
                    await self.musicMan.triggerSFXEvent('cancelAllLoops');
                    break;
           }
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

  loop(timestamp )
  {
    var progress = timestamp - lastRender;

    if(metronome.active)
    {
      this.update(progress);
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
    beatMilliseconds = 0;

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
