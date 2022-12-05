import Phaser from 'phaser'

export default class Fireball extends Phaser.Sprite {
  constructor (game, x, y, height, velocity) {
    super(game, x, y, 'fireball')
    this.anchor.set(0.5)
    this.maxHeight = y
    this.minHeight = y - height
    this.startVelocity = velocity
    this.game.physics.enable(this)
    this.body.allowGravity = false
    this.body.immovable = true
    this.body.collideWorldBounds = true
    this.body.velocity.y = velocity
    // animations
    this.animations.add('fire', [0])
    this.animations.play('fire')
  }

  update () {
    if (this.y < this.minHeight) {
      this.body.velocity.y = Math.abs(this.startVelocity)
      this.scale.y = -1
    } else if (this.y > this.maxHeight) {
      this.body.velocity.y = -this.startVelocity
      this.scale.y = 1
    }
  }
}
