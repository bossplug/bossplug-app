import Vue from 'vue';

var $ = require("jquery");

const ContextMenuHelper = require('./context-menu-helper').default
const LocalStorageHelper= require('./local-storage-helper').default

const AudioTreeHelper= require('./audio-tree-helper').default


//const AudioPlayer= require('./audio-player').default

const MetronomeHelper = require('./metronome-helper').default
var metronomeHelper;

import LaunchPad from './vue/LaunchPad.vue'
import TreeMenu from './vue/TreeMenu.vue'


var bossComponent;
var fileTree;


var cellEditor;

var alertBox;
var dragBox;
 //https://vuejsdevelopers.com/2017/10/23/vue-js-tree-menu-recursive-components/
//https://dzone.com/articles/build-a-collapsible-tree-menu-with-vuejs-recursive-1



export default class Build {
  constructor(audioPlayer){
    this.audioPlayer=audioPlayer;
  }

  async init(socketClient){
    var self = this;
    self.socketClient=socketClient;



    var tree =  {
      label: 'Audio List',
      nodes: []
    }


      fileTree = new Vue({
        el: '#filetree',
        data:  {
          tree: tree,
          audioFolders: [],
          loading: true
        } ,
        created: async function()
        {
          var existingAudioFolders = await LocalStorageHelper.get("audioFolders");

          console.log('found folders', existingAudioFolders )
          if(existingAudioFolders)
          {
           var tree = await AudioTreeHelper.buildAudioFolders(existingAudioFolders, self.socketClient)
           this.tree = tree;
          }

          this.loading = false;
        },
        methods: {
          dragAudioFile: function(label) {
            console.log('test',label)
          }
        },
         components:
        {
          TreeMenu
        }
      })


      fileTree.$on('drag-audio-file', item => {
            //console.log('start dragging ', label) // should return 'I am being fired here'
            self.setDragMessage('red', item.label)
            Vue.set(bossComponent, 'draggedSound', item )

            $('.boss-container').off();
            $(window).off();


            $('.boss-container').on('mouseup',(event) => self.handleFileDragDrop(event,item));
            $(window).on('mouseup',(event)=> self.cancelFileDragDrop(event,item)   )
            $(window).on('mousemove',(event)=> self.updateDragBox(event)  )
      });

      fileTree.$on('activate-audio-file', sfx => {
            metronomeHelper.metronome.$emit('activate-sound', sfx)
      });


      var padTree = self.getPadConfig();
      console.log('pad tree', padTree)



     bossComponent = new Vue({
        el: '#theboss',
        data: {
          connected: false,
          audioPreloaded:false,
          padTree: padTree,
          padConfig: null,
          draggedSound: null
        },
        methods: {
           clickButton: async function (buttonName) {
             // `this` inside methods points to the Vue instance
             console.log('clicked ' + buttonName + '!')

             switch(buttonName) {
                case 'connect':
                    var response = await self.socketClient.emit('connectToLaunchpad')
                    self.connected = response.success
                    if(!response.success)
                    {
                      self.setAlertMessage('red',response.message)
                    }
                    break;
                case 'preloadAudio':
                    var response = await self.socketClient.emit('preloadAudio')
                    self.connected = response.success
                    if(response.success)
                    {
                      self.updatePadConfig(response.padConfig,response.padTree)
                    }else{
                      self.setAlertMessage('red',response.message)
                    }
                    break;
                case 'loadConfig':
                    var response = await self.socketClient.emit('loadPadConfig')

                    if(response.success)
                    {
                      self.setAlertMessage('green',response.message)
                      self.updatePadConfig(response.padConfig,response.padTree)
                    }else{
                      self.setAlertMessage('red',response.message)
                    }

                    break;
                case 'saveConfig':
                    var response = await self.socketClient.emit('savePadConfig')

                    if(response.success)
                    {
                      self.setAlertMessage('green',response.message)
                    }else{
                      self.setAlertMessage('red',response.message)
                    }

                    break;
                default:
                    break;
            }


          },
          setPadConfigName: async function (element) {

            var val = element.target.value;
            console.log(val)
            self.assignOptionToPadConfig('name',val)
          }
         },
          components:
         {
           LaunchPad
         }
      })


      bossComponent.$on('edit-cell', cell => {
          //  metronome.$emit('activate-sound', sfx)
          //begin editing sfx
          this.enableCellEditor(cell,true)

      });

      metronomeHelper = new MetronomeHelper(this.audioPlayer);
      await metronomeHelper.init();





       cellEditor = new Vue({
          el: '#cell-editor',
          data: {
            enabled: false
          },
          methods: {

           }
        })

      alertBox = new Vue({
         el: '#alert-box',
         data: {
           alertMessage: null,
           alertClass: null
         },
         methods: {

          }
       })

      dragBox = new Vue({
          el: '#drag-box',
          data: {
            dragMessage: null,
            dragClass: null
          },
          methods: {

           }
        })

      await ContextMenuHelper.buildMenu(window,'.audio-list',(evt,target)=> self.handleMenuEvent(evt,target));

  }

