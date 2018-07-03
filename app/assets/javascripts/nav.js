import Vue from 'vue';


///giving me issues

export default class Nav {
  constructor( ){

  }

  init(){
     console.log('nav hi ');


     new Vue({
        el: '#nav-primary',
        data: {
          activeTab: 'home'
        },
        methods: {
           clickTab: function (tabType) {
             // `this` inside methods points to the Vue instance
             console.log('clicked ' + tabType + '!')

             this.activeTab = tabType;

             switch(tabType) {
                case 'accounts':
                    window.location.href = '/accounts.html'
                    break;
                case 'transfer':
                    window.location.href = '/transfer.html'
                    break;
                default:
                    window.location.href = '/'
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
