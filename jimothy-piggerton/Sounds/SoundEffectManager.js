function getWithDefault(string, defaultValue) {
  var val = localStorage.getItem(string);
  if(val===null)return defaultValue;
  return parseFloat(val);
}
var AUDIOCONTEXT;
var DESTINATION;
var BUFFERBUFFER = [];
var VOLUME = getWithDefault("volume", 0.5);
var MUSIC_VOLUME = getWithDefault("music_volume",1);
var EFFECTS_VOLUME = getWithDefault("effects_volume",1);
var musicGain;
var effectsGain;
function setVolume(val) {
  if(val < 0) val = 0;
  if(val > 1) val = 1;
  VOLUME = val;
  DESTINATION.gain.setValueAtTime(val, 0);  
  localStorage.setItem("volume", val);
}
function setMusicVolume(val) {
  if(val < 0) val = 0;
  if(val > 1) val = 1;
  MUSIC_VOLUME = val;
  musicGain.gain.setValueAtTime(val, 0);  
  localStorage.setItem("music_volume", val);
}
function setEffectsVolume(val) {
  if(val < 0) val = 0;
  if(val > 1) val = 1;
  EFFECTS_VOLUME = val;
  effectsGain.gain.setValueAtTime(val, 0);  
  localStorage.setItem("effects_volume", val);
}
function initializeSound() {
  console.log("initializing sound");
  if('webkitAudioContext' in window) {
    AUDIOCONTEXT = new webkitAudioContext();
  } else {
    AUDIOCONTEXT = new AudioContext();
  }
  AUDIOCONTEXT.resume();
  var maseterGain = AUDIOCONTEXT.createGain();
  maseterGain.connect(AUDIOCONTEXT.destination);
  DESTINATION = maseterGain;
  effectsGain = AUDIOCONTEXT.createGain();
  effectsGain.connect(maseterGain);
  musicGain = AUDIOCONTEXT.createGain();
  musicGain.connect(maseterGain);
  for(var i in BUFFERBUFFER) {
    BUFFERBUFFER[i].beginLoad();
  }
  BUFFERBUFFER = [];
  musicGain.gain.setValueAtTime(MUSIC_VOLUME, 0);  
  effectsGain.gain.setValueAtTime(EFFECTS_VOLUME, 0);  
  DESTINATION.gain.setValueAtTime(VOLUME, 0);  
  // setVolume(VOLUME);
  // setVolume(localStorage.getItem("volume")||0.5);
}
// var DESTINATION = AUDIOCONTEXT.destination;
class SoundEffect {
  constructor(rate, frq, vol, len, inBetweens, type) {
    this.type = type||'triangle';
    this.sampleRate = rate;
    this.inBetweens = inBetweens || 0;
    this.frqData=frq;
    this.volData=vol;
    this.length = this.sampleRate*len;
    this.volume =1;
  }
  play(entity) {
    // return;
    if(!DESTINATION)return;
    var volume = this.volume;
    if(entity&&!entity.player) {
      // var d = distanceBetweenEntities(entity, entity.game.player);
      // console.log(d);
      // volume = 1/(d/50+1);
      volume = .1;
      // volume = 0;
      // console.log(volume);
    }
    var audioContext= AUDIOCONTEXT;
    var destination = effectsGain;
    var oscillator = audioContext.createOscillator();
    var gain = audioContext.createGain();
    var time = audioContext.currentTime;
    oscillator.start(time);
    var stopTime = time+this.length;
    oscillator.stop(stopTime);
    oscillator.type=this.type;
    oscillator.frequency.setValueAtTime(this.frqData[0], time);
    gain.gain.setValueAtTime(this.volData[0]*volume, time);
    oscillator.connect(gain);
    gain.connect(destination);
    this.applyData(oscillator, gain, time, volume);
    oscillator.stopSound = function() {
      try {
        this.disconnect(gain);
      } catch(e) {
        console.log(e);
      }
    };
    return oscillator;
  }
  applyData(oscillator, gain, time, volume) {
    var last;
    for(var i=0;i<this.frqData.length;i++) {
      var frq = this.frqData[i];
      if(!frq) continue;
      oscillator.frequency.setValueAtTime(frq, time+i*this.sampleRate);
      if(last)
      for(var j=0;j<this.inBetweens;j++){
        if(frq) oscillator.frequency.setValueAtTime( last + (frq-last)*j/this.inBetweens, time+(i-1+j/this.inBetweens)*this.sampleRate);        
      }
      last = frq;
    }
    last = false;
    for(var i=0;i<this.volData.length;i++) {
      var amplitude = this.volData[i];
      if(!amplitude)continue;
      amplitude = amplitude;
      gain.gain.setValueAtTime(amplitude*volume, time+i*this.sampleRate);
      if(last)
      for(var j=0;j<this.inBetweens;j++){
        if(amplitude) gain.gain.setValueAtTime((last + (amplitude-last)*j/this.inBetweens)*volume, time+(i-1+j/this.inBetweens)*this.sampleRate);        
      }
      last = amplitude;
    }
  }
}
// var OnFile = (window.location.protocol == "file:");
// var webDomain = 'http://bmarcelus.github.io/JimothyPiggerton';
function loadBuffer(url, callback) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  // if(OnFile) url = webDomain + url;
  // else url = '.' + url;
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    AUDIOCONTEXT.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        callback(buffer);
      },
      function(error) {
        // console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    console.log("BufferLoader: XHR error");
    console.log("Cannot load sounds from File system");
  }

  request.send();
}

