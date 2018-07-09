
var editorConstants = {
  cellAttributes: [
    'waitForBeat','loop','pulse','fadeIn','fadeOut'
  ],
  cellActions: [
    {name:'setChannelVolume',label:'Set Channel Volume',type:'percent'},
    {name:'glowAboveChannelVolume',label:'Glow Above Channel Volume',type:'percent'},
    {name:'toggleChannelMute',label:'Toggle Channel Mute',type:'channelNumber'},
    {name:'playMetronome',label:'Play',type:'valueless'},
    {name:'pauseMetronome',label:'Pause',type:'valueless'},
    {name:'stopMetronome',label:'Stop',type:'valueless'},
    {name:'cancelLoops',label:'Cancel Loops',type:'valueless'},
    {name:'cancelChannel',label:'Cancel Channel',type:'valueless'},
    {name:'cancelAll',label:'Cancel All Audio',type:'valueless'},
  ]

}


exports.config = editorConstants;
