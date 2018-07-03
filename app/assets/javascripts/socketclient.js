

var io = require('socket.io-client');

export default class SocketClient {
  constructor( ){

  }

  async init()
  {
    console.log('init socket client')

    var self = this;

    var current_hostname = window.location.hostname;

    const socketServer = 'http://'+current_hostname+':2054';

    const options = {transports: ['websocket'], forceNew: true};
    this.socket = io(socketServer, options);

    this.socket.on('connect', () => {
      console.log('connected to socket.io server');

    });


    this.socket.on('disconnect', () => {
      console.log('disconnected from socket.io server');
    });


 




  }


  async socketEmit(name,value,callback)
  {
    console.log('emit ',name,value)

  //  console.log(this.socket)

    await this.socket.emit(name,value,callback)
  }


}
