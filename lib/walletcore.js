

var path = require("path"),
    express = require("express");

var DIST_DIR = path.join(__dirname, "../public"),
    PORT = 3000,
    app = express();


var fs = require('fs');


const INFURA_MAINNET = "https://mainnet.infura.io/kZjd4ib8d7TnDMhYzjy4"

const AccountHelper = require('./account-helper')
const StorageHelper = require('./storage-helper')



  var server = require('./webserver')


module.exports =  class WalletCore {


    constructor( ){

    }


    static async  init(  )
    {

      var defaultSettings = {
        web3Provider: INFURA_MAINNET,
        tokenAddress: "0xb6ed7644c69416d67b522e20bc294a9a9b405b31"
      }

      var settingsExists = await StorageHelper.hasFile('settings');

      console.log('settingsExists',settingsExists)

      if(!settingsExists)
      {
        StorageHelper.storeFile('settings',defaultSettings);
      }



      var serv = new server();
      serv.init()


    }

}
