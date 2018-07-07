import Vue from 'vue';

var $ = require("jquery");

const ContextMenuHelper = require('./context-menu-helper').default

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
      label: 'roott',
      nodes: [
        {
          label: 'item1',
          nodes: [
            {
              label: 'item1.1'
            },
            {
              label: 'item1.2',
              nodes: [
                {
                  label: 'item1.2.1'
                }
              ]
            }
          ]
        },
        {
          label: 'item2'
        }
      ]
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
                    var response = await socketClient.emit('connectToLaunchpad')
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

             // `event` is the native DOM event
             /*if (event) {
               alert(event.target.tagName)
             }*/
           },
           greet: function()
           {
             console.log('hello')
           }
         }
      })



      await ContextMenuHelper.buildMenu(window,'.audio-list',(evt)=> self.handleEvent(evt));


  }



  handleMouseUp(event,label){
      console.log('mouse up', event)

      if(event.target.classList.contains('drag-target'))
      {
          var cellId = event.target.getAttribute('data-cell-id');

          console.log('dropped ',label,' on cell ', cellId)

      }
  }

  //consider stuffing this in another class
  async handleEvent(eventName)
  {
    var self = this;

    switch(eventName){
      case 'addAudioFolder':
          var response = await this.socketClient.emit('addAudioFolder');
          self.addAudioFolders(response)
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

      console.log('set tree',tree)

      console.log('got tree',fileTree.tree)
    }
  }



    async buildFileTree(folders,containerClass)
    {


      var tree =  {
        label: 'reett',
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
            label: 'item2'
          }
        ]
      }



      return tree;


  }


};
