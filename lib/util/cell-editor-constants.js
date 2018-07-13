
var cellEditorConstants = {

  cellAttributes: {
    'channel':{name:'channel',label:'Channel',type:'integer'},
    'delay':{name:'delay',label:'Delay',type:'milliseconds',units:'ms'},
    'waitForBeat':{name:'waitForBeat',label:'Wait For Beat',type:'valueless'},
    'pulse':{name:'pulse',label:'Pulse',type:'integer'},

    'fadeIn':{name:'fadeIn',label:'Fade In',type:'milliseconds',units:'ms'},
    'fadeOut':{name:'fadeOut',label:'Fade Out',type:'milliseconds',units:'ms'},

    'volume':{name:'volume',label:'Volume',type:'percent',units:'%'},
    'speed':{name:'speed',label:'Speed',type:'percent',units:'%'},
    'setChannelVolume':{name:'setChannelVolume',label:'Set Channel Volume',type:'percent',units:'%'},
    'setBPM':{name:'setBPM',label:'Set BPM',type:'integer'},
    'glowAboveChannelVolume':{name:'glowAboveChannelVolume',label:'Glow Above Channel Volume',type:'percent',units:'%'},
    'toggleChannelMute':{name:'toggleChannelMute',label:'Toggle Channel Mute',type:'valueless'},
    'play':{name:'play',label:'Play',type:'valueless'},
    'pause':{name:'pause',label:'Pause',type:'valueless'},
    'stop':{name:'stop',label:'Stop',type:'valueless'},
    'cancelLoops':{name:'cancelLoops',label:'Cancel Loops',type:'valueless'},
    'cancelChannel':{name:'cancelChannel',label:'Cancel Channel',type:'integer'},
    'cancelAll':{name:'cancelAll',label:'Cancel All Audio',type:'valueless'},
    'cancelSelf':{name:'cancelSelf',label:'CancelSelf',type:'valueless'},
  }

}


exports.config = cellEditorConstants;
