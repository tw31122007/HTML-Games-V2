import AudioManager from '../audio.js'
import Constants from '../constants.js'
import Properties from '../properties.js'
import { getText, lang } from '../translate.js'
import { clearScene, fadeInOutTitle, fadeOut } from '../helpers.js'

// Forest images ID to be replaced
const FOREST_IMAGE_IDS = [88, 96, 90]
const FOREST_SPRITES = [undefined, undefined, undefined]
// Additional processing of sprites from tilemap
const PROCESSING = {
    '1-tree-cut2': saveFallingTree,
    '1-tree3': updateTreeBody
}
// Animations
const ANIMATIONS = ['1-fire1', '1-fire2', '1-fire3']

// Fire physics group and collider
let fireGroup, fireCollider
// Falling tree sprite
let fallingTree

export default {
    preloadLevel: function() {
        // Init fire group
        initFireGroup()
        // Create fire animations
        initFireAnimations()
        // Load map images for Level 1
        Properties.map.getObjectLayer('level1').objects.forEach(object => {
            let sprite
            switch (object.type) {
                case 'fire':
                    // Add fire objects
                    sprite = addFire(object)
                    break

                default:
                    // Add image
                    sprite = Properties.addMapImage(object)
                    break
            }
            // Post processing
            if (object.name in PROCESSING) {
                PROCESSING[object.name](sprite)
            }
            // Save needed images
            if (FOREST_IMAGE_IDS.includes(object.id)) {
                FOREST_SPRITES[FOREST_IMAGE_IDS.indexOf(object.id)] = sprite
            }
        })
        // Hide fire group
        fireGroup.setAlpha(0)
        // Init Australia theme
        AudioManager.base.hell = Properties.scene.sound.add('hell', { loop: true })
        AudioManager.base.koala = Properties.scene.sound.add('koala', { loop: false, volume: 0.3 })
        AudioManager.base['tree-falls'] = Properties.scene.sound.add('tree-falls', { loop: false, volume: 0.3 })
    },
    checkpoint1: function() {
        // Update checkpoint
        Properties.checkpoint = 1
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'CHECKPOINT_1')
    },
    showTitle: function() {
        fadeInOutTitle(getText('australia'))
    },
    checkpoint2: function() {
        // Update checkpoint
        Properties.checkpoint = 2
        // Clear passed objects
        clearScene()
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'CHECKPOINT_2')
    },
    startWildfires: function() {
        // Get control
        Properties.takeControl()
        // Destroy intro music
        AudioManager.fadeOut('intro', 100, () => AudioManager.destroy('intro'))
        // Set text and size
        Properties.titleText[0].setText(`${lang === 'es' ? '¡' : ''}2020!`)
        Properties.titleText[0].setFontSize(84)
        // Show text
        Properties.titleText[0].alpha = 1
        // Wait and continue
        Properties.scene.time.delayedCall(1500, () => {
            // Update text
            Properties.titleText[0].setText(getText('survive'))
            // Update forest background
            FOREST_SPRITES[0].setTexture('1-forest-fire1')
            FOREST_SPRITES[1].setTexture('1-forest-fire2')
            FOREST_SPRITES[2].setTexture('1-forest-fire1')
            // Show fire
            fireGroup.setAlpha(1)
            // Set collision with fire – game over
            fireCollider = Properties.scene.physics.add.collider(
                Properties.player,
                fireGroup,
                () => Properties.gameOver()
            )
            // Play hell music
            AudioManager.fadeIn('hell', Constants.VOLUME.hell, 0)
            // Start playing
            Properties.giveControl()
            // Wait and fade out
            Properties.scene.time.delayedCall(1500, () => fadeOut(Properties.titleText[0], 100))
        })
    },
    treeFalls: function() {
        AudioManager.play('koala')
        // Take control
        Properties.takeControl()
        // Wait a bit after koala shouts
        Properties.scene.time.delayedCall(300, () => {
            // Wait and add falling tree sound
            Properties.scene.time.delayedCall(800, () => AudioManager.play('tree-falls'))
            // Tree falls => rotate by 90 degree
            let angle = 90
            // Add falling tween
            let tween = Properties.scene.tweens.add({
                targets: fallingTree,
                x: { value: '+=32', ease: 'Expo.easeIn' },
                y: { value: '+=48', ease: 'Expo.easeIn' },
                angle: { value: angle, ease: 'Cubic.easeIn' },
                duration: Constants.DURATION.treeFalls,
                onComplete: () => {
                    // Position accorging to rotated tree (and koala)
                    let x = fallingTree.x + fallingTree.height / 2
                    let y = fallingTree.y - fallingTree.width * (fallingTree.originX - 1 / 2)
                    // Create
                    let tree = Properties.scene.physics.add.staticImage(x, y, '1-tree-cut3')
                    // Add to the ground group
                    Properties.groundGroup.add(tree)
                    // Set body size
                    tree.setBodySize(tree.width * 0.95, tree.height * 0.18)
                    // Add leaves in the front
                    let posX = x + fallingTree.height / 2, posY = y + fallingTree.width / 2
                    let leaves = Properties.scene.add.image(posX, posY, '1-tree-cut3-leaves')
                    leaves.setOrigin(1, 1).setDepth(Constants.DEPTH.important)
                    // Destroy previous tree
                    fallingTree.destroy()
                    // Add koala
                    addKoala()
                    // Return control
                    Properties.giveControl()
                    // Stop tween
                    tween.stop()
                }
            })
        })

    },
    koalaJumps: function() {
        if (Properties.playerState.withKoala) {
            // Positions
            let offsetY = -30
            let posX = Properties.player.x, posY = Properties.foregroundY() + offsetY
            // Create
            let koala = Properties.scene.add.image(posX, posY, '1-koala')
            // Origin
            koala.setOrigin(0, 1)
            // Update player state
            Properties.playerState.withKoala = false
        }
    },
    clear: function() {
        // Destroy fire group and collider
        if (fireGroup && fireGroup.active) { fireGroup.destroy(true) }
        if (fireCollider && fireCollider.active) { fireCollider.destroy() }
    }
}

