import Vue from 'vue';

var $ = require("jquery");

const ContextMenuHelper = require('./context-menu-helper').default
const LocalStorageHelper= require('./local-storage-helper').default

const AudioTreeHelper= require('./audio-tree-helper').default


const AudioHelper= require('./audio-helper').default



import TreeMenu from './vue/TreeMenu.vue'

var buildComponent;
var fileTree;
var motherShip;
var alertBox;

 //https://vuejsdevelopers.com/2017/10/23/vue-js-tree-menu-recursive-components/
//https://dzone.com/articles/build-a-collapsible-tree-menu-with-vuejs-recursive-1


export default class Build {
  constructor( ){

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
          audioFolders: []
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


      fileTree.$on('drag-audio-file', label => {
            //console.log('start dragging ', label) // should return 'I am being fired here'

            $('.boss-container').off();
            $('.boss-container').on('mouseup',(event) => self.handleFileDragDrop(event,label));

      });

      fileTree.$on('activate-audio-file', sfx => {
            console.log('activate audio file', sfx) // should return 'I am being fired here'

            motherShip.$emit('activate-sound', sfx)

            //$('.boss-container').off();
            //$('.boss-container').on('mouseup',(event) => self.handleFileDragDrop(event,label));

      });



     buildComponent = new Vue({
        el: '#theboss',
        data: {
          connected: false
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

                default:
                    break;
            }


           }
         }
      })

      motherShip = new Vue({
         el: '#mothership',
         data: {
         },
         methods: {
           activateSound: async function (sfx) {
             console.log('sound', sfx)
           }
          }
       })


       motherShip.$on('activate-sound', sfx => {
             console.log('activate audio file', sfx) // should return 'I am being fired here'

            AudioHelper.playSound(self.socketClient,sfx)
       });


      alertBox = new Vue({
         el: '#alert-box',
         data: {

           alertMessage: null,
           alertClass: null
         },
         methods: {

          }
       })

      await ContextMenuHelper.buildMenu(window,'.audio-list',(evt,target)=> self.handleMenuEvent(evt,target));

  }



  handleFileDragDrop(event,label){
      if(event.target.classList.contains('drop-target'))
      {
          var cellId = event.target.getAttribute('data-cell-id');

          console.log('dropped ',label,' on cell ', cellId)

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
