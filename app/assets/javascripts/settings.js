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
          version:null,
          tokenAddress:null,
          web3Provider:null
        },
        created: async function () {
          self.socketClient.socketEmit('getWalletInfo',null,function(data){
              console.log('got data', data)
              settingsComponent.storagePath = data.storagePath;
              settingsComponent.version = data.version;
              settingsComponent.tokenAddress = data.tokenAddress;
              settingsComponent.web3Provider = data.web3Provider;

          });


        },
        methods: {
           clickButton: function (buttonName) {

            }

           }

      })


  }


};
