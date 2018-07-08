# Bossplug (Desktop)

Modular music studio for the Launchpad.   

Bossplug serves as an editor for .boss configuration files.   You can also play using the pad in 'play' mode.


![image](https://user-images.githubusercontent.com/38132633/42414901-0a62df98-820e-11e8-871c-1294c259fdbe.png)

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

# Developer TODO
1. Grab the audio file on nodejs side, do processing, then stream to frontend to playback!  NEED to ultimately play the audio stream w Howler !!! 

2. Clicking on a pad button opens the config for it - on mothership

** All important code will live in the backend Nodejs, the front end is just cosmetic



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


## License

[CC0 1.0 (Public Domain)](LICENSE.md)
