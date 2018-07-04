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
        el: '#accounts-menu',
        data: {

        },
        created: function () {
            self.getAccountsList();
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

             // `event` is the native DOM event
             /*if (event) {
               alert(event.target.tagName)
             }*/
           }
         }
      })




  }


  getAccountsList()
  {
    var self = this;

    console.log('get acct list', self.socketClient)
     self.socketClient.socketEmit('listStoredAccounts',null,function(data){

       if(data.success)
       {
         window.location.href = '/accounts.html'
       }

     })

  }


};
