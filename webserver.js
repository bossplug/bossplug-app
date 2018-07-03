

    var path = require("path"),
        express = require("express");

    var DIST_DIR = path.join(__dirname, "public"),
        PORT = 3000,
        app = express();



const storage = require('electron-json-storage');



module.exports =  class WebServer {
  constructor( ){

  }

  init(){

    console.log('hosting server ')

    //Serving the files on the dist folder
    app.use(express.static(DIST_DIR));

    //Send index.html when the user access the web
    app.get("*", function (req, res) {
      res.sendFile(path.join(DIST_DIR, "index.html"));
    });

    app.listen(PORT);
    console.log('Express dev server listening on port ', PORT, "!")




    // Write
    storage.set('foobar', { foo: 'bar' }).then(function() {

        // Read
        storage.get('foobar').then(function(object) {
            console.log(object.foo);
            // will print "bar"
        });

    });
  }

}
