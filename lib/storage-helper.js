


var fs = require('fs');

const storage = require('electron-json-storage');

var web3utils =  require('web3-utils');

var keythereum = require("keythereum");

var pjson = require('../package.json');




module.exports =  class StorageHelper {
  constructor( ){

  }


    static getStoragePath()
    {
      return storage.getDataPath()
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

 
      static async hasFile(key)
      {
        var response = await new Promise((resolve, reject) => {

          storage.has(key,function(error,data) {
            if (error) reject(error);
              resolve(data);
          });

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

}
