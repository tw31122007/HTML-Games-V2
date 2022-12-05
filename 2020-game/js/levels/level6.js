import AudioManager from '../audio.js'
import Constants from '../constants.js'
import Properties from '../properties.js'
import { getText } from '../translate.js'
import { clearScene, fadeInOutTitle } from '../helpers.js'

// Pre processing of objects from tilemap
const PRE_PROCESSING = {
    '6-water': processFloodWater
}
// Post processing of sprites from tilemap
const POST_PROCESSING = {
    // Sprites in water
    '6-car': processWaterCar,
    '6-tree': processWaterTree,
    // Save finish position
    '6-finish': sprite => finish = sprite
}
// Car and tree names
const CAR_NAME = 770, TREE_NAME = 771

// Flood water and objects groups; objects tween in water
let floodWater, floodObjects, floodObjectsTween
// Colliders
let floodWaterCollider, floodObjectsCollider
// Race state
let raceActive = false
// Player velocity
let playerVelocity
// Presidents and finish
let biden, trump, finish
// Current velocity
let bidenVelocity, trumpVelocity

export default {
    preloadLevel: function() {
        // Reset
        raceActive = false, bidenVelocity = 0, trumpVelocity = 0
        // Set player velocity
        playerVelocity = Constants.VELOCITY_X_FROM_HEIGHT * Properties.sceneSize.height
        // Init flood and president animations
        initAnimations()
        // Init flood objects
        initFloodObjects()
        // Load sprites for Level 6
        Properties.map.getObjectLayer('level6').objects.forEach(object => {
            // Pre processing
            if (object.name in PRE_PROCESSING) {
                // Process
                PRE_PROCESSING[object.name](object)
            } else {
                // Add usual objects
                let sprite = Properties.addMapImage(object)
                // Post processing
                if (object.name in POST_PROCESSING) {
                    POST_PROCESSING[object.name](sprite)
                }
            }
        })
        // Add tween for water objects
        floodObjectsTween = Properties.scene.tweens.add({
            targets: floodObjects.getChildren(),
            y: '+=5',
            yoyo: true,
            duration: Constants.DURATION.floodObjects,
            repeat: -1
        })
    },
    checkpoint13: function() {
        // Update checkpoint
        Properties.checkpoint = 13
        // Clear passed objects
        clearScene()
        // Start drive
        AudioManager.setMain('full')
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'CHECKPOINT_13')
    },
    floodsTitle: function() {
        fadeInOutTitle(getText('floods'))
    },
    checkpoint14: function() {
        // Update checkpoint
        Properties.checkpoint = 14
        // Start drive
        AudioManager.setMain('full')
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'CHECKPOINT_14')
    },
    raceTitle: function() {
        fadeInOutTitle(getText('usaElections'))
    },
    startRace: function() {
        // Add Trump and Biden
        let posX = Properties.player.x + Properties.sceneSize.width / 2, posY = Properties.foregroundY()
        addBiden(posX, posY)
        addTrump(posX + 60, posY)
        // Add finish event for presidents
        addFinishOverlap()
        // Update state
        raceActive = true
        // Define velocity
        bidenVelocity = playerVelocity * 0.4
        trumpVelocity = bidenVelocity * 1.1
        // Run
        this.runPresidents()
    },
    bidenLeads: function() {
        // Speed up
        bidenVelocity = playerVelocity
        trumpVelocity = bidenVelocity * 0.8
        // Run
        this.runPresidents()
    },
    trumpLeads: function() {
        // Speed up
        trumpVelocity = playerVelocity
        bidenVelocity = trumpVelocity * 0.8
        // Run
        this.runPresidents()
    },
    bidenNitro: function() {
        // Speed up
        bidenVelocity = playerVelocity * 1.2
        trumpVelocity = bidenVelocity * 0.8
        // Run
        this.runPresidents()
    },
    runPresidents: function() {
        // Check state
        if (!raceActive) { return }
        // Set velocity
        biden.body.setVelocityX(bidenVelocity)
        trump.body.setVelocityX(trumpVelocity)
        // Update animations
        biden.anims.play('6-biden-run', true)
        trump.anims.play('6-trump-run', true)
    },
    stopPresidents: function() {
        // Check state
        if (!raceActive) { return }
        // Reset velocity
        biden.body.setVelocityX(0)
        trump.body.setVelocityX(0)
        // Update animations
        biden.anims.play('6-biden-idle', true)
        trump.anims.play('6-trump-idle', true)
    },
    clear: function() {
        // Stop flood objects tween
        if (floodObjectsTween) { floodObjectsTween.stop() }
        // Destroy flood groups and colliders
        if (floodWater && floodWater.active) { floodWater.destroy() }
        if (floodObjects && floodObjects.active) { floodObjects.destroy() }
        if (floodWaterCollider && floodWaterCollider.active) { floodWaterCollider.destroy() }
        if (floodObjectsCollider && floodObjectsCollider.active) { floodObjectsCollider.destroy() }
    }
}

function initFloodObjects() {
    let carMoved = false, treeMoved = false
    // Create physics groups
    floodWater = Properties.scene.physics.add.staticGroup()
    floodObjects = Properties.scene.physics.add.group({ allowGravity: false, immovable: true })
    // Create colliders with player
    floodWaterCollider = Properties.scene.physics.add.collider(
        Properties.player,
        floodWater,
        () => Properties.gameOver()
    )
    floodObjectsCollider = Properties.scene.physics.add.collider(
        Properties.player,
        floodObjects,
        (_, object) => {
            // Land
            Properties.landPlayer()
            // Check for object
            if (object.name == CAR_NAME && !carMoved) {
                carMoved = true
                moveObject(object, 350, 3000)
            } else if (object.name == TREE_NAME && !treeMoved) {
                treeMoved = true
                moveObject(object, 240, 2300)
            }
        }
    )
}

