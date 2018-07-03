


var fs = require('fs');

const storage = require('electron-json-storage');

var web3utils =  require('web3-utils');
var Web3Accounts = require('web3-eth-accounts');

var keythereum = require("keythereum");


const INFURA_MAINNET = "https://mainnet.infura.io/kZjd4ib8d7TnDMhYzjy4"
var web3Accounts = new Web3Accounts(INFURA_MAINNET);


module.exports =  class AccountHelper {
  constructor( ){

  }


  static createAccount()
  {

    var params = { keyBytes: 32, ivBytes: 16 };

    var dk = keythereum.create( params );

    var account = web3Accounts.privateKeyToAccount(dk.privateKey);

    return {address:account.address,derivation:dk};
  }

  static async  saveAccount(acct)
  {
    var password = acct.password;
    var dk = acct.dk;
    var name = 'eth_acct_'+acct.address;
    var options = {};

    var keyObject = keythereum.dump(password, new Buffer(dk.privateKey), new Buffer(dk.salt), new Buffer(dk.iv), {options});

    await AccountHelper.storeFile(name,keyObject);


   return {success:true}
  }



    async testStorage(  )
    {



          ///test storage
          console.log(storage.getDataPath() ) //show this in settings


          await this.storeFile('foobar',{foo:'bar'});

          var response = await this.readFile('foobar');

          console.log(response)


  }



    static async  storeFile(key,json)
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
