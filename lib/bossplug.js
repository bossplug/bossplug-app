


var fs = require('fs');

 
const StorageHelper = require('./storage-helper')

const AppHelper = require('./app-helper')


  var server = require('./webserver')


module.exports =  class BossPlug {


    constructor( ){

    }

    static async  init()
    {
      await AppHelper.initSettings();


      var serv = new server();
      await serv.init()

    }





}
