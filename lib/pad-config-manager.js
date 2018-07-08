
const StorageHelper = require('./storage-helper')

const fs = require("fs");

const SHA = require('js-sha3')

/*

  Manages the pad config file

*/
var padConfig;
var padTree;

  //A mapping of audio file hashes to their paths
var pathHashMap = {};
var audioHasPreloadedBuffer = {};


module.exports =  class PadConfigManager {


    constructor( ){

    }

     async  init()
    {
      console.log('init PadConfigManager');

      padTree = this.buildPadTree()

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
      return this.setPadConfig(padConfig, 'Assigned '+label+' to cell '+ cellId + '.');
    }


    async assignOptionToPadConfig(assignment)
    {
      var optionName = assignment.optionName;
      var value = assignment.value;

      switch(optionName)
      {
        case 'name':
          padConfig.name = value;

          break;
        default:
                return {success:false, message: 'Invalid option name.' }
          break;
      }

      return this.setPadConfig(padConfig, 'Assigned '+optionName+' : '+ value + '.')

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
      var fileName = "padConfig.pad"

      if(padConfig && padConfig.name)
      {
        fileName = padConfig.name + '.pad'
      }

      var path = await StorageHelper.showSaveDialog({defaultPath: fileName})

      console.log('saving at ', path)



      var padConfigString = JSON.stringify(padConfig);

      await StorageHelper.writeFile(path,padConfigString)


      return {success:true,message:'Saved pad config.'}

    }

    setPadConfig(config,msg)
    {
      padConfig = config;

      var configName = config.name;

      if(msg == null)
      {
        msg = 'Set .pad config: '+configName;
      }

      var tree = this.buildPadTree(padConfig)

      return {success:true,message:msg, padConfig: padConfig, padTree: tree}
    }

    buildPadTree(padConfig)
    {
      var self = this;

      var tree = {
        cells:[]
      };

      var existingCellsMap = {};

      if(padConfig != null && padConfig.cells != null)
      {
        for(var cell of padConfig.cells)
        {
          existingCellsMap[cell.cellId] = cell;
        }
      }

      var cellId = 0;
      for(var x=0;x<8;x++)
      {
        for(var y=0;y<8;y++)
        {
          var matchingCell = existingCellsMap[cellId];


          //look for a cell with this ID
          //TODO
          if(matchingCell)
          {
            tree.cells.push(
              {
                cellId: cellId++,
                cellX: x,
                cellY: y,
                path:self.findFilePathUsingHash(matchingCell.sfxHash),
                label:matchingCell.sfxName,
                hash:matchingCell.sfxHash,
                preloaded:(audioHasPreloadedBuffer[matchingCell.sfxHash]!=null)
              }
            )
          }else{
            tree.cells.push(
              {
                cellId: cellId++,
                cellX: x,
                cellY: y,
                path:null,
                label:'---',
                hash:null
              }
            )
          }


        }
      }


      return tree;
    }

    getPadConfig()
    {

      var padTree=this.buildPadTree(padConfig)

      return {success:true,padConfig:padConfig,padTree:padTree}

    }

    // Need a pre-loaded dictionary that matches hashes to paths
    findFilePathUsingHash(hash)
    {
      return pathHashMap[hash];
    }

    async catalogAudioFileHashes(audioFiles)
    {

      var result = [];

      for(var path of audioFiles)
      {
        var fileContents = await StorageHelper.readFile(path);

        var hash = SHA.sha3_256(fileContents);

        pathHashMap[hash] = path;

        result.push(
          {
            path: path,
            hash: hash
          }
        )

      }


      return result;
    }

    //return an array of the files {path: _ ... }
    async getSelectedAudioFiles()
    {
      var self = this;
      var files = [];

      var existingCellsMap = {};

      if(padConfig != null && padConfig.cells != null)
      {
        for(var cell of padConfig.cells)
        {
          files.push( {
            path:self.findFilePathUsingHash(cell.sfxHash),
            label:cell.sfxName,
            hash:cell.sfxHash
          } )
        }
      }


      return files;
    }


    markAudioFilesPreloaded(preloadedAudioFiles)
    {
      audioHasPreloadedBuffer = preloadedAudioFiles;

    }


}
