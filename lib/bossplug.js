const electron = require('electron')

const Menu = electron.Menu;
const MenuItem = electron.MenuItem;


var fs = require('fs');


const StorageHelper = require('./storage-helper')

const AppHelper = require('./app-helper')
const PluginManager = require('./plugin-manager')


  var server = require('./webserver')


module.exports =  class BossPlug {


    constructor( ){

    }

    static async  init()
    {
      await AppHelper.initSettings();
      await PluginManager.init();

      var serv = new server();
      await serv.init()
 

    }


}