class SoundSource {
  constructor(url, playbackRate, volume) {
    url = SOUNDASSETS + url;    
    this.url = url;
    this.loaded = false;
    this.playbackRate = playbackRate || 1;
    this.volume = volume || 1;
    this.loops=false;
    BUFFERBUFFER.push(this);
    this.lastSound = null;
  }
  beginLoad() {
    loadBuffer(this.url, this.onloadBuffer.bind(this));
  }
  onloadBuffer(buffer) {
    this.buffer=buffer;
    this.loaded = true;
  }
  stopSound() {
    if(!this.lastSound) return;
    this.lastSound.stopSound();
    this.lastSound = null;
  }
  pause() {
    this.setVolume(0);
    // if(!this.lastSound)return;
    // this.pauseTime = this.lastSound.getTime();
    // this.stopSound();
  }
  resume() {
    this.setVolume(1);
    // if(!this.lastSound||!this.pauseTime)return;
    // this.lastSound.resume(this.pauseTime);
  }
  setVolume(v) {
    if(!this.lastSound)return;
    this.lastVolume = v;
    v = v*this.volume;
    if(v<0)v=0;
    if(v>1)v=1;
    this.lastSound.myGain.gain.setValueAtTime(v, AUDIOCONTEXT.currentTime);
  }
  play() {
    var audioContext= AUDIOCONTEXT;
    var destination = this.isSong?musicGain:effectsGain;
    if(!destination)return;
    var time = audioContext.currentTime;
    var source = audioContext.createBufferSource();
    source.buffer = this.buffer;
    // source.playbackRate = 0.5;
    // if(pitchShift != null) {
    //   source.playbackRate.setValueAtTime(pitchShift, time)
    //   // source.detune = pitchShift;
    //   // source.detune.setValueAtTime(pitchShift*100, time);
    // }
    var r = 1;// + (Math.random()-0.5)/10;
    source.playbackRate.setValueAtTime(this.playbackRate*r,time);
    source.start(time);  
    if(this.loops) source.loop = true;
    var gain = audioContext.createGain();
    gain.gain.setValueAtTime(this.volume, time);
    gain.connect(destination);
    source.connect(gain);    
    source.stopSound = function() {
      try {
        this.disconnect(gain);
      } catch(e) {
        console.log(e);
      }
    };
    source.myGain = gain;
    this.lastSound = source;
    source.getTime = function() {}
    source.pause = function() {}
    source.resume = function() {}
    return source;
  }
}

