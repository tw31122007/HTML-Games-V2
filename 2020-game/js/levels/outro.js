import AudioManager from '../audio.js'
import Constants from '../constants.js'
import Properties from '../properties.js'
import { getText } from '../translate.js'
import { addGameWinLayer, fadeInOutTitle } from '../helpers.js'

// Additional processing of sprites from tilemap
const PRE_PROCESSING = {
    'o-ray': processRay
}
const POST_PROCESSING = {
    'o-ufo': processUfo,
    'o-ray': processRay
}
// Offset for each text line in the speech bubble
const SPEECH_LINE_HEIGHT = 1.4

let speechBuble = { container: undefined, line1: undefined, line2: undefined }
let ufo, ray

export default {
    preloadLevel: function() {
        // Load sprites for outro
        Properties.map.getObjectLayer('outro').objects.forEach(object => {
            if (object.name in PRE_PROCESSING) {
                PRE_PROCESSING[object.name](object)
            } else {
                // Add sprite
                let sprite = Properties.addMapImage(object)
                // Post processing
                if (object.name in POST_PROCESSING) {
                    POST_PROCESSING[object.name](sprite)
                }
            }
        })
        initSpeechBubble()
        // Init audio sounds
        AudioManager.base.zombies = Properties.scene.sound.add('zombies', { loop: false })
        AudioManager.base.ufo = Properties.scene.sound.add('ufo', { loop: false })
        AudioManager.base.godzilla = Properties.scene.sound.add('godzilla', { loop: false, volume: 1 })
        AudioManager.base.sfx = Properties.scene.sound.add('sfx', { loop: false })
    },
    start: function() {
        initSpeechBubble()
        addSpeech([getText('outroMessage1')], 1000)
        Properties.scene.time.delayedCall(1500, () => addSpeech([getText('outroMessage2_1'), getText('outroMessage2_2')], 1300))
        Properties.scene.time.delayedCall(3500, () => addSpeech([getText('outroMessage3_1'), getText('outroMessage3_2')], 2500))
        // Start showing 2021
        Properties.scene.time.delayedCall(5500, shiftTo2021)
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'OUTRO')
    }
}

function initSpeechBubble() {
    let offsetX = 200, offsetY = -90
    let posX = Properties.player.x + offsetX, posY = Properties.player.y + offsetY
    let background = Properties.scene.add.image(0, 0, 'o-speech-bubble')
    let line1 = Properties.scene.add.bitmapText(0, 0, 'dark').setOrigin(0.5, 0.85)
    let line2 = Properties.scene.add.bitmapText(0, 0, 'dark').setOrigin(0.5, 0.85)
    let container = Properties.scene.add.container(posX, posY, [background, line1, line2])
    container.setDepth(Constants.DEPTH.important)
    // Save
    speechBuble.container = container
    speechBuble.line1 = line1
    speechBuble.line2 = line2
    // Hide at first
    speechBuble.container.alpha = 0
}

function addSpeech(lines, delay = 1000) {
    let fontSize = 32, line1 = lines[0], line2 = lines.length > 1 ? lines[1] : ''
    let maxLineLength = Math.max(line1.length, line2.length)

    if (maxLineLength > 12) { fontSize = 22 }
    else if (maxLineLength > 8) { fontSize = 26 }
    let offsetY = fontSize * SPEECH_LINE_HEIGHT / 2

    speechBuble.line1.setFontSize(fontSize).setText(line1)
    speechBuble.line2.setFontSize(fontSize).setText(line2)

    if (lines.length > 1) {
        speechBuble.line1.y = -offsetY
        speechBuble.line2.y = offsetY
    } else {
        speechBuble.line1.y = 0
        speechBuble.line2.y = 0
    }

    Properties.scene.time.delayedCall(delay, hideSpeechBuble)
    showSpeechBubble()
}

function hideSpeechBuble() {
    Properties.scene.tweens.add({
        targets: speechBuble.container,
        alpha: 0,
        duration: 100
    })
}

