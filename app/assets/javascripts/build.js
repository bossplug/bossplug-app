import Vue from 'vue';

var $ = require("jquery");

const ContextMenuHelper = require('./context-menu-helper').default
const LocalStorageHelper= require('./local-storage-helper').default

import TreeMenu from './vue/TreeMenu.vue'

var buildComponent;
var fileTree;


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

       var existingAudioTree = await LocalStorageHelper.get("audioTree");

     console.log('found tree', existingAudioTree )
     if(existingAudioTree)
     {
       tree = existingAudioTree;
     }



      fileTree = new Vue({
        el: '#filetree',
        data:  {
          tree: tree
        }  ,
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
          connected: false,
          audioFolders: []
        },
        methods: {
           clickButton: async function (buttonName) {
             // `this` inside methods points to the Vue instance
             console.log('clicked ' + buttonName + '!')

             switch(buttonName) {
                case 'connect':

                    var response = await self.socketClient.emit('connectToLaunchpad')
                    if(response.success)
                    {
                      self.connected = true;
                    }else{
                      self.connected = false;
                      self.errorMessage = response.message;
                    }
                    break;

                default:
                    break;
            }


           }
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
          console.log('remove audio folderr', target)
          break;
      default:
          break;
    }
  }

  async addAudioFolders(folders)
  {
    for(var folder of folders)
    {
      console.log('add folder ',folder);
      var selectedFolders = buildComponent.audioFolders;

      selectedFolders.push(folder);

      var tree = await this.buildFileTree( selectedFolders, '.audioFileContainer' );

      Vue.set(buildComponent, 'audioFolders', selectedFolders )
      Vue.set(fileTree, 'tree', tree )
      //show children of root

      LocalStorageHelper.set("audioTree",tree)



      console.log('set tree',tree)

      console.log('got tree',fileTree.tree)
    }
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

          var foldername = folder.substring(folder.lastIndexOf('/')+1);
          var subnode = {
            label: foldername,
            path : folder,
            nodes: [],
            key: elementKey
          };
          elementKey++;

           for(var file of files)
           {
             console.log('found audio file',file, ' in folder ', folder )
             var filename = file.substring(file.lastIndexOf('/')+1);

             var filenode = {
               label:filename,
               path:file,
               key: elementKey
             }
             elementKey++;
            subnode.nodes.push(filenode)
           }

            tree.nodes.push( subnode )
        }catch(err)
        {
          console.error(err)
        }
      }



/*
      var tree =  {
        label: 'Audio List',
        nodes: [
          {
            label: 'item1',
            nodes: [
              {
                label: 'item1.1'
              },
              {
                label: 'item1.2',
                nodes: [ ]
              }
            ]
          },
          {
            label: 'item2',
            path:'thisismypath'
          }
        ]
      }

*/

      return tree;


  }


};
