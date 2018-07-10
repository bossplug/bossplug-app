# Bossplug (Desktop)

Modular music studio for the Launchpad.   

Bossplug serves as an editor for .boss configuration files.   You can also play using the pad in 'play' mode.


![image](https://user-images.githubusercontent.com/38132633/42414901-0a62df98-820e-11e8-871c-1294c259fdbe.png)




# Developer TODO
1. Add channel number,delay ms  to config for pad , number of beats to loop/pulse 




## To Use


Prereqs:

  sudo apt-get install libasound2-dev



```bash

# Install dependencies
npm install
# Compile
npm run webpack
# Run the app
npm run app
```  


### PLUGins
A .zip file which contains html, css, and js conforming to the Bossplug API in order to add a module to the studio when installed.

Default plugins:
 1. The Mothership
    Features play, pause, and record buttons in order to create, remix, and preview audio cases.  Shows the animated 'time disc' which can be used to beat match using the software.
 2. The Archive
    A simple list of audio cases
 3. The Boss
    Allows for assigning audio cases to keys on the Launchpad

### Boss configuration
  A boss configuration is a .json file which saves the key configuration set by the Boss.  At its simplest form, it assigns the SHA3 hashes of audio cases to the keys of the launchpad.



### Audio Cases
An audio file (or midi ?) which has metadata including the milliseconds for the 'hit time'.  Always referred to by its SHA3 hash.


| aplay -f cd


## ioHook
Make sure it is configured correctly !!! Node 8.9 and Electron 2 : https://wilixlead.github.io/iohook/installation.html

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
