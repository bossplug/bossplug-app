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

             // `event` is the native DOM event
             /*if (event) {
               alert(event.target.tagName)
             }*/
           }
         }
      })


  }


};
