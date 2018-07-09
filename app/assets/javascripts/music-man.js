import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default



var actionQueue = {};

export default class MusicMan {
  constructor(audioPlayer){
    this.audioPlayer=audioPlayer;
  }

  init(metronomeComponent)
  {

  }

  //the metronome calls this method 
  beat(undershoot)
  {
    //music man learned of a new music beat :)

  }


}
