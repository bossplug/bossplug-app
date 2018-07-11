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
          addingNewAttribute: false
        },
        created:function(){

             console.log('siri wave')



        },
        methods: {
          toggleAddNewAttribute: function(enabled)
          {
            this.addingNewAttribute = enabled;
          },
          setCellName: function(element)
          {
            var val = element.target.value;
            if(val && val.length >= 1)
            {
              self.assignOptionToCellConfig(this.editingCell,'name',val)
            }

          },
          setCellAttribute: function(cellId,attribute,val,enabled)
          {
            console.log('toggle cell attr',cellId,attribute,val,enabled)
            self.assignAttributeToCellConfig(cellId,attribute,val,enabled)
          },
          //add cell action - remove cell action
          closeEditor: function(element)
          {
            console.log('close editor')
            self.enableCellEditor(false) ;
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
    if(cellData)
    {


      var cellId = cellData.cellId;

      if(enable && cellId)
      {
        var cell = await this.socketClient.emit('getCellData',cellId)

        Vue.set(cellEditor, 'editingCell', cell )
        return

      }

    }
      Vue.set(cellEditor, 'editingCell', null )
      Vue.set(cellEditor, 'addingNewAttribute', null )
  }


  async assignOptionToCellConfig(cell,optionName,value)
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


  async assignAttributeToCellConfig(cellId,attributeName,value,enabled)
  {
    

     var response = await this.socketClient.emit('assignAttributeToCellConfig',{cellId: cellId, attributeName:attributeName,value:value,enabled:enabled});
     if(response.success)
     {
       this.alertBox.setAlertMessage('blue',response.message)
       var cell = await this.socketClient.emit('getCellData',cellId)

       if(enabled)
       {
         Vue.set(cellEditor, 'addingNewAttribute', null )
       }
         Vue.set(cellEditor, 'editingCell', cell )


        this.bossComponent.$emit('refresh') //necessary ?
     }else{
       this.alertBox.setAlertMessage('red',response.message)
     }
  }


}
