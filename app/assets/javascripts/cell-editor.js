import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default


var cellEditor;


import CellEditorComponent from './vue/CellEditorComponent.vue'


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
          setCellName: function()
          {
            console.log('set cell name')
          }
        },
         components:
        {
          CellEditorComponent
        }
      })


  }


  async enableCellEditor(cell,enable)
  {
    console.log('enable cell editor',cell,enable)
    if(enable)
    {
      Vue.set(cellEditor, 'enabled', true )
      Vue.set(cellEditor, 'editingCell', cell )
    }else{
      Vue.set(cellEditor, 'enabled', false )
    }
  }

}
