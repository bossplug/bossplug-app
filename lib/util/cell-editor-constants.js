
var cellEditorConstants = {

  cellAttributes: {
    'channel':{name:'channel',label:'Channel',type:'integer'},
    'delay':{name:'delay',label:'Delay',type:'milliseconds'},
    'waitForBeat':{name:'waitForBeat',label:'Wait For Beat',type:'valueless'},
    'pulse':{name:'pulse',label:'Pulse',type:'integer'},
    'loop':{name:'loop',label:'Loop',type:'milliseconds'},
    'fadeIn':{name:'fadeIn',label:'Fade In',type:'milliseconds'},
    'fadeOut':{name:'fadeOut',label:'Fade Out',type:'milliseconds'},


    'setChannelVolume':{name:'setChannelVolume',label:'Set Channel Volume',type:'percent'},
    'setBPM':{name:'setBPM',label:'Set BPM',type:'integer'},
    'glowAboveChannelVolume':{name:'glowAboveChannelVolume',label:'Glow Above Channel Volume',type:'percent'},
    'toggleChannelMute':{name:'toggleChannelMute',label:'Toggle Channel Mute',type:'valueless'},
    'playMetronome':{name:'playMetronome',label:'Play',type:'valueless'},
    'pauseMetronome':{name:'pauseMetronome',label:'Pause',type:'valueless'},
    'stopMetronome':{name:'stopMetronome',label:'Stop',type:'valueless'},
    'cancelLoops':{name:'cancelLoops',label:'Cancel Loops',type:'valueless'},
    'cancelChannel':{name:'cancelChannel',label:'Cancel Channel',type:'integer'},
    'cancelAll':{name:'cancelAll',label:'Cancel All Audio',type:'valueless'},
  }

}


exports.config = cellEditorConstants;
