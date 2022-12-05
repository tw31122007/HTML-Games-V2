import AudioManager from '../audio.js'
import Constants from '../constants.js'
import Properties from '../properties.js'
import { getText } from '../translate.js'
import { clearScene, fadeInOutTitle, processCorona, processMask } from '../helpers.js'

// Additional processing of sprites from tilemap
const PROCESSING = {
    'c-mask': processMask,
    'c-corona': processCorona,
    'c-bush': bush => bush.setDepth(Constants.DEPTH.foregroundMain),
    '3-closed': rotateClosed,
    '3-home': processHome,
    '3-home-wall1': processHomeWall,
    '3-home-wall2': processHomeWall,
    '3-toilet': processToiletItem,
    '3-book1': processToiletItem,
    '3-book2': processToiletItem,
    '3-book3': processToiletItem
}
// Acceleration for falling stocks
const STOCK_ACCELERATION = 300

// Home walls
let homeWalls
// Array for toilet papers
let toiletItems

export default {
    preloadLevel: function() {
        // Clear toilet and home walls
        homeWalls = []
        toiletItems = []
        // Load sprites for Level 3
        Properties.map.getObjectLayer('level3').objects.forEach(object => {
            // Add sprite
            let sprite = Properties.addMapImage(object)
            // Post processing
            if (object.name in PROCESSING) {
                PROCESSING[object.name](sprite)
            }
        })
        // Init animations
        initStockAnimations()
        // Init quarantine clock sound
        AudioManager.base.clock = Properties.scene.sound.add('clock', { loop: false, volume: 0.8 })
    },
    checkpoint4: function() {
        // Update checkpoint
        Properties.checkpoint = 4
        // Drive theme
        AudioManager.setMain('full')
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'CHECKPOINT_4')
    },
    checkpoint5: function() {
        // Update checkpoint
        Properties.checkpoint = 5
        // Clear passed objects
        clearScene()
        // Drive theme
        AudioManager.setMain('full')
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'CHECKPOINT_5')
    },
    showTitle: function() {
        // Show title
        fadeInOutTitle([getText('stockMarketCrash1'), getText('stockMarketCrash2')], null, 2000)
    },
    // Stocks
    stockGoogle: function() { addStock('3-stock-google', '-33%', 800) },
    stockAmazon: function() { addStock('3-stock-amazon', '-28%', 1000) },
    stockMicrosoft: function() { addStock('3-stock-microsoft', '-45%', 400) },
    stockFacebook: function() { addStock('3-stock-facebook', '-21%', 700) },
    stockApple: function() { addStock('3-stock-apple', '-38%', 800) },
    checkpoint6: function() {
        // Update checkpoint
        Properties.checkpoint = 6
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'CHECKPOINT_6')
    },
    startQuarantine: function() {
        // Duration and toilet interval
        let intervalDuration = Constants.DURATION.quarantine / toiletItems.length
        // Show title
        fadeInOutTitle(getText('quarantine'), null, Constants.DURATION.quarantine)
        // Stop drive sound
        AudioManager.stop(AudioManager.currentMain)
        // Play clock sound
        AudioManager.play('clock')
        // Enable walls
        homeWalls.forEach(wall => wall.body.enable = true)
        // Set interval for quarantine and toilet papers
        let interval = Properties.scene.time.addEvent({
            delay: intervalDuration,
            loop: true,
            callback: () => {
                if (!toiletItems.length) {
                    // Remove interval
                    interval.remove()
                    // Destroy walls
                    homeWalls.forEach(wall => wall.body.enable = false)
                    // Stop clock
                    AudioManager.stop('clock')
                } else {
                    // Remove toilet and destroy
                    let toilet = toiletItems.pop()
                    toilet.destroy()
                }
            }
        })
    },
    resumeMusic: function() {
        // Resume drive theme
        AudioManager.setMain('beats')
        // Destroy clock one
        AudioManager.destroy('clock')
    }
}

