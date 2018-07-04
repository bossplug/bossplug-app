


var fs = require('fs');


const StorageHelper = require('./storage-helper')

var web3utils =  require('web3-utils');

var keythereum = require("keythereum");



  var pjson = require('../package.json');

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

    await StorageHelper.storeFile(name,keyObject);


   return {success:true}
  }


  static async getStoredAccountList()
  {
      var accountAddresses = [];

      var keys = await StorageHelper.getAllKeys();


      for(var filename of keys)
      {

         var response = await StorageHelper.readFile(filename);


         if(response && response.address)
         {
           var address = response.address;

           if(!address.startsWith('0x')){
             address = '0x' + response.address;
           }

           accountAddresses.push(address)
         }

      }
 

    return accountAddresses;
  }






}
