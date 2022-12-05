import AudioManager from '../audio.js'
import Constants from '../constants.js'
import Properties from '../properties.js'
import { clearScene, processCorona, processMask } from '../helpers.js'

// Additional processing of sprites from tilemap
const PROCESSING = {
    'c-mask': processMask,
    '5-5G-stand': save5GStand,
    '5-5G-box': process5GBox,
    '5-tiktok-body': processTikTok
}
// TikTok disco alpha
const DISCO_ALPHA = 0.4
// TikTok disco colors: yellow, red, mint, purple
const DISCO_COLOR = [0xf5ef42, 0xff0000, 0x00fad8, 0x7300c4]

// 5G stand and box sprites
let stand5G, box5G
// 5G state
let generatingCorona
// TikTok state
let playingTikTok
// TikTok disco sprite and interval
let disco, discoInterval
// 5G box collider and tiktok overlap
let box5GCollider, tiktokOverlap

export default {
    preloadLevel: function() {
        // Reset states
        generatingCorona = false
        playingTikTok = false
        // Load sprites for Level 5
        Properties.map.getObjectLayer('level5').objects.forEach(object => {
            // Add sprite
            let sprite = Properties.addMapImage(object)
            // Post processing
            if (object.name in PROCESSING) {
                PROCESSING[object.name](sprite)
            }
        })
        // Init TikTok sound
        AudioManager.base.tiktok = Properties.scene.sound.add('tiktok', { loop: true, volume: 0.3 })
    },
    checkpoint10: function() {
        // Update checkpoint
        Properties.checkpoint = 10
        // Stop main theme for BLM
        if (AudioManager.currentMain) {
            AudioManager.fadeOut(AudioManager.currentMain)
        }
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'CHECKPOINT_10')
    },
    checkpoint11: function() {
        // Update checkpoint
        Properties.checkpoint = 11
        // Clear passed objects
        clearScene()
        // Main theme short
        AudioManager.setMain('short')
        AudioManager.fadeIn(AudioManager.currentMain, Constants.VOLUME.main)
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'CHECKPOINT_11')
    },
    startCoronaGeneration: function() {
        // Start generation
        generatingCorona = true
        // Interval
        let delay = 2000
        let createCorona = () => {
            if (!generatingCorona) {
                return
            }
            // Generate
            addCoronasFrom5G()
            // Once more after delay if coronas are being generated
            Properties.scene.time.delayedCall(delay, createCorona)
        }
        // Generate corona with delay
        createCorona()
    },
    stopCoronaGeneration: function() {
        generatingCorona = false
    },
    checkpoint12: function() {
        // Update checkpoint
        Properties.checkpoint = 12
        // Main theme short
        AudioManager.setMain('short')
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'CHECKPOINT_12')
    },
    clear: function() {
        // Destroy physics for 5G and TikTok
        if (box5GCollider && box5GCollider.active) { box5GCollider.destroy() }
        if (tiktokOverlap && tiktokOverlap.active) { tiktokOverlap.destroy() }
        // Destroy TikTok sound
        AudioManager.destroy('tiktok')
    }
}

function save5GStand(sprite) {
    stand5G = sprite
    // Set depth
    stand5G.setDepth(Constants.DEPTH.foregroundMain)
}

function process5GBox(sprite) {
    box5G = sprite
    // Set depth
    box5G.setDepth(Constants.DEPTH.foregroundMain)
    // Add to physics
    Properties.scene.physics.add.existing(box5G, true)
    // Add collider
    box5GCollider = Properties.scene.physics.add.collider(Properties.player, box5G, () => {
        if (!generatingCorona) { return }
        // Break only if touching down
        if (box5G.body.touching.down) {
            // Stop generating corona
            generatingCorona = false
            // Set broken textures
            stand5G.setTexture('5-5G-stand-broken')
            box5G.setTexture('5-5G-box-broken')
        }
    })
}

