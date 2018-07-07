import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default

export default class AudioTreeHelper {
  constructor( ){

  }


  static async addAudioFolders(folders, socketClient)
  {

    for(var folder of folders)
    {
      var existingAudioFolders = await LocalStorageHelper.get("audioFolders");

      var selectedFolders = [];

      if(existingAudioFolders) selectedFolders = existingAudioFolders;

      selectedFolders.push({ path: folder, nodeId: null });

      var tree = await AudioTreeHelper.buildAudioFolders(selectedFolders, socketClient);

      //Vue.set(fileTree, 'audioFolders', selectedFolders )

      LocalStorageHelper.set("audioFolders",selectedFolders)

      return tree;

    }
  }

  static async removeAudioFolder(nodeId, socketClient)
  {
    var existingAudioFolders = await LocalStorageHelper.get("audioFolders");

    var remainingAudioFolders = existingAudioFolders.filter((item) => item.nodeId != nodeId)

    var tree = await AudioTreeHelper.buildAudioFolders(remainingAudioFolders, socketClient);

    //Vue.set(fileTree, 'audioFolders', remainingAudioFolders )

    LocalStorageHelper.set("audioFolders",remainingAudioFolders)

    return tree;
  }

  static async buildAudioFolders(selectedFolders, socketClient)
  {

    var tree = await AudioTreeHelper.buildFileTree( selectedFolders, '.audioFileContainer' ,  socketClient);

    //Vue.set(fileTree, 'tree', tree )

    LocalStorageHelper.set("audioTree",tree)

    console.log('updated tree',tree )

    return tree;

  }

    static async  buildFileTree(folders,containerClass, socketClient)
    {
      console.log('folders',folders   )
      var audioFiles = [];

      var tree =  {
        label: 'Audio List',
        nodes: []
      }

      var elementKey = 0;

      for(var folder of folders)
      {
        try{
          var files = await socketClient.emit('findAudioInDir', folder );

          var folderpath = folder.path;
          var foldername = folderpath.substring(folderpath.lastIndexOf('/')+1);
          var nodeId = elementKey++;
          folder.nodeId = nodeId;  //set the folder nodeId

          var subnode = {
            label: foldername,
            path : folderpath,
            nodes: [],
            nodeId: nodeId
          };


           for(var file of files)
           {
             //console.log('found audio file',file, ' in folder ', folder )
             var filename = file.substring(file.lastIndexOf('/')+1);

             var filenode = {
               label:filename,
               path:file,
               nodeId: elementKey++
             }

            subnode.nodes.push(filenode)
           }

            tree.nodes.push( subnode )
        }catch(err)
        {
          console.error(err)
        }
      }

      return tree;
  }


}
