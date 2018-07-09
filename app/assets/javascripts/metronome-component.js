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

  async init(musicMan)
  {


    metronome = new Vue({
       el: '#metronome',
       data: {
         enabled: true,
         beatsPerMinute: 120
       },
       methods: {
         setMetronomeBPM: function(){
           console.log('set bpm')
         }
        }
     })


     metronomeChart = new MetronomeChart()
     metronomeChart.init();



    // window.requestAnimationFrame(this.loop.bind(this))
     window.requestAnimationFrame( this.loop.bind(this) );

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
     //this.draw()

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
