import Vue from 'vue';

const ContextMenuHelper = require('./context-menu-helper').default

export default class Build {
  constructor( ){

  }

  async init(socketClient){
    var self = this;
    this.socketClient=socketClient;


     new Vue({
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
                    var response = await socketClient.emit('connectToLaunchpad')
                    console.log(response)
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

        console.log(ContextMenuHelper)
      await ContextMenuHelper.buildMenu(window,'.audio-list');


  }


};
