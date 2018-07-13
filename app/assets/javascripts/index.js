//js

import Nav from './nav';
var nav = new Nav();


import Settings from './settings';
var settings = new Settings();




import AudioPlayer from './audio-player';
var audioPlayer = new AudioPlayer();



import MusicMan from './music-man';
var musicMan = new MusicMan(audioPlayer);

import SocketClient from './socketclient';
var socketClient = new SocketClient(musicMan);

import Build from './build';
var build = new Build(audioPlayer);

import KeyListener from './key-listener';
var keyListener = new KeyListener(socketClient);


function init()
{
  nav.init();

  audioPlayer.init();
  musicMan.init(socketClient);
  socketClient.init();
  keyListener.init(socketClient);

  if(document.getElementById("build")){
    build.init(socketClient,musicMan);
  }

  if(document.getElementById("settings")){
    settings.init(socketClient);
  }


}




init();
