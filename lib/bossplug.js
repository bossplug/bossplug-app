const electron = require('electron')

const Menu = electron.Menu;
const MenuItem = electron.MenuItem;


var fs = require('fs');


const StorageHelper = require('./storage-helper')

const AppHelper = require('./app-helper')
const PluginManager = require('./plugin-manager')


  var Server = require('./webserver')
  var BeatQueue = require('./beat-queue')

module.exports =  class BossPlug {


    constructor( ){

    }

    static async  init()
    {
      await AppHelper.initSettings();
      await PluginManager.init();

      var beatQueue = new BeatQueue()
      await beatQueue.init()

      var server = new Server(beatQueue);
      await server.init()


    }


}
