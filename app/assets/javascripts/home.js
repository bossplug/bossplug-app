import Vue from 'vue';


export default class Nav {
  constructor( ){

  }

  init(){


     new Vue({
        el: '#home-menu',
        data: {

        },
        methods: {
           clickButton: function (buttonName) {
             // `this` inside methods points to the Vue instance
             console.log('clicked ' + buttonName + '!')

             switch(buttonName) {
                case 'addaccount':
                    window.location.href = '/account_add.html'
                    break;
                case 'addressbook':
                    window.location.href = '/accounts.html'
                    break;
                case 'settings':
                    window.location.href = '/settings.html'
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


};
