import Phaser from 'phaser'

import SpriteState from './SpriteState'
import {LEVEL_COUNT} from '../constants/constants'

export default class PlayState extends SpriteState {
  init (data) {
    this.keys = this.game.input.keyboard.addKeys({
      left: Phaser.KeyCode.LEFT,
      right: Phaser.KeyCode.RIGHT,
      up: Phaser.KeyCode.UP
    })
    this.ringCount = 0
    this.score = 0
    this.level = (data.level || 0) % LEVEL_COUNT
    this.timeCount = 0
    this.bgm = this.game.add.audio('bgm')
    this.bgm.loopFull()
  }

  create () {
  // fade in (from black)
    this.camera.flash('#000000')
    // create sound entities
    this.sfx = {
      jump: this.game.add.audio('sfx:jump'),
      spring: this.game.add.audio('sfx:spring'),
      ring: this.game.add.audio('sfx:ring'),
      pop: this.game.add.audio('sfx:pop'),
      finish: this.game.add.audio('sfx:finish'),
      hurt: this.game.add.audio('sfx:hurt'),
      dead: this.game.add.audio('sfx:dead')
    }

    // create level entities and decoration
    this.game.add.image(0, 0, 'background')
    this.loadLevel(this.game.cache.getJSON(`level:${this.level}`))
    // Start time
    this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTime, this)
    // create UI score boards
    this.createHud()
  }

  updateTime () {
    this.timeCount++
  }

  formatTime () {
    let mins = Math.floor(this.timeCount / 60)
    let secs = this.timeCount % 60
    if (secs < 10) {
      secs = '0' + secs
    }
    let formatted = mins + ':' + secs
    return formatted
  }

  update () {
    this.handleCollisions()
    this.handleInput()
    // update scoreboards
    this.scoreNumber.text = `${this.score}`
    this.ringNumber.text = `${this.ringCount}`
    this.timeNumber.text = `${this.formatTime()}`
  }

  shutdown () {
    this.bgm.stop()
  }

  handleCollisions () {
    this.game.physics.arcade.collide(this.enemies, this.platforms)
    this.game.physics.arcade.collide(this.enemies, this.enemyWalls)
    this.game.physics.arcade.collide(this.hero, this.platforms)
    this.game.physics.arcade.collide(this.hero, this.movingBlocks)
    this.game.physics.arcade.collide(this.movingBlocks, this.platforms)
    this.game.physics.arcade.collide(this.movingBlocks, this.movingBlocks)

    // collision: hero vs enemies (kill or die)
    this.game.physics.arcade.overlap(this.hero, this.enemies,
      this.onHeroVsEnemy, null, this)
    // collision: lava
    this.game.physics.arcade.collide(this.hero, this.lava,
      this.handleDamage, null, this)
    // collision: spring
    this.game.physics.arcade.overlap(this.hero, this.spring,
      this.onHeroVsSpring, null, this)
    // collision: fireball
    this.game.physics.arcade.overlap(this.hero, this.fireball,
      this.handleDamage, null, this)
    // collision: spikes
    this.game.physics.arcade.overlap(this.hero, this.spike,
      this.handleDamage, null, this)
    // collision: rings
    this.game.physics.arcade.overlap(this.hero, this.rings, this.onHeroVsRing,
      null, this)
    // collision: finish
    this.game.physics.arcade.overlap(this.hero, this.finish, this.onHeroVsFinish,
    // ignore if there is no key or the player is on air
      function (hero, finish) {
        return hero.body.touching.down
      }, this)
  }

  handleInput () {
    if (this.keys.left.isDown) { // move hero left
      this.hero.move(-1)
    } else if (this.keys.right.isDown) { // move hero right
      this.hero.move(1)
    } else { // stop
      this.hero.move(0)
    }
    // handle jump
    if (this.keys.up.downDuration(200)) {
      let didJump = this.hero.jump()
      didJump ? this.sfx.jump.play() : this.hero.stopJumpBoost()
    }
  }

  onHeroVsRing (hero, ring) {
    this.sfx.ring.play()
    ring.kill()
    this.ringCount++
  }

  handleDamage (hero) {
    if (this.ringCount === 0 && !hero.invincible) {
      hero.die()
      this.sfx.dead.play()
      hero.events.onKilled.addOnce(() => {
        this.game.state.restart(true, false, {
          level: this.level
        })
      })
    } else if (hero.invincible) {

    } else {
      this.ringCount = 0
      hero.injure()
      this.sfx.hurt.play()
    }
  }

  onHeroVsEnemy (hero, enemy) {
  // the hero can kill enemies when is falling (after a jump, or a fall)
    if (hero.body.velocity.y !== 0) {
      enemy.die()
      hero.bounce()
      this.sfx.pop.play()
      this.score += 100
    } else {
      this.handleDamage(hero)
      // NOTE: bug in phaser in which it modifies 'touching' when
      // checking for overlaps. This undoes that change so enemies don't
      // 'bounce' agains the hero
      enemy.body.touching = enemy.body.wasTouching
    }
  }

  onHeroVsSpring (hero, spring) {
    if (hero.body.velocity.y > 0) {
      spring.animations.play('jump')
      let didJump = this.hero.jump(900)
      if (didJump) {
        this.sfx.spring.play()
      }
    }
  }

  onHeroVsFinish (hero, finish) {
    this.sfx.finish.play()
    finish.animations.play('open')
    // play animation and change to the next level when it ends
    hero.freeze()
    this.game.add.tween(hero)
      .to({
        x: 940,
        alpha: 0
      }, 500, null, true)
      .onComplete.addOnce(this.goToNextLevel, this)
  }

  goToNextLevel () {
    this.camera.fade('#000000')
    this.camera.onFadeComplete.addOnce(function () {
    // change to next level
      this.game.state.restart(true, false, {
        level: this.level + 1,
        score: this.score + 1000
      })
    }, this)
  }

  loadLevel (data) {
  // create all the groups/layers that we need
    this.bgDecoration = this.game.add.group()
    this.rings = this.game.add.group()
    this.enemies = this.game.add.group()
    this.enemyWalls = this.game.add.group()
    this.enemyWalls.visible = false
    this.movingBlocks = this.game.add.group()
    this.fireball = this.game.add.group()
    this.lava = this.game.add.group()
    this.spring = this.game.add.group()
    this.spike = this.game.add.group()
    this.platforms = this.game.add.group()
    this.finish = this.game.add.group()
    // spawn
    this.spawnCharacters({
      hero: data.hero,
      enemies: data.enemies
    })
    data.platforms.forEach(this.spawnPlatform, this)
    data.movingBlocks.forEach(this.spawnMovingBlocks, this)
    data.lava.forEach(this.spawnLava, this)
    data.spring.forEach(this.spawnSpring, this)
    data.rings.forEach(this.spawnRings, this)
    this.spawnSpike({
      spike: data.spike
    })
    this.spawnFireball({
      fireball: data.fireball
    })
    this.spawnFinish({
      finish: data.finish
    })
    data.decoration.forEach(function (deco) {
      this.bgDecoration.add(
        this.game.add.image(deco.x, deco.y, 'decoration', deco.frame))
    }, this)

    // enable gravity
    this.game.physics.arcade.gravity.y = 1200
  }

  createHud () {
    const NUMBERS_STR = '0123456789:'
    const LETTERS_STR = 'SCORINGTME'
    this.scoreText = this.game.add.retroFont('font:letters', 14, 17, LETTERS_STR, 10)
    this.timeText = this.game.add.retroFont('font:letters', 14, 17, LETTERS_STR, 10)
    this.ringText = this.game.add.retroFont('font:letters', 14, 17, LETTERS_STR, 10)
    this.scoreNumber = this.game.add.retroFont('font:numbers', 14, 17, NUMBERS_STR, 11)
    this.timeNumber = this.game.add.retroFont('font:numbers', 14, 17, NUMBERS_STR, 11)
    this.ringNumber = this.game.add.retroFont('font:numbers', 14, 17, NUMBERS_STR, 11)

    this.scoreText.text = `SCORE`
    this.timeText.text = `TIME`
    this.ringText.text = `RINGS`

    let scoreTextImage = this.game.make.image(50, 25, this.scoreText)
    let timeTextImage = this.game.make.image(50, 25, this.timeText)
    let ringsTextImage = this.game.make.image(50, 25, this.ringText)
    let scoreNumberImage = this.game.make.image(50, 25, this.scoreNumber)
    let timeNumberImage = this.game.make.image(50, 25, this.timeNumber)
    let ringsNumberImage = this.game.make.image(50, 25, this.ringNumber)

    this.hud = this.game.add.group()
    this.hud.add(scoreTextImage)
    this.hud.add(timeTextImage)
    this.hud.add(ringsTextImage)
    this.hud.add(scoreNumberImage)
    this.hud.add(timeNumberImage)
    this.hud.add(ringsNumberImage)

    this.hud.position.set(10, 10)
    this.hud.children[0].position.set(20, 20)
    this.hud.children[1].position.set(20, 50)
    this.hud.children[2].position.set(20, 80)
    this.hud.children[3].position.set(140, 20)
    this.hud.children[4].position.set(100, 50)
    this.hud.children[5].position.set(140, 80)
    console.log(this.hud.children[3])
  }
}
