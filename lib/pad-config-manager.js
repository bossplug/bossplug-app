
const StorageHelper = require('./storage-helper')

const fs = require("fs");

const SHA = require('js-sha3')

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


    async assignSoundToPadConfig(assignment)
    {
      console.log('assign ', assignment)

      var path = assignment.sfx.path;
      var label = assignment.sfx.label;
      var cellId = assignment.cellId;

      //try to read the file from the pc
      var fileContents = await StorageHelper.readFile(path);

      //grab sha hash of the file
      var hash = SHA.sha3_256(fileContents);
      console.log('hash',hash)

      //remove existing cell config for this cell
      if(padConfig && padConfig.cells)
      {
        padConfig.cells = padConfig.cells.filter((item)=>(item.cellId != cellId))
      }else{
        padConfig = {
          name:"CoolPadConfig",
          cells: []
        }
      }

      //add the config to the padConfig
      var newCell = {
        cellId: cellId,
        sfxName: label,
        sfxHash: hash
      }

      padConfig.cells.push(newCell)

      //return the new config
      return this.getPadConfig();
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


    async savePadConfig()
    {
      var path = await StorageHelper.showSaveDialog({defaultPath: fileName})

      console.log('saving at ', path)

      var fileName = "padConfig.pad"

      var padConfigString = JSON.stringify(padConfig);

      await StorageHelper.writeFile(path,padConfigString)


      return {success:true,message:'Saved pad config.'}

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
        return {success:true,padConfig:padConfig}
      }else{
        return {success:false,message:'No config file loaded yet'}
      }
    }



}
