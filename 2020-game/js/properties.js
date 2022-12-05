import Constants from './constants.js'
import { addGameOverLayer, playerSpriteStand } from './helpers.js'

const PROPERTIES = {
    // Loaded state
    gameIsLoaded: false,
    // Base scene object
    scene: undefined,
    // Tilemap
    map: undefined,
    // Player object
    player: undefined,
    // Main camera
    camera: undefined,
    // Keyboard keys
    keyboard: {
        up: undefined, left: undefined, right: undefined,
        W: undefined, A: undefined, D: undefined, space: undefined
    },
    // Ground physics group
    groundGroup: undefined,
    // Corona physics group
    coronaGroup: undefined,
    // Main title bitmap text
    titleText: [undefined, undefined],
    // Foreground position
    foregroundY: function() {
        return this.sceneSize.height * (1 - Constants.FOREGROUND)
    },
    // How far is current ratio from maximum one
    ratioPercent: function() {
        let ratio = this.sceneSize.width / this.sceneSize.height
        return (Constants.MAX_GAME_RATIO - ratio) / (Constants.MAX_GAME_RATIO - Constants.MIN_GAME_RATIO)
    },
    // Scene size
    sceneSize: { width: 0, height: 0 },
    // Current level
    checkpoint: 0,
    // Player state
    playerState: {
        jumping: true,
        withKoala: false,
        withMask: false
    },
    // Events
    timelineEvents: undefined,
    // Whether input in being processing
    inputEnabled: true,
    // Whether game is over
    gameIsOver: false,
    // Reset
    reset: function() {
        this.gameIsOver = false
        this.inputEnabled = true
        this.playerState.jumping = true
        this.playerState.withKoala = false
        this.playerState.withMask = false
    },
    // Set scene size
    setSceneSize: function() {
        this.sceneSize.width = this.scene.game.canvas.width
        this.sceneSize.height = this.scene.game.canvas.height
    },
    // Touch states
    touches: { left: false, right: false, up: false },
    // Movement states
    holdsRight: function() {
        return this.keyboard.right.isDown || this.keyboard.D.isDown || this.touches.right
    },
    holdsLeft: function() {
        return this.keyboard.left.isDown || this.keyboard.A.isDown || this.touches.left
    },
    holdsUp: function() {
        return this.keyboard.space.isDown || this.keyboard.up.isDown || this.keyboard.W.isDown || this.touches.up
    },
    // Player stands
    playerStands: function() { return this.player.body.onFloor() || this.player.body.touching.down },
    // Collision with ground
    landPlayer: function() {
        if (this.playerState.jumping && this.playerStands()) {
            // Update state to running
            this.playerState.jumping = false
            // Update player animation
            playerSpriteStand()
        }
    },
    // Take control from the player
    takeControl: function() {
        this.inputEnabled = false
        // Stop player
        this.player.setVelocityX(0)
        // Stand animation
        playerSpriteStand()
    },
    // Give control to the player
    giveControl: function() {
        this.inputEnabled = true
    },
    // Add image from map
    addMapImage: function(image) {
        let newImage
        // Check if collision
        if (image.type === Constants.OBJECT_TYPES.static) {
            // Create static image
            newImage = this.scene.physics.add.staticImage(image.x, image.y, image.name)
            // Set origin and refresh body
            newImage.setOrigin(0, 1).refreshBody()
            // Add to the physics group
            this.groundGroup.add(newImage)
            // Set foreground main depth
            newImage.setDepth(Constants.DEPTH.foregroundMain)
        } else {
            newImage = this.scene.add.image(image.x, image.y, image.name)
            // Set origin
            newImage.setOrigin(0, 1)
            // Set depth: background or main secondary
            if (image.type === Constants.OBJECT_TYPES.background) {
                newImage.setDepth(Constants.DEPTH.background)
            } else {
                newImage.setDepth(Constants.DEPTH.foregroundSecondary)
            }
        }
        // Set name
        newImage.setName(image.id)
        // Result
        return newImage
    },
    // Game over
    gameOver: function() {
        // Game Over
        this.gameIsOver = true
        // Stop physics
        this.scene.physics.pause()
        // Remove all tweens
        this.scene.tweens.pauseAll()
        // Stop all timer events
        this.scene.time.removeAllEvents()
        // Remove all sounds
        this.scene.sound.removeAll()
        // Remove animation
        this.player.anims.stop()
        // Add game over layer
        addGameOverLayer()
    }
}

export default PROPERTIES
