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
          addingPrivateKey: false,
          password: null,

          importedAccount: null,
          keystoreFile: null,
          address: null,
          errorMessage: null

        },
        methods: {
           setImportType: function (type) {
             this.errorMessage = null;
              console.log('import type',type)
              this.importType = type;

              this.importedAccount = false;
              this.keystoreFile = null;
              this.privateKeyRaw = null;
              this.address = null;
              this.addingPrivateKey=false;
              this.password=null;

              self.renderAccount(this.address);
           },
           importRawPrivateKey: function ( ) {
             this.errorMessage = null;
            //  console.log('import raw key', this.privateKeyRaw );

              if(!this.addingPrivateKey)
              {
                if( this.privateKeyRaw.length != 64  )
                {
                  console.log('invalid length')
                  this.errorMessage = 'Invalid key length.'
                  return;
                }

                console.log('valid')
                this.addingPrivateKey = true;
                return;
              }

              if(this.password.length < 6)
              {
                this.errorMessage = 'Minimum password length: 6'
                return
              }

              var options = {};

              console.log(this.privateKeyRaw)

              var dk = keythereum.create( );

              var keyObject = keythereum.dump(this.password, this.privateKeyRaw, new Buffer(dk.salt), new Buffer(dk.iv), {options});

              self.renderAccount(keyObject.address);

               console.log('created key object', keyObject )

               this.importedAccount = keyObject;


           },


           importKeystoreFile: async function ( ) {
             this.errorMessage = null;
              this.keystoreFile = this.$refs.keystoreFile.files[0]


              var fileContents = await self.readInputFile(this.keystoreFile)


              this.address = fileContents.address;

              self.renderAccount(this.address);

              this.importedAccount = fileContents;


              //var privateKey = keythereum.recover(password, keyObject);
            },
            saveAccount: function ( ) {
              this.errorMessage = null;
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

    if(address)
    {
      blockieContainer.appendChild(icon); // icon is a canvas element
    }


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
