import Vue from 'vue';

var transferComponent;

export default class Transfer {
  constructor( ){

  }

  init(socketClient){
    var self = this;
    self.socketClient = socketClient;

    var self = this;

    var existingActiveAddress = window.sessionStorage.getItem("activeAddress");



     transferComponent = new Vue({
        el: '#transfer',
        data: {
          selectedAddress: existingActiveAddress

        },
        created: async function () {


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

          }

         }
      })


  }

 


};
