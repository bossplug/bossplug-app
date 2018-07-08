

var path = require("path"),
    express = require("express");

var DIST_DIR = path.join(__dirname, "../public"),
    PORT = 3000,
    app = express();


var fs = require('fs');

const storage = require('electron-json-storage');
const {clipboard} = require('electron')
const DeviceManager = require('./device-manager')
const StorageHelper = require('./storage-helper')


module.exports =  class SocketServer {

  constructor(beatQueue,padConfigManager){
    console.log('new socket serv')
     this.beatQueue=beatQueue;
     this.padConfigManager=padConfigManager;
  }


    async init(server )
    {


      var self = this;
      var io = require('socket.io')(server);
      var port = process.env.PORT || 2054;


      ///  https://socket.io/docs/rooms-and-namespaces/#


      server.listen(port, function () {
        console.log('Socket server listening at port %d', port);
      });

      var sockets = {};




      //https://stackoverflow.com/questions/6756241/socket-io-client-side-emit-callback-never-fires

      io.on('connection', function (socket) {
        self.socket = socket;
        console.log('established new socket connection');

          socket.on('connectToLaunchpad', async function (data,fn) {
                var response = await DeviceManager.connectToLaunchpad()
                console.log(response)
                fn(JSON.stringify(response));  //immediate response
          });


          socket.on('addAudioFolder', async function (data,fn) {
              console.log('audio folder')
                var response = await StorageHelper.showOpenDialog({
                    properties: ['openDirectory']
                })
                fn(JSON.stringify(response));  //immediate response

          });





          socket.on('findAudioInDir', async function (folder,fn) {

                var audioFiles = [];
                var sfxArray = [];

                try{
                   audioFiles = await StorageHelper.findAllInDir(folder.path,/\.wav$/,false )
                   sfxArray = await self.padConfigManager.catalogAudioFileHashes(audioFiles)  //adds the hashes to the elements

                }catch(e) {console.error(e)}

                //dont await this just go ahead


                fn(JSON.stringify(sfxArray));  //immediate response

          });


          socket.on('queueSound', async function (sfx,fn) {
                  console.log('queueSound', sfx)

                  var response ;
                  if(sfx.preloaded)
                  {
                    response = self.beatQueue.playPreloaded(sfx)
                  }else{
                    console.error('WARNING: PLAYING SLOW STREAMED FILE - PRELOAD NEXT TIME ')
                    response = self.beatQueue.playStreamed(sfx)
                  }

                  fn(JSON.stringify(response));  //immediate response
            });





            socket.on('preloadAudio', async function (data,fn) {
                    console.log('preloadAudio' )

                    var selectedAudioFiles = await self.padConfigManager.getSelectedAudioFiles();

                    var preloader = await self.beatQueue.preloadAudio(selectedAudioFiles)

                    await self.padConfigManager.markAudioFilesPreloaded(preloader.preloadedAudio)

                    var response = self.padConfigManager.getPadConfig()

                    fn(JSON.stringify(response));  //immediate response
              });


            socket.on('assignSoundToPadConfig', async function (assignment,fn) {
                    console.log('assignSoundToPadConfig', assignment)
                    var response = await self.padConfigManager.assignSoundToPadConfig(assignment)
                    fn(JSON.stringify(response));  //immediate response
              });


              socket.on('assignOptionToPadConfig', async function (assignment,fn) {
                      console.log('assignOptionToPadConfig', assignment)
                      var response = await self.padConfigManager.assignOptionToPadConfig(assignment)
                      fn(JSON.stringify(response));  //immediate response
                });

              //open file dialog, return file
              socket.on('loadPadConfig', async function (data,fn) {
                    var response = await self.padConfigManager.loadPadConfig()
                    fn(JSON.stringify(response));  //immediate response

              });

              socket.on('savePadConfig', async function (data,fn) {
                    var response = await self.padConfigManager.savePadConfig()
                    fn(JSON.stringify(response));  //immediate response

              });


              socket.on('getPadConfig', async function (data,fn) {
                    var response = self.padConfigManager.getPadConfig()
                    fn(JSON.stringify(response));  //immediate response

              });


          socket.on('copyToClipboard', async function (data,fn) {
                  console.log('copy to clipboard', data)
                  var success = clipboard.writeText(data)
                  fn(JSON.stringify(data));  //immediate response
            });


          socket.on('disconnect', function () {
            console.log(socket.sid, 'disconnected');
            delete sockets[socket.sid];
          });
      });



  }

  async emit(name,value)
  {
    var self=this;
    console.log('emitting ',name,value)

    if(!self.socket)
    {
      return {success:false,message:'Socket does no exist.'}
    }


    var response = await new Promise((resolve, reject) => {
          self.socket.emit(name,value,function(res){
            resolve(JSON.parse(res));
          });
      }); 

    return response;
  }

}
