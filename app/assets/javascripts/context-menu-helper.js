var remote = require('electron').remote;
var buildEditorContextMenu = remote.require('electron-editor-context-menu');

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;



export default class ContextMenuHelper {
  constructor( ){

  }

  //window,
  static async buildMenu(win,menuClass,handleEvent)
  {
    win.addEventListener('contextmenu', function(e) {
      console.log('right click')

      // Only show the context menu in text editors.
      if (!e.target.closest(menuClass)) return;

      console.log('show menu')





      const template = [

          {label: 'Add Audio Folder',
          role: 'addaudiofolder',
          click: function(menuItem,currentWindow){
                handleEvent(menuItem,e.target)
            }
          },

          {label: 'Remove Audio Folder',
          role: 'removeaudiofolder',
          click: function(menuItem,currentWindow){
                handleEvent(menuItem,e.target)
            }
          },
          /*
          {type: 'separator'},
          {role: 'cut'},
          {role: 'copy',accelerator: "CmdOrCtrl+C"},
          {role: 'paste', accelerator: "CmdOrCtrl+V"},
          {role: 'delete'},
          {role: 'selectall',accelerator: "CmdOrCtrl+A"}
              */
      ]



      var menu = Menu.buildFromTemplate(template);

      // The 'contextmenu' event is emitted after 'selectionchange' has fired but possibly before the
      // visible selection has changed. Try to wait to show the menu until after that, otherwise the
      // visible selection will update after the menu dismisses and look weird.
      setTimeout(function() {
        menu.popup(remote.getCurrentWindow());
      }, 30);


    });

  }



}
