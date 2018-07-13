const electron = require('electron')

const Menu = electron.Menu;
const MenuItem = electron.MenuItem;


var fs = require('fs');


const StorageHelper = require('./storage-helper')

const AppHelper = require('./app-helper')
const PluginManager = require('./plugin-manager')

 var DeviceManager = require('./device-manager')


  var Server = require('./webserver')
  var BeatQueue = require('./beat-queue')
  var PadConfigManager = require('./pad-config-manager')

module.exports =  class BossPlug {


    constructor( ){

    }

    static async  init()
    {
      await AppHelper.initSettings();
      await PluginManager.init();


      var deviceManager = new DeviceManager()

      var padConfigManager = new PadConfigManager(deviceManager)
      await padConfigManager.init()

      var beatQueue = new BeatQueue()
      await beatQueue.init()





      var server = new Server(beatQueue,padConfigManager,deviceManager);
      await server.init()  //segfault

       var socketServer = server.getSocketServer();


       await deviceManager.init(padConfigManager,socketServer)

    }


}
