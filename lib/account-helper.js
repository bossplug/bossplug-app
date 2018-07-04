


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

    var params = {   };

    var dk = keythereum.create( params );


    //dk = JSON.stringify(dk)

    //dk = JSON.parse(dk) 

    var options={};
    var password=""
    var keyObject = keythereum.dump(password, Buffer.from(dk.privateKey), Buffer.from(dk.salt), Buffer.from(dk.iv), {options});

    var address = keyObject.address;

    if(!address.startsWith('0x'))
    {
      address = '0x' + address;
    }

    return {address:address,derivation:dk};
  }

  static async  saveAccount(keyObject)
  {
  /*  var password = acct.password;
    var dk = acct.dk;
    var name = 'eth_acct_'+acct.address;
    var options = {};

    var keyObject = keythereum.dump(password, new Buffer(dk.privateKey), new Buffer(dk.salt), new Buffer(dk.iv), {options});
*/
    var address = keyObject.address;

    if(!address.startsWith('0x')){
      address = '0x' + keyObject.address;
    }

    var name = 'eth_acct_'+address;

    await AccountHelper.storeFile(name,keyObject);


   return {success:true}
  }


  static async getStoredAccountList()
  {
      var accountAddresses = [];

      var keys = await this.getAllKeys();


      for(var filename of keys)
      {

         var response = await this.readFile(filename);


         if(response && response.address)
         {
           var address = response.address;

           if(!address.startsWith('0x')){
             address = '0x' + response.address;
           }

           accountAddresses.push(address)
         }

      }

     console.log(accountAddresses)

    return accountAddresses;
  }




/*
    async testStorage(  )
    {

          ///test storage
          console.log(storage.getDataPath() ) //show this in settings


          await this.storeFile('foobar',{foo:'bar'});

          var response = await this.readFile('foobar');

          console.log(response)


  }
*/


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

    static async readFile(key)
    {
      var response = await new Promise((resolve, reject) => {

        storage.get(key,function(error,data) {
          if (error) reject(error);
            resolve(data);
        });

      });

      return response;
    }

    static async getAllFiles( )
    {

      var response = await new Promise((resolve, reject) => {

        storage.getAll(function(error, data) {
          if (error) reject(error);
          resolve(data);
        });

      });

      return response;
    }

    static async getAllKeys( )
    {

      var response = await new Promise((resolve, reject) => {

        storage.keys(function(error, data) {
          if (error) reject(error);
          resolve(data);
        });

      });

      return response;
    }



}
