# Bossplug (Desktop)

Modular music studio for the Launchpad.   

Bossplug serves as an editor for .boss configuration files.   

The studio is composed entirely of .plug plugin modules.  

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
1.  




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





## License

[CC0 1.0 (Public Domain)](LICENSE.md)
