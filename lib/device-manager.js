
const {app} = require('electron')

const StorageHelper = require('./storage-helper')

const AppHelper = require('./app-helper')



const Launchpad = require( 'launchpad-mini' );
const pad = new Launchpad();

//  const ioHook = require('iohook')   /// SEGFAULT, does not allow open file dialog

/*

  manages launchpad devices


*/
var queuedPadColors = {};

var connected = false;

var sfxConfig = {};

module.exports =  class DeviceManager {


    constructor(){

    }

    async init(padConfigManager,socketServer)
    {
      var self = this;
      this.padConfigManager=padConfigManager;
      this.socketServer=socketServer;

      setInterval( function(){ self.update() } , 75 )

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

    async pressedKeyboard(keyCode)
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
      var self = this;

       try{
          var response = await pad.connect();
       }catch(e){
          return {success:false,message:e}
       }

      pad.reset( 0 );             // Make Launchpad glow yellow

      //k = { x: 1, y: 3, pressed: true, 0: 1, 1: 3, length: 2 }
      pad.on( 'key', k => {
          // Make button red while pressed, green after pressing
          self.pressedPad( k.x, k.y, k.pressed  );
      } );

      connected = true;

      return {success:true,message:response};

    }


    //make an update loop to send the buffered LED colors so as to reduce bandwidth

    async pressedPad(x,y,pressed)
    {
      var i = x + (y*8);
      console.log('pressed pad',x,y,i,pressed)

      if(pressed)
      {
        var response = await this.activateCell({cellId:  i });
        sfxConfig[i].pressed = true;
      }else{
        sfxConfig[i].pressed = false;
      }

    }

  /*  async setPadColor(k)
    {
      await pad.col( k.pressed ? pad.red : pad.green, k );
    } */


    async queuePadColor(i, padColor)
    {
      //var padColor = (color == 'red') ? Launchpad.Colors.red : Launchpad.Colors.green;
      var x = Math.floor(i%8);
      var y = Math.floor(i/8);

      queuedPadColors[i] = {definition: [x,y,padColor]}
      //await pad.col( (color == 'red') ? pad.red : pad.green, k );
    }


    async update()
    {

      for(var i in sfxConfig)
      {
        var light = sfxConfig[i];
        if(light)
        {
          var x = Math.floor(i%8);
          var y = Math.floor(i/8);

          if( light.assigned )
          {
            queuedPadColors[i] = {definition: [x,y,pad.amber.full ]}
          }

          if( light.pressed ) //light.playing
          {
            queuedPadColors[i] = {definition: [x,y,pad.green.full ]}
          }



        }else{
          queuedPadColors[i] = {definition: [x,y,pad.red.off]}
        }
      }


      if(queuedPadColors)
      {
        var array = [];

        for(var j in queuedPadColors){
          var queuedColor = queuedPadColors[j];
          if(queuedColor)
          {
            array.push(queuedColor.definition)
          }
        }


        await this.setPadColorByArray(array)
      }


    }

    /*
    [
        [ 0, 0, Launchpad.Colors.green ],
        [ 1, 1, Launchpad.Colors.red ],
        [ 2, 2, Launchpad.Colors.amber ]
    ]
    */
    async setPadColorByArray(array)
    {
      if(connected && array && array.length > 0)
      {
        //console.log('meep', array)

        var response = await pad.setColors( array )
      }

    }


    updatePadConfig(padConfig)
    {
      console.log('update pad config ', padConfig)

      sfxConfig = {};

      if(padConfig && padConfig.cells  )
      {
        for(var i in padConfig.cells)
        {
          var cell = padConfig.cells[i];

          if(cell.sfxHash)
          {

            if(sfxConfig[i] == null )
            {
              sfxConfig[i] = {};
            }

            sfxConfig[i].assigned = true;
          }

        }


      }

    }


    async activateCell(cell)
    {
      var sfx = await this.padConfigManager.getSoundAtCell(cell);
      console.log('activate sfx',sfx, cell)

      var response = await this.socketServer.emit('queueSFXEvent',sfx)

    }



}
