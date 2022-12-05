import AudioManager from '../audio.js'
import Constants from '../constants.js'
import Properties from '../properties.js'
import { getText } from '../translate.js'
import Outro from './outro.js'
import {
    addBounceTween, clearScene, fadeInOutTitle, hideControls,
    playerSpriteRun, playerSpriteStand, processCorona, processMask
} from '../helpers.js'

// Additional processing of sprites from tilemap
const PRE_PROCESSING = {
    '7-smoke': processSmoke,
    '7-firework1': processFirework,
    '7-firework2': processFirework,
    '7-firework3': processFirework
}
const POST_PROCESSING = {
    'c-corona': corona => processCorona(corona, false, false),
    'c-mask': processMask,
    '7-home': processHome,
    '3-home-wall1': wall => wall.setDepth(Constants.DEPTH.important),
    '3-home-wall2': wall => wall.setDepth(Constants.DEPTH.important),
    '7-vaccine': processVaccine,
}
// Intervals
const SYRINGE_INTERVAL = 700
const SYRINGE_MS_PER_PIXEL = 1
const SYRINGE_DISTANCE_FROM_WIDTH = 0.6
const CORONA_INTEREVAL = 2400
const CORONA_MS_PER_PIXEL = 2.4
const CORONA_Y_DURATION = 600
// Corona Y offsets from foreground
const CORONA_OFFSETS_Y = [16, 64, 128]
// Corona tween configurations
const CORONA_TWEEN_PARAMS = [
    { yDelta: 0, ease: undefined }, // No Y delta – horizontal tweeen
    { yDelta: 104, ease: 'Cubic.easeOut' },
    // { yDelta: 96, ease: 'Sine.easeInOut' },
    { yDelta: 192, ease: 'Sine.easeInOut' }
]
// Sequence of corona actions to be looped
const CORONA_ACTIONS = [
    // No top straight corona (2, 0) amd bottom jumpy one (0, 1)
    { offsetY: CORONA_OFFSETS_Y[0], tweenParams: CORONA_TWEEN_PARAMS[0] },
    { offsetY: CORONA_OFFSETS_Y[2], tweenParams: CORONA_TWEEN_PARAMS[2] },
    // { offsetY: CORONA_OFFSETS_Y[1], tweenParams: CORONA_TWEEN_PARAMS[1] },
    // { offsetY: CORONA_OFFSETS_Y[0], tweenParams: CORONA_TWEEN_PARAMS[2] },
    // { offsetY: CORONA_OFFSETS_Y[2], tweenParams: CORONA_TWEEN_PARAMS[1] },
    { offsetY: CORONA_OFFSETS_Y[1], tweenParams: CORONA_TWEEN_PARAMS[0] },
    // { offsetY: CORONA_OFFSETS_Y[1], tweenParams: CORONA_TWEEN_PARAMS[2] }
]
// Bush which needs to be in front of the home
const HOME_BUSH_ID = 743

// Syringe group and collider
let syringeGroup, syringeCollider
// Shoot and corona interval
let coronaInterval, shootingInterval
// Home and fireworks sprite
let home, fireworks
// Parameter for the current corona action
let currentCoronaAction

