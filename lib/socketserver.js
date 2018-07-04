

var path = require("path"),
    express = require("express");

var DIST_DIR = path.join(__dirname, "../public"),
    PORT = 3000,
    app = express();


var fs = require('fs');

const storage = require('electron-json-storage');


const WalletHelper = require('./wallet-helper')
const AccountHelper = require('./account-helper')
const NetworkHelper = require('./network-helper')

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
                      var acct = AccountHelper.createAccount();
                      fn(JSON.stringify(acct));  //immediate response
                });

              socket.on('saveAccount', async function (data,fn) {
                      var response = await AccountHelper.saveAccount(data);
                      fn(response);  //immediate response
                });

              socket.on('getWalletInfo', async  function (data,fn) {
                      var info = await  WalletHelper.getWalletInfo();
                      fn(info);  //immediate response
                });


              socket.on('getAccountInfo', async function (address,fn) { 
                      var info = await NetworkHelper.getAccountInfo(address);
                      fn({success:true, accountInfo: info});  //immediate response
                });

              socket.on('listStoredAccounts', async function (data,fn) {
                      var list = await AccountHelper.getStoredAccountList();
                      fn({success:true, list: list});  //immediate response
                });



              socket.on('disconnect', function () {
                console.log(socket.sid, 'disconnected');
                delete sockets[socket.sid];
              });
      });





  }

}
