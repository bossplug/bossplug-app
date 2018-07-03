import Vue from 'vue';


export default class Nav {
  constructor( ){

  }

  init(){


     new Vue({
        el: '#add-account-menu',
        data: {

        },
        methods: {
           clickButton: function (buttonName) {
             // `this` inside methods points to the Vue instance
             console.log('clicked ' + buttonName + '!')

             switch(buttonName) {
                case 'newaccount':
                    window.location.href = '/account_new.html'
                    break;
                case 'importaccount':
                    window.location.href = '/account_import.html'
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
