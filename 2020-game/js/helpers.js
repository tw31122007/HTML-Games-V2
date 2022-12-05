import Constants from './constants.js'
import Properties from './properties.js'
import { getText, lang } from './translate.js'

let controls = document.getElementById('controls')

export function showControls() {
    controls.style.display = 'flex'
}

export function hideControls() {
    controls.style.display = 'none'
}

function playerSpritePostfix() {
    if (Properties.playerState.withMask) { return '-mask' }
    else if (Properties.playerState.withKoala) { return '-koala' }
    return ''
}

export function playerSpriteRun() {
    Properties.player.anims.play('run' + playerSpritePostfix(), true)
}

export function playerSpriteStand() {
    Properties.player.anims.play('idle' + playerSpritePostfix(), true)
}

export function playerSpriteJump() {
    Properties.player.anims.play('jump' + playerSpritePostfix())
}

export function addBounceTween(object) {
    return Properties.scene.tweens.add({
        targets: object,
        duration: 800,
        y: '-=5',
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    })
}

export function fadeInOutTitle(text, duration = null, delay = null) {
    // Duration and delay
    duration = duration === null ? 600 : duration
    delay = delay === null ? 1500 : delay
    // Set font size
    Properties.titleText[0].setFontSize(Constants.TITLE_FONT_SIZE)
    Properties.titleText[1].setFontSize(Constants.TITLE_FONT_SIZE)
    // Update text
    if (Array.isArray(text)) {
        Properties.titleText[0].setText(text[0])
        Properties.titleText[1].setText(text[1])
        // Fade in and out
        fadeInOut(Properties.titleText[0], duration, delay)
        fadeInOut(Properties.titleText[1], duration, delay)
    } else {
        Properties.titleText[0].setText(text)
        Properties.titleText[1].setText('')
        // Fade in and out
        fadeInOut(Properties.titleText[0], duration, delay)
    }
}

export function fadeInOut(target, duration, delay, onComplete = null) {
    // Fade in
    fadeIn(target, duration, function() {
        // Wait and fade out
        Properties.scene.time.delayedCall(delay, () => fadeOut(target, duration, onComplete))
    })
}

export function fadeIn(target, duration, onComplete = null) {
    // Reset
    target.alpha = 0
    // Fade in
    return Properties.scene.tweens.add({
        targets: target,
        alpha: 1,
        duration: duration,
        onComplete: onComplete
    })
}

export function fadeOut(target, duration, onComplete = null) {
    // Fade out
    return Properties.scene.tweens.add({
        targets: target,
        alpha: 0,
        duration: duration,
        onComplete: onComplete
    })
}

export function processMask(mask) {
    // Add bounce
    let tween = addBounceTween(mask)
    // Set physics
    Properties.scene.physics.add.existing(mask, true)
    // Add overlap with the player
    let overlap = Properties.scene.physics.add.overlap(Properties.player, mask, () => {
        // Collect
        collectMask(mask)
        // Stop tween
        tween.stop()
        // Destroy overlap
        overlap.destroy()
    })
}

export function processCorona(corona, bounce = true, smallPhysics = true) {
    // Add bounce
    if (bounce) { addBounceTween(corona) }
    // Add to group
    Properties.coronaGroup.add(corona)
    // Make small circle as phsyics
    let radius = corona.width * (smallPhysics ? 0.2 : 0.4)
    let offset = corona.width / 2 - radius
    corona.body.setCircle(radius)
    corona.body.setOffset(offset, offset)
}

export function addGameOverLayer() {
    // Hide title if it is visible
    Properties.titleText[0].alpha = 0
    Properties.titleText[1].alpha = 0
    // Position – center by X and 0.2 from the top by Y
    let posX = Properties.sceneSize.width / 2, posY = Properties.sceneSize.height * 0.2
    // Title, subtitle and play button
    let titleSize = 64, subtitleSize = 38, offset = 24
    let title = Properties.scene.add.bitmapText(0, 0, 'light', getText('gameOver'), titleSize)
    let subtitle = Properties.scene.add.bitmapText(0, titleSize + 2 * offset, 'light', getText('checkpoint'), subtitleSize)
    let play = Properties.scene.add.image(0, subtitle.y + subtitleSize + 2 * offset, 'play')
    // Update origins
    title.setOrigin(0.5, 0.35)
    subtitle.setOrigin(0.5, 0.35)
    play.setOrigin(0.5, 0)
    // Interactions
    play.setInteractive().setScrollFactor(0)
    // Root element
    let container = Properties.scene.add.container(posX, posY, [title, subtitle, play])
    container.setScrollFactor(0).setDepth(Constants.DEPTH.important)
    // Play button handler - restart
    let restartGame = () => {
        container.destroy()
        Properties.scene.scene.restart()
    }
    // Start game as pointer raises
    play.once('pointerup', () => {
        // Remove space events
        Properties.keyboard.space.removeAllListeners()
        restartGame()
    })
    // Start game on space
    Properties.keyboard.space.once('up', () => {
        // Remove play button listeners
        play.removeAllListeners()
        restartGame()
    })
}