function initFireGroup() {
    // Define fire group
    fireGroup = Properties.scene.physics.add.group({ allowGravity: false })
}

function initFireAnimations() {
    // Small, medium and big fire animations
    for (const texture of ANIMATIONS) {
        Properties.scene.anims.create({
            key: texture,
            frames: texture,
            frameRate: 10,
            repeat: -1
        })
    }
}

function saveFallingTree(tree) {
    // Save to variable
    fallingTree = tree
    // Update origin origin for rotating
    let xOrigin = 10 / 18
    fallingTree.setOrigin(xOrigin, 1)
    // Fix position
    fallingTree.x += xOrigin * fallingTree.width
}

function updateTreeBody(tree) {
    // Flip tree
    tree.setFlip(true)
    // Physics body height from tree height
    let bodyPercent = 0.35
    // Set new body and make offset for it
    tree.setBodySize(tree.width, tree.height * bodyPercent, false)
    tree.setOffset(0, tree.height * (1 - bodyPercent))
}

function addFire(object) {
    // Create fire
    let fire = fireGroup.create(object.x, object.y, object.name)
    // Update origin
    fire.setOrigin(0, 1)
    // Run fire animation
    fire.play(object.name)
    // Width and height for physics body
    let widthPercent = 0.25, heightPercent = 0.1
    // Update physics body and offset
    fire.setBodySize(fire.width * widthPercent, fire.height * heightPercent)
    fire.setOffset(fire.width * (1 - widthPercent) / 2, fire.height * (1 - heightPercent))
    // Set depth – foreground important
    return fire.setDepth(Constants.DEPTH.important)
}

function addKoala() {
    // Define offset from the falling tree position
    let offsetX = 180, offsetY = -62
    // Define position
    let posX = fallingTree.x + offsetX, posY = fallingTree.y + offsetY
    // Create static object
    let koala = Properties.scene.physics.add.staticImage(posX, posY, '1-koala')
    // Set collider
    let collider = Properties.scene.physics.add.collider(Properties.player, koala, () => {
        // Get koala
        Properties.playerState.withKoala = true
        // Remove koala
        koala.destroy()
        // Remove collider
        collider.destroy()
    })
}
