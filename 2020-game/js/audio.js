import Properties from './properties.js'

export default {
    muted: true,
    base: {
        // Music tracks
        intro: undefined,
        hell: undefined,
        'main-full': undefined,
        'main-short': undefined,
        'main-beats': undefined,
        // Sounds
        bat: undefined,
        dolphins: undefined,
        koala: undefined,
        'tree-falls': undefined,
        clock: undefined,
        tiktok: undefined,
        fireworks: undefined,
        // Outro
        godzilla: undefined,
        zombies: undefined,
        ufo: undefined,
        sfx: undefined,
    },
    currentMain: undefined,
    setMain: function(key) {
        let nextMain = `main-${key}`

        if (this.currentMain === nextMain) {
            return
        } else if (!this.currentMain) {
            this.currentMain = nextMain
            this.base[nextMain].play()
        } else {
            let current = this.base[this.currentMain]
            current.once('looped', () => {
                current.stop()
                this.currentMain = nextMain
                this.base[nextMain].play()
            })
        }
    },
    unsetMain: function() {
        this.currentMain = undefined
    },
    play: function(key) {
        if (!this.base[key].isPlaying) {
            this.base[key].play()
        }
    },
    resume: function(key) {
        if (!this.base[key].isPlaying) {
            if (this.base[key].isPaused) {
                this.base[key].resume()
            } else {
                this.base[key].play()
            }
        }
    },
    pause: function(key) {
        if (this.base[key].isPlaying) {
            this.base[key].pause()
        }
    },
    stop: function(key) {
        if (this.base[key].isPlaying) {
            this.base[key].stop()
            // Unset current main if it is being stopped
            if (this.currentMain === key) { this.unsetMain() }
        }
    },
    destroy: function(key) {
        if (this.base[key] && this.base[key].manager) {
            this.base[key].destroy()
        }
    },
    fadeIn: function(key, volume, duration = 1000, onComplete = null) {
        if (!this.base[key].isPlaying) {
            this.base[key].setVolume(0)
            this.base[key].play()
            Properties.scene.tweens.add({
                targets: this.base[key],
                volume: volume,
                duration: duration,
                onComplete: () => {
                    if (onComplete) { onComplete() }
                }
            })
        }
    },
    fadeOut: function(key, duration = 1000, onComplete = null) {
        if (this.base[key].isPlaying) {
            Properties.scene.tweens.add({
                targets: this.base[key],
                volume: 0,
                duration: duration,
                onComplete: () => {
                    this.base[key].stop()
                    if (onComplete) { onComplete() }
                }
            })
            // Unset current main if it is being faded
            if (this.currentMain === key) { this.unsetMain() }
        }
    }
}
