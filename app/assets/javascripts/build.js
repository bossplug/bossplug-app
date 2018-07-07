import Vue from 'vue';

var $ = require("jquery");

const ContextMenuHelper = require('./context-menu-helper').default
const LocalStorageHelper= require('./local-storage-helper').default

const AudioTreeHelper= require('./audio-tree-helper').default


const AudioHelper= require('./audio-helper').default




import LaunchPad from './vue/LaunchPad.vue'
import TreeMenu from './vue/TreeMenu.vue'

var motherShip;
var bossComponent;
var fileTree;


var alertBox;
var dragBox;
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


      fileTree.$on('drag-audio-file', item => {
            //console.log('start dragging ', label) // should return 'I am being fired here'
            self.setDragMessage('red', item.label)

            $('.boss-container').off();
            $(window).off();


            $('.boss-container').on('mouseup',(event) => self.handleFileDragDrop(event,item));
            $(window).on('mouseup',(event)=> self.setDragMessage('red', null)  )
            $(window).on('mousemove',(event)=> self.updateDragBox(event)  )
      });

      fileTree.$on('activate-audio-file', sfx => {
            motherShip.$emit('activate-sound', sfx)
      });


      var padTree = Build.buildPadTree();
      console.log('pad tree', padTree)

      var initialPadConfig = await self.getInitialPadConfig()

     bossComponent = new Vue({
        el: '#theboss',
        data: {
          connected: false,
          pad: padTree,
          padConfig: initialPadConfig
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
                case 'loadConfig':
                    var response = await self.socketClient.emit('loadPadConfig')

                    if(response && response[0] && response[0].endsWith('.pad'))
                    {
                      self.setAlertMessage('green',response)
                      self.loadPadConfigFile(response[0])
                    }else{
                      self.setAlertMessage('red','Error: Not a .pad configuration')
                    }

                    break;
                default:
                    break;
            }


           }
         },
          components:
         {
           LaunchPad
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
             console.log('activate audio file  ', sfx) // should return 'I am being fired here'

            AudioHelper.playSound(self.socketClient,sfx)
            self.setAlertMessage('blue',sfx.label)
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



 static buildPadTree()
  {
    var tree = {
      cells:[]
    };

    var cellId = 0;
    for(var x=0;x<8;x++)
    {
      for(var y=0;y<8;y++)
      {
        tree.cells.push(
          {
            cellId: cellId++,
            cellX: x,
            cellY: y,
            path:null,
            label:'---'
          }
        )
      }
    }

    return tree;
  }

  async getInitialPadConfig()
  {

    return null;
  }

  async loadPadConfigFile()
  {

  }

  async handleFileDragDrop(event,item){

        console.log('handle drop ' )

      if(event.target.classList.contains('drop-target'))
      {
          $('.boss-container').off();
          var cellId = event.target.getAttribute('data-cell-id');

          console.log('dropped ',item,' on cell ', cellId)
          await this.assignSoundToPadConfig(item,cellId)
      }
  }



  async assignSoundToPadConfig(item,cellId)
  {
     var response = await this.socketClient.emit('assignSoundToPadConfig',{sfx:item,cellId:cellId});
     if(response.success)
     {
       self.setAlertMessage('blue','Assigned '+item.label+' to cell '+ cellId + '.')
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
