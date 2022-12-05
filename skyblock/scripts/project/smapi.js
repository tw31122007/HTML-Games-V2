Scorenga = function() {
  var self = this;

  self.VERSION = '20191203';
  self.ACTIONS = {
    READY: 'READY',
    INFO: 'INFO',
    COMMAND: 'COMMAND',
    EVENT: 'EVENT',
    WARNING: 'WARNING',
    ERROR: 'ERROR'
  }
  self.EVENTS = {
    GAME_START: 'GAME_START',
    GAME_FINISH: 'GAME_FINISH',
    LEVEL_START: 'LEVEL_START',
    LEVEL_FINISH: 'LEVEL_FINISH',
    HIGH_SCORE: 'HIGH_SCORE'
  };
  self.SENDERS = {
    SYSTEM: 'Scorenga system',
    BRIDGE: 'Scorenga bridge'
  }

  self.callbacks = {
    mute: null,
    unmute: null,
    pause: null,
    resume: null
  }

  self.setMuteCallback = function(muteCallback) {
    self.callbacks.mute = muteCallback;
  }
  self.setUnMuteCallback = function(unMuteCallback) {
    self.callbacks.unmute = unMuteCallback;
  }
  self.setPauseCallback = function(pauseCallback) {
    self.callbacks.pause = pauseCallback;
  }
  self.setResumeCallback = function(resumeCallback) {
    self.callbacks.resume = resumeCallback;
  }
  self.setReady = function() {
    self.postMessage(self.ACTIONS.READY);
  }

  self.postMessage = function(action, payload) {
    if(!window.parent) {
      console.log('SCORENGA ERROR: Can not find parent window to send message to scorenga system');
      return;
    }
    window.parent.postMessage(JSON.stringify({
      sender: self.SENDERS.BRIDGE,
      action: action,
      payload: payload
    }, function(key, val) {
      return (typeof val === 'function') ? '<function>' : val
    }), '*');
  }

  self.reportEvent = function(event, level, score) {
    if(!self.EVENTS.hasOwnProperty(event)) {
      console.log('[SCORENGA] Error: unknown event ' + event + ', please use window.scorenga.EVENTS enum');
      return;
    }
    self.postMessage(self.ACTIONS.EVENT, {
      event: event,
      level: parseInt(level),
      score: parseInt(score)
    })
  }

  window.addEventListener('message', function(event) {
    var message = JSON.parse(event.data);
    if(!message || !message.sender || message.sender !== self.SENDERS.SYSTEM) return;
    if(!message.action) return;
    if(message.action === self.ACTIONS.INFO) {
      self.postMessage(self.ACTIONS.INFO, {version: self.VERSION, callbacks: self.callbacks});
      return;
    }
    if(message.action === self.ACTIONS.COMMAND) {
      if(!self.callbacks[message.payload.callback]) {
        self.postMessage(self.ACTIONS.WARNING, {
          error: 'You asked to perform ' + message.payload.callback + ' callback, but it is not filled by game'
        });
        return;
      }
      self.callbacks[message.payload.callback]();
    }
  })
}

window.scorenga = new Scorenga();
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";

runOnStartup(async runtime =>
{
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.
	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime)
{
	// Code to run just before 'On start of layout' on
	// the first layout. Loading has finished and initial
	// instances are created and available to use here.
	
	runtime.addEventListener("tick", () => Tick(runtime));
}

function Tick(runtime)
{
	// Code to run every tick
}
