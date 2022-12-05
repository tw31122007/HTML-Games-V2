import AudioManager from '../audio.js'
import Constants from '../constants.js'
import Properties from '../properties.js'
import {
    addBounceTween, clearScene, fadeInOut,
    fadeInOutTitle, processCorona, processMask
} from '../helpers.js'

// Additional processing of sprites from tilemap
const PROCESSING_NAME = {
    'c-mask': processMask,
    'c-corona': processCorona,
    // Cart
    '2-cart': updateCartBody,
    // Collecting products
    '2-banana': addToProductsGroup,
    '2-bread': addToProductsGroup,
    '2-bottle': addToProductsGroup,
    '2-milk': addToProductsGroup,
    '2-toilet': addToProductsGroup
}
const PROCESSING_TYPE = {
    // Update people body
    'person': addPersonBody,
    'person-cart': addCartPersonBody
}
// Flipped sprite IDs
const FLIP_IDS = [138, 148]

// Products physics group
let productsGroup, productsTween, productsCollider

export default {
    preloadLevel: function() {
        // Init products group
        initProductsGroup()
        // Load sprites for Level 2
        Properties.map.getObjectLayer('level2').objects.forEach(object => {
            // Add sprite
            let sprite = Properties.addMapImage(object)
            // Post processing by name
            if (object.name in PROCESSING_NAME) {
                PROCESSING_NAME[object.name](sprite)
            }
            // Post processing by type
            if (object.type in PROCESSING_TYPE) {
                PROCESSING_TYPE[object.type](sprite)
            }
            // Set flip for the cart and person
            if (FLIP_IDS.includes(object.id)) {
                sprite.setFlip(true)
            }
        })
        // Add products tween
        productsTween = addBounceTween(productsGroup.getChildren())
        // Init sounds
        AudioManager.base.bat = Properties.scene.sound.add('bat', { loop: true, volume: 0.5 })
    },
    checkpoint3: function() {
        // Update checkpoint
        Properties.checkpoint = 3
        // Clear passed objects
        clearScene()
        // Destroy Australia tracks
        AudioManager.fadeOut('hell', 1000, () => AudioManager.destroy('hell'))
        // Start first main theme
        AudioManager.setMain('short')
        AudioManager.fadeIn(AudioManager.currentMain, Constants.VOLUME.main)
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'CHECKPOINT_3')
    },
    addFlyingBat: function() {
        // Show title
        fadeInOutTitle('COVID 19')
        // Create animation
        let anim = Properties.scene.anims.create({
            key: '2-bat',
            frames: '2-bat',
            frameRate: 10,
            repeat: -1
        })
        // Add bat
        let offsetX = 100, posY = Properties.sceneSize.height * 0.4
        let startX = Properties.player.x + Properties.sceneSize.width * 0.6 + offsetX
        let endX = startX - Properties.sceneSize.width - 2 * offsetX
        let bat = Properties.scene.add.sprite(startX, posY, '2-bat')
        // Animation
        bat.anims.play('2-bat')
        AudioManager.play('bat')
        Properties.scene.time.delayedCall(3000, () => AudioManager.fadeOut('bat'))
        // Tween
        let tween = Properties.scene.tweens.add({
            targets: bat,
            x: endX,
            duration: Constants.DURATION.bat,
            onComplete: () => {
                // Destroy bat and animation, stop tween
                bat.destroy()
                anim.destroy()
                tween.stop()
                AudioManager.destroy('bat')
            }
        })
    },
    showQuarantineTitle: function() {
        // Text params
        let offsetY = 192
        let posX = Properties.sceneSize.width / 2, posY = Properties.foregroundY() - offsetY
        // Create, set origin and no camera scroll
        let achievement = Properties.scene.add.image(posX, posY, '2-quarantine-ready')
        achievement.setOrigin(0.5, 1).setScrollFactor(0)
        // Fade in and out
        let duration = 100, delay = 2000
        fadeInOut(achievement, duration, delay, () => {
            achievement.destroy()
        })
    },
    clear: function() {
        // Stop tween
        if (productsTween) { productsTween.stop() }
        // Destroy products group and collider
        if (productsGroup && productsGroup.active) { productsGroup.destroy(true) }
        if (productsCollider && productsCollider.active) { productsCollider.destroy() }
    }
}

function initProductsGroup() {
    productsGroup = Properties.scene.physics.add.group({ allowGravity: false })
    // Add overlap with player
    productsCollider = Properties.scene.physics.add.overlap(Properties.player, productsGroup, (_, p) => {
        // Destroy product
        p.destroy()
    })
}

function updateCartBody(cart) {
    cart.body.setOffset(0, cart.height * 0.1)
}

function addPersonBody(person) {
    // Set physics
    Properties.scene.physics.add.existing(person, true)
    // Update body
    person.body.setSize(person.width * 0.6)
    person.body.setOffset(person.width * 0.2, person.height * 0.05)
    // Add to the groud group
    Properties.groundGroup.add(person)
}

function addCartPersonBody(personWithCart) {
    // Set physics
    Properties.scene.physics.add.existing(personWithCart, true)
    // Update body
    personWithCart.body.setSize(personWithCart.width * 0.4)
    personWithCart.body.setOffset(personWithCart.width * 0.2, personWithCart.height * 0.05)
    // Add to the groud group
    Properties.groundGroup.add(personWithCart)
}

function addToProductsGroup(sprite) {
    // Add to group
    productsGroup.add(sprite)
    // Update body
    let percent = 0.6
    sprite.body.setSize(sprite.height * percent, sprite.width * percent)
}
