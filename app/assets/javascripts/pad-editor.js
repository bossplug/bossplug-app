import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default


var editor;




export default class PadEditor {
  constructor( ){

  }

  async init( )
  {


    editor = new Vue({
       el: '#pad-editor',
       data: {
         enabled: true,
         editingCell: null
       },
       methods: {

        }
     })




  }

}
