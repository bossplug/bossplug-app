
const {app} = require('electron')

const StorageHelper = require('./storage-helper')

const AppHelper = require('./app-helper')



const Launchpad = require( 'launchpad-mini' );
const pad = new Launchpad();

const ioHook = require('iohook');
/*

  manages launchpad devices


*/


module.exports =  class DeviceManager {


    constructor(padConfigManager,socketServer){
      this.padConfigManager=padConfigManager;
      this.socketServer=socketServer;
    }

    async init()
    {

        //testing

       
        ioHook.on("keydown111123", event => {
          //console.log(event); // {keychar: 'f', keycode: 19, rawcode: 15, type: 'keup'}


          if(event.keycode == 2)
          {
            self.activateCell({cellId: 1})
          }
         });

        ioHook.start();


    }

    async connectToLaunchpad()
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


    async activateCell(cell)
    {
      var sfx = this.padConfigManager.getSoundAtCell(cell);
      console.log('activate sfx',sfx, cell)

      var response = await this.socketServer.emit('playLocalSound',sfx)

    }



}
