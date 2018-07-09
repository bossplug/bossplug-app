var Chart = require('chart.js')

export default class MetronomeChart {
  constructor( ){

  }

   init()
  {

    var randomScalingFactor = function() {
  			return Math.round(Math.random() * 100);
  		};

      window.chartColors = {
          primary: '#6c5ce7' ,
          secondary: '#a29bfe'
      };



  		var config = {
  			type: 'doughnut',
  			data: {
  				datasets: [
          {
            data: [
              0.25,
              0.25,
              0.25,
              0.25
            ],
            backgroundColor: [
              window.chartColors.transparent,
              window.chartColors.transparent,

            ],
            label: 'Beat Bar'
          },
          {
            data: [
              0,
              1,

            ],
            backgroundColor: [
              window.chartColors.transparent,
              window.chartColors.primary,

            ],
            label: 'Beat Duration'
          }],
  				labels: [
  					'Red',
  					'Orange',

  				]
  			},
  			options: {
  				responsive: true,
  				legend: null,
  				title: {
  					display: false,
  					text: 'Metronome'
  				},
  				animation: {
            duration: 1,
  					animateScale: true,
  					animateRotate: true
  				}
  			}
  		};

  		window.onload = function() {
  			var ctx = document.getElementById('metronome-chart').getContext('2d');
  			window.metronomeChart = new Chart(ctx, config);
  		};


  		var colorNames = Object.keys(window.chartColors);


    }

    setChartValue(beatPercent, beatMilliseconds, barBeatCount)
    {

      if(!window.metronomeChart){
        console.log('no chart');
        return false;
      }
      console.log('set chart value', beatPercent)

      var chartPercent = ( barBeatCount +  beatPercent )


      //beat colors
      for(var i=0;i<4;i++)
      {
        if(i >= 4-barBeatCount ||  barBeatCount == 0  )
        {
          window.metronomeChart.data.datasets[0].backgroundColor[i] = window.chartColors.secondary;
        }else{
          window.metronomeChart.data.datasets[0].backgroundColor[i] = window.chartColors.transparent;
        }

      }

      window.metronomeChart.data.datasets[1].data[0] = 4.0 - chartPercent; // Would update the first dataset's value of 'March' to be 50
      window.metronomeChart.data.datasets[1].data[1] =   chartPercent; // Would update the first dataset's value of 'March' to be 50
      window.metronomeChart.update();
      return true;
    }

}
