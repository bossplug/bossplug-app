import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default


var alertBox;




export default class AlertBox {
  constructor( ){
  }

  async init( )
  {

    alertBox = new Vue({
       el: '#alert-box',
       data: {
         alertMessage: null,
         alertClass: null
       },
       methods: {

        }
     })

  }

  async setAlertMessage(color,msg)
  {
      Vue.set(alertBox, 'alertClass', color )
      Vue.set(alertBox, 'alertMessage', msg )

      await this.sleep(1000);

      Vue.set(alertBox, 'alertMessage', null )
  }

  sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
  }
}
