import Vue from 'vue';
 


var buffList;


export default class BuffComponent {
  constructor( ){
  }

  async init( )
  {
    var self = this;

    buffComponent = new Vue({
       el: '#metronome',
       data: {
         enabled: true
       },

       methods: {

        }
     })



  }




}
