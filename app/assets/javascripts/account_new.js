import Vue from 'vue';

var blockies = require('./util/blockies')
 require('./util/keythereum')

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
          password: '',
          dk: null,
          accountRendering: false,
          backingUp: false,
          backedUp: false
        },
        methods: {
           newAccount: function () {
             self.socketClient.socketEmit('createAccount',null,function(data){

               console.log('got ', data)
               var address = data.address;

               Vue.set(accountComponent, 'dk',  data.derivation )
               Vue.set(accountComponent, 'address',  address )
               Vue.set(accountComponent, 'accountRendering',  true )

               self.renderAccount( address )
             })
           },
           saveAccount: function () {
             var accountData = {
               address:accountComponent.address,
               dk:accountComponent.dk,
               password:accountComponent.password
             }

             self.socketClient.socketEmit('saveAccount',accountData,function(data){

               if(data.success)
               {
                 window.location.href = '/accounts.html'
               }

             })
           },
           startBackup: function () {
              Vue.set(accountComponent, 'backingUp', true )




           },
           downloadBackup: function (el) {

             var password = accountComponent.password;
             var dk = accountComponent.dk;


             if(password.length<6)
             {
                console.log(password)

               console.log('Please use a longer password')
               return;
             }

             var options = {};

             var keyObject = keythereum.dump(password, new Buffer(dk.privateKey), new Buffer(dk.salt), new Buffer(dk.iv), {options});


              var btn = document.getElementById('downloadBackupButton')

              var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(keyObject));

              btn.setAttribute("href", "data:"+data);
              btn.setAttribute("download", "data.json");

              Vue.set(accountComponent, 'backingUp', false )
              Vue.set(accountComponent, 'backedUp', true )
           }
         }
      })


  }


  renderAccount(address)
  {
    console.log('render account ', address);





    //make a blocky
    var icon = blockies.create({ // All options are optional
      seed: address, // seed used to generate icon data, default: random

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