export default {
    preloadLevel: function() {
        // Clear scene and init objects
        clearScene()
        initSyringeGroup()
        fireworks = []
        currentCoronaAction = 0
        // Load sprites for Level 7
        Properties.map.getObjectLayer('level7').objects.forEach(object => {
            if (object.name in PRE_PROCESSING) {
                PRE_PROCESSING[object.name](object)
            } else {
                // Add sprite
                let sprite = Properties.addMapImage(object)
                // Post processing
                if (object.name in POST_PROCESSING) {
                    POST_PROCESSING[object.name](sprite)
                }
                // Check for home bush
                if (object.id == HOME_BUSH_ID) {
                    sprite.setDepth(Constants.DEPTH.foregroundMain + 0.5)
                }
            }
        })
        // Init fireworks sound
        AudioManager.base.fireworks = Properties.scene.sound.add('fireworks', { loop: false, volume: 0.3 })
    },
    checkpoint15: function() {
        // Update checkpoint
        Properties.checkpoint = 15
        // Clear passed objects
        clearScene()
        // Play main theme full
        AudioManager.setMain('full')
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'CHECKPOINT_15')
    },
    showTitle: function() {
        fadeInOutTitle(getText('covidSecondWave'), null, 3000)
    },
    startCorona: function() {
        addCoronaAttack(CORONA_INTEREVAL)
        // Add instantly first corona
        addCorona()
    },
    removeCorona: function() {
        // Stop corona attack
        coronaInterval.remove()
        // Set home to be behind the player
        home.setDepth(Constants.DEPTH.foregroundMain)
    },
    removeSyringe: function() {
        // Stop syringe shooting and corona attack
        shootingInterval.remove()
    },
    gameWin: function() {
        // Stop theme
        AudioManager.fadeOut(AudioManager.currentMain, 1500)
        // Disable player input
        Properties.inputEnabled = false
        // Hide controls
        hideControls()
        // If player is jumping - unset velocity and wait until it lands
        if (!Properties.playerStands()) {
            // Save current velocity to use later
            let velocityX = Properties.player.body.velocity.x
            // Reset velocity
            Properties.player.setVelocityX(0)
            // Wait for player to land
            let interval = Properties.scene.time.addEvent({
                delay: 25,
                loop: true,
                callback: () => {
                    if (Properties.playerStands()) {
                        interval.remove()
                        // Set velocity back
                        Properties.player.setVelocityX(velocityX)
                        playerSpriteRun()
                        // Finish after landed and started running
                        finishGame()
                    }
                }
            })
        } else {
            finishGame()
        }
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'GAME_WIN')
    },
    clear: function() {
        if (syringeCollider && syringeCollider.active) { syringeCollider.destroy() }
        if (syringeGroup && syringeGroup.active) { syringeGroup.destroy() }
    }
}

function initSyringeGroup() {
    // Define group
    syringeGroup = Properties.scene.physics.add.group({ allowGravity: false })
    // Define collider with coronas
    syringeCollider = Properties.scene.physics.add.overlap(
        syringeGroup,
        Properties.coronaGroup,
        (s, c) => {
            // Remove tweens
            Properties.scene.tweens.killTweensOf(s)
            Properties.scene.tweens.killTweensOf(c)
            // Destroy both
            s.destroy()
            c.destroy()
        }
    )
}

function processSmoke(object) {
    let smoke = Properties.scene.add.sprite(object.x, object.y, object.name)
    smoke.setOrigin(0, 1).setDepth(Constants.DEPTH.foregroundMain)
    Properties.scene.anims.create({
        key: object.name,
        frames: object.name,
        frameRate: 6,
        repeat: -1
    })
    smoke.anims.play(object.name)
}

function processFirework(object) {
    let firework = Properties.scene.add.sprite(object.x, object.y, object.name)
    // Create animation
    Properties.scene.anims.create({
        key: object.name,
        frames: object.name,
        frameRate: 10,
        repeat: 1,
        hideOnComplete: true
    })
    // Save name
    firework.setName(object.name)
    // Properties
    firework.setOrigin(0, 1).setAlpha(0).setDepth(Constants.DEPTH.foregroundSecondary)
    // Add to array
    fireworks.push(firework)
}

function processHome(sprite) {
    home = sprite
    // Set depth important at first, so corona is behind
    home.setDepth(Constants.DEPTH.important)
}

function processVaccine(vaccine) {
    // Define physics
    Properties.scene.physics.add.existing(vaccine)
    // Disallow gravity
    vaccine.body.setAllowGravity(false)
    // Add bounce
    addBounceTween(vaccine)
    // Set collider
    let collider = Properties.scene.physics.add.overlap(Properties.player, vaccine, () => {
        // Destroy vaccine and collider
        vaccine.destroy()
        collider.destroy()
        // Start shooting
        startSyringeShooting()
    })
}

