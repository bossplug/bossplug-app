
const {app} = require('electron')

const StorageHelper = require('./storage-helper')

const AppHelper = require('./app-helper')



const Launchpad = require( 'launchpad-mini' );
const pad = new Launchpad();
/*

  manages launchpad devices


*/


module.exports =  class DeviceManager {


    constructor( ){

    }

    static async connectToLaunchpad()
    {
       try{
          var response = await pad.connect();
       }catch(e){
          return {success:false,message:e}
       }

      pad.reset( 2 );             // Make Launchpad glow yellow
      pad.on( 'key', k => {
          // Make button red while pressed, green after pressing
          pad.col( k.pressed ? pad.red : pad.green, k );
      } );

      return {success:true,message:response};

    }






}
