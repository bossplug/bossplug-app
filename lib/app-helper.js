



const StorageHelper = require('./storage-helper')


  var pjson = require('../package.json');

module.exports =  class AppHelper {


    constructor( ){

    }


    static async initSettings()
    {
      var defaultSettings = {

        tokenName: "0xBTC",

      }

      var settingsExists = await StorageHelper.hasConfigFile('settings');


      if(!settingsExists)
      {
        StorageHelper.storeConfigFile('settings',defaultSettings);
      }else{
        console.log('found settings' )
      }
    }



    static async getStoredSettings()
    {
      var settings = await StorageHelper.readConfigFile('settings');
      return settings;
    }




}
