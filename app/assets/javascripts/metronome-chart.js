var Chart = require('chart.js')

export default class MetronomeChart {
  constructor( ){

  }

   init()
  {

    var randomScalingFactor = function() {
  			return Math.round(Math.random() * 100);
  		};

      window.chartColors = {};

  		var config = {
  			type: 'doughnut',
  			data: {
  				datasets: [{
  					data: [
  						randomScalingFactor(),
  						randomScalingFactor(),
  						 
  					],
  					backgroundColor: [
  						window.chartColors.red,
  						window.chartColors.orange,

  					],
  					label: 'Dataset 1'
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
  					text: 'Chart.js Doughnut Chart'
  				},
  				animation: {
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

    setChartValue(beatPercent, beatMilliseconds)
    {

      if(!window.metronomeChart){
        console.log('no chart');
        return false;
      }
      console.log('set chart value', beatPercent)

      window.metronomeChart.data.datasets[0].data[0] = beatMilliseconds; // Would update the first dataset's value of 'March' to be 50
      window.metronomeChart.update();
      return true;
    }

}