function processTikTok(tiktok) {
    // HACK THE SYSTEM
    tiktok.setDepth(Constants.DEPTH.important + 1)
    // Add physics
    Properties.scene.physics.add.existing(tiktok, true)
    // Add overlap
    let threshold = 10
    // Define key points
    let leftX = tiktok.x + threshold, rightX = tiktok.x + tiktok.width - threshold
    // Add overlap - when person is inside
    tiktokOverlap = Properties.scene.physics.add.overlap(Properties.player, tiktok, () => {
        if (Properties.player.x > leftX && Properties.player.x < rightX) {
            startTikTok()
        } else {
            stopTikTok()
        }
    })
    // Init disco filter
    initDisco(tiktok.x, tiktok.y, tiktok.width, tiktok.height)
}

function startTikTok() {
    if (!playingTikTok) {
        // Update state
        playingTikTok = true
        // Pause theme
        AudioManager.pause(AudioManager.currentMain)
        // Play sound and disco
        AudioManager.resume('tiktok')
        startDisco()
    }
}

function stopTikTok() {
    if (playingTikTok) {
        // Update state
        playingTikTok = false
        // Stop sound and disco
        AudioManager.pause('tiktok')
        stopDisco()
        // Continue theme
        AudioManager.resume(AudioManager.currentMain)
    }
}

function initDisco(x, y, width, height) {
    // Rectangle
    disco = Properties.scene.add.rectangle(x, y, width, height)
    // Origin and depth
    disco.setOrigin(0, 1).setDepth(Constants.DEPTH.important)
}

function startDisco() {
    // Color counter
    let i = 0
    // Funciton
    let changeColors = () => {
        disco.setFillStyle(DISCO_COLOR[i], DISCO_ALPHA)
        i = (i + 1) % DISCO_COLOR.length
    }
    // Start
    changeColors()
    // Set interval
    discoInterval = Properties.scene.time.addEvent({
        delay: 500,
        loop: true,
        callback: changeColors
    })
}

function stopDisco() {
    // Clear interval
    discoInterval.remove()
    // Remove fill
    disco.setFillStyle()
}

function addCoronasFrom5G() {
    // Positions for corona
    let offsetY = 10
    let posX = stand5G.x + stand5G.width / 2, posY = stand5G.y - stand5G.height + offsetY
    // Initial scale
    let initialScale = 0.4
    // Tween distance and directions
    let distance = 1000
    let directions = [
        // Top
        { x: `-=${distance}`, y: `-=${distance}` },
        { x: `+=${distance}`, y: `-=${distance}` },
        { x: '+=0', y: `-=${distance}` },
        // Left and right
        { x: `-=${distance}`, y: '+=0' },
        { x: `+=${distance}`, y: '+=0' },
        // Bottom
        { x: `-=${distance}`, y: `+=${distance}` },
        { x: `+=${distance}`, y: `+=${distance}` },
        { x: `-=${distance}`, y: `+=${distance / 2}` },
        { x: `+=${distance}`, y: `+=${distance / 2}` },
        { x: `-=${distance / 2}`, y: `+=${distance}` },
        { x: `+=${distance / 2}`, y: `+=${distance}` },
    ]
    // Tween duration
    let totalDuration = 4500, fadeInDuration = 2000, fadeOutDuration = 500
    // Create coronas with tween for all directions
    directions.forEach(direction => {
        // Create new corona and set depth
        let corona = Properties.scene.add.sprite(posX, posY, 'c-corona')
        corona.setDepth(Constants.DEPTH.foregroundSecondary)
        // Make small
        corona.scale = initialScale
        // Make immovable and collidable physics
        processCorona(corona, false)
        // Add tween
        let tween = Properties.scene.tweens.add({
            targets: corona,
            // Scale in
            scale: { value: 1, duration: fadeInDuration },
            // Move by X and Y
            x: { value: direction.x, duration: totalDuration, ease: 'Sine.easeIn' },
            y: { value: direction.y, duration: totalDuration, ease: 'Sine.easeIn' },
            // Wait and fade out
            alpha: { value: 0, duration: fadeOutDuration, delay: totalDuration - fadeOutDuration },
            onComplete: () => {
                tween.stop()
                corona.destroy()
            }
        })
    })
}
