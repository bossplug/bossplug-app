

    var path = require("path"),
        express = require("express");

    var DIST_DIR = path.join(__dirname, "../public"),
        PORT = 3000,
        app = express();


    var fs = require('fs');
var cors = require('cors')

var SocketServer = require('./socketserver');
var socketServer ;


module.exports =  class WebServer {
  constructor(beatQueue,padConfigManager){
    this.beatQueue=beatQueue;
    this.padConfigManager=padConfigManager;

    socketServer = new SocketServer(beatQueue,padConfigManager);
  }

  async init(){

    console.log('hosting server ')

    //Serving the files on the dist folder
    app.use(express.static(DIST_DIR));
    app.use(cors())
    //Send index.html when the user access the web
    app.get("*", function (req, res) {


      res.sendFile(path.join(DIST_DIR, "index.html"));
    });

    app.listen(PORT);
    console.log('Express dev server listening on port ', PORT, "!")




    var https_enabled = false;
    if(https_enabled)
    {
      console.log('using https')

      var config = require('./sslconfig');

      var sslOptions ={
      key: fs.readFileSync(config.ssl.key),
      cert: fs.readFileSync(config.ssl.cert)/*,
      ca: [
        fs.readFileSync(config.ssl.root, 'utf8'),
        fs.readFileSync(config.ssl.chain, 'utf8')
      ]*/
     }

      var server = require('https').createServer(sslOptions,app);

    }else{
      var server = require('http').createServer(app);

    }

      socketServer.init(server)



  }



}
