const levels = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'final'];
let level = 'intro'; // Trick to transition from opening cutscene to first level.
let gamepad = {};
let inputMethod = ''; // Will be 'keyboard' or 'gamepad'.

// Global tracking of player stats.
let levelNum = 0;
let secondsChilled = 0;
let flowersPicked = 0;
let znakesKilled = 0;
let deathCount = 0;
let gorgeStreak = 0;

const randomIntBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomArrayElement = arr => arr[Math.floor(Math.random() * arr.length)];
const mapFrames = (key, frames) => frames.map(frame => ({key, frame}));

// Reset controls so they do not get stuck.
const resetControls = () => {
  if (game.levelScene && game.levelScene.keys) {
    game.levelScene.keys.up.isDown = false;
    game.levelScene.keys.down.isDown = false;
    game.levelScene.keys.left.isDown = false;
    game.levelScene.keys.right.isDown = false;
    game.levelScene.keys.jump.isDown = false;
    game.levelScene.keys.chill.isDown = false;
  };

  if (gamepad.buttons) {
    gamepad.buttons.forEach(b => b.pressed = false);
  }
};

const setLetter = (sprite, letter) => {
  // Since itch.io does not support quote symbols, using { and } for opening and closing quotes.
  const map = {
    ' ': 0, '!': 1, '{': 2, '}': 3, '@': 4, '&': 6, '\'': 7, '(': 8, ')': 9, '+': 11,
    ',': 12, '-': 13, '.': 14, ':': 26, ';': 27, '<': 28, '>': 29, '?': 31,
    '0': 16, '1': 17, '2': 18, '3': 19, '4': 20, '5': 21, '6': 22, '7': 23, '8': 24, '9': 25,
    A: 33, B: 34, C: 35, D: 36, E: 37, F: 38, G: 39, H: 40,
    I: 41, J: 42, K: 43, L: 44, M: 45, N: 46, O: 47, P: 48,
    Q: 49, R: 50, S: 51, T: 52, U: 53, V: 54, W: 55, X: 56,
    Y: 57, Z: 58,
    a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72,
    i: 73, j: 74, k: 75, l: 76, m: 77, n: 78, o: 79, p: 80,
    q: 81, r: 82, s: 83, t: 84, u: 85, v: 86, w: 87, x: 88,
    y: 89, z: 90, '<': 91, '>': 92
  };

  sprite.setFrame(map[letter] || 0);
};

const buildStats = (scene) => {
  const stats = game.plr ? [
    {text: 'LEVEL', icon: 'chain', value: levelNum},
    {text: 'SECONDS CHILLED', icon: 'snowflake', value: secondsChilled},
    // Flower and znake counts for each level reset if player dies.
    {text: 'FLOWERS PICKED', icon: 'flower', value: flowersPicked + game.plr.flowers},
    {text: 'ZNAKES KILLED', icon: 'z', value: znakesKilled + game.plr.znakes},
    {text: 'DEATHS', icon: 'heart', value: deathCount},
    {text: 'GORGE STREAK', icon: 'rock', value: Math.max(game.plr.gorges, gorgeStreak)},
  ] : [];

  stats.forEach((stat, i) => {
    const top = 88;
    const left = 64;
    const right = 64;

    // Display stat description.
    stat.text.split('').forEach((char, col) => {
      setLetter(scene.add.sprite(left + col * 8, top + i * 16, 'typeface'), char);
    });

    // Display stat.
    const statStr = (stat.value + '');
    statStr.split('').forEach((char, col) => {
      setLetter(scene.add.sprite((256 - right) + col * 8, top + i * 16, 'typeface'), char);
    });

    // Display stat icon.
    scene.add.image((256 - right) + statStr.length * 8, top + i * 16, `icon-${stat.icon}`);
  });
};

