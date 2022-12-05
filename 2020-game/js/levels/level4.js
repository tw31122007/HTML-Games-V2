import AudioManager from '../audio.js'
import Constants from '../constants.js'
import Properties from '../properties.js'
import { getText } from '../translate.js'
import {
    addBounceTween, clearScene, fadeInOut,
    fadeInOutTitle, processCorona
} from '../helpers.js'

// Additional processing of sprites from tilemap
const PROCESSING = {
    '4-smog1': processSmog,
    '4-smog2': processSmog,
    '4-smog3': processSmog,
    '4-dolphin': processDolphin,
    '4-oil': addOilOverlap,
    '4-cloud-small': processCloud,
    '4-cloud-big': processCloud,
    'c-corona': addCorona
}
// Cloud texts
const CLOUD_TEXTS = {
    972: [getText('zoom1')],
    442: [getText('zoom2_1'), getText('zoom2_2')],
    443: [getText('zoom3_1'), getText('zoom3_2')],
    444: [getText('zoom4_1'), getText('zoom4_2')],
    445: [getText('zoom5_1'), getText('zoom5_2')],
    446: [getText('zoom6_1'), getText('zoom6_2')],
    447: [getText('zoom7_1'), getText('zoom7_2')],
    448: [getText('zoom8_1'), getText('zoom8_2')],
    973: [getText('zoom9')],
}
// Second flipped dolphin
const SECOND_DOLPHIN_ID = 856

let smogs
let dolphin1, dolphin2
let coronas, coronasTween

export default {
    preloadLevel: function() {
        // Clear smogs
        smogs = []
        // Clear coronas
        coronas = []
        // Load sprites for Level 4
        Properties.map.getObjectLayer('level4').objects.forEach(object => {
            // Add sprite
            let sprite = Properties.addMapImage(object)
            // Post processing
            if (object.name in PROCESSING) {
                PROCESSING[object.name](sprite)
            }
        })
        // Add coronas bounce
        coronasTween = addBounceTween(coronas)
        // Dolphins sound
        AudioManager.base.dolphins = Properties.scene.sound.add('dolphins', { loop: false })
    },
    checkpoint7: function() {
        // Update checkpoint
        Properties.checkpoint = 7
        // Clear passed objects
        clearScene()
        // Main theme beats
        AudioManager.setMain('beats')
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'CHECKPOINT_7')
    },
    showTitle: function() {
        // Show title
        fadeInOutTitle([getText('natureClearing1'), getText('natureClearing2')], null, 3000)
    },
    fadeOutSmog: function() {
        // Fade out
        let smogTween = Properties.scene.tweens.add({
            targets: smogs,
            alpha: 0,
            duration: Constants.DURATION.smogMoves,
            onComplete: () => {
                // Stop and destroy
                smogTween.stop()
                smogs.forEach(smog => smog.destroy())
            }
        })
    },
    addDolphins: function() {
        jumpDolphin(dolphin1)
        jumpDolphin(dolphin2, 800)
        // Fade in and out dolphin sounds
        AudioManager.fadeIn('dolphins', 0.05, 200, () => {
            Properties.scene.time.delayedCall(1400, () => AudioManager.fadeOut('dolphins', 200, () => {
                AudioManager.destroy('dolphins')
            }))
        })
    },
    checkpoint8: function() {
        // Update checkpoint
        Properties.checkpoint = 8
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'CHECKPOINT_8')
    },
    checkpoint9: function() {
        // Update checkpoint
        Properties.checkpoint = 9
        // Main theme beats
        AudioManager.setMain('beats')
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'CHECKPOINT_9')
    },
    clear: function() {
        // Stop tween
        if (coronasTween) { coronasTween.stop() }
        // Destroy coronas
        if (coronas) { coronas.forEach(corona => corona.destroy()) }
    }
}

function addCorona(corona) {
    // Add corona without tween
    processCorona(corona, false)
    // Add to the array
    coronas.push(corona)
}

function processSmog(smog) {
    // Add to smogs
    smogs.push(smog)
}

function processDolphin(sprite) {
    sprite.setOrigin(0.5).setFlipX(true)
    sprite.setScale(0.85).setRotation(-0.3 * Math.PI)

    if (sprite.name == SECOND_DOLPHIN_ID) {
        dolphin2 = sprite
    } else {
        dolphin1 = sprite
    }
}

function jumpDolphin(dolphin, delay = 0) {
    let xDelta = '+=450', yDelta = '-=240'
    let rotationDelta = 0.65 * Math.PI

    let tween = Properties.scene.add.tween({
        targets: dolphin,
        delay: delay,
        y: { value: yDelta, yoyo: true, ease: 'Sine.easeOut', duration: 650 },
        x: { value: xDelta, duration: 1300 },
        rotation: { value: rotationDelta, duration: 1300 },
        onComplete: () => tween.stop()
    })
}

function addOilOverlap(oil) {
    // Add physics
    Properties.scene.physics.add.existing(oil, true)
    // Add bounce tween
    let tween = addBounceTween(oil)
    // Add overlap – collect
    let overlap = Properties.scene.physics.add.overlap(Properties.player, oil, () => {
        // Destroy sprite
        oil.destroy()
        // Destroy tween
        tween.stop()
        // Destroy overlap
        overlap.destroy()
        // Fade in out text
        let offsetY = 160
        let posX = Properties.sceneSize.width / 2, posY = Properties.foregroundY() - offsetY
        let title = '+0$', fontSize = 36
        // Create, set origin and no camera scroll
        let text = Properties.scene.add.bitmapText(posX, posY, 'light', title, fontSize)
        text.setOrigin(0.5, 1).setScrollFactor(0)
        // Fade in and out
        let duration = 50, delay = 400
        fadeInOut(text, duration, delay, () => {
            text.destroy()
        })
    })
}

function processCloud(cloud) {
    // Set physics body height
    let widthPercent = 0.9, heightPercent = 0.8
    cloud.body.setSize(cloud.width * widthPercent, cloud.height * heightPercent)
    // Update depth
    cloud.setDepth(Constants.DEPTH.important)
    // Add text
    addCloudText(cloud)
}

function addCloudText(cloud) {
    let textLines = CLOUD_TEXTS[cloud.name]
    let maxLineLength = Math.max(textLines[0].length, textLines.length > 1 ? textLines[1].length : 0)
    // Define font size
    let fontSize
    if (maxLineLength < 10) {
        fontSize = 22
    } else if (maxLineLength < 13) {
        fontSize = 19
    } else {
        fontSize = 17
    }
    // Positions
    let posX = cloud.x + cloud.width / 2, posY = cloud.y - cloud.height / 2
    // Add texts for one and two lines
    if (textLines.length === 1) {
        let text = Properties.scene.add.bitmapText(posX, posY, 'dark', textLines[0], fontSize)
        text.setOrigin(0.5, 0.85).setDepth(Constants.DEPTH.important)
    } else {
        // Texts for two lines
        let offset = fontSize / 2 + 4
        let text1 = Properties.scene.add.bitmapText(posX, posY - offset, 'dark', textLines[0], fontSize)
        let text2 = Properties.scene.add.bitmapText(posX, posY + offset, 'dark', textLines[1], fontSize)
        // Set origin to shift texts
        text1.setOrigin(0.5, 0.85).setDepth(Constants.DEPTH.important)
        text2.setOrigin(0.5, 0.85).setDepth(Constants.DEPTH.important)
    }
}
