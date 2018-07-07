import Vue from 'vue';

const ContextMenuHelper = require('./context-menu-helper').default

import TreeMenu from './vue/TreeMenu.vue'

var buildComponent;
var fileTree; //https://vuejsdevelopers.com/2017/10/23/vue-js-tree-menu-recursive-components/

export default class Build {
  constructor( ){

  }

  async init(socketClient){
    var self = this;
    this.socketClient=socketClient;




    var tree =  {
      label: 'root',
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

  /*  var temp = Vue.component('tree-menu', {
       template: '#tree-menu',
       props: [ 'nodes', 'label', 'depth' ],
       data() {
          return {
            showChildren: true
          }
       },
       computed: {
         iconClasses() {
           return {
             'fa-plus-square-o': !this.showChildren,
             'fa-minus-square-o': this.showChildren
           }
         },
         labelClasses() {
           return { 'has-children': this.nodes }
         },
         indent() {
           return { transform: `translate(${this.depth * 50}px)` }
         }
       },
       methods: {
         toggleChildren() {
           console.log('toggle children')
            this.showChildren = !this.showChildren;
         }
       }
     });*/



     fileTree = new Vue({
        el: '#filetree',
        data: {
           tree
        },
        components: {
          TreeMenu
        }
      })



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
           }
         }
      })



      await ContextMenuHelper.buildMenu(window,'.audio-list',(evt)=> self.handleEvent(evt));


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
      Vue.set(fileTree, 'data', tree )

      console.log('set tree',tree)
    }
  }



    async buildFileTree(folders,containerClass)
    {


      var tree = {
          name: 'My Tree',
          children: [
            { name: 'hello' },
            { name: 'wat' },
            {
              name: 'child folder',
              children: [
                {
                  name: 'child folder',
                  children: [
                    { name: 'hello' },
                    { name: 'wat' }
                  ]
                },
                { name: 'hello' },
                { name: 'wat' },
                {
                  name: 'child folder',
                  children: [
                    { name: 'hello' },
                    { name: 'wat' }
                  ]
                }
              ]
            }
          ]
        }


        Vue.component('item', {
    template: '#item-template',
    props: {
      model: Object
    },
    data: function () {
      return {
        open: false
      }
    },
    computed: {
      isFolder: function () {
        return this.model.children &&
          this.model.children.length
      }
    },
    methods: {
      toggle: function () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },
      changeType: function () {
        if (!this.isFolder) {
          Vue.set(this.model, 'children', [])
          this.addChild()
          this.open = true
        }
      },
      addChild: function () {
        this.model.children.push({
          name: 'new stuff'
        })
      }
    }
  })






      return tree;


  }


};