function addCoronaAttack(intervalDuration) {
    // Set new interval for corona attack
    coronaInterval = Properties.scene.time.addEvent({
        delay: intervalDuration,
        loop: true,
        callback: addCorona
    })
}

function addCorona() {
    let offsetX = 50
    let startX = Properties.camera.scrollX + Properties.sceneSize.width + offsetX
    let endX = Properties.camera.scrollX - offsetX
    // Get current action offset Y and params for tweening
    let { offsetY, tweenParams } = CORONA_ACTIONS[currentCoronaAction]
    let posY = Properties.foregroundY() - offsetY
    let corona = Properties.scene.add.image(startX, posY, 'c-corona')
    corona.setDepth(Constants.DEPTH.foregroundMain)
    processCorona(corona, false, false)
    // Add tween
    tweenBounce(corona, endX, tweenParams.yDelta, tweenParams.ease)
    // Update current action
    currentCoronaAction = (currentCoronaAction + 1) % CORONA_ACTIONS.length
}

function tweenBounce(corona, endX, yDelta, ease) {
    let duration = Math.abs(endX - corona.x) * (CORONA_MS_PER_PIXEL + 0.6 * Properties.ratioPercent())
    let config = {
        targets: corona,
        x: { value: endX, duration },
        onComplete: () => {
            tween.stop()
            corona.destroy()
        }
    }
    // Add Y tween if it is not zero
    if (yDelta) {
        config.y = {
            value: `-=${yDelta}`,
            duration: CORONA_Y_DURATION + 200 * Properties.ratioPercent(),
            ease: ease,
            yoyo: true,
            repeat: 3
        }
    }
    let tween = Properties.scene.tweens.add(config)
}

function startSyringeShooting() {
    // Set interval
    shootingInterval = Properties.scene.time.addEvent({
        delay: SYRINGE_INTERVAL,
        loop: true,
        callback: addSyringe,
        // Shoot immediately
        startAt: SYRINGE_INTERVAL
    })
}

function addSyringe() {
    if (!Properties.player.flipX) {
        // Set position and create
        let posX = Properties.player.x + 50, posY = Properties.player.y
        let syringe = Properties.scene.add.sprite(posX, posY, '7-syringe')
        // Add physics
        Properties.scene.physics.add.existing(syringe)
        // Refresh body
        syringe.body.setSize(syringe.width, syringe.height * 0.7)
        // Added to group
        syringeGroup.add(syringe)
        // Syringe speed per 100 pixels
        let distance = Properties.sceneSize.width * SYRINGE_DISTANCE_FROM_WIDTH
        // Add tween
        let tween = Properties.scene.tweens.add({
            targets: syringe,
            x: `+=${distance}`,
            duration: distance * SYRINGE_MS_PER_PIXEL,
            onComplete: function() {
                tween.stop()
                syringe.destroy()
            }
        })
    }
}

function finishGame() {
    // Wait, stop and start outro
    Properties.scene.time.delayedCall(600, () => {
        Properties.player.setVelocityX(0)
        playerSpriteStand()
    })
    // Show title
    // fadeInOutTitle('CONGRATULATIONS!', 200, 3000)
    // Firework play function
    let showFirework = firework => {
        firework.setAlpha(1)
        firework.anims.play(firework.name)
    }
    // Delayed calls
    Properties.scene.time.delayedCall(600, () => {
        showFirework(fireworks[0])
        AudioManager.play('fireworks')
    })
    Properties.scene.time.delayedCall(1800, () => showFirework(fireworks[1]))
    Properties.scene.time.delayedCall(1000, () => showFirework(fireworks[2]))
    // Wait and start outro
    Properties.scene.time.delayedCall(2000, () => Outro.start())
}
