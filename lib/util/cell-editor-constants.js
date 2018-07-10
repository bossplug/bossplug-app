
var cellEditorConstants = {
   
  cellAttributes: [
    {name:'channel',label:'Channel',type:'integer'},
    {name:'delay',label:'Delay',type:'milliseconds'},
    {name:'waitForBeat',label:'Wait For Beat',type:'valueless'},
    {name:'pulse',label:'Pulse',type:'integer'},
    {name:'loop',label:'Loop',type:'milliseconds'},
    {name:'fadeIn',label:'Fade In',type:'milliseconds'},
    {name:'fadeOut',label:'Fade Out',type:'milliseconds'},


    {name:'setChannelVolume',label:'Set Channel Volume',type:'percent'},
    {name:'setBPM',label:'Set BPM',type:'integer'},
    {name:'glowAboveChannelVolume',label:'Glow Above Channel Volume',type:'percent'},
    {name:'toggleChannelMute',label:'Toggle Channel Mute',type:'valueless'},
    {name:'playMetronome',label:'Play',type:'valueless'},
    {name:'pauseMetronome',label:'Pause',type:'valueless'},
    {name:'stopMetronome',label:'Stop',type:'valueless'},
    {name:'cancelLoops',label:'Cancel Loops',type:'valueless'},
    {name:'cancelChannel',label:'Cancel Channel',type:'integer'},
    {name:'cancelAll',label:'Cancel All Audio',type:'valueless'},
  ]

}


exports.config = cellEditorConstants;