  async enableCellEditor(cell,enable)
  {
    console.log('enable cell editor',cell,enable)
    if(enable)
    {
      Vue.set(metronome, 'enabled', false )
      Vue.set(cellEditor, 'enabled', true )
    }else{
      Vue.set(metronome, 'enabled', true )
      Vue.set(cellEditor, 'enabled', false )
    }
  }

  async updatePadConfig(padConfig,padTree)
  {

    //need to update the tree ..for rendering

    Vue.set(bossComponent, 'padConfig', padConfig )
    Vue.set(bossComponent, 'padTree', padTree )
    console.log('update pad config ', padConfig)
    console.log('update pad tree ', padTree)
  }

  async handleFileDragDrop(event,item){

        console.log('handle drop ' )
        var droppedSound = bossComponent.draggedSound;

      if(event.target.classList.contains('drop-target') && droppedSound)
      {

          $('.boss-container').off();
          var cellId = event.target.getAttribute('data-cell-id');

          console.log('dropped ',item,' on cell ', cellId)
          await this.assignSoundToPadConfig(item,cellId)

          this.cancelFileDragDrop(event,item)
      }
  }

  async cancelFileDragDrop(event,item)
  {
      console.log('cancel drag drop ')
      this.setDragMessage('red', null)
       ///$(window).off();
       Vue.set(bossComponent, 'draggedSound', null )
  }


  async getPadConfig()
  {
     var response = await this.socketClient.emit('getPadConfig');
     if(response.success)
     {
       this.setAlertMessage('blue',response.message)
       this.updatePadConfig(response.padConfig,response.padTree)
     }else{
       this.setAlertMessage('red',response.message)
     }
  }

  async assignOptionToPadConfig(optionName,value)
  {
     var response = await this.socketClient.emit('assignOptionToPadConfig',{optionName:optionName,value:value});
     if(response.success)
     {
       this.setAlertMessage('blue',response.message)
       var config = response.padConfig
       this.updatePadConfig(response.padConfig,response.padTree)
     }else{
       this.setAlertMessage('red',response.message)
     }
  }

  async assignSoundToPadConfig(item,cellId)
  {
     var response = await this.socketClient.emit('assignSoundToPadConfig',{sfx:item,cellId:cellId});
     if(response.success)
     {
       this.setAlertMessage('blue',response.message)
       this.updatePadConfig(response.padConfig,response.padTree)
     }else{
        this.setAlertMessage('red',response.message)
     }
  }

  //consider stuffing this in another class
  async handleMenuEvent(evt,target)
  {
    var self = this;

    var role = evt.role;

    switch(role){
      case 'addaudiofolder':
          var response = await this.socketClient.emit('addAudioFolder');
          var tree = await AudioTreeHelper.addAudioFolders(response, self.socketClient)
          Vue.set(fileTree, 'tree', tree )
          break;

      case 'removeaudiofolder':
          var nodeId = target.getAttribute('data-node-id')
          var tree =  await AudioTreeHelper.removeAudioFolder(nodeId, self.socketClient)
          Vue.set(fileTree, 'tree', tree )
          break;
      default:
          break;
    }
  }

  async setDragMessage(color,msg)
  {
      Vue.set(dragBox, 'dragClass', color )
      Vue.set(dragBox, 'dragMessage', msg )
  }

  updateDragBox(event)
  {
    //must not cover mouse or else drop does not work !
    var x = event.clientX + 2;
    var y = event.clientY - 5;

    $(".drag-box").css('top', y + "px");
    $(".drag-box").css('left', x + "px");
  }


  async setAlertMessage(color,msg)
  {
      Vue.set(alertBox, 'alertClass', color )
      Vue.set(alertBox, 'alertMessage', msg )

      await this.sleep(1000);

      Vue.set(alertBox, 'alertMessage', null )
  }

  sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}


};
