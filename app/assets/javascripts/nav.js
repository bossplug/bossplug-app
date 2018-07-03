import Vue from 'vue';


export default class Nav {
  constructor( ){

  }

  init(){


    var initActiveTab = null;

    if(document.getElementById("home")){
      initActiveTab = 'home';
    }

    if(document.getElementById("accounts")){
      initActiveTab = 'accounts';
    }

    if(document.getElementById("transfer")){
      initActiveTab = 'transfer';
    }


     new Vue({
        el: '#nav-primary',
        data: {
          activeTab: initActiveTab
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
