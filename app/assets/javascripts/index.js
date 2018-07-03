//js

import Nav from './nav';
var nav = new Nav();

import Home from './home';
var home = new Home();

import AccountAdd from './account_add';
var accountAdd = new AccountAdd();

function init()
{
  nav.init();


  if(document.getElementById("home")){
    home.init();
  }

  if(document.getElementById("add-account")){
    accountAdd.init();
  }


}




init();
