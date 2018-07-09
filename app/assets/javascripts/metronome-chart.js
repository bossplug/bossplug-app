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
  						randomScalingFactor(),
  						randomScalingFactor(),
  						randomScalingFactor(),
  					],
  					backgroundColor: [
  						window.chartColors.red,
  						window.chartColors.orange,
  						window.chartColors.yellow,
  						window.chartColors.green,
  						window.chartColors.blue,
  					],
  					label: 'Dataset 1'
  				}],
  				labels: [
  					'Red',
  					'Orange',
  					'Yellow',
  					'Green',
  					'Blue'
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
  			window.myDoughnut = new Chart(ctx, config);
  		};



  		var colorNames = Object.keys(window.chartColors);







    }

}
