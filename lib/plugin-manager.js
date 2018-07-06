
const {app} = require('electron')

const StorageHelper = require('./storage-helper')

const AppHelper = require('./app-helper')
var fx = require('mkdir-recursive');


  var server = require('./webserver')

  var architect = require("architect");
  var dirname = require('path').dirname;
/*

  Manages the queue of beats to play


*/

// https://medium.com/@ohbytheway/architecture-using-architect-8c8bb7d0277a
// https://github.com/c9/architect  ?
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')

const path = require('path')


const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory)

global.appRoot = path.resolve(__dirname);

module.exports =  class PluginManager {


    constructor( ){

    }

    static async  init()
    {
      //copy default plugins to storage (take their folder, save in storage)
    //  StorageHelper.copyFolderRecursiveSync(  )
      await PluginManager.copyPlugins()

      //find  plugins in storage and bring them in.  HTML needs to be webpacked

      //load plugins
      await PluginManager.loadPlugins();

      //webpack ??


    }

    static async copyPlugins()
    {
      var destination = StorageHelper.getStoragePath() + '/plugins';


      var response = await new Promise((resolve, reject) => {
          fx.mkdir(destination, function(err) {
              if (err) reject(err);
              resolve('created folder '+destination);
            });
        });


      var defaultPluginDirectories = getDirectories(appRoot  + '/plugins');
      console.log( getDirectories(appRoot  + '/plugins') )

      for(var folder of defaultPluginDirectories)
      {
        var folderName = folder.substring(folder.lastIndexOf('/'));
        console.log(destination + folderName)
        StorageHelper.copyFolderRecursiveSync(folder,destination)
      }

      //  console.log( getDirectories('./plugins') )
    }

    //reload the plugins from storage, can do this at any time
    static async  reload()
    {
      await PluginManager.loadPlugins();

    }

    static async loadPlugins()
    {

      var pluginPath = StorageHelper.getStoragePath() + '/plugins';

      console.log(pluginPath )

      var pluginDirectories = getDirectories(pluginPath);

      console.log('pluginDirectories',pluginDirectories )

      var pluginArray = []

     for(var folder of pluginDirectories)
     {
       console.log('meep',folder)

       try{
         var pluginFile = await StorageHelper.findInDir(folder,/\.plugin.js$/ )
       }catch(err)
       {
         console.error(err)
       }

       console.log(pluginFile)
       if(!pluginFile ) continue;


       //var config = require(configPath);
       //var base = dirname(configPath);

        pluginArray.push( pluginFile.substring(0,pluginFile.lastIndexOf('.')  ) )
     }



      //get this from storage  and the plugins are in storage


      console.log('pluginArray',pluginArray)


      var pluginPath = StorageHelper.getStoragePath() + '/plugins';


    //  var pluginConfig = ["/home/andy/.config/bossplug-app/storage/plugins/calculator/calculator.plugin"] //need to auto gen this !!
      var base = dirname(pluginPath);

      var config = architect.resolveConfig(pluginArray,base);



      console.log('config',config)

    /*   architect.createApp(config, function (err, app) {
        if (err) throw err;
        console.log("app ready");
      });*/

/*
      require(["../../architect"], function (architect) {
          architect.resolveConfig(plugins,appRoot, function (err, config) {
              if (err) throw err;
             architect.createApp(config);
          });
      });
*/



    }




}
