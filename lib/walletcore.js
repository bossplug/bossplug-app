


var fs = require('fs');


const AccountHelper = require('./account-helper')
const StorageHelper = require('./storage-helper')

const WalletHelper = require('./wallet-helper')


  var server = require('./webserver')


module.exports =  class WalletCore {


    constructor( ){

    }





    static async  init()
    {
      await WalletHelper.initSettings();


      var serv = new server();
      await serv.init()

    }





}
