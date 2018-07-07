import Vue from 'vue';

var $ = require("jquery");

const ContextMenuHelper = require('./context-menu-helper').default
const LocalStorageHelper= require('./local-storage-helper').default

import TreeMenu from './vue/TreeMenu.vue'

var buildComponent;
var fileTree;
var alertBox;

 //https://vuejsdevelopers.com/2017/10/23/vue-js-tree-menu-recursive-components/
//https://dzone.com/articles/build-a-collapsible-tree-menu-with-vuejs-recursive-1


export default class Build {
  constructor( ){

  }

  async init(socketClient){
    var self = this;
    this.socketClient=socketClient;



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
           await self.buildAudioFolders(existingAudioFolders)
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
            console.log('start dragging ', label) // should return 'I am being fired here'

            $('.boss-container').off();
            $('.boss-container').on('mouseup',(event) => self.handleMouseUp(event,label));

          //  window.addEventListener('mouseup',(event) => self.handleMouseUp(event,label) )

      });



     buildComponent = new Vue({
        el: '#build',
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

      alertBox = new Vue({
         el: '#alert-box',
         data: {

           alertMessage: null,
           alertClass: null
         },
         methods: {

          }
       })

      await ContextMenuHelper.buildMenu(window,'.audio-list',(evt,target)=> self.handleEvent(evt,target));

  }



  handleMouseUp(event,label){
      if(event.target.classList.contains('drop-target'))
      {
          var cellId = event.target.getAttribute('data-cell-id');

          console.log('dropped ',label,' on cell ', cellId)

      }
  }

  //consider stuffing this in another class
  async handleEvent(evt,target)
  {
    var self = this;

    var role = evt.role;

    switch(role){
      case 'addaudiofolder':
          var response = await this.socketClient.emit('addAudioFolder');
          self.addAudioFolders(response)
          break;

      case 'removeaudiofolder':
          //var response = await this.socketClient.emit('addAudioFolder');
          //self.addAudioFolders(response)
          var nodeId = target.getAttribute('data-node-id')
          self.removeAudioFolder(nodeId)
          break;
      default:
          break;
    }
  }

  async addAudioFolders(folders)
  {


    for(var folder of folders)
    {
      var existingAudioFolders = await LocalStorageHelper.get("audioFolders");

      var selectedFolders = [];

      if(existingAudioFolders) selectedFolders = existingAudioFolders;

      selectedFolders.push({ path: folder, nodeId: null });

      await this.buildAudioFolders(selectedFolders);

      Vue.set(fileTree, 'audioFolders', selectedFolders )

      LocalStorageHelper.set("audioFolders",selectedFolders)

    }
  }

  async removeAudioFolder(nodeId)
  {

    console.log('remove audio folderr', nodeId)


    var existingAudioFolders = await LocalStorageHelper.get("audioFolders");


    var remainingAudioFolders = existingAudioFolders.filter((item) => item.nodeId != nodeId)

    await this.buildAudioFolders(remainingAudioFolders);

    Vue.set(fileTree, 'audioFolders', remainingAudioFolders )

    LocalStorageHelper.set("audioFolders",remainingAudioFolders)
  }

  async buildAudioFolders(selectedFolders)
  {

    var tree = await this.buildFileTree( selectedFolders, '.audioFileContainer' );

    Vue.set(fileTree, 'tree', tree )
    //show children of root
    LocalStorageHelper.set("audioTree",tree)

    console.log('updated tree',tree )
  }

    async buildFileTree(folders,containerClass)
    {
      console.log('folders',folders   )
      var audioFiles = [];

      var tree =  {
        label: 'Audio List',
        nodes: []
      }

      var elementKey = 0;

      for(var folder of folders)
      {
        try{
          var files = await this.socketClient.emit('findAudioInDir', folder );

          var folderpath = folder.path;
          var foldername = folderpath.substring(folderpath.lastIndexOf('/')+1);
          var nodeId = elementKey++;
          folder.nodeId = nodeId;  //set the folder nodeId

          var subnode = {
            label: foldername,
            path : folderpath,
            nodes: [],
            nodeId: nodeId
          };


           for(var file of files)
           {
             console.log('found audio file',file, ' in folder ', folder )
             var filename = file.substring(file.lastIndexOf('/')+1);

             var filenode = {
               label:filename,
               path:file,
               nodeId: elementKey++
             }

            subnode.nodes.push(filenode)
           }

            tree.nodes.push( subnode )
        }catch(err)
        {
          console.error(err)
        }
      }




      return tree;


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
