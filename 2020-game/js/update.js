import Constants from './constants.js'
import Properties from './properties.js'
import { checkTimeline } from './timeline.js'
import { playerSpriteJump, playerSpriteRun, playerSpriteStand } from './helpers.js'
// For presidents race
import Level6 from './levels/level6.js'

export function processEachStep() {
    if (Properties.gameIsOver || !Properties.inputEnabled) { return false }

    // Get player
    let player = Properties.player
    // Get scene size
    let size = Properties.sceneSize
    // Moving velocity
    let velocityX = Constants.VELOCITY_X_FROM_HEIGHT * Properties.sceneSize.height

    // Moving right – follow player after the screen center (include camera scroll)
    // Moving left – only until the left border of the screen
    if (Properties.holdsRight()) {
        // Set velocity
        player.setVelocityX(velocityX)
        // Flip sprite back
        player.setFlip(false)
        // Set running animation if not jumping
        if (!Properties.playerState.jumping) {
            playerSpriteRun()
        }
        // Follow camera after the center
        if (player.x - Properties.camera.scrollX >= size.width / 2) {
            Properties.camera.startFollow(player)
            // For Level 6 race
            Level6.runPresidents()
        }
        // Check for timeline events
        checkTimeline()
    } else if (Properties.holdsLeft() && player.x - player.width / 2 > Properties.camera.scrollX) {
        player.setVelocityX(-velocityX)
        // Flip sprite
        player.setFlip(true)
        // Set running animation if not jumping
        if (!Properties.playerState.jumping) {
            playerSpriteRun()
        }
        // Stop follow when player goes left
        Properties.camera.stopFollow()
        // For Level 6 race
        Level6.stopPresidents()
    } else {
        // Reset velocity
        player.setVelocityX(0)
        // Set standing animation if not jummping
        if (!Properties.playerState.jumping) {
            playerSpriteStand()
        }
        // For Level 6 race
        Level6.stopPresidents()
    }

    // Jump if key is down and player is not jumping
    if (Properties.holdsUp() && !Properties.playerState.jumping && Properties.playerStands()) {
        // Jump
        let velocityY = Constants.VELOCITY_Y_FROM_HEIGHT * Properties.player.height
        player.setVelocityY(velocityY)
        // Set jump animation
        playerSpriteJump()
        // Update state
        Properties.playerState.jumping = true
    }
}
