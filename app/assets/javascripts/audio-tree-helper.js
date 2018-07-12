import Vue from 'vue';

const LocalStorageHelper= require('./local-storage-helper').default

export default class AudioTreeHelper {
  constructor( ){

  }


  static async addAudioFolders(folders, socketClient)
  {

    //await  LocalStorageHelper.set("audioFolders",[ ])

      var existingAudioFolders = await LocalStorageHelper.get("audioFolders");

      if(existingAudioFolders == null) existingAudioFolders = [];
      console.log('existiiiing folders', existingAudioFolders)

      var selectedFolders = [];

      //if(existingAudioFolders) selectedFolders = existingAudioFolders;

      for(var folder of folders)
      {
        selectedFolders.push({ path: folder, nodeId: null });


      }


      //var tree = await AudioTreeHelper.buildOneAudioFolder(folder, socketClient);

      //Vue.set(fileTree, 'audioFolders', selectedFolders )

      for(var selectedFolder of selectedFolders)
      {
        var response = await AudioTreeHelper.addFolderToFileTree( selectedFolder,  socketClient);
        var folderNodeId = response.nodeId;
        var tree = response.tree;
        LocalStorageHelper.set("audioTree",tree)
        console.log('updated tree',tree )

        existingAudioFolders.push({ path: selectedFolder.path, nodeId: folderNodeId })
      }


      LocalStorageHelper.set("audioFolders",existingAudioFolders)

      return tree;


  }

  static async removeAudioFolder(path, socketClient)
  {


    var existingAudioFolders = await LocalStorageHelper.get("audioFolders");

    console.log('remove folder w id',path , existingAudioFolders )

    var removedFolders = existingAudioFolders.filter((item) => (item.path == path))
    var remainingAudioFolders = existingAudioFolders.filter((item) => (item.path != path))

    for(var removedFolder of removedFolders)
    {
      var tree = await AudioTreeHelper.removeFolderFromFileTree(removedFolder, socketClient);

      await LocalStorageHelper.set("audioFolders",remainingAudioFolders)
    }


    return tree;
  }

    static async addFolderToFileTree(folder, socketClient)
    {
      var tree = await LocalStorageHelper.get("audioTree",tree);



      var elementKey = AudioTreeHelper.getHighestElementKey(tree); //need to find this from the treee..



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
        var filepath = file.path;
        //console.log('found audio file',file, ' in folder ', folder )
        var filename = filepath.substring(filepath.lastIndexOf('/')+1);

        var filenode = {
          label:filename,
          path:filepath,
          nodeId: elementKey++,
          hash: file.hash
        }

       subnode.nodes.push(filenode)
      }


      if(tree == null)
      {
        tree = {
          label: 'Audio List',
          nodes: []
        }
      }

      if(tree.nodes == null)
      {
        tree.nodes = [];
      }

       tree.nodes.push( subnode )


      return {tree:tree,nodeId:folder.nodeId };

    }

    static async  removeFolderFromFileTree(removedFolder, socketClient)
    {

      var tree = await LocalStorageHelper.get("audioTree",tree);

      for(var i in tree.nodes)
      {
        if( tree.nodes[i] == null) continue;

        var node = tree.nodes[i];

        if(node.path == removedFolder.path) tree.nodes.splice(i,1);

      }


      return tree;
    }




  static async buildAllAudioFolders(selectedFolders, socketClient)
  {



    var tree = await AudioTreeHelper.buildFileTree( selectedFolders,   socketClient);

    //Vue.set(fileTree, 'tree', tree )

    LocalStorageHelper.set("audioTree",tree)

    console.log('updated tree',tree )

    return tree;

  }




    static async  buildFileTree(folders, socketClient)
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

          console.log('files',files)

           for(var file of files)
           {
             var filepath = file.path;
             //console.log('found audio file',file, ' in folder ', folder )
             var filename = filepath.substring(filepath.lastIndexOf('/')+1);

             var filenode = {
               label:filename,
               path:filepath,
               nodeId: elementKey++,
               hash: file.hash
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



  static getHighestElementKey(tree)
  {
    var elementKey = 0;

    if(tree)
    {
      for(var subnode of tree.nodes)
      {
        for(var filenode of subnode.nodes )
        {
            if(filenode.nodeId > elementKey) elementKey = filenode.nodeId;
        }
      }
    }



    return elementKey;
  }


}
