//js

import Nav from './nav';
var nav = new Nav();

import Home from './home';
var home = new Home();

import AccountAdd from './account_add';
var accountAdd = new AccountAdd();

import SocketClient from './socketclient';
var socketClient = new SocketClient();

import AccountNew from './account_new';
var accountNew = new AccountNew();

function init()
{
  nav.init();
  socketClient.init();


  if(document.getElementById("home")){
    home.init();
  }

  if(document.getElementById("add-account")){
    accountAdd.init();
  }

  if(document.getElementById("new-account")){
    accountNew.init(socketClient); 
  }


}




init();
