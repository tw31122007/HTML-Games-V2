import Hero from '../sprites/Hero'
import Spike from '../sprites/Spike'
import Enemy from '../sprites/Enemy'
import Block from '../sprites/Block'
import Fireball from '../sprites/Fireball'

export default class SpriteState {
  spawnCharacters (data) {
    // spawn enemies
    data.enemies.forEach(function (enemy) {
      let sprite = new Enemy(this.game, enemy.x, enemy.y, enemy.image, enemy.gravity)
      this.enemies.add(sprite)
    }, this)
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y)
    this.game.add.existing(this.hero)
  }

  spawnPlatform (platform) {
    let sprite = this.platforms.create(platform.x, platform.y, platform.image)
    // physics for platform sprites
    this.game.physics.enable(sprite)
    sprite.body.allowGravity = false
    sprite.body.immovable = true
    // spawn invisible walls at each side, only detectable by enemies
    this.spawnEnemyWall(platform.x, platform.y, 'left')
    this.spawnEnemyWall(platform.x + sprite.width, platform.y, 'right')
  }

  spawnMovingBlocks (block) {
    let sprite = new Block(this.game, block.x, block.y)
    this.movingBlocks.add(sprite)
  }

  spawnLava (lava) {
    let sprite = this.lava.create(lava.x, lava.y, lava.image)
    this.game.physics.enable(sprite)
    sprite.body.allowGravity = false
    sprite.body.immovable = true
    // animations
    sprite.animations.add('flow', [0, 1, 2], 6, true)
    sprite.animations.play('flow')
  }

  spawnFireball (data) {
    data.fireball.forEach(function (ball) {
      let sprite = new Fireball(this.game, ball.x, ball.y, ball.height, ball.velocity)
      this.fireball.add(sprite)
    }, this)
  }

  spawnSpike (data) {
    data.spike.forEach(function (s) {
      let sprite = new Spike(this.game, s.x, s.y, s.image)
      this.spike.add(sprite)
    }, this)
  }

  spawnEnemyWall (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall')
    // anchor and y displacement
    sprite.anchor.set(side === 'left' ? 1 : 0, 1)
    this.game.physics.enable(sprite)
    sprite.body.immovable = true
    sprite.body.allowGravity = false
  }

  spawnRings (ring) {
    let sprite = this.rings.create(ring.x, ring.y, 'ring')
    sprite.anchor.set(0.5, 0.5)
    this.game.physics.enable(sprite)
    sprite.body.allowGravity = false
    // animations
    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true)
    sprite.animations.play('rotate')
  }

  spawnFinish (data) {
    let sprite = this.finish.create(data.finish.x, data.finish.y, 'finish')
    this.game.physics.enable(sprite)
    sprite.anchor.setTo(0.5, 1)
    sprite.body.allowGravity = false
    sprite.animations.add('open', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
  }

  spawnSpring (spring) {
    let sprite = this.spring.create(spring.x, spring.y, 'spring')
    this.game.physics.enable(sprite)
    sprite.body.allowGravity = false
    sprite.animations.add('jump', [0, 1, 0], 12)
  }
}
