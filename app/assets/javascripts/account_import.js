import Vue from 'vue';

var blockies = require('./util/blockies')
 require('./util/keythereum')

var importComponent;

export default class AccountImport {
  constructor( ){

  }

  init(socketClient){
    var self = this;
    self.socketClient = socketClient;

    importComponent = new Vue({
        el: '#import-account',
        data: {
          importType: null,
          privateKeyRaw: null,
          importedAccount: false,
          keystoreFile: null,
          address: null

        },
        methods: {
           setImportType: function (type) {
              console.log('import type',type)
              this.importType = type;
           },
           importRawPrivateKey: function ( ) {
              console.log('import raw key' )

           },


           importKeystoreFile: async function ( ) {
              this.keystoreFile = this.$refs.keystoreFile.files[0]


              var fileContents = await self.readInputFile(this.keystoreFile)
              console.log(fileContents)

              this.address = fileContents.address;

              self.renderAccount(this.address);

              this.importedAccount = true;
            },
            saveAccount: function ( ) {
               console.log('save' )

            },


         }
      })


  }


  renderAccount(address)
  {
    console.log('render account ', address);

    //make a blocky
    var icon = blockies.create({ // All options are optional
      seed: address, // seed used to generate icon data, default: random

      size: 20, // width/height of the icon in blocks, default: 8
      scale: 6, // width/height of each block in pixels, default: 4

      });

    var blockieContainer = document.getElementById('blockie');
    while (blockieContainer.firstChild) {
      blockieContainer.removeChild(blockieContainer.firstChild);
    }
    blockieContainer.appendChild(icon); // icon is a canvas element


  }


  async readInputFile(file)
  {
    var self = this ;

    var response = new Promise(async (resolve, reject) => {
        if (file.name.endsWith('.json')) {

            var reader = new FileReader();
              // Closure to capture the file information.
              reader.onload = (function(theFile) {
                return function(e) {
                 var parsedFileJson = JSON.parse(e.target.result);

                 resolve(parsedFileJson);

                // self.initiateLavaPackTransaction( JSON.parse( parsedFileJson) )

                };
              })(file);

            reader.readAsText(file); // start reading the file data.
        }else{
          reject('Wrong filetype')
        }

      });

    //  console.log(response)
      return response;

  }


};
