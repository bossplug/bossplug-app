
const StorageHelper = require('./storage-helper')

const fs = require("fs");

/*

  Manages the pad config file

*/
var padConfig;

module.exports =  class PadConfigManager {


    constructor( ){

    }

     async  init()
    {
      console.log('init PadConfigManager')

      //check for existing config file

    }


    async loadPadConfig()
    {
      var response = await StorageHelper.showOpenDialog()
      if(response && response[0] && response[0].endsWith('.pad'))
      {
        var configFile = response[0];
        var configName = configFile.substring(configFile.lastIndexOf('/'+1));

        //read in the file
        //assign padConfig variable

        var contents = await StorageHelper.readFile(configFile)
        console.log( 'contents ')

        return {success:true,message:'Loaded .pad config '+configName}
      }else{
        return {success:false,message:'Error: Not a .pad configuration'}
      }
    }

    async getPadConfig()
    {
      if(padConfig)
      {
        return {success:true,padconfig:padconfig}
      }else{
        return {success:false,message:'No config file loaded yet'}
      }
    }



}
