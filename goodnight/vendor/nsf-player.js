const createNsfPlayer = (audioContext) => {
  // Messages are disabled. Feel free to handle them however you like.
  const message = (msg) => undefined;

  const play = (fileName, trackNo) => {
    if (node) {
      node.disconnect();
      node = null;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', fileName, true);
    xhr.responseType = 'arraybuffer';
    xhr.onerror = (e) => {
      message(e);
    };
    xhr.onload = function(e) {
      if (this.status === 404){
        message('not found');
        return;
      }
      const payload = new Uint8Array(this.response);
      playMusicData(payload, trackNo);
      updateSongInfo(fileName, trackNo);
    };
    xhr.send();
  };

  const stop = () => {
    if (!node) {
      return;
    }

    node.disconnect();
    if (Module.ccall('gme_delete', 'number', ['number'], [emu]) !== 0) {
      // console.error('Failed to stop track.');
    }
  };

  let ref;
  let emu;
  let node;

  const parseMetadata = ref => {
    let offset = 0;

    const read_int32 = () => {
       const value = Module.getValue(ref + offset, 'i32');
       offset += 4;
       return value;
     };

     const read_string = () => {
       const value = Module.Pointer_stringify(Module.getValue(ref + offset, 'i8*'));
       offset += 4;
       return value;;
     }

     const res = {};

     res.length = read_int32();
     res.intro_length = read_int32();
     res.loop_length = read_int32();
     res.play_length = read_int32();

     offset += 4*12; // skip unused bytes

     res.system = read_string();
     res.game = read_string();
     res.song = read_string();
     res.author = read_string();
     res.copyright = read_string();
     res.comment = read_string();

     return res;
  };

  const updateSongInfo = (filename, subtune) => {
   const subtune_count = Module.ccall('gme_track_count', 'number', ['number'], [emu]);

   if (Module.ccall('gme_track_info', 'number', ['number', 'number', 'number'], [emu, ref, subtune]) != 0) {
     console.error('Could not load metadata.');
   }

    const metadata = parseMetadata(Module.getValue(ref, '*'));

    message('playing', filename, metadata);
  };

  const playMusicData = (payload, subtune) => {
    if (!window.AudioContext) {
      if (window.webkitAudioContext) {
        window.AudioContext = window.webkitAudioContext;
      } else if (window.mozAudioContext) {
        window.AudioContext = window.mozAudioContext;
      } else {
        message('Web Audio API is not supported.');
      }
    }

    try{
      ctx = audioContext || new AudioContext();
    } catch(err) {
      console.error(`Unable to create AudioContext. Error: ${err}`);
      return;
    }

    ref = Module.allocate(1, 'i32', Module.ALLOC_STATIC);

    const samplerate = ctx.sampleRate;

    if (Module.ccall('gme_open_data', 'number', ['array', 'number', 'number', 'number'], [payload, payload.length, ref, samplerate]) != 0) {
      console.error('gme_open_data failed.');
      return;
    }

    emu = Module.getValue(ref, 'i32');

    const subtune_count = Module.ccall('gme_track_count', 'number', ['number'], [emu]);

    Module.ccall('gme_ignore_silence', 'number', ['number'], [emu, 1]);

    const voice_count = Module.ccall('gme_voice_count', 'number', ['number'], [emu]);
    message('Channel count: ', voice_count);
    message('Track count: ', subtune_count);

    if (Module.ccall('gme_start_track', 'number', ['number', 'number'], [emu, subtune]) != 0) {
      console.error('Failed to load track.');
    }

    const bufferSize = 1024 * 16;
    const inputs = 2;
    const outputs = 2;

    if (!node && ctx.createJavaScriptNode) {
      node = ctx.createJavaScriptNode(bufferSize, inputs, outputs);
    }
    if (!node && ctx.createScriptProcessor) {
      node = ctx.createScriptProcessor(bufferSize, inputs, outputs);
    }

    const buffer = Module.allocate(bufferSize * 2, 'i32', Module.ALLOC_STATIC);

    const INT16_MAX = Math.pow(2, 32) - 1;

    node.onaudioprocess = (e) => {
      if (Module.ccall('gme_track_ended', 'number', ['number'], [emu]) == 1) {
        node.disconnect();
        message('End of stream.');
        return;
      }

      const channels = [e.outputBuffer.getChannelData(0), e.outputBuffer.getChannelData(1)];

      const err = Module.ccall('gme_play', 'number', ['number', 'number', 'number'], [emu, bufferSize * 2, buffer]);
      for (var i = 0; i < bufferSize; i++) {
        for (var n = 0; n < e.outputBuffer.numberOfChannels; n++) {
          channels[n][i] = Module.getValue(buffer + i * e.outputBuffer.numberOfChannels * 2 + n * 4, 'i32') / INT16_MAX;
        }
      }
    }

    node.connect(ctx.destination);

    window.savedReferences = [ctx, node];
  };

  return { play, stop };
};
