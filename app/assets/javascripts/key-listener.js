import Vue from 'vue';


export default class KeyListener {
  constructor( ){

  }

  async init(socketClient)
  {
    var self=this;
    self.socketClient=socketClient;
    document.onkeypress = async function (e) {
        e = e || window.event;

        console.log('meep',e.keyCode)

        var response = await self.socketClient.emit('pressedKey',e.keyCode);
        console.log('pressed key response ',response)
    };
  }



}
