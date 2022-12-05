import Phaser from 'phaser'

export default class Block extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y, 'block')
    this.game.physics.enable(this)
    this.body.collideWorldBounds = true
    this.body.allowGravity = false
    this.body.immovable = true
    this.body.velocity.x = 100
  }
  update () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
      this.body.velocity.x = -100 // turn left
    } else if (this.body.touching.left || this.body.blocked.left) {
      this.body.velocity.x = 100 // turn right
    }
  }
}
