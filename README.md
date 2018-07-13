# Bossplug (Desktop)

A Fun Open-Source Drum-Kitting Electron App.

### HOW TO USE 

1. Install & run BossPlug 
2. Right click on the 'Audio Browser' on the left-hand side to add folders from your computer which have .WAV files 
3. Drag the audio files onto the 64 cells in the center.   
4. Click on the sound cells to assign special attributes 
5. Play the sound effects and create music !  If you have a Novation Launchpad, click the 'Connect To Launchpad' button at the bottom to connect so that it will control the cells.  If not, you can use number keys 1 - 8 on your pc keyboard to control the top row.  Here is what I use: https://www.amazon.com/Novation-Launchpad-Compact-Controller-Ableton/dp/B00W5F3GJ0




### Sound Attributes 
* Pulse - Loops this sound every X beats 
* setBPM 
* setVolume  
* Channel - Assigned this effect to a channel (only affects other attributes such as cancelChannel)
* CancelAudio - Cancel all playing audio
* CancelLoops - End all 'pulses' loops, does not silence audio which is currently playing so use with cancelAudio for that effect 
* CancelSelf - Cancel playing sounds with the same sfxHash
* CancelChannel - Cancel playing sounds assigned to a particular channel

![image](https://user-images.githubusercontent.com/38132633/42414901-0a62df98-820e-11e8-871c-1294c259fdbe.png)

 


## To Install With NPM 


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

  


 
 
## License

[CC0 1.0 (Public Domain)](LICENSE.md)