export function addGameWinLayer() {
    // Position – center by X and Y
    let posX = Properties.sceneSize.width / 2, posY = Properties.sceneSize.height * 0.1
    // Bordered rect
    let width = lang === 'es' ? 1140 : 1080, height = 472, offsetY = 16
    // Background
    let rect1 = Properties.scene.add.rectangle(0, 0, width + 20, height + 20, 0x4f5479)
    let rect2 = Properties.scene.add.rectangle(0, 10, width, height, 0xe6f7ff)
    // Title text
    let titleSize = 36, titleOffset = 50
    let title1 = Properties.scene.add.bitmapText(0, titleOffset, 'dark', getText('winTitle1'), titleSize)
    let title2 = Properties.scene.add.bitmapText(0, titleOffset + titleSize * 1.3, 'dark', getText('winTitle2'), titleSize)
    // Donate text and button
    let donateY = title2.y + titleSize + 3 * offsetY, donateSize = 24, btnScale = 0.8
    let lines = [getText('winText1'), getText('winText2'), getText('winText3'), getText('winText4'), getText('winText5')]
    let line1 = Properties.scene.add.bitmapText(0, donateY, 'dark', lines[0], donateSize)
    let line2 = Properties.scene.add.bitmapText(0, line1.y + donateSize * 1.45, 'dark', lines[1], donateSize)
    let line3 = Properties.scene.add.bitmapText(0, line2.y + donateSize * 1.45, 'dark', lines[2], donateSize)
    let line4 = Properties.scene.add.bitmapText(0, line3.y + donateSize * 1.45, 'dark', lines[3], donateSize)
    let line5 = Properties.scene.add.bitmapText(0, line4.y + donateSize * 1.45, 'dark', lines[4], donateSize)
    let donateButton = Properties.scene.add.image(0, line5.y + donateSize + 2 * offsetY, 'donate').setScale(btnScale)
    // Combine and update origin
    let items = [rect1, rect2, donateButton]
    let textItems = [title1, title2, line1, line2, line3, line4, line5]
    for (const item of items) { item.setOrigin(0.5, 0) }
    for (const item of textItems) { item.setOrigin(0.5, 0.35) }
    // Interactions
    donateButton.setInteractive().setScrollFactor(0)
    // Root element
    let container = Properties.scene.add.container(posX, posY, items)
    container.add(textItems)
    container.setScrollFactor(0).setDepth(Constants.DEPTH.important * 3)
    // Open donate page as pointer raises
    donateButton.on('pointerup', () => {
        window.open(getText('donateUrl'), '_blank')
        // Yandex.Metrika
        ym(70640851, 'reachGoal', 'DONATE_CLICKED')
    })
    // Yandex.Metrika
    ym(70640851, 'reachGoal', 'DONATE_POPUP')
}

function collectMask(mask) {
    // Mask ON
    Properties.playerState.withMask = true
    // Destroy mask
    mask.destroy()
}

export function catchCorona(corona) {
    // Check if with mask
    if (Properties.playerState.withMask) {
        // Remove mask
        Properties.playerState.withMask = false
        // Remove corona
        corona.destroy()
        // Remove tweens
        Properties.scene.tweens.killTweensOf(corona)
        // Hit player
        hitPlayer()
    } else {
        // Game over
        Properties.gameOver()
    }
}

export function clearScene() {
    if (Constants.DEBUG) {
        console.log('Was:')
        console.log('Children:', Properties.scene.children.length)
        console.log('Colliders:', Properties.scene.physics.world.colliders.length)
        console.log('Tweens:', Properties.scene.tweens.getAllTweens().length)
    }

    clearObjects()
    clearColliders()

    if (Constants.DEBUG) {
        setTimeout(() => {
            console.log('Now:')
            console.log('Children:', Properties.scene.children.length)
            console.log('Colliders:', Properties.scene.physics.world.colliders.length)
            console.log('Tweens:', Properties.scene.tweens.getAllTweens().length)
        }, 100)
    }
}

function hitPlayer() {
    // Disable input
    Properties.inputEnabled = false
    // Throw away player and play fall animation
    Properties.player.setVelocity(-100, -500)
    Properties.player.anims.play('fall')
    // Wait and enable input processing
    Properties.scene.time.delayedCall(500, () => Properties.inputEnabled = true)
}

function clearObjects() {
    // Loop from the end
    let i = Properties.scene.children.length - 1
    while (i >= 0) {
        // Get child
        let child = Properties.scene.children.list[i]
        // Check for image or sprite
        if ((child.type === 'Image' || child.type === 'Sprite') && child.name !== 'info') {
            // Check whether it is passed
            if (child.x + child.width < Properties.camera.scrollX) {
                // Remove child
                child.destroy()
                // Remove all its tweens
                Properties.scene.tweens.killTweensOf(child)
            }
        }
        // Decrement
        i--
    }
}

function clearColliders() {
    // Loop from the end
    let colliders = Properties.scene.physics.world.colliders.getActive()
    let i = colliders.length - 1
    while (i >= 0) {
        // Get objects
        let object1 = colliders[i].object1, object2 = colliders[i].object2
        // Check whether it is active
        if (!(object1 && object1.active && object2 && object2.active)) {
            // Destroy if there is any inactive object
            colliders[i].destroy()
        }
        // Decrement
        i--
    }
}
