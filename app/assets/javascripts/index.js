//js

import Nav from './nav';
var nav = new Nav();


import Settings from './settings';
var settings = new Settings();


import SocketClient from './socketclient';
var socketClient = new SocketClient();

import AudioPlayer from './audio-player';
var audioPlayer = new AudioPlayer();

import Build from './build';
var build = new Build(audioPlayer);



function init()
{
  nav.init();
  socketClient.init();
  audioPlayer.init();

  if(document.getElementById("build")){
    build.init(socketClient);
  }

  if(document.getElementById("settings")){
    settings.init(socketClient);
  }


}




init();
