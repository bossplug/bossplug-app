
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

        var contentsJSON = await StorageHelper.readFile(configFile)

        var contents;
        try{  contents = JSON.parse(contentsJSON)
        }catch(e){return {success:false, message: 'Could not parse file.' }}

        return this.setPadConfig(contents)


      }else{
        return {success:false,message:'Error: Not a .pad configuration'}
      }
    }

    setPadConfig(config)
    {
      padConfig = config;

      var configName = config.name;

      return {success:true,message:'Set .pad config: '+configName, padConfig: padConfig}
    }

    getPadConfig()
    {
      if(padConfig)
      {
        return {success:true,padconfig:padconfig}
      }else{
        return {success:false,message:'No config file loaded yet'}
      }
    }



}
