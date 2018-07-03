import Vue from 'vue';

var blockies = require('./util/blockies')
var accountComponent;

export default class Nav {
  constructor( ){

  }

  init(socketClient){
    var self = this;
    self.socketClient = socketClient;

    accountComponent = new Vue({
        el: '#new-account',
        data: {
          address: '',
          privateKey: '',
          accountRendering: false
        },
        methods: {
           newAccount: function () {
             self.socketClient.socketEmit('createAccount',null,function(data){

               self.renderAccount( data )
             })
           },
           saveAccount: function () {
             var accountData = {};

             self.socketClient.socketEmit('saveAccount',accountData,function(data){

               if(data.success)
               {
                 window.location.href = '/accounts.html'
               }

             })
           },
           downloadBackup: function (el) {

             var btn = document.getElementById('downloadBackupButton')

              var obj = {
                  privateKey: accountComponent.privateKey
              };

              var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
            
              btn.setAttribute("href", "data:"+data);
              btn.setAttribute("download", "data.json");

           }
         }
      })


  }


  renderAccount(acct)
  {
    console.log('render account ', acct);


    Vue.set(accountComponent, 'address',  acct.address )
    Vue.set(accountComponent, 'privateKey',  acct.privateKey )
    Vue.set(accountComponent, 'accountRendering',  true )


    //make a blocky
    var icon = blockies.create({ // All options are optional
      seed: acct.address, // seed used to generate icon data, default: random

      size: 20, // width/height of the icon in blocks, default: 8
      scale: 6, // width/height of each block in pixels, default: 4

      });

    var blockieContainer = document.getElementById('blockie');
    while (blockieContainer.firstChild) {
      blockieContainer.removeChild(blockieContainer.firstChild);
    }
    blockieContainer.appendChild(icon); // icon is a canvas element


  }


};
