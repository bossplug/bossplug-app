


var fs = require('fs');

const storage = require('electron-json-storage');

var web3utils =  require('web3-utils');
var Web3Accounts = require('web3-eth-accounts');

const INFURA_MAINNET = "https://mainnet.infura.io/kZjd4ib8d7TnDMhYzjy4"
var web3Accounts = new Web3Accounts(INFURA_MAINNET);


module.exports =  class AccountHelper {
  constructor( ){

  }


  static createAccount()
  {
    var account = web3Accounts.create();
    return account;
  }




    async init(  )
    {



          ///test storage
          console.log(storage.getDataPath() ) //show this in settings


          await this.storeFile('foobar',{foo:'bar'});

          var response = await this.readFile('foobar');

          console.log(response)


  }



    async storeFile(key,json)
    {
      var response = await new Promise((resolve, reject) => {
        storage.set(key,json, function(error) {
          if (error) reject(error);

          var msg = 'Stored '+JSON.stringify(json)+ ' at '+ key.toString();
          resolve(msg);
        })
      });

      return response;
    }

    async readFile(key)
    {
      var response = await new Promise((resolve, reject) => {

        storage.get(key,function(error,data) {
          if (error) reject(error);
            resolve(data);
        });

      });

      return response;
    }


}
