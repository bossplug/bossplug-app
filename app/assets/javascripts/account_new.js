import Vue from 'vue';

var blockies = require('./util/blockies')
 require('./util/keythereum')

var accountComponent;

export default class AccountNew {
  constructor( ){

  }

  init(socketClient){
    var self = this;
    self.socketClient = socketClient;

    accountComponent = new Vue({
        el: '#new-account',
        data: {
          address: null,
          password: '',
          dk: null,
          accountRendering: false,
          backingUp: false,
          backedUp: false,

          errorMessage: null
        },
        methods: {
           newAccount: function () {
             self.socketClient.socketEmit('createAccount',null,function(data){

               var acct = JSON.parse(data);

               console.log('got ',  acct)
               var address = acct.address;

               accountComponent.dk = acct.derivation;
               accountComponent.dk.privateKey = Buffer.from(accountComponent.dk.privateKey)
               accountComponent.dk.salt = Buffer.from(accountComponent.dk.salt)
               accountComponent.dk.iv = Buffer.from(accountComponent.dk.iv)

               accountComponent.address = address;
               accountComponent.accountRendering = true;

               self.renderAccount( address )
             })
           },
           saveAccount: function () {

             //address is changing !!??

             var password = accountComponent.password;
             var dk = accountComponent.dk;
             var options = {};

             var keyObject = keythereum.dump(password, (dk.privateKey), (dk.salt), (dk.iv), {options});
 
             if( !accountComponent.address.endsWith(keyObject.address))
             {
               console.log(keyObject.address)

               accountComponent.errorMessage = "Address doesn't match?"
               return;
             }

             self.socketClient.socketEmit('saveAccount',keyObject,function(data){

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

             if(password.length < 6)
             {
               this.errorMessage = 'Minimum password length: 6'
              return
             }


             var options = {};

             var keyObject = keythereum.dump(password, (dk.privateKey), (dk.salt), (dk.iv), {options});



             if( !accountComponent.address.endsWith(keyObject.address))
             {
               console.log('does not match', keyObject.address, accountComponent.address)

               accountComponent.errorMessage = "Address doesn't match?"
               return;
             }

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
