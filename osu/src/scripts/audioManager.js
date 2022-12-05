class Sound {
	constructor(src, type = "music", allowMultiPlay = false) {
		this.audio = new Audio(src);
		this.type = type;
		this.allowMultiPlay = allowMultiPlay;
	}
}

export class AudioManager {
	constructor() {
		/* map for loaded sounds */
		this.sounds = {};
		this.masterVolume = 1;
		this.musicVolume = 1;
		this.effectsVolume = 1;
	}
	setMasterVolume(volume) {
		this.masterVolume = volume;
	}
	/* value between 0 and 1, where 0 = muted */
	setMusicVolume(volume) {
		this.musicVolume = volume;
	}
	/* value between 0 and 1, where 0 = muted */
	setEffectsVolume(volume) {
		this.effectsVolume = volume;
	}
	/* type is a string data that is either "music" or "effects" */
	/* allowMultiPlay is an optional argument */
	load(id, src, type, allowMultiPlay) {
		this.sounds[id] = new Sound(src, type, allowMultiPlay);
	}
	changeSource(id, src) {
		this.sounds[id].audio.src = src;
	}
	play(id, volumeOverride) {
		if (this.sounds[id].allowMultiPlay) {
			let cloned = this.sounds[id].audio.cloneNode();
			if (volumeOverride) {
				cloned.volume = volumeOverride;
			} else {
				if (this.sounds[id].type === "music") {
					cloned.volume = this.masterVolume * this.musicVolume;
				} else {
					cloned.volume = this.masterVolume * this.effectsVolume;
				}
			}
			cloned.play();
		} else {
			if (volumeOverride) {
				this.sounds[id].audio.volume = volumeOverride;
			} else {
				if (this.sounds[id].type === "music") {
					this.sounds[id].audio.volume = this.masterVolume * this.musicVolume;
				} else {
					this.sounds[id].audio.volume = this.masterVolume * this.effectsVolume;
				}
			}
			this.sounds[id].audio.play();
		}
	}
	pause(id) {
		if (this.sounds[id].audio.paused === false) {
			this.sounds[id].audio.pause();
		}
	}
}