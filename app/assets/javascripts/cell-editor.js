import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default


var cellEditor;




export default class CellEditor {
  constructor( ){

  }

  async init( )
  {


     cellEditor = new Vue({
        el: '#cell-editor',
        data: {
          enabled: false,
          editingCell: null
        },
        methods: {

         }
      })


  }


  async enableCellEditor(cell,enable)
  {
    console.log('enable cell editor',cell,enable)
    if(enable)
    {
      Vue.set(cellEditor, 'enabled', true )
    }else{
      Vue.set(cellEditor, 'enabled', false )
    }
  }

}