function showSpeechBubble() {
    Properties.scene.tweens.add({
        targets: speechBuble.container,
        alpha: 1,
        duration: 100
    })
}

function shiftTo2021() {
    // Yandex.Metrika
    ym(70640851, 'reachGoal', '2021')

    // Stop following player
    Properties.camera.stopFollow()
    // Create invisible object
    let hidden = Properties.scene.add.circle(Properties.player.x, Properties.player.y, 1)
    Properties.camera.startFollow(hidden)
    // Move to the end
    let hiddenMove = Properties.scene.tweens.add({
        targets: hidden,
        x: Properties.camera.getBounds().width,
        duration: 18500 - Properties.ratioPercent() * 2000,
        onComplete: () => {
            hiddenMove.stop()
            hidden.destroy()
            Properties.camera.stopFollow()
        }
    })
    // Show 2021 title
    Properties.scene.time.delayedCall(500, () => {
        fadeInOutTitle('2021', 1200, 8000)
        moveUfo()
    })
    // Wait and play zombies sound
    Properties.scene.time.delayedCall(2000, () => {
        AudioManager.fadeIn('zombies', 0.3, 3000)
        Properties.scene.time.delayedCall(5000, () => AudioManager.fadeOut('zombies', 2000))
    })
    // Wait and play UFO sounds
    Properties.scene.time.delayedCall(5000, () => {
        AudioManager.fadeIn('ufo', 0.5, 2000)
        Properties.scene.time.delayedCall(7500, () => AudioManager.fadeOut('ufo', 3000))
    })
    // Wait and play Godzilla sound
    Properties.scene.time.delayedCall(13000, () => {
        addRay()
        AudioManager.play('godzilla')
        Properties.scene.time.delayedCall(4400, () => AudioManager.fadeOut('godzilla', 300))
    })
    // SFX effect
    Properties.scene.time.delayedCall(17000, () => {
        AudioManager.fadeIn('sfx', 0.2, 500)
        Properties.scene.time.delayedCall(3000, () => AudioManager.fadeOut('sfx', 3000))
    })
    // Show game win layer
    Properties.scene.time.delayedCall(16000, addGameWinLayer)
}

function processUfo(sprite) {
    ufo = sprite
    // Fix origin
    let xOrigin = 0.16, yOrigin = 0.1
    ufo.setOrigin(xOrigin, yOrigin)
    ufo.x += xOrigin * ufo.width
    ufo.y -= ufo.height * (1 - yOrigin)
}

function processRay(rayObject) {
    ray = Properties.scene.add.sprite(rayObject.x, rayObject.y, rayObject.name).setOrigin(1, 0)
    // Fix position for the new origin
    ray.x += ray.width
    ray.y -= ray.height
    // Fix depth
    ray.setDepth(Constants.DEPTH.background)
    // Init animation and play
    Properties.scene.anims.create({
        key: 'o-ray',
        frames: Properties.scene.anims.generateFrameNumbers('o-ray', { start: 0, end: 3 }),
        // frames: 'o-ray',
        frameRate: 10,
        repeat: -1
    })
    ray.anims.play('o-ray')
    // Hide
    ray.alpha = 0
}

function moveUfo() {
    let { x, y, angle } = ufo
    Properties.scene.tweens.timeline({
        targets: ufo,
        ease: 'Sine.easeInOut',
        tweens: [
            { angle: angle + 20, x: x + 200, y: y - 40, duration: 3200, },
            { angle: angle + 50, x: x + 40, y: y + 80, duration: 3200 },
            { angle: angle + 10, x: x + 300, y: y + 70, duration: 3200, },
            { angle: angle, x: x, y: y, duration: 3200, },
        ],
        loop: -1
    })
}

function addRay() {
    ray.alpha = 1
    ray.angle = ray.angle - 1.5
    Properties.scene.tweens.add({
        targets: ray,
        angle: ray.angle + 5,
        scale: ray.scale * 1.2,
        duration: 3000,
        yoyo: true,
        ease: 'Sine.easeInOut',
        loop: -1
    })
}
