

var path = require("path"),
    express = require("express");

var DIST_DIR = path.join(__dirname, "../public"),
    PORT = 3000,
    app = express();


var fs = require('fs');

const storage = require('electron-json-storage');


const AccountHelper = require('./account-helper')


module.exports =  class SocketServer {
  constructor( ){

  }


    async init(server )
    {


      var self = this;
      var io = require('socket.io')(server);
      var port = process.env.PORT || 2054;


      ///  https://socket.io/docs/rooms-and-namespaces/#


      server.listen(port, function () {
        console.log('Socket server listening at port %d', port);
      });

      var sockets = {};




      //https://stackoverflow.com/questions/6756241/socket-io-client-side-emit-callback-never-fires

      io.on('connection', function (socket) {
        console.log('established new socket connection');


                socket.on('createAccount', function (data,fn) {

                        //use tools to create an acct and return the info
                        //should also save this account to some sort of global state ?
                        var acct = AccountHelper.createAccount();


                        fn(acct);  //immediate response

                  });






              socket.on('disconnect', function () {
                console.log(socket.sid, 'disconnected');
                delete sockets[socket.sid];
              });
      });





  }

}
