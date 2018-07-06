//js

import Nav from './nav';
var nav = new Nav();

import Home from './home';
var home = new Home();

import Settings from './settings';
var settings = new Settings();


import SocketClient from './socketclient';
var socketClient = new SocketClient();


function init()
{
  nav.init();
  socketClient.init();


  if(document.getElementById("home")){
    home.init();
  }

  if(document.getElementById("settings")){
    settings.init(socketClient);
  }
 

}




init();
