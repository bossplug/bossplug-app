import Vue from 'vue';

var settingsComponent;



export default class Nav {
  constructor( ){

  }

  init(socketClient){
    var self = this;
    this.socketClient=socketClient;

     settingsComponent = new Vue({
        el: '#settings',
        data: {
          storagePath: null,
          version:null
        },
        created: async function () {
          self.socketClient.socketEmit('getWalletInfo',null,function(data){
              console.log('got data', data)
              settingsComponent.storagePath = data.storagePath;
              settingsComponent.version = data.version;

          });


        },
        methods: {
           clickButton: function (buttonName) {

            }

           }

      })


  }


};
