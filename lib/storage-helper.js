

var fs = require('fs');

var path = require('path');

const storage = require('electron-json-storage');

const electron = require('electron')
const dialog = electron.dialog

const {shell} = require('electron')

var pjson = require('../package.json');




module.exports =  class StorageHelper {
  constructor( ){

  }


    static getStoragePath()
    {
      return storage.getDataPath()
    }

      static async  storeFile(key,json)
      {
        var response = await new Promise((resolve, reject) => {
          storage.set(key,json, function(error) {
            if (error) reject(error);

            var msg = 'Stored '+JSON.stringify(json)+ ' at '+ key.toString();
            resolve(msg);
          })
        });

        return response;
      }


      static async hasFile(key)
      {
        var response = await new Promise((resolve, reject) => {

          storage.has(key,function(error,data) {
            if (error) reject(error);
              resolve(data);
          });

        });

        return response;
      }



      static async readFile(key)
      {
        var response = await new Promise((resolve, reject) => {

          storage.get(key,function(error,data) {
            if (error) reject(error);
              resolve(data);
          });

        });

        return response;
      }

      static async getAllFiles( )
      {

        var response = await new Promise((resolve, reject) => {

          storage.getAll(function(error, data) {
            if (error) reject(error);
            resolve(data);
          });

        });

        return response;
      }

      static async getAllKeys( )
      {

        var response = await new Promise((resolve, reject) => {

          storage.keys(function(error, data) {
            if (error) reject(error);
            resolve(data);
          });

        });

        return response;
      }



      static copyFileSync( source, target ) {

        var targetFile = target;

        //if target is a directory a new file with the same name will be created
        if ( fs.existsSync( target ) ) {
            if ( fs.lstatSync( target ).isDirectory() ) {
                targetFile = path.join( target, path.basename( source ) );
            }
        }

        fs.writeFileSync(targetFile, fs.readFileSync(source));
    }

      static copyFolderRecursiveSync( source, target ) {
        var files = [];

        //check if folder needs to be created or integrated
        var targetFolder = path.join( target, path.basename( source ) );
        if ( !fs.existsSync( targetFolder ) ) {
            fs.mkdirSync( targetFolder );
        }

        //copy
        if ( fs.lstatSync( source ).isDirectory() ) {
            files = fs.readdirSync( source );
            files.forEach( function ( file ) {
                var curSource = path.join( source, file );
                if ( fs.lstatSync( curSource ).isDirectory() ) {
                    StorageHelper.copyFolderRecursiveSync( curSource, targetFolder );
                } else {
                    StorageHelper.copyFileSync( curSource, targetFolder );
                }
            } );
        }
    }

    //returns the first file matching filter
    static async findInDir(startPath,filter,recursive){

      return new Promise((resolve, reject) => {

        if (!fs.existsSync(startPath)){
            console.log("no dir ",startPath);
            reject("no dir ");
        }

        var files=fs.readdirSync(startPath);
        for(var i=0;i<files.length;i++){
            var filename=path.join(startPath,files[i]);
            var stat = fs.lstatSync(filename);
            if (recursive && stat.isDirectory()){
                  StorageHelper.findInDir(filename,filter); //recurse
            }
            else if (filter.test(filename)) resolve(filename);
            else continue
        };


      });
    };

    static async findAllInDir(startPath,filter,recursive){

      return new Promise((resolve, reject) => {

        if (!fs.existsSync(startPath)){
            console.log("no dir ",startPath);
            reject("no dir ");
        }

        var array = [];

        var files=fs.readdirSync(startPath);
        for(var i=0;i<files.length;i++){
            var filename=path.join(startPath,files[i]);
            var stat = fs.lstatSync(filename);
            if (recursive && stat.isDirectory()){
                  StorageHelper.findInDir(filename,filter); //recurse
            }
            else if (filter.test(filename)) array.push(filename);
            else continue
        };

        resolve(array);

      });
    };


    static async showOpenDialog()
    {

      var path = dialog.showOpenDialog({
          properties: ['openDirectory']
      });

      console.log(path)

      return path;

    }

}
