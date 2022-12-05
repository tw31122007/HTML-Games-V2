import Phaser from 'phaser'

export default class Spike extends Phaser.Sprite {
  constructor (game, x, y, image) {
    super(game, x, y, image)
    this.anchor.set(0.5)
    this.spikeUp = true
    this.game.physics.enable(this)
    this.body.allowGravity = false
    this.body.immovable = true
    this.game.time.events.loop(1500, this.updateSpike, this)
  }

  updateSpike () {
    if (this.spikeUp) {
      this.position.y -= 30
      this.spikeUp = false
    } else {
      this.position.y += 30
      this.spikeUp = true
    }
  }
}
