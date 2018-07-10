import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default


var cellEditor;


import CellEditorComponent from './vue/CellEditorComponent.vue'


export default class CellEditor {
  constructor(socketClient,bossComponent,alertBox){
      this.socketClient=socketClient;
      this.bossComponent=bossComponent;
      this.alertBox=alertBox;
  }

  async init( )
  {
    var self = this;


     cellEditor = new Vue({
        el: '#cell-editor',
        data: {
        //  enabled: false,
          editingCell: null,
          test: {name:'test'}
        },
        methods: {
          setCellName: function(element)
          {
            var val = element.target.value;
            self.assignOptionToCellConfig(this.editingCell,'name',val)
          },
          closeEditor: function(element)
          {
            console.log('close editor')
            this.editingCell = null;
          }
        } ,
        components:
       {
         CellEditorComponent
       }
      })


  }


  async enableCellEditor(cellData,enable)
  {
    var cellId = cellData.cellId;

    if(enable)
    {
      var cell = await this.socketClient.emit('getCellData',cellId)

      console.log('meeepo',cell)
      Vue.set(cellEditor, 'editingCell', cell )
      //Vue.set(cellEditor, 'enabled', true )

    }else{
      Vue.set(cellEditor, 'editingCell', null )
    }
  }


  async assignOptionToCellConfig(cell, optionName,value)
  {
     var response = await this.socketClient.emit('assignOptionToCellConfig',{cellId: cell.cellId, optionName:optionName,value:value});
     if(response.success)
     {
       this.alertBox.setAlertMessage('blue',response.message)

       var cell = await this.socketClient.emit('getCellData',cell.cellId)
       Vue.set(cellEditor, 'editingCell', cell )


       this.bossComponent.$emit('refresh')

     }else{
       this.alertBox.setAlertMessage('red',response.message)
     }
  }


}