function initStockAnimations() {
    // Fire
    Properties.scene.anims.create({
        key: '3-stock-fire',
        frames: '3-stock-fire',
        frameRate: 10,
        repeat: -1
    })
    // Sparks
    Properties.scene.anims.create({
        key: '3-stock-sparks',
        frames: '3-stock-sparks',
        frameRate: 10,
        hideOnComplete: true
    })
}

function addStock(name, percentText, offsetX) {
    // Position
    let posX = Properties.player.x + offsetX, posY = -100
    let borderWidth = 4
    // Stock image
    let stock = Properties.scene.add.image(0, 0, name)
    // Stock fire sprite
    let stockFire = Properties.scene.add.sprite(0, stock.height / 2 + borderWidth)
    stockFire.setOrigin(0.5, 1)
    stockFire.anims.play('3-stock-fire')
    // Stock sparks sprite
    let stockSparks = Properties.scene.add.sprite(0, stock.height / 2 + borderWidth)
    stockSparks.setOrigin(0.5, 1)
    stockSparks.alpha = 0
    // Stock percent text
    let stockText = Properties.scene.add.bitmapText(0, -30, 'stock', percentText, 32)
    stockText.setOrigin(0.5, 1)
    // Create container
    let stockContainer = Properties.scene.add.container(posX, posY, [stock, stockFire, stockSparks, stockText])
    // Set depth
    stockContainer.setDepth(Constants.DEPTH.important)
    // Add physics
    Properties.scene.physics.add.existing(stockContainer)
    // Set size and offset
    stockContainer.body.setSize(stock.width, stock.height)
    stockContainer.body.setOffset(-stock.width / 2, -stock.height / 2)
    // Disable gravity and make immovable by other objects
    stockContainer.body.setImmovable(true)
    stockContainer.body.setAllowGravity(false)
    // Set acceleration and bounce
    stockContainer.body.setAcceleration(0, STOCK_ACCELERATION)
    stockContainer.body.setBounce(0.1)
    // Add collider with player
    let playerCollider = Properties.scene.physics.add.collider(Properties.player, stockContainer, () => {
        // Game over only if player touches it with upper side
        if (Properties.player.body.touching.up) {
            Properties.gameOver()
        }
    })
    // Add collider with ground
    let foreground = Properties.map.getLayer('foreground').tilemapLayer
    // Collided state
    let fallen = false
    let collider = Properties.scene.physics.add.collider(foreground, stockContainer, () => {
        if (!fallen) {
            // Update state
            fallen = true
            // Remove fire from container and destroy
            stockContainer.remove(stockFire, true)
            stockContainer.remove(stockText, true)
            // Show sparks
            stockSparks.alpha = 1
            stockSparks.anims.play('3-stock-sparks')
        } else {
            // Destroy current collider
            collider.destroy()
            // Remove collider with player
            playerCollider.destroy()
            // Remove sparks from container and destroy
            stockContainer.remove(stockSparks, true)
            // Remove stock and destroy
            stockContainer.remove(stock)
            stockContainer.destroy()
            // Add stock as a separate object
            Properties.scene.add.existing(stock)
            stock.x = stockContainer.x
            stock.y = stockContainer.y
            // Physics
            Properties.scene.physics.add.existing(stock, true)
            // Add to the ground group
            Properties.groundGroup.add(stock)
        }
    })
}

function rotateClosed(sprite) {
    // Update origin
    sprite.setOrigin(0.5, 0.5)
    // Shift
    sprite.x += sprite.width / 2
    sprite.y -= sprite.height / 2
    // Set rotation
    sprite.setRotation(Math.PI / 8)
}

function processHome(home) {
    // Set depth
    home.setDepth(Constants.DEPTH.foregroundMain)
}

function processHomeWall(wall) {
    // Set depth
    wall.setDepth(Constants.DEPTH.important)
    // Disable physics
    wall.body.enable = false
    // Add to array
    homeWalls.push(wall)
}

function processToiletItem(toiletItem) {
    // Set depth
    toiletItem.setDepth(Constants.DEPTH.foregroundMain)
    // Add to array
    toiletItems.push(toiletItem)
}
