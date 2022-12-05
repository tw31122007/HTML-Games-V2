import Phaser from 'phaser'

export default class Enemy extends Phaser.Sprite {
  constructor (game, x, y, image, gravity) {
    super(game, x, y, image)
    this.anchor.set(0.5)
    this.game.physics.enable(this)
    this.body.collideWorldBounds = true
    this.body.allowGravity = gravity
    this.body.velocity.x = 100
    // animations
    this.animations.add('move', [0, 1, 2], 8, true)
    this.animations.add('die', [3, 3], 6)
    this.animations.play('move')
  }

  update () {
  // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
      this.body.velocity.x = -100 // turn left
      this.scale.x = -1
    } else if (this.body.touching.left || this.body.blocked.left) {
      this.body.velocity.x = 100 // turn right
      this.scale.x = 1
    }
  }

  die () {
    this.body.enable = false
    this.animations.play('die').onComplete.addOnce(() => this.kill())
  }
}