function moveObject(object, initialVelocity, duration) {
    object.body.setVelocityX(initialVelocity)
    let tween = Properties.scene.tweens.add({
        targets: object.body.velocity,
        x: 0,
        duration: duration,
        onComplete: function() {
            tween.stop()
        }
    })
}

function processFloodWater(object) {
    // Create sprite
    let water = floodWater.create(object.x, object.y, object.name)
    // Set origin and depth; refresh body
    water.setOrigin(0, 1).setDepth(Constants.DEPTH.important).refreshBody()
    // Set body size and offset
    let heightPercent = 0.2
    water.body.setSize(water.width, water.height * heightPercent)
    water.body.setOffset(0, water.height * (1 - heightPercent))
    // Play animation
    water.anims.play('6-water')
}

function processWaterCar(car) {
    processWaterObject(car)
    let heightPercent = 0.5
    car.body.setSize(car.width, car.height * heightPercent)
    car.body.setOffset(0, car.height * (1 - heightPercent))
}

function processWaterTree(tree) {
    processWaterObject(tree)
    let heightPercent = 0.47
    tree.body.setSize(tree.width, tree.height * heightPercent)
    tree.body.setOffset(0, tree.height * (1 - heightPercent))
}

function processWaterObject(sprite) {
    // Add to the group
    floodObjects.add(sprite)
    // Friction
    sprite.body.setFriction(1)
}

function addTrump(x, y) {
    // Save sprite
    trump = Properties.scene.physics.add.sprite(x, y, '6-trump-run')
    trump.anims.play('6-trump-run')
    processPresident(trump)
}

function addBiden(x, y) {
    // Save sprite
    biden = Properties.scene.physics.add.sprite(x, y, '6-biden-run')
    biden.anims.play('6-biden-run')
    processPresident(biden)
}

function processPresident(sprite) {
    // Update origin
    sprite.setOrigin(0, 1).setDepth(Constants.DEPTH.foregroundMain)
    // Make immovable and no gravity
    sprite.body.setImmovable(true)
    sprite.body.setAllowGravity(false)
}

function addFinishOverlap() {
    // Add physics
    Properties.scene.physics.add.existing(finish, true)
    // Set overlaps with finish
    let overlapBiden = Properties.scene.physics.add.overlap(biden, finish, () => {
        // Inactivate race
        raceActive = false
        // Wait and stop Biden
        Properties.scene.time.delayedCall(370, () => {
            biden.body.setVelocityX(0)
            biden.anims.play('6-biden-happy')
        })
        // Destroy
        overlapBiden.destroy()
    })
    let overlapTrump = Properties.scene.physics.add.overlap(trump, finish, () => {
        // Wait and stop Trump
        Properties.scene.time.delayedCall(280, () => {
            trump.body.setVelocityX(0)
            trump.anims.play('6-trump-sad')
        })
        // Destroy
        overlapTrump.destroy()
    })
}

function initAnimations() {
    // Flood water
    Properties.scene.anims.create({
        key: '6-water',
        frames: '6-water',
        frameRate: 10,
        repeat: -1
    })
    // Presidents
    // Run
    Properties.scene.anims.create({
        key: '6-biden-run',
        frames: '6-biden-run',
        frameRate: 10,
        repeat: -1
    })
    Properties.scene.anims.create({
        key: '6-trump-run',
        frames: '6-trump-run',
        frameRate: 10,
        repeat: -1
    })
    // Idle
    Properties.scene.anims.create({
        key: '6-biden-idle',
        frames: [
            { key: '6-biden-idle', frame: 0, duration: 100 },
            { key: '6-biden-idle', frame: 1, duration: 600 },
            { key: '6-biden-idle', frame: 2, duration: 100 },
            { key: '6-biden-idle', frame: 3, duration: 100 },
        ],
        repeat: -1
    })
    Properties.scene.anims.create({
        key: '6-trump-idle',
        frames: [
            { key: '6-trump-idle', frame: 0, duration: 100 },
            { key: '6-trump-idle', frame: 1, duration: 600 },
            { key: '6-trump-idle', frame: 2, duration: 100 },
            { key: '6-trump-idle', frame: 3, duration: 100 },
        ],
        repeat: -1
    })
    // Final
    Properties.scene.anims.create({
        key: '6-biden-happy',
        frames: [
            { key: '6-biden-happy', frame: 0, duration: 600 },
            { key: '6-biden-happy', frame: 1, duration: 100 },
            { key: '6-biden-happy', frame: 2, duration: 100 },
            { key: '6-biden-happy', frame: 3, duration: 100 },
        ],
        repeat: -1
    })
    Properties.scene.anims.create({
        key: '6-trump-sad',
        frames: [
            { key: '6-trump-sad', frame: 0, duration: 600 },
            { key: '6-trump-sad', frame: 1, duration: 100 },
            { key: '6-trump-sad', frame: 2, duration: 100 },
            { key: '6-trump-sad', frame: 3, duration: 100 },
        ],
        repeat: -1
    })
}
