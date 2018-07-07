//js

import Nav from './nav';
var nav = new Nav();

import Build from './build';
var build = new Build();

import Settings from './settings';
var settings = new Settings();


import SocketClient from './socketclient';
var socketClient = new SocketClient();


function init()
{
  nav.init();
  socketClient.init();


  if(document.getElementById("build")){
    build.init(socketClient);
  }

  if(document.getElementById("settings")){
    settings.init(socketClient);
  }


}




init();
