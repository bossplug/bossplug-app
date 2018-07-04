import Vue from 'vue';

var accountsComponent;

export default class Accounts {
  constructor( ){

  }

  init(socketClient){
    var self = this;
    self.socketClient = socketClient;

    var self = this;




     accountsComponent = new Vue({
        el: '#accounts',
        data: {
          accounts: [],
          selectedAccount: null,
          selectedAddress: null,

          tokenLoaded:false,
          tokenBalance: null
        },
        created: async function () {
            var accountsList = await self.getAccountsList();
            console.log(accountsList)

            self.renderAccountsList(accountsList)

        },
        methods: {
           clickButton: function (buttonName) {
             // `this` inside methods points to the Vue instance
             console.log('clicked ' + buttonName + '!')

             switch(buttonName) {
                case 'addaccount':
                    window.location.href = '/account_add.html'
                    break;

                default:
                    break;
            }

          },
          selectAccount: function (e) {
            // `this` inside methods points to the Vue instance
            console.log('clicked ' +    '!', e.target)

            var target = e.target;
            var address = target.getAttribute('data-address');

            console.log(address)

            this.selectedAddress = address;

            self.renderAccountData(address)


          }
         }
      })


  }

  //get balances and QR codes
  async renderAccountData(address)
  {

    Vue.set(accountsComponent, 'tokenLoaded', false )


    var self=this;
    var accountInfo = await new Promise(async (resolve, reject) => {
         self.socketClient.socketEmit('getAccountInfo',address,function(data){

           if(data.success)
           {
              resolve(data.accountInfo)
           }else{
             reject(data.success)
           }

         })
      })

      console.log('account info',accountInfo)


      Vue.set(accountsComponent, 'tokenLoaded', true )

      Vue.set(accountsComponent, 'tokenBalance', accountInfo.tokenBalance )

  }


  async getAccountsList()
  {
    var self = this;

    console.log('get acct list', self.socketClient)

    var list = await new Promise(async (resolve, reject) => {
         self.socketClient.socketEmit('listStoredAccounts',null,function(data){

           if(data.success)
           {
              resolve(data.list)
           }else{
             reject(data.success)
           }

         })
      })

      return list;
  }



  async renderAccountsList(list)
  {
      var accounts = [];

      for(var address of list)
      {
        var acct = {
          address: address
        }

        accounts.push(acct)
      }


      Vue.set(accountsComponent, 'accounts', accounts )
  }


};