const intro = {
  paragraphs: [
    {
      text: `a young dreamer chills on a sofa, awaiting the start of their favorite cartoon.`,
      method(sprites) {
        this.anims.create({
          key: 'fade',
          frames: this.anims.generateFrameNumbers('frame-bg', { start: 0, end: 4 }),
          frameRate: 1,
        });

        this.anims.create({
          key: 'sparkle',
          frames: mapFrames('eyes', [0, 1, 2, 1]),
          frameRate: 10,
          repeat: -1
        });

        this.anims.create({
          key: 'glaze',
          frames: mapFrames('eyes', [0, 1, 2]),
          frameRate: 10,
        });

        this.anims.create({
          key: 'bored',
          frames: mapFrames('mouth', [0, 1, 2]),
          frameRate: 2,
        });

        this.anims.create({
          key: 'close',
          frames: mapFrames('eyes', [4,5,5,5,4,4,4,5,6,7]),
          frameRate: 5,
        });

        this.anims.create({
          key: 'half-blink',
          frames: mapFrames('eyes', [4, 5, 4]),
          frameRate: 5,
        });

        this.anims.create({
          key: 'slacken',
          frames: this.anims.generateFrameNumbers('mouth', { start: 2, end: 4 }),
          frameRate: 5,
        });

        this.anims.create({
          key: 'scan',
          frames: this.anims.generateFrameNumbers('tv-screen', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1,
        });

        sprites.stars.visible = false;
        sprites.sofaBack.visible = false;
        sprites.tv.visible = false;
        sprites.tvScreen.visible = false;

        sprites.eyes.anims.play('sparkle');

        // Set up parallax motion.
        sprites.sofa.target = 147;
        sprites.sofa.speed = 0.2;
        sprites.dreamer.target = 156;
        sprites.dreamer.speed = 0.4;
        sprites.eyes.target = 145;
        sprites.eyes.speed = 0.4;
        sprites.mouth.target = 143;
        sprites.mouth.speed = 0.4;
      }
    },
    {
      text: `each episode is a tale of wonder & adventure in a strange new place,`,
      method(sprites) {
        sprites.eyes.visible = false;
        sprites.mouth.visible = false;
        sprites.dreamer.visible = false;
        sprites.sofa.visible = false;

        sprites.sofaBack.visible = true;
        sprites.tv.visible = true;
        sprites.tvScreen.visible = true;

        sprites.tvScreen.anims.play('scan');

        // Set up parallax motion.
        sprites.sofaBack.target = 92;
        sprites.sofaBack.speed = 0.4;
        sprites.tv.target = 161;
        sprites.tv.speed = 0.2;
        sprites.tvScreen.target = 154;
        sprites.tvScreen.speed = 0.2;
      }
    },
    {
      text: `a hero using her wits to overcome some impossible obstacle.`,
      method(sprites) {
      }
    },
    {
      text: `but the time slot before is filled with stuffy old men saying things our dreamer doesn't understand,`,
      method(sprites) {
        game.music.play('talking');

        sprites.sofaBack.visible = false;
        sprites.tv.visible = false;
        sprites.tvScreen.visible = false;

        sprites.eyes.visible = true;
        sprites.mouth.visible = true;
        sprites.dreamer.visible = true;
        sprites.sofa.visible = true;

        sprites.eyes.anims.play('glaze');
        sprites.mouth.anims.play('bored');
      }
    },
    {
      text: `and soon our young dreamer drifts off into a strange world of their very own.`,
      method(sprites) {
        sprites.eyes.anims.play('close');
        sprites.mouth.anims.play('slacken');
      }
    },
    {
      text: `{but i mustn't sleep,} our dreamer realizes!
      {my very favorite tv show will be starting any minute now!}`,
      method(sprites) {
        game.music.stop();

        sprites.stars.visible = true;
        sprites.bg.anims.play('fade');

        // Set up parallax motion.
        sprites.sofa.target = 397;
        sprites.sofa.speed = 1;
        sprites.dreamer.target = 356;
        sprites.dreamer.speed = 1.2;
        sprites.eyes.target = 345;
        sprites.eyes.speed = 1.2;
        sprites.mouth.target = 343;
        sprites.mouth.speed = 1.2;
        sprites.stars.target = 128;
        sprites.stars.speed = 0.04;
        sprites.platform.target = 60;
        sprites.platform.speed = 0.5;
        sprites.bwDreamer.target = 108;
        sprites.bwDreamer.speed = 0.67;
        sprites.chain.target = 142;
        sprites.chain.speed = 0.75;
        sprites.cutZnake.target = 188;
        sprites.cutZnake.speed = 1;
      }
    },
    {
      text: `{i must escape this world somehow...
      ...and soon!!}`,
      method(sprites) {
      },
  }],
  music: 'intro',
  onComplete() {
    game.music.play('waltz');
    startNextLevel.call(this);
    this.scene.launch('pause');
    game.scene.keys.pause.cameras.main.visible = false;
  }
};

// !--- SPOILER ALERT ---!
const outro = {
  paragraphs: [
    {
      text: `our dreamer drowsily opens their eyes and tries to focus on the television screen.`,
      method(sprites) {
        this.anims.create({
          key: 'open',
          frames: mapFrames('eyes', [7, 6, 5, 4]),
          frameRate: 3,
        });

        this.anims.create({
          key: 'sleepy',
          frames: [{key: 'mouth', frame: 4}],
        });

        this.anims.create({
          key: 'tighten',
          frames: [{key: 'mouth', frame: 3}],
        });

        this.anims.create({
          key: 'smile',
          frames: mapFrames('mouth', [2, 1]),
          frameRate: 3,
        });

        sprites.stars.visible = false;
        sprites.sofaBack.visible = false;
        sprites.tv.visible = false;
        sprites.tvScreen.visible = false;

        sprites.eyes.anims.play('open');
        sprites.mouth.anims.play('sleepy');

        // Set up parallax motion.
        sprites.sofa.target = 147;
        sprites.sofa.speed = 0.2;
        sprites.dreamer.target = 156;
        sprites.dreamer.speed = 0.4;
        sprites.eyes.target = 145;
        sprites.eyes.speed = 0.4;
        sprites.mouth.target = 143;
        sprites.mouth.speed = 0.4;
      },
    },
    {
      text: `the ending credits of the cartoon slowly come into focus.`,
      method(sprites) {
        sprites.eyes.visible = false;
        sprites.mouth.visible = false;
        sprites.dreamer.visible = false;
        sprites.sofa.visible = false;

        sprites.sofaBack.visible = true;
        sprites.tv.visible = true;
        sprites.tvScreen.visible = true;

        sprites.tvScreen.anims.play('scan');

        // Set up parallax motion.
        sprites.sofaBack.target = 92;
        sprites.sofaBack.speed = 0.4;
        sprites.tv.target = 161;
        sprites.tv.speed = 0.2;
        sprites.tvScreen.target = 154;
        sprites.tvScreen.speed = 0.2;
      },
    },
    {
      text: `{i've missed it,} our dreamer sighs.
      but they can't help showing a small smile.`,
      method(sprites) {
        sprites.sofaBack.visible = false;
        sprites.tv.visible = false;
        sprites.tvScreen.visible = false;

        sprites.eyes.visible = true;
        sprites.mouth.visible = true;
        sprites.dreamer.visible = true;
        sprites.sofa.visible = true;

        sprites.mouth.anims.play('tighten');
        sprites.eyes.anims.play('half-blink');
      },
      },
    {
      text: `this time, the adventure was their own, and every bit as wondrous as any on tv.`,
      method(sprites) {
        sprites.eyes.anims.play('half-blink');
        sprites.mouth.anims.play('smile');
      },
    },
    {
      text: `anyhow, it's getting late now...
      might as well go back to sleep.`,
      method(sprites) {
        sprites.stars.visible = true;

        sprites.eyes.anims.play('close');
        sprites.mouth.anims.play('slacken');
        sprites.bg.anims.play('fade');

        // Set up parallax motion.
        sprites.sofa.target = 397;
        sprites.sofa.speed = 0.5;
        sprites.dreamer.target = 356;
        sprites.dreamer.speed = 0.6;
        sprites.eyes.target = 345;
        sprites.eyes.speed = 0.6;
        sprites.mouth.target = 343;
        sprites.mouth.speed = 0.6;
      },
    }
  ],
  onComplete() {
    this.scene.start('credits');
  }
};

const cutsceneFactory = config => ({
  preload() {
    game.activeScene = this;

    this.load.image('frame', 'img/frame.png');
    this.load.image('dreamer', 'img/cutscene-dreamer.gif');
    this.load.image('cut-znake', 'img/cutscene-bw-znake.gif');
    this.load.image('platform', 'img/cutscene-bw-platform.gif');
    this.load.image('bw-dreamer', 'img/cutscene-bw-dreamer.gif');
    this.load.image('chain', 'img/cutscene-bw-chain.gif');
    this.load.image('sofa', 'img/cutscene-sofa.gif');
    this.load.image('sofa-back', 'img/cutscene-sofa-back.gif');
    this.load.image('tv', 'img/cutscene-tv.gif');
    this.load.image('stars', 'img/cutscene-stars.png');
    this.load.spritesheet('frame-bg', 'img/frame-bg.png', {frameWidth: 172, frameHeight: 82});
    this.load.spritesheet('eyes', 'img/cutscene-dreamer-eyes.gif', {frameWidth: 41, frameHeight: 21});
    this.load.spritesheet('mouth', 'img/cutscene-dreamer-mouth.gif', {frameWidth: 14, frameHeight: 14});
    this.load.spritesheet('tv-screen', 'img/cutscene-tv-screen.gif', {frameWidth: 51, frameHeight: 34});
  },
  create() {
    if (config.music) {
      game.music.play(config.music);
    }

    const sprites = {
      bg: this.add.sprite(128, 96, 'frame-bg'),
      stars: this.add.sprite(116, 96, 'stars'),
      sofa: this.add.image(122, 106, 'sofa'),
      dreamer: this.add.image(106, 96, 'dreamer'),
      eyes: this.add.sprite(95, 96, 'eyes'),
      mouth: this.add.sprite(93, 113, 'mouth'),
      tv: this.add.image(131, 96, 'tv'),
      tvScreen: this.add.sprite(124, 91, 'tv-screen'),
      sofaBack: this.add.image(32, 103, 'sofa-back'),
      platform: this.add.image(-98, 84, 'platform'),
      bwDreamer: this.add.image(-104, 108, 'bw-dreamer'),
      chain: this.add.image(-95, 68, 'chain'),
      cutZnake: this.add.image(-128, 84, 'cut-znake'),
    };
    this.add.image(128, 120, 'frame');

    // Configure sprites for parallax animations.
    this.sprites = sprites;

    const text = []; // For  clearing text.
    let timers = []; // For clearing or early invoking of text timers.

    const print = paragraph => {
      // Clear prior text/timers.
      text.forEach(sprite => {
        sprite.destroy();
      });
      timers.forEach((timer, i) => {
        timer.remove();
      });
      timers = [];

      const lineLength = 24;
      const top = 168;
      const left = 36;
      const timeBetweenChars = 50;
      let col = 0;
      let row = 0;
      let charCount = 0;

      paragraph.split(' ').forEach((word, i) => {
        word.split('').forEach((char, j) => {
          charCount++;

          const printChar = (muteSound) => {
            if (char === '\n') {
              col = 0;
              row += 2;
              return;
            }

            if (char !== ' ' && !muteSound) {
              game.sfx.play('text');
            }

            // At start of each word, check if we should wrap.
            if (j === 0 && col + word.length > lineLength) {
              row += 1;
              col = 0;
            }

            const sprite = this.add.sprite(left + col * 8, top + row * 8, 'typeface')
            setLetter(sprite, char.toUpperCase());
            col++;
            text.push(sprite)

            if (j + 1 === word.length) {
              const space = this.add.sprite(left + col * 8, top + row * 8, 'typeface')
              setLetter(space, ' ');
              col++;
              text.push(space);

              if (i + 1 === paragraph.split(' ').length) {
                timers = [];
              }
            }
          };

          const timer = this.time.addEvent({
            delay: timeBetweenChars * charCount,
            callback: printChar
          });

          timers.push(timer);
        });
      });
    };

    const nextLine = (event = {key: 'Enter'}) => {
      if (event.key !== 'Enter' && event.key !== 'x') {
        return;
      }

      // If the text is still animating in, just display it all immediately.
      if (timers.length) {
        const muteSound = true;
        timers.forEach(timer => {
          if (!timer.hasDispatched) {
            timer.callback(muteSound);
          }

          timer.remove();
        });

        timers = [];

        return;
      }

      const paragraph = config.paragraphs.shift();

      if (paragraph) {
        print(paragraph.text);
        paragraph.method.call(this, sprites);;
      } else {
        // Showed all the text.
        config.onComplete.call(this);
      }
    };

    // Press START or JUMP to progress.
    this.input.keyboard.on('keydown', event => {
      inputMethod = 'keyboard'; // Capture input method for use in tutorial text.
      nextLine(event);
    });

    this.input.gamepad.on('down', pad => {
      const startButton = pad.buttons[9];

      if (pad.A || startButton.pressed) {
        inputMethod = 'gamepad'; // Capture input method for use in tutorial text.
        nextLine();
      }
    }, this);

    // Print first line.
    nextLine();
  },
  update() {
    Object.values(this.sprites).forEach(sprite => {
      if (sprite.target && sprite.x < sprite.target) {
        sprite.x += sprite.speed;
      }
    });
  }
});

const startNextLevel = function() {
  if (game.transitioning) {
    console.warn('startNextLevel called while transition already occuring');
    return;
  }

  game.transitioning = true;
  const duration = 2000;

  // Update stats.
  if (game.plr) {
    flowersPicked += game.plr.flowers;
    znakesKilled += game.plr.znakes;

    if (game.plr.gorges > gorgeStreak) {
      gorgeStreak = game.plr.gorges;
    }
  }

  // First transition from previous level to transition scene.
  const lastLevel = level;
  if (lastLevel) {
    this.scene.pause(lastLevel);
  }
  const lastScene = game.activeScene;
  game.transitionScene.tweens.add({
    targets: lastScene.cameras.main,
    y: 240,
    duration,
    onComplete: () => {
      if (lastLevel) {
        this.scene.stop(lastLevel);
      }

      setTimeout(() => {
        // Then start the next level and hide the transition screen.
        game.transitionScene.cameras.main.visible = false;
        game.starsScene.cameras.main.visible = true;
        this.scene.launch(level);
        game.transitioning = false;
      }, 750);
    }
  });

  level = levels.shift();
  levelNum++;

  const isLastLevel = !levels.length;
  if (isLastLevel) {
    game.music.play('title');
  }

  game.transitionScene.setLevel(levelNum);
  game.transitionScene.cameras.main.visible = true;
  game.starsScene.cameras.main.visible = false;
};

let animateTileIndex = 0;
const update = function() {
  // In case player switches to another gamepad. Default to pad1.
  gamepad = gamepad.connected
    ? gamepad
    : this.input.gamepad.pad1 || gamepad;

  if (gamepad.setAxisThreshold) {
    gamepad.setAxisThreshold(0.5);
  }

  const idleAnimationInterval = 8000; // How long in MS to wait before playing an alternative idle animation.
  const animateTileInterval = 500;

  if (this.time.now > this.lastTileSwap + animateTileInterval) {
    if (animateTileIndex === 0) {
      game.map.replaceByIndex(53, 59); // Bubbles.
      game.map.replaceByIndex(45, 58); // Water surface.
      animateTileIndex = 1;
    } else {
      animateTileIndex = 0;
      game.map.replaceByIndex(59, 53);
      game.map.replaceByIndex(58, 45);
    }

    this.lastTileSwap = this.time.now;
  }

  const plr = game.plr;

  if (plr.isDead || plr.endingGame) {
    return;
  }

  // Track time chilled.
  if (plr.chilling) {
    if (this.lastUpdatedChillTime) {
      if (this.time.now > this.lastUpdatedChillTime + 1000) {
        secondsChilled++;
        this.lastUpdatedChillTime = this.time.now;
      }
    } else {
      this.lastUpdatedChillTime = this.time.now;
    }

    const chillGameboyInterval = 8000;
    if (this.time.now > this.lastPlayedGameboy + chillGameboyInterval) {
      plr.anims.play('gameboy');
      this.lastPlayedGameboy = this.time.now;
    }
  } else {
    this.lastUpdatedChillTime = undefined;
    this.lastPlayedGameboy = this.time.now;
  }

  const anim = plr.anims.currentAnim.key;
  const overTile = game.map.worldLayer.tilemap.getTileAtWorldXY(plr.x, plr.y);
  const onTile = game.map.worldLayer.tilemap.getTileAtWorldXY(plr.x, plr.y + 8);

  if (overTile && overTile.properties.gorge) {
    plr.jumpingGorge = true;
  }

  // Player fell in the gorge.
  if (onTile && onTile.properties.death) {
    plr.kill();
  }

  // Float in water.
  if (overTile && overTile.properties.water) {
    plr.jumping = false;
    plr.canAutovault = true;
    plr.swimming = true;
  } else {
    plr.swimming = false;
    plr.setGravityY(800);
  }

  // Play random alternative idle animation after some time passed w/o input.
  if (this.time.now > this.lastPlayerInput + idleAnimationInterval && !plr.chilling) {
    const anim = Math.random() > 0.5 ? 'idleAltA' : 'idleAltB';
    plr.anims.play(anim);
    this.lastPlayerInput = this.time.now; // Reset timer.
  }

  const pressing = {
    up: this.keys.up.isDown || gamepad.up || (gamepad.leftStick && gamepad.leftStick.y < 0),
    down: this.keys.down.isDown || gamepad.down || (gamepad.leftStick && gamepad.leftStick.y > 0),
    left: this.keys.left.isDown || gamepad.left || (gamepad.leftStick && gamepad.leftStick.x < 0),
    right: this.keys.right.isDown || gamepad.right || (gamepad.leftStick && gamepad.leftStick.x > 0),
    jump: this.keys.jump.isDown || gamepad.A,
    chill: this.keys.chill.isDown || gamepad.B,
  };
  plr.pressing = pressing;

  if (pressing.left || pressing.right || pressing.up || pressing.down || pressing.jump) {
    this.lastPlayerInput = this.time.now;
    if (plr.chilling) {
      plr.chilling = false;
    }
  } else if (pressing.chill && !plr.chilling && plr.body.blocked.down) {
    plr.body.velocity.x = 0; // Stop slide in case player was moving.

    if (onTile && onTile.properties.couch) {
      // End the game!!
      plr.endingGame = true;
      plr.anims.play('watchTv');
      game.npc.anims.play('npc-chill');
      game.music.stop();
      this.scene.stop('pause');

      this.time.delayedCall(6000, () => {
        plr.anims.play('sleepFromChill');
      }, [], this);

      this.time.delayedCall(10000, () => {
        game.starsScene.cameras.main.visible = false;
        this.scene.start('outro');
      }, [], this);

      return;
    }

    plr.chilling = true;
    plr.anims.play('startChill');
    return;
  } else if (plr.chilling) {
    return;
  }

  // Allow player to jump once if they just pressed jump, or if they're holding the jump key and touching down.
  // (Prevents spam-vaulting.)
  // There's also a gamepad listener for this in set up player.
  const justPressedJump = Phaser.Input.Keyboard.JustDown(this.keys.jump);
  if (justPressedJump || (pressing.jump && plr.body.blocked.down)) {
    if (plr.swimming) {
      plr.swim();
    } else if (!plr.jumping) {
      plr.jump();
    }
  }

  // Allow player to vault once after jumping by continuing to hold down the jump key.
  // (Each vault after that must be manual.)
  const touchingSide = plr.body.blocked.left || plr.body.blocked.right;
  if (pressing.jump && touchingSide && plr.canAutovault && !plr.jumping) {
    plr.canAutovault = false;
    plr.jump();
  }

  // Allow player to swim (throttled) by holding jump key.
  const autoSwimInterval = 200;
  if (pressing.jump && plr.swimming && this.time.now > this.lastSwam + autoSwimInterval) {
    plr.swim();
  }

  // Ensure upward movement (negative Y value) doesn't exceed maximum speed.
  if (plr.body.velocity.y < plr.jumpHeight) {
    plr.body.velocity.y = plr.jumpHeight;
  }

  const oneHorizontalKeyIsDownButNotBoth = (pressing.left && !pressing.right) || (pressing.right && !pressing.left);
  const oneVerticalKeyIsDownButNotBoth = (pressing.up && !pressing.down) || (pressing.down && !pressing.up)

  if (oneHorizontalKeyIsDownButNotBoth) {
    if (anim !== 'run' && !plr.jumping && !plr.hurt && !plr.climbing && !plr.swimming) {
      plr.anims.play('run');
    } else if (anim !== 'climb' && plr.climbing && !plr.hurt) {
      plr.anims.play('climb');
    }

    if (pressing.left) {
      plr.flipX = false;
      plr.body.velocity.x -= 20;
    }
    if (pressing.right) {
      plr.flipX = true;
      plr.body.velocity.x += 20;
    }
  } else {
    if (anim !== 'idle' && anim !== 'idleAltA' && anim !== 'idleAltB' && !plr.jumping && !plr.hurt && !plr.climbing && !plr.swimming) {
      plr.anims.play('idle');
    } else if (plr.climbing && !oneVerticalKeyIsDownButNotBoth && anim !== 'climbIdle') {
      plr.anims.play('climbIdle');
    }
  }

  if (plr.jumping && !plr.hurt) {
    // Play platform vault animation if player is bounding off the side of a platform.
    if (plr.body.blocked.left || plr.body.blocked.right) {
      if (anim !== 'vault') {
        plr.anims.play('vault');
      }
    } else {
      if (anim !== 'jump') {
        plr.anims.play('jump');
      }
    }
  }

  if (plr.swimming && anim !== 'swim' && !plr.hurt) {
    plr.anims.play('swim');
    plr.body.velocity.y = 0;
    plr.setGravityY(75);
  }

  if (plr.hurt && anim !== 'hurt') {
    plr.anims.play('hurt');
    plr.kill();
    if (plr.hurt === 'left') {
      plr.body.velocity.x = 100;
    } else {
      plr.body.velocity.x = -100;
    }
  }

  const maxSpeed = 100;
  if (Math.abs(plr.body.velocity.x) > maxSpeed) {
    plr.body.velocity.x = Math.sign(plr.body.velocity.x) * maxSpeed;
  }

  // World Wrap.
  if (plr.body.x > game.config.width) {
    plr.x = -4;
  }
  if (plr.body.x < -12) {
    plr.x = game.config.width + 4;
  }

  if (plr.body.y > game.config.height) {
    // Sweet Death!
    plr.kill();
  }

  // Friction.
  if (plr.body.velocity.x > 0) {
    plr.body.velocity.x -= 6;
    if (plr.body.velocity.x < 0) {
      plr.body.velocity.x = 0;
    }
  } else if (plr.body.velocity.x < 0) {
    plr.body.velocity.x += 6;
    if (plr.body.velocity.x > 0) {
      plr.body.velocity.x = 0;
    }
  }

  // Handle climbing.
  if (overTile && overTile.properties.climbable) {
    if (plr.body.y < 0 && !plr.jumping) {
      // Next Level!
      startNextLevel.call(this);
    }

    plr.body.allowGravity = false;
    plr.jumping = false;
    plr.canAutovault = true;

    if (!plr.climbing) {
      plr.climbing = true;
      plr.body.velocity.x = 0;
      plr.body.velocity.y = 0;
    }

    if (oneVerticalKeyIsDownButNotBoth) {
      if (anim !== 'climb') {
        plr.anims.play('climb');
      }
      plr.y += pressing.up ? -3 : 2;
    }
  } else {
    plr.climbing = false;
    plr.body.allowGravity = true;
  }
};

const addNpc = function({x, y, properties}) {
  const sprite = this.add.sprite(x, y - 12, 'npc')
    .anims.play(properties.anim ? properties.anim : 'npc-idle', true);

  if (properties.faceRight) {
    sprite.flipX = true;
  }

  game.npc = sprite;

  const timeBetweenLines = 2500;
  const timeBetweenChars = 50;
  const dialog = properties.dialog;
  const lines = dialog.split('\n');
  let letters = [];

  lines.forEach((line, i) => {
    const chars = line.split('');
    this.time.addEvent({
      delay: timeBetweenLines * i,
      callback: () => {
        letters.forEach(l => l.destroy());

        if (game.plr.endingGame) {
          return;
        }

        chars.forEach((char, col) => {
          if (char === 'A' && inputMethod === 'keyboard') {
            char = 'X';
          }

          if (char === 'B' && inputMethod === 'keyboard') {
            char = 'Z';
          }

          this.time.addEvent({
            delay: timeBetweenChars * col,
            callback: () => {
              if (char !== ' ') {
                game.sfx.play('text');
              }
              const top = y - 28;
              const left = x - ((chars.length - 1) * 4 / 2); // Center text.
              const letter = this.add.sprite(left + col * 4, top, 'typeface-sm');
              letters.push(letter);
              setLetter(letter, char);
            },
          });
        });
      },
    });
  });

  this.time.addEvent({
    delay: timeBetweenLines * lines.length,
    callback: () => {
      letters.forEach(l => l.destroy());
    },
  });
};

// Add the player and set up controls.
const setUpPlayer = function({x, y, properties}) {
  const plr = this.physics.add.sprite(x, y, 'plr')
    .anims.play('idle', true);

  if (properties && properties.faceRight) {
    plr.flipX = true;
  }

  plr.lastPlayedGameboy = this.time.now;
  plr.lastSwam = this.time.now;

  game.plr = plr;

  this.physics.add.collider(game.map.worldLayer, plr, (plr, tile) => {
    plr.jumping = false;
    if (plr.body.blocked.down) {
      plr.canAutovault = true;
      plr.swimming = false;
      if (plr.jumpingGorge) {
        plr.jumpingGorge = false;
        plr.gorges++;
      }
    }

    // Collect flowers.
    const tileBehindPlayer = game.map.getTileAt(tile.x, tile.y - 1);
    if (tileBehindPlayer && tileBehindPlayer.properties.flower) {
      tileBehindPlayer.visible = false;
      tileBehindPlayer.properties.flower = false;
      game.sfx.play('pick');
      plr.flowers++;
    }
  });

  plr.body.setSize(12, 22, 2, 1);

  this.keys = {
    up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
    down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
    left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
    right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
    jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
    chill: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
  };

  plr.on('animationcomplete', () => {
    const anim = plr.anims.currentAnim.key;
    if (anim === 'idleAltA' || anim === 'idleAltB') {
      plr.anims.play('idle');
    }
    if (anim === 'hurt') {
      plr.hurt = false;
    }
    if (anim === 'startChill') {
      plr.anims.play('chill');
    }
    if (anim === 'gameboy') {
      plr.anims.play('chill');
    }
  }, this);

  plr.kill = () => {
    // Update stats.
    deathCount++;

    if (plr.gorges > gorgeStreak) {
      gorgeStreak = plr.gorges;
    }

    plr.isDead = true;
    const scene = this.scene;
    plr.body.checkCollision.down = false;
    this.time.addEvent({ delay: 750, callback() {
      scene.restart();
    }});
    plr.rotation = Math.PI;
    game.sfx.play('die');
  };

  plr.jumpHeight = -220;
  plr.jump = () => {
    // Player can jump off the ground,
    // or vault off the sides of platforms,
    // or jump off chains.
    if (!plr.body.blocked.down && !plr.body.blocked.left && !plr.body.blocked.right && !plr.climbing) {
      return;
    }

    // Player must be jumping left or right if climbing.
    if (plr.climbing && !plr.pressing.left && !plr.pressing.right) {
      return;
    }

    plr.jumping = true;
    plr.swimming = false;

    plr.body.velocity.y = plr.jumpHeight;
    game.sfx.play('jump');

    // We are vaulting.
    if (!plr.body.blocked.down) {
      plr.canAutovault = false;
    }
  };
  plr.swim = () => {
    const swimHeight = -125;
    plr.setGravityY(800); // Make height change quickly but prevent player going up too high.
    plr.body.velocity.y = swimHeight;
    game.sfx.play('swim');
    this.lastSwam = this.time.now;
  };

  this.input.gamepad.on('down', pad => {
    if (plr.endingGame) {
      return;
    }

    gamepad = pad; // In case player switches to another gamepad.

    // Let player jump once per button press.
    const pressedJump = pad.A;
    if (pressedJump) {
      if (plr.swimming) {
        plr.swim();
      } else if (!plr.jumping) {
        plr.jump();
      }
    }
  }, this);

  // Track stats per level, reset on death.
  plr.flowers = 0;
  plr.znakes = 0;
  plr.gorges = 0;

  // Make player flash a few times on scene start.
  const flashTimer = this.time.addEvent({ delay: 100, callback() {
    plr.isTinted ? plr.clearTint() : plr.setTintFill(0xFFFFFF);
  }, loop: true });

  this.time.addEvent({ delay: 600, callback() {
    plr.clearTint();
    flashTimer.remove();
  }});
};

const preloadLevel = function(levelName) {
  game.levelScene = this;
  game.activeScene = this;

  this.load.tilemapTiledJSON(levelName, `map/${levelName}.json`);
  this.load.spritesheet('tileset', 'img/tileset.gif', {frameWidth: 8, frameHeight: 8});
};

const createLevel = function(levelName) {
  resetControls();

  if (level === 'level4') {
    game.music.play('level4');
  }

  const xOffset = -24; // To account for extra level width.
  this.lastTileSwap = this.time.now;
  this.lastPlayerInput = this.time.now;

  game.map = this.make.tilemap({key: levelName});
  game.map.tileset = game.map.addTilesetImage('tileset');

  // There are 2 extra tiles on the left and right for screen wrapping.
  // There is also a 1-tile collidable border to prevent players falling outside the screen.
  game.map.worldLayer = game.map.createDynamicLayer('World', game.map.tileset, xOffset, 0);
  game.map.worldLayer.setCollisionByProperty({collides: true});

  // Spawn player and enemies from positions placed in Tiled object layer.
  const objectLayer = game.map.objects.find(objectLayer => objectLayer.name === 'Objects');

  const npc = objectLayer.objects.find(obj => obj.type === 'npc');
  if (npc) {
    addNpc.call(this, npc);
  }

  const player = objectLayer.objects.find(obj => obj.type === 'player');
  setUpPlayer.call(this, player);

  const znakes = objectLayer.objects
    .filter(obj => obj.type === 'znake')
    .map(znake => addZnake.call(this, znake));
};

const addZnake = function({x, y, properties}) {
  const xOffset = -24; // To account for extra level width.
  const znake = this.physics.add.sprite(x + xOffset, y, 'znake')
    .anims.play('left', true);

  znake.setGravityY(800);

  znake.body.setSize(14, 14, 1, 0.5);
  znake.kill = () => {
    game.plr.znakes++;
    znake.body.checkCollision.down = false;
    this.time.addEvent({ delay: 750, callback() {
      znake.destroy();
    }});
    znake.rotation = Math.PI;
    game.sfx.play('stomp');

    if (properties && properties.triggerMusic && !znake.playedAlt) {
      game.music.play('alt');
      znake.playedAlt = true;
    }
  };

  if (properties && properties.triggerMusic) {
    this.time.delayedCall(12000, () => {
      if (znake && !znake.playedAlt) {
        game.music.play('alt');
        znake.playedAlt = true;
      }
    });
  }

  znake.on('animationcomplete', () => {
    const anim = znake.anims.currentAnim.key;
    if (anim === 'turnLeft') {
      znake.anims.play('left');
    } else if (anim === 'turnRight') {
      znake.anims.play('right');
    }
  }, this);

  // Make znake patrol.
  this.physics.add.collider(game.map.worldLayer, znake, (znake, tile) => {
    const anim = znake.anims.currentAnim.key;
    // If the next tile the znake will encounter is not collidable, turn around.
    let nextX;
    if (anim === 'left') {
      znake.x -= 0.1;
      nextX = tile.x - 1;
    } else if (anim === 'right') {
      znake.x += 0.1;
      nextX = tile.x + 2;
    }
    const nextTile = tile.tilemapLayer.getTileAt(nextX, tile.y);
    if (!nextTile || !nextTile.properties.collides) {
      if (anim === 'left' && znake.x <= tile.getRight()) {
        znake.anims.play('turnRight');
      } else if (anim === 'right') {
        znake.anims.play('turnLeft');
      }
    }
  });
  this.physics.add.collider(game.plr, znake, () => {
    // Znakes don't mess with chill ppl.
    if (game.plr.chilling) {
      return;
    }

    const plrJumpedOnZnake = game.plr.body.touching.down && znake.body.touching.up;
    if (plrJumpedOnZnake) {
      game.plr.body.velocity.y -= 100;
      znake.kill();
    } else if (game.plr.anims.currentAnim.key !== 'hurt') {
      if (game.plr.x > znake.x) {
        game.plr.hurt = 'left';
      } else {
        game.plr.hurt = 'right';
      }
    }
  });

  return znake;
};

const scenes = {
  logo: {
    preload() {
      this.load.image('logo', 'img/logo.gif');
    },
    create() {
      // Set up SFX. Don't allow sounds to stack.
      const sfx = () => {
        const sounds = ['text', 'jump', 'swim', 'stomp', 'pick', 'die', 'silence'];
        const soundbank = sounds.reduce((bank, name) => {
          bank[name] = new Howl({
            src: [`./sfx/${name}.wav`],
            volume: 0.5,
          });

          return bank;
        }, {});

        return {
          play(name) {
            if (soundbank[name].playing()) {
              soundbank[name].stop();
            }
            soundbank[name].play();
          },
          stop(name) {
            soundbank[name].stop();
          }
        };
      };

      const bgm = (audioCtx) => {
        const player = createNsfPlayer(audioCtx);

        return {
          play(fileName) {
            player.play(`./music/${fileName}.nsf`);
          },
          stop() {
            player.stop();
          }
        };
      };

      game.sfx = sfx();
      game.music = bgm(Howler.ctx);

      const logo = this.add.image(128, 120, 'logo');
      logo.alpha = 0;

      this.time.addEvent({delay: 500, callback: () => {
        this.time.addEvent({delay: 100, callback: () => {
          logo.alpha += 0.33;
        }, repeat: 3});
      }});

      game.music.play('logo');

      // Prepare the menu.
      this.scene.add('menu', scenes.menu);

      this.time.delayedCall(3000, () => {
        this.scene.start('menu');
      });
    },
  },
  stars: {
    create() {
      game.starsScene = this;

      [...Array(4)]
        .forEach((x, i) => {
          const getRandomPosition = () => ({
            x: randomIntBetween(0, game.config.width),
            y: randomIntBetween(0, game.config.height)
          });

          const pos = getRandomPosition();
          const star = this.add.sprite(pos.x, pos.y, 'star')

          // Stagger star animations.
          const delay = 100;
          this.time.delayedCall(delay * i, () => {
            star.anims.play('twinkle', true);
          }, [], this);

          star.on('animationrepeat', () => {
            const newPos = getRandomPosition();
            star.x = newPos.x;
            star.y = newPos.y;
          });
        });
    },
  },
  pause: {
    preload() {
      this.load.image('icon-chain', 'img/icon-chain.gif');
      this.load.image('icon-snowflake', 'img/icon-snowflake.gif');
      this.load.image('icon-flower', 'img/icon-flower.gif');
      this.load.image('icon-z', 'img/icon-z.gif');
      this.load.image('icon-heart', 'img/icon-heart.gif');
      this.load.image('icon-rock', 'img/icon-rock.gif');
    },
    create() {
      game.pauseScene = this;

      const togglePause = () => {
        if (game.scene.isActive(level) && !game.transitioning) {
          this.scene.restart('pause'); // Re-render stats.
          game.scene.pause(level);
          game.scene.keys[level].cameras.main.visible = false;
          resetControls();
          this.cameras.main.visible = true;
        } else {
          game.scene.resume(level);
          game.scene.keys[level].cameras.main.visible = true;
          this.cameras.main.visible = false;
        }
      };

      // Set up controls to pause/unpause.
      this.input.keyboard.on('keydown', (event) => {
        if (event.key === 'Enter') {
          togglePause();
        }
      });

      this.input.gamepad.on('down', pad => {
        // Let player toggle pause.
        const pressedStart = pad.buttons[9].pressed;
        if (pressedStart) {
          togglePause();
        }
      }, this);

      const chars = 'PAUSED'.split('');
      chars.forEach((char, col) => {
        const top = 56;
        const left = (256 - ((chars.length - 1) * 8)) / 2; // Center text.
        setLetter(this.add.sprite(left + col * 8, top, 'typeface'), char);
      });

      buildStats(this);
    },
  },
  transition: {
    preload() {
      this.load.spritesheet('typeface', 'img/typeface.gif', {frameWidth: 8, frameHeight: 8});
      this.load.spritesheet('typeface-sm', 'img/typeface-hw.gif', {frameWidth: 4, frameHeight: 8});
    },
    create() {
      game.transitionScene = this;

      const top = 112;

      const chars = 'LEVEL  '.split('');
      chars.forEach((char, col) => {
        const left = (256 - ((chars.length - 1) * 8)) / 2; // Center text.
        setLetter(this.add.sprite(left + col * 8, top, 'typeface'), char);
      });

      const level = this.add.sprite(148, top, 'typeface');

      this.setLevel = (levelNum) => {
        setLetter(level, `${levelNum}`);
      };
    },
  },
  menu: {
    preload() {
      // Art
      this.load.image('bg', 'img/title-bg.gif');
      this.load.image('push-start', 'img/title-push-start.gif');

      this.load.spritesheet('eye',
        'img/title-eye-idle.gif',
        { frameWidth: 13, frameHeight: 13 }
     );

      this.load.spritesheet('plr',
        'img/dreamer.gif',
        { frameWidth: 20, frameHeight: 24}
      );

      this.load.spritesheet('npc',
        'img/subconscious.gif',
        { frameWidth: 20, frameHeight: 24}
      );

      this.load.spritesheet('star',
        'img/star.png',
        { frameWidth: 9, frameHeight: 9 }
      );

      this.load.spritesheet('znake',
        'img/znake.gif',
        { frameWidth: 20, frameHeight: 16 }
      );

      // Add the various scenes.
      this.scene.add('stars', scenes.stars);
      this.scene.add('pause', scenes.pause);
      this.scene.add('transition', scenes.transition);
      this.scene.add('intro', scenes.intro);
      this.scene.add('outro', scenes.outro);
      this.scene.add('credits', scenes.credits);

      // Add levels as scenes.
      levels.forEach(levelName => {
        this.scene.add(levelName, scenes[levelName]);
      });
    },
    create() {
      // Play a silent "sound" every 20 secs.
      // This prevents AudioContext from pausing itself.
      setInterval(() => {
        game.sfx.play('silence');
      }, 20000);

      game.music.play('title');

      // Set up graphics.
      const bg = this.add.image(128, 120, 'bg');

      bg.alpha = 0;

      // Fade in the menu screen.
      this.time.addEvent({delay: 500, callback() {
        bg.alpha += 0.33;
      }, repeat: 2});

      this.time.addEvent({delay: 1500, callback: () => {
        bg.alpha = 1;

        const startText = this.add.image(128, 204, 'push-start');

        // Flash the menu text.
        this.time.addEvent({ delay: 500, callback() {
          startText.setTintFill(0x000000);
        }, loop: true });

        this.time.addEvent({ delay: 100, callback: () => {
          this.time.addEvent({ delay: 500, callback() {
            startText.clearTint();
          }, loop: true });
        }});

        // Create eye w/ idle animations.
        const addEye = function(x, y) {
          const eye = this.add.sprite(x, y, 'eye');

          this.time.addEvent({ delay: 8000, callback: () => {
            eye.anims.play('lookRight');

            this.time.addEvent({ delay: 1000, callback: () => {
              eye.anims.play('lookLeft');
            }});

            this.time.addEvent({ delay: 4000, callback() {
              eye.anims.play('blink');
            }});
          }, loop: true });
        };

        addEye.call(this, 67, 61);
        addEye.call(this, 92, 61);
      }});

      this.anims.create({
        key: 'lookRight',
        frames: this.anims.generateFrameNumbers('eye', { start: 0, end: 3 }),
        frameRate: 10,
      });

      this.anims.create({
        key: 'lookLeft',
        frames: mapFrames('eye', [3, 2, 1, 0]),
        frameRate: 10,
      });

      this.anims.create({
        key: 'blink',
        frames: mapFrames('eye', [6,7,8,9,8,7,6,0]),
        frameRate: 10,
      });

      this.anims.create({
        key: 'npc-idle',
        frames: mapFrames('npc', [6, 6, 8, 6]),
        frameRate: 8,
        repeat: -1
      });

      this.anims.create({
        key: 'npc-swim',
        frames: mapFrames('npc', [18, 19, 20, 19]),
        frameRate: 8,
        repeat: -1
      });

      this.anims.create({
        key: 'npc-chill',
        frames: this.anims.generateFrameNumbers('npc', { start: 24, end: 29 }),
        frameRate: 8,
      });

      this.anims.create({
        key: 'idle',
        frames: mapFrames('plr', [8, 8, 10, 8]),
        frameRate: 8,
        repeat: -1
      });

      this.anims.create({
        key: 'idleAltA',
        frames: this.anims.generateFrameNumbers('plr', { start: 16, end: 23 }),
        frameRate: 8,
      });

      this.anims.create({
        key: 'idleAltB',
        frames: this.anims.generateFrameNumbers('plr', { start: 24, end: 31 }),
        frameRate: 8,
      });

      this.anims.create({
        key: 'run',
        frames: mapFrames('plr', [0, 1, 2, 1]),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'vault',
        frames: mapFrames('plr', [33, 34]),
        frameRate: 20,
      });

       this.anims.create({
        key: 'jump',
        frames: mapFrames('plr', [33, 32]),
        frameRate: 10,
      });

      this.anims.create({
        key: 'swim',
        frames: mapFrames('plr', [40, 41, 42, 41]),
        frameRate: 8,
        repeat: -1,
      });

      this.anims.create({
        key: 'startChill',
        frames: this.anims.generateFrameNumbers('plr', { start: 64, end: 67 }),
        frameRate: 8
      });

      this.anims.create({
        key: 'chill',
        frames: mapFrames('plr', [67,67,67,67,67,67,67,67,67,67,67,67,67,67,67,67,68,69,70,69,68]),
        frameRate: 8
      });

      this.anims.create({
        key: 'gameboy',
        frames: mapFrames('plr', [72,73,74,75,74,76,74,77,78,77,74,75,74,75,74,76,74,73,72]),
        frameRate: 8
      });

      this.anims.create({
        key: 'sleepFromChill',
        frames: mapFrames('plr', [61,60,59,67,68,69,70]),
        frameRate: 4
      });

      this.anims.create({
        key: 'watchTv',
        frames: this.anims.generateFrameNumbers('plr', { start: 56, end: 62 }),
        frameRate: 8
      });

      this.anims.create({
        key: 'climb',
        frames: mapFrames('plr', [48, 49, 50, 49]),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'climbIdle',
        frames: [{key: 'plr', frame: 49}],
        frameRate: 1
      });

      this.anims.create({
        key: 'hurt',
        frames: mapFrames('plr', [34, 36]),
        frameRate: 10,
      });

      this.anims.create({
        key: 'twinkle',
        frames: this.anims.generateFrameNumbers('star', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'left',
        frames: mapFrames('znake', [4, 5, 6, 5]),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'right',
        frames: mapFrames('znake', [8, 9, 10, 9]),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'turnRight',
        frames: mapFrames('znake', [0, 1, 2, 3]),
        frameRate: 10,
      });

      this.anims.create({
        key: 'turnLeft',
        frames: mapFrames('znake', [3, 2, 1, 0]),
        frameRate: 10,
      });

      // Press ENTER key or START/OPTIONS button to start.
      this.input.keyboard.on('keydown', (event) => {
        if (event.key === 'Enter') {
          this.scene.start('intro');
        }
      });

      // Set up gamepad.
      this.input.gamepad.on('down', pad => {
        const startButton = pad.buttons[9];

        if (startButton.pressed) {
          this.scene.start('intro');
        }
      }, this);

      // Prepare transition screen.
      this.scene.launch('transition');
      game.scene.keys.transition.cameras.main.visible = false;

      // TESTING: Skip to first level.
      // startNextLevel.call(this);

      // Prepare stars scene.
      this.scene.launch('stars');
      game.scene.keys.stars.cameras.main.visible = false;
    },
  },
  intro: cutsceneFactory(intro),
  outro: cutsceneFactory(outro),
  credits: {
    create() {
      game.starsScene.cameras.main.visible = true;
      game.music.play('credits');

      const top = 112;
      const timeBetweenCredits = 6000;
      let sprites = []; // To clear credits.

      const credits = [
        ['design, sound & story:', , 'benji kay', , '@okaybenji'],
        ['art & animation:', , 'adam bing', , '@exciteless'],
        ['monochrome caves tileset:', , 'adam saltsman', , '@adamatomic'],
        ['inspired by the art of', , 'sam boucher', , '@monsieureureka'],
        ['github.com/okaybenji/goodnight', '', 'okaybenji.itch.io/goodnight'],
        [, 'goodnight']
      ];

      credits.forEach((credit, i) => {
        const timer = this.time.addEvent({
          delay: timeBetweenCredits * i,
          callback: () => {
            // Clear prior credit.
            sprites.forEach(sprite => sprite.destroy());
            sprites = [];

            // Fade in the new one.
            credit.forEach((line, row) => {
              const chars = line.split('');
              const left = (256 - ((chars.length - 1) * 8)) / 2; // Center text.
              chars.forEach((char, col) => {
                const sprite = this.add.sprite(left + col * 8, top + row * 8, 'typeface');
                sprite.alpha = 0;
                sprites.push(sprite);
                setLetter(sprite, char.toUpperCase());

                this.time.addEvent({delay: 250, callback() {
                  sprite.alpha += 0.5;
                }, repeat: 2});

                if (i + 1 !== credits.length) {
                  // Fade out.
                  this.time.addEvent({delay: timeBetweenCredits - 250, callback() {
                    sprite.alpha -= 0.5;
                  }});
                }
              });
            });
          }
        });
      });
    }
  }
};

levels.forEach(levelName => {
  scenes[levelName] = {
    preload() {
      preloadLevel.call(this, levelName)
    },
    create() {
      createLevel.call(this, levelName)
    },
    update
  };
});

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 240,
  pixelArt: true,
  physics: {
    default: 'arcade',
  },
  input: {
    gamepad: true,
  },
  scene: scenes.logo,
};

const game = new Phaser.Game(config);