class SoundTag {
  constructor(url, playbackRate, volume) {
    url = SOUNDASSETS + url;
    this.url = url;
    this.playbackRate = playbackRate || 1;
    this.volume = volume || 1;
    this.createAudio();
  }
  createAudio() {
    var audioElement = document.createElement("audio");
    // audioElement.setAttribute('crossorigin', 'anonymous');   
    // audioElement.crossOrigin = 'anonymous';
    audioElement.src = this.url;
    this.audioElement = audioElement;
    audioElement.playbackRate = this.playbackRate;
    this.setVolume(1);
  }
  play() {
    if(!DESTINATION)return; 
    this.audioElement.play();
    this.audioElement.currentTime = 0;
    if(this.loops) this.audioElement.loop = true;        
    return this;
  }
  stopSound() {
    this.audioElement.pause();
  }
  pause() {
    this.audioElement.pause();
  }
  resume(time) {
    this.audioElement.play();
    if(time!=undefined) {
      this.audioElement.currentTime = time;
    }
  }
  getTime() {
    return this.audioElement.currentTime;
  }
  setVolume(v) {
    this.lastVolume = v;        
    v = v*VOLUME*this.volume;
    if(v<0)v=0;
    if(v>1)v=1;
    this.audioElement.volume = v;    
  }
}

// var OnFile = (window.location.protocol == "file:");
// if(OnFile) SoundSource = SoundTag;
// SoundSource=SoundTag;

class MixAudio {
  constructor(audios) {
    this.audios = audios;
  }
  play() {
    this.audios.forEach(a => a.play());
  }
}

class PickAudio {
  constructor(audios) {
    this.audios = audios;
  }
  play() {
    var i = Math.floor(Math.random()*this.audios.length);
    return this.audios[i].play();
  }
}

class MusicSource extends SoundSource {
  constructor(...args) {
    super(...args);
    this.loops = true;
    this.lastVolume = 1;
    this.isSong = false;
  }
  play() {
    if(this.lastSound)return this.lastSound;
    return super.play();
  }
  lerpVolume(v) {
    this.setVolume(this.lastVolume + (v-this.lastVolume) / 10);
  }
}

var musicMixerVolume = localStorage.getItem("musicVolume") || 0.2;
class MusicHandler {
  constructor(...args) {
    this.songs = args;
    this.setSong(0);
    this.volume = 1;
    this.on = true;
  }
  setSong(index) {
    var newSong = this.songs[index];
    if(!newSong || this.song == newSong) return;
    newSong.isSong = true;
    if(this.on) newSong.play();
    if(this.song){
      this.song.stopSound();
      this.song.pause();
      this.song.isSong = false;
      this.song.setVolume(1)
    }
    this.song = newSong;
  }
  toggle() {
    this.on = !this.on;
    this.volume = this.on ? 1 : 0;
    if(this.song)
    this.song.setVolume(1);
  }
  play() {
    if(this.song == undefined)return;
    // if(!this.on)return;
    this.song.stopSound();
    this.song.setVolume(1);
    return this.song.play();
  }
  lerpVolume(v) {
    this.song.lerpVolume(v*this.volume*musicMixerVolume);
  }
  setVolume(v) {
    this.song.setVolume(v*this.volume*musicMixerVolume);
  }
  getTime() {
    return this.song.getTime();
  }
  pause() {
    // this.song.pause();
    this.song.setVolume(0);
  }
  resume(k) {
    // this.song.setVolume(1);
    // this.song.resume(k);
  }
}

// class MusicSource extends SoundSource {
//   constructor(...args) {
//     super(...args);
//     this.loops = true;
//   }
//   onloadBuffer(buffer) {
//     this.buffer=buffer;
//     this.loaded = true;
//     this.play();
//     // setInterval(() => {
//     //   this.setPitch();
//     // }, 4000)
//     this.setPitch();
//   }
//   setPitch() {
//     // var v = 1 + (Math.random()-0.5)/2;
//     var v = 1;
//     if(Math.random()>.5)v = 2;
//     this.lastSound.playbackRate.setValueAtTime(v, AUDIOCONTEXT.currentTime);
//     setTimeout(() => {
//       this.setPitch();
//     }, 4000/v);
//   }
// }



class SoundList {
  constructor(sounds) {
    this.sounds = sounds;
    this.index = 0;
  }
  play() {
    this.sounds[this.index].play();
    this.index = (this.index+1)%this.sounds.length;
  }
}

class SoundListRandom {
  constructor(sounds) {
    this.sounds = sounds;
  }
  play(...args) {
    this.sounds[Math.floor(Math.random()*this.sounds.length)].play(...args);
  }
}
