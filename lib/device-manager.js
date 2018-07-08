
const {app} = require('electron')

const StorageHelper = require('./storage-helper')

const AppHelper = require('./app-helper')



const Launchpad = require( 'launchpad-mini' );
const pad = new Launchpad();

//  const ioHook = require('iohook')   /// SEGFAULT, does not allow open file dialog

/*

  manages launchpad devices


*/


module.exports =  class DeviceManager {


    constructor(){

    }

    async init(padConfigManager,socketServer)
    {
      this.padConfigManager=padConfigManager;
      this.socketServer=socketServer;

        //testing


      /*  ioHook.on("keydown", event => {
          //console.log(event); // {keychar: 'f', keycode: 19, rawcode: 15, type: 'keup'}

          var keycode = event.keycode;
          if(keycode >= 2 && keycode <=9)
          {
            self.activateCell({cellId: (keycode-2)})
          }
         });

        ioHook.start();
        */

    }

    async pressedKey(keyCode)
    {
      console.log('got key press',keyCode)

      if(keyCode >= 49 && keyCode <=57)
      {
        var response = await this.activateCell({cellId: (keyCode-49)})
        return {success:true}
      }
      return {success:false}
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
