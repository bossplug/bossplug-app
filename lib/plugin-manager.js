


const StorageHelper = require('./storage-helper')

const AppHelper = require('./app-helper')


  var server = require('./webserver')


/*

  Manages the queue of beats to play


*/

// https://medium.com/@ohbytheway/architecture-using-architect-8c8bb7d0277a
// https://github.com/c9/architect  ?

module.exports =  class PluginManager {


    constructor( ){

    }

    static async  init()
    {


    }

    //reload the plugins from storage, can do this at any time
    static async  reload()
    {


    }



}
