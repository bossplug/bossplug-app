import Vue from 'vue';


export default class Nav {
  constructor( ){

  }

  init(socketClient){
    var self = this;
    self.socketClient = socketClient;

     new Vue({
        el: '#new-account',
        data: {

        },
        methods: {
           newAccount: function () {
             // `this` inside methods points to the Vue instance
             console.log('clicked ' )

             self.socketClient.socketEmit('createAccount',true,function(data){
               console.log('got a thing ',data)
             })
           }
         }
      })


  }


};
