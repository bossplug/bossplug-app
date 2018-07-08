//js

import Nav from './nav';
var nav = new Nav();


import Settings from './settings';
var settings = new Settings();




import AudioPlayer from './audio-player';
var audioPlayer = new AudioPlayer();

import SocketClient from './socketclient';
var socketClient = new SocketClient(audioPlayer);

import Build from './build';
var build = new Build(audioPlayer);



function init()
{
  nav.init();

  audioPlayer.init();
  socketClient.init();

  if(document.getElementById("build")){
    build.init(socketClient);
  }

  if(document.getElementById("settings")){
    settings.init(socketClient);
  }


}




init();
