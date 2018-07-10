
const StorageHelper = require('./storage-helper')

const fs = require("fs");

const SHA = require('js-sha3')


const cellEditorConstants = require('./util/cell-editor-constants').config

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


    async getCellData(cellId)
    {
      if(padConfig != null && padConfig.cells != null)
      {
        return padConfig.cells[cellId];
      }

      return null;
    }


    async getSoundAtCell(cell)
    {
      var cellId = cell.cellId;

      var sfx = await this.getCellData(cellId);
      sfx.preloaded = padTree.cells[cellId].preloaded;

      return sfx;

    }


    async assignOptionToCellConfig(assignment)
    {
      var cellId = assignment.cellId;
      var optionName = assignment.optionName;
      var value = assignment.value;

      if(padConfig != null && padConfig.cells != null)
      {
         padConfig.cells[cellId][optionName] = value

         return {success:true, cell: padConfig.cells[cellId] }
      }


      return {success:false, message: "Error assigning " + optionName + " to cell "+cellId }
    }

    async assignAttributeToCellConfig(assignment)
    {
      var cellId = assignment.cellId;
      var attributeName = assignment.attributeName;
      var value = assignment.value;

      if(padConfig != null && padConfig.cells != null && padConfig.cells[cellId].attributes)
      {
         padConfig.cells[cellId].attributes[attributeName] = value

         return {success:true, cell: padConfig.cells[cellId] }
      }



      return {success:false, message: "Error assigning " +  attributeName + " to cell "+cellId }
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
      if(padConfig == null ||  padConfig.cells == null)
      {
        //make a new pad config :)
        padConfig = {
          name:"CoolPadConfig",
          version:"1.0.0",
          cells: {}  //a hash not an array !!
        }
      }

      //add the config to the padConfig
      if(!padConfig.cells[cellId])
      {
        padConfig.cells[cellId] = {
          cellId: cellId
        }
      }

      padConfig.cells[cellId].sfxName = label;
      padConfig.cells[cellId].sfxHash = hash;
      padConfig.cells[cellId].name = label;

      padConfig.cells[cellId] = PadConfigManager.populateCellWithAttributes(padConfig.cells[cellId])

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

        padTree = this.buildPadTree(padConfig)



      return {success:true,message:msg, padConfig: padConfig, padTree: padTree}
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
          existingCellsMap = padConfig.cells;
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

             var name = matchingCell.name;
              if(name == null) name = matchingCell.sfxName;

            tree.cells.push(
              {
                cellId: cellId++,
                cellX: x,
                cellY: y,
                path:self.findFilePathUsingHash(matchingCell.sfxHash),
                label:name,
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

      padTree = tree;

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


      console.log('preload fail ', padConfig.cells )

      if(padConfig != null && padConfig.cells != null)
      {
        for(var key in padConfig.cells )
        {
          var cell = padConfig.cells[key]
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


    static populateCellWithAttributes(cell)
    {

      console.log('populating ', cellEditorConstants)
      //cellEditorConstants

      if(!cell.attributes) cell.attributes = {}


        for(var attr of cellEditorConstants.cellAttributes)
        {

          cell.attributes[attr] = false;
        }



        if(!cell.actions) cell.actions = {}

        for(var action of cellEditorConstants.cellActions)
        {
          var val;

          switch(action.type)
          {
            case 'percent': val = 0; break;
            case 'integer': val = 0; break;
            case 'channelNumber': val = 0; break;
            case 'boolean': val = false; break;
            case 'valueless': val = null; break;
          }


          cell.actions[action.name] = {
            name: action.name,
            label: action.label,
            type: action.type,
            value: val,
            enabled: false
          };
        }






      return cell;
    }


}
