import Constants from './constants.js'
import Properties from './properties.js'
import { fontFolder, getText, getDonateImage, getQuarantineReadyImage } from './translate.js'

const CDN_URL = Constants.ASSETS_URL

export function preloadAssets() {
    // Set scene
    Properties.scene = this
    // Set scene size
    Properties.setSceneSize()
    // Set camera
    Properties.camera = this.cameras.main

    // Load bitmap fonts
    let fontUrl = `${CDN_URL}/assets/fonts/${fontFolder()}`
    this.load.bitmapFont('light', `${fontUrl}/light.png`, `${fontUrl}/light.xml`);
    this.load.bitmapFont('dark', `${fontUrl}/dark.png`, `${fontUrl}/dark.xml`);
    this.load.bitmapFont('stock', `${CDN_URL}/assets/fonts/stock.png`, `${CDN_URL}/assets/fonts/stock.xml`);
    // Load tilemap and tileset
    this.load.tilemapTiledJSON('game', `${CDN_URL}/assets/tilemap.json`)
    this.load.image('tileset', `${CDN_URL}/assets/tileset.png`)

    // Load player
    preloadPlayer.call(this)
    // Load audio
    preloadAudio.call(this)
    // Load background and common textures
    preloadCommon.call(this)
    // Buttons (play, donate, etc.)
    preloadButtons.call(this)
    // Load levels
    preloadLevel0.call(this)
    preloadLevel1.call(this)
    preloadLevel2.call(this)
    preloadLevel3.call(this)
    preloadLevel4.call(this)
    preloadLevel5.call(this)
    preloadLevel6.call(this)
    preloadLevel7.call(this)
    preloadOutro.call(this)

    // Translated text
    let loadingText = getText('loading')
    // Progress bar
    let widthPercent = 0.4
    let width = Properties.sceneSize.width * widthPercent, height = 64
    let posX = (Properties.sceneSize.width - width) / 2, posY = (Properties.sceneSize.height - height) / 2
    // Game objects
    let progressBar = this.add.graphics()
    let progressBox = this.add.graphics()
    let percentText = this.make.text({
        x: posX + width / 2,
        y: posY - height * 0.8,
        text: `${loadingText}... 0%`,
        style: {
            font: '32px Pixel',
            fill: '#ffffff'
        }
    }).setOrigin(0.5, 0.65)
    let warningText = this.make.text({
        x: posX + width / 2,
        y: posY + height * 1.8,
        text: Constants.IS_TOUCH_DEVICE ? getText('warningDesktop') : '',
        style: {
            font: '32px Pixel',
            fill: '#ffffff'
        }
    }).setOrigin(0.5, 0.65)
    // Bordered progress container
    progressBox.lineStyle(4, 0xffffff, 1)
    progressBox.strokeRect(posX, posY, width, height)
    // Yandex.Metrika
    if (!Properties.gameIsLoaded) {
        ym(70640851, 'reachGoal', 'LOADING_STARTED')
    }

    // For tracking 50% loaded
    let halfLoaded = false

    this.load.on('progress', function(value) {
        // Update progress bar and text
        progressBar.clear()
        progressBar.fillStyle(0xffffff, 1)
        progressBar.fillRect(posX, posY, width * value, height)
        percentText.setText(`${loadingText}... ` + parseInt(value * 100) + '%')

        if (!halfLoaded && value > 0.5 && !Properties.gameIsLoaded) {
            halfLoaded = true
            // Yandex.Metrika
            ym(70640851, 'reachGoal', 'HALF_LOADED')
        }
    })

    this.load.on('complete', function() {
        // Destroy all
        progressBar.destroy()
        progressBox.destroy()
        percentText.destroy()
        warningText.destroy()
    })
}

function preloadPlayer() {
    // Load player sprites for different postfixes
    ['', '-koala', '-mask'].forEach(postfix => {
        this.load.spritesheet(`player-idle${postfix}`, `${CDN_URL}/assets/player/idle${postfix}.png`, {
            frameWidth: 88, frameHeight: 128, margin: 1, spacing: 2
        })
        this.load.spritesheet(`player-run${postfix}`, `${CDN_URL}/assets/player/run${postfix}.png`, {
            frameWidth: 88, frameHeight: 128, margin: 1, spacing: 2
        })
        this.load.spritesheet(`player-jump${postfix}`, `${CDN_URL}/assets/player/jump${postfix}.png`, {
            frameWidth: 88, frameHeight: 128, margin: 1, spacing: 2
        })
    })
}

function preloadAudio() {
    // Theme musics
    this.load.audio('intro', [`${CDN_URL}/assets/audio/intro.mp3`])
    this.load.audio('hell', [`${CDN_URL}/assets/audio/hell.mp3`])
    this.load.audio('main1', [`${CDN_URL}/assets/audio/main1.mp3`])
    this.load.audio('main2', [`${CDN_URL}/assets/audio/main2.mp3`])
    this.load.audio('main3', [`${CDN_URL}/assets/audio/main3.mp3`])
    // Sounds
    this.load.audio('koala', [`${CDN_URL}/assets/audio/sounds/koala.mp3`])
    this.load.audio('tree-falls', [`${CDN_URL}/assets/audio/sounds/tree-falls.mp3`])
    this.load.audio('bat', [`${CDN_URL}/assets/audio/sounds/bat.mp3`])
    this.load.audio('clock', [`${CDN_URL}/assets/audio/sounds/clock.mp3`])
    this.load.audio('dolphins', [`${CDN_URL}/assets/audio/sounds/dolphins.mp3`])
    this.load.audio('tiktok', [`${CDN_URL}/assets/audio/sounds/sayso.mp3`])
    this.load.audio('fireworks', [`${CDN_URL}/assets/audio/sounds/fireworks.mp3`])
    // Outro
    this.load.audio('zombies', [`${CDN_URL}/assets/audio/sounds/zombies.mp3`])
    this.load.audio('ufo', [`${CDN_URL}/assets/audio/sounds/ufo.mp3`])
    this.load.audio('godzilla', [`${CDN_URL}/assets/audio/sounds/godzilla.mp3`])
    this.load.audio('sfx', [`${CDN_URL}/assets/audio/sounds/sfx.mp3`])
}

function preloadCommon() {
    this.load.image('c-hills1', `${CDN_URL}/assets/common/hills1.png`)
    this.load.image('c-hills2', `${CDN_URL}/assets/common/hills2.png`)
    this.load.image('c-hills3', `${CDN_URL}/assets/common/hills3.png`)
    this.load.image('c-cloud1', `${CDN_URL}/assets/common/cloud1.png`)
    this.load.image('c-cloud2', `${CDN_URL}/assets/common/cloud2.png`)
    this.load.image('c-cloud3', `${CDN_URL}/assets/common/cloud3.png`)
    this.load.image('c-clouds1', `${CDN_URL}/assets/common/clouds1.png`)
    this.load.image('c-clouds2', `${CDN_URL}/assets/common/clouds2.png`)
    this.load.image('c-clouds3', `${CDN_URL}/assets/common/clouds3.png`)
    this.load.image('c-city', `${CDN_URL}/assets/common/city.png`)
    this.load.image('c-stone1', `${CDN_URL}/assets/common/stone1.png`)
    this.load.image('c-stone2', `${CDN_URL}/assets/common/stone2.png`)
    this.load.image('c-bush', `${CDN_URL}/assets/common/bush.png`)
    this.load.image('c-tree1', `${CDN_URL}/assets/common/tree1.png`)
    this.load.image('c-tree2', `${CDN_URL}/assets/common/tree2.png`)
    this.load.image('c-tree3', `${CDN_URL}/assets/common/tree3.png`)
    this.load.image('c-mask', `${CDN_URL}/assets/common/mask.png`)
    this.load.image('c-corona', `${CDN_URL}/assets/common/corona.png`)
}

function preloadButtons() {
    this.load.image('play', `${CDN_URL}/assets/buttons/play.png`)
    this.load.image('donate', getDonateImage())
    this.load.image('info', `${CDN_URL}/assets/buttons/info.png`)
    // Tutorial controls
    this.load.image('arrow-left', `${CDN_URL}/assets/tutorial/3-left.png`)
    this.load.image('arrow-right', `${CDN_URL}/assets/tutorial/3-right.png`)
    this.load.image('arrow-up', `${CDN_URL}/assets/tutorial/3-up.png`)
    this.load.image('arrow-down', `${CDN_URL}/assets/tutorial/3-down.png`)
}

function preloadLevel0() {
    this.load.spritesheet('0-bird', `${CDN_URL}/assets/level0/bird.png`, {
        frameWidth: 64, frameHeight: 64, margin: 1, spacing: 2
    })
}

function preloadLevel1() {
    this.load.image('1-rock', `${CDN_URL}/assets/level1/rock.png`)
    this.load.image('1-tree1', `${CDN_URL}/assets/level1/tree1.png`)
    this.load.image('1-tree2', `${CDN_URL}/assets/level1/tree2.png`)
    this.load.image('1-grass', `${CDN_URL}/assets/level1/grass.png`)
    this.load.image('1-stone1', `${CDN_URL}/assets/level1/stone1.png`)
    this.load.image('1-stone2', `${CDN_URL}/assets/level1/stone2.png`)
    this.load.image('1-stone3', `${CDN_URL}/assets/level1/stone3.png`)
    this.load.image('1-stone4', `${CDN_URL}/assets/level1/stone4.png`)
    this.load.image('1-forest1', `${CDN_URL}/assets/level1/forest1.png`)
    this.load.image('1-forest2', `${CDN_URL}/assets/level1/forest2.png`)
    this.load.image('1-forest3', `${CDN_URL}/assets/level1/forest3.png`)
    this.load.image('1-forest4', `${CDN_URL}/assets/level1/forest4.png`)
    this.load.image('1-forest-fire1', `${CDN_URL}/assets/level1/forest-fire1.png`)
    this.load.image('1-forest-fire2', `${CDN_URL}/assets/level1/forest-fire2.png`)
    this.load.image('1-tree3', `${CDN_URL}/assets/level1/tree3.png`)
    this.load.image('1-tree-cut1', `${CDN_URL}/assets/level1/tree-cut1.png`)
    this.load.image('1-tree-cut2', `${CDN_URL}/assets/level1/tree-cut2.png`)
    this.load.image('1-tree-cut3', `${CDN_URL}/assets/level1/tree-cut3.png`)
    this.load.image('1-tree-cut3-leaves', `${CDN_URL}/assets/level1/tree-cut3-leaves.png`)
    this.load.image('1-koala', `${CDN_URL}/assets/level1/koala.png`)
    this.load.image('1-bush1', `${CDN_URL}/assets/level1/bush1.png`)
    this.load.image('1-bush2', `${CDN_URL}/assets/level1/bush2.png`)
    // Fire sprites
    this.load.spritesheet('1-fire1', `${CDN_URL}/assets/level1/fire1.png`, {
        frameWidth: 64, frameHeight: 92, margin: 1, spacing: 2
    })
    this.load.spritesheet('1-fire2', `${CDN_URL}/assets/level1/fire2.png`, {
        frameWidth: 104, frameHeight: 96, margin: 1, spacing: 2
    })
    this.load.spritesheet('1-fire3', `${CDN_URL}/assets/level1/fire3.png`, {
        frameWidth: 124, frameHeight: 160, margin: 1, spacing: 2
    })
}

function preloadLevel2() {
    // Outdoor
    this.load.image('2-sign1', `${CDN_URL}/assets/level2/sign1.png`)
    this.load.image('2-sign2', `${CDN_URL}/assets/level2/sign2.png`)
    this.load.image('2-cart', `${CDN_URL}/assets/level2/cart.png`)
    this.load.image('2-city', `${CDN_URL}/assets/level2/city.png`)
    this.load.image('2-column', `${CDN_URL}/assets/level2/column.png`)
    // People
    this.load.image('2-person2', `${CDN_URL}/assets/level2/people/2.png`)
    this.load.image('2-person3', `${CDN_URL}/assets/level2/people/3.png`)
    this.load.image('2-person4', `${CDN_URL}/assets/level2/people/4.png`)
    this.load.image('2-person5', `${CDN_URL}/assets/level2/people/5.png`)
    this.load.image('2-person7', `${CDN_URL}/assets/level2/people/7.png`)
    this.load.image('2-person8', `${CDN_URL}/assets/level2/people/8.png`)
    this.load.image('2-person9', `${CDN_URL}/assets/level2/people/9.png`)
    this.load.image('2-person10', `${CDN_URL}/assets/level2/people/10.png`)
    this.load.image('2-person11', `${CDN_URL}/assets/level2/people/11.png`)
    this.load.image('2-person12', `${CDN_URL}/assets/level2/people/12.png`)
    // Market
    this.load.image('2-market', `${CDN_URL}/assets/level2/market/building.png`)
    this.load.image('2-rack1', `${CDN_URL}/assets/level2/market/rack1.png`)
    this.load.image('2-rack2', `${CDN_URL}/assets/level2/market/rack2.png`)
    this.load.image('2-rack3', `${CDN_URL}/assets/level2/market/rack3.png`)
    this.load.image('2-cashier', `${CDN_URL}/assets/level2/market/cashier.png`)
    this.load.image('2-quarantine-ready', getQuarantineReadyImage())
    // Products
    this.load.image('2-banana', `${CDN_URL}/assets/level2/products/banana.png`)
    this.load.image('2-bread', `${CDN_URL}/assets/level2/products/bread.png`)
    this.load.image('2-bottle', `${CDN_URL}/assets/level2/products/bottle.png`)
    this.load.image('2-milk', `${CDN_URL}/assets/level2/products/milk.png`)
    this.load.image('2-toilet', `${CDN_URL}/assets/level2/products/toilet.png`)
    // Bat sprite
    this.load.spritesheet('2-bat', `${CDN_URL}/assets/level2/bat.png`, {
        frameWidth: 64, frameHeight: 72, margin: 1, spacing: 2
    })
}

function preloadLevel3() {
    // Buildings
    this.load.image('3-gym', `${CDN_URL}/assets/level3/gym.png`)
    this.load.image('3-restaurant', `${CDN_URL}/assets/level3/restaurant.png`)
    this.load.image('3-cinema', `${CDN_URL}/assets/level3/cinema.png`)
    this.load.image('3-closed', `${CDN_URL}/assets/level3/closed.png`)
    // Stock
    this.load.image('3-stock-apple', `${CDN_URL}/assets/level3/stock/ap.png`)
    this.load.image('3-stock-facebook', `${CDN_URL}/assets/level3/stock/f.png`)
    this.load.image('3-stock-amazon', `${CDN_URL}/assets/level3/stock/am.png`)
    this.load.image('3-stock-google', `${CDN_URL}/assets/level3/stock/g.png`)
    this.load.image('3-stock-microsoft', `${CDN_URL}/assets/level3/stock/m.png`)
    // Home
    this.load.image('3-home', `${CDN_URL}/assets/level3/home.png`)
    this.load.image('3-home-wall1', `${CDN_URL}/assets/level3/home-wall1.png`)
    this.load.image('3-home-wall2', `${CDN_URL}/assets/level3/home-wall2.png`)
    this.load.image('3-toilet', `${CDN_URL}/assets/level3/toilet.png`)
    this.load.image('3-book1', `${CDN_URL}/assets/level3/book1.png`)
    this.load.image('3-book2', `${CDN_URL}/assets/level3/book2.png`)
    this.load.image('3-book3', `${CDN_URL}/assets/level3/book3.png`)
    // Stock sprites
    this.load.spritesheet('3-stock-fire', `${CDN_URL}/assets/level3/stock/fire.png`, {
        frameWidth: 188, frameHeight: 112, margin: 1, spacing: 2
    })
    this.load.spritesheet('3-stock-sparks', `${CDN_URL}/assets/level3/stock/sparks.png`, {
        frameWidth: 420, frameHeight: 96, margin: 1, spacing: 2
    })
}

function preloadLevel4() {
    // Mountains, smog and dolphin
    this.load.image('4-mountain1', `${CDN_URL}/assets/level4/mountain1.png`)
    this.load.image('4-mountain2', `${CDN_URL}/assets/level4/mountain2.png`)
    this.load.image('4-mountain3', `${CDN_URL}/assets/level4/mountain3.png`)
    this.load.image('4-smog1', `${CDN_URL}/assets/level4/smog1.png`)
    this.load.image('4-smog2', `${CDN_URL}/assets/level4/smog2.png`)
    this.load.image('4-smog3', `${CDN_URL}/assets/level4/smog3.png`)
    this.load.image('4-dolphin', `${CDN_URL}/assets/level4/dolphin.png`)
    // Oil
    this.load.image('4-oil', `${CDN_URL}/assets/level4/oil.png`)
    // Zoom cloud
    this.load.image('4-cloud-small', `${CDN_URL}/assets/level4/cloud-small.png`)
    this.load.image('4-cloud-big', `${CDN_URL}/assets/level4/cloud-big.png`)
}

function preloadLevel5() {
    // BLM
    this.load.image('5-BLM', `${CDN_URL}/assets/level5/BLM.png`)
    this.load.image('5-flower1', `${CDN_URL}/assets/level5/flower1.png`)
    this.load.image('5-flower2', `${CDN_URL}/assets/level5/flower2.png`)
    this.load.image('5-flower3', `${CDN_URL}/assets/level5/flower3.png`)
    this.load.image('5-flower4', `${CDN_URL}/assets/level5/flower4.png`)
    // 5G
    this.load.image('5-5G-stand', `${CDN_URL}/assets/level5/5G-stand.png`)
    this.load.image('5-5G-box', `${CDN_URL}/assets/level5/5G-box.png`)
    this.load.image('5-5G-stand-broken', `${CDN_URL}/assets/level5/5G-stand-broken.png`)
    this.load.image('5-5G-box-broken', `${CDN_URL}/assets/level5/5G-box-broken.png`)
    // Preload
    this.load.image('5-tiktok-body', `${CDN_URL}/assets/level5/tiktok-body.png`)
    this.load.image('5-tiktok-logo', `${CDN_URL}/assets/level5/tiktok-logo.png`)
}

function preloadLevel6() {
    // Flood
    this.load.image('6-car', `${CDN_URL}/assets/level6/car.png`)
    this.load.image('6-tree', `${CDN_URL}/assets/level6/tree.png`)
    this.load.image('6-house1', `${CDN_URL}/assets/level6/house1.png`)
    this.load.image('6-house2', `${CDN_URL}/assets/level6/house2.png`)
    // Water
    this.load.spritesheet('6-water', `${CDN_URL}/assets/level6/water.png`, {
        frameWidth: 64, frameHeight: 64, margin: 1, spacing: 2
    })
    // USA president election
    this.load.image('6-statue', `${CDN_URL}/assets/level6/statue.png`)
    this.load.image('6-whitehouse', `${CDN_URL}/assets/level6/whitehouse.png`)
    this.load.image('6-finish', `${CDN_URL}/assets/level6/finish.png`)
    // President sprites
    // Run
    this.load.spritesheet('6-trump-run', `${CDN_URL}/assets/level6/trump/run.png`, {
        frameWidth: 104, frameHeight: 144, margin: 1, spacing: 2
    })
    this.load.spritesheet('6-biden-run', `${CDN_URL}/assets/level6/biden/run.png`, {
        frameWidth: 104, frameHeight: 144, margin: 1, spacing: 2
    })
    // Idle
    this.load.spritesheet('6-trump-idle', `${CDN_URL}/assets/level6/trump/idle.png`, {
        frameWidth: 116, frameHeight: 132, margin: 1, spacing: 2
    })
    this.load.spritesheet('6-biden-idle', `${CDN_URL}/assets/level6/biden/idle.png`, {
        frameWidth: 96, frameHeight: 140, margin: 1, spacing: 2
    })
    // Sad and happy
    this.load.spritesheet('6-trump-sad', `${CDN_URL}/assets/level6/trump/sad.png`, {
        frameWidth: 84, frameHeight: 136, margin: 1, spacing: 2
    })
    this.load.spritesheet('6-biden-happy', `${CDN_URL}/assets/level6/biden/happy.png`, {
        frameWidth: 96, frameHeight: 144, margin: 1, spacing: 2
    })
}

function preloadLevel7() {
    // Vaccine
    this.load.image('7-vaccine', `${CDN_URL}/assets/level7/vaccine.png`)
    this.load.image('7-syringe', `${CDN_URL}/assets/level7/syringe.png`)
    // Home
    this.load.image('7-home', `${CDN_URL}/assets/level7/home.png`)
    this.load.image('7-bush', `${CDN_URL}/assets/level7/bush.png`)
    this.load.image('7-tree1', `${CDN_URL}/assets/level7/tree1.png`)
    this.load.image('7-tree2', `${CDN_URL}/assets/level7/tree2.png`)
    // Fireworks and smoke
    this.load.spritesheet('7-smoke', `${CDN_URL}/assets/level7/smoke.png`, {
        frameWidth: 308, frameHeight: 216, margin: 1, spacing: 2
    })
    this.load.spritesheet('7-firework1', `${CDN_URL}/assets/level7/firework1.png`, {
        frameWidth: 440, frameHeight: 392, margin: 1, spacing: 2
    })
    this.load.spritesheet('7-firework2', `${CDN_URL}/assets/level7/firework2.png`, {
        frameWidth: 440, frameHeight: 392, margin: 1, spacing: 2
    })
    this.load.spritesheet('7-firework3', `${CDN_URL}/assets/level7/firework3.png`, {
        frameWidth: 440, frameHeight: 396, margin: 1, spacing: 2
    })
}

function preloadOutro() {
    // Outro
    this.load.image('o-speech-bubble', `${CDN_URL}/assets/outro/speech-bubble.png`)
    this.load.image('o-clouds', `${CDN_URL}/assets/outro/clouds.png`)
    this.load.image('o-city', `${CDN_URL}/assets/outro/city.png`)
    this.load.image('o-ufo', `${CDN_URL}/assets/outro/ufo.png`)
    this.load.image('o-godzilla', `${CDN_URL}/assets/outro/godzilla.png`)
    this.load.image('o-zombie1', `${CDN_URL}/assets/outro/zombie1.png`)
    this.load.image('o-zombie2', `${CDN_URL}/assets/outro/zombie2.png`)
    this.load.image('o-zombie3', `${CDN_URL}/assets/outro/zombie3.png`)
    this.load.image('o-zombie4', `${CDN_URL}/assets/outro/zombie4.png`)
    this.load.image('o-zombie5', `${CDN_URL}/assets/outro/zombie5.png`)
    // Godzilla ray sprite
    this.load.spritesheet('o-ray', `${CDN_URL}/assets/outro/ray.png`, {
        frameWidth: 376, frameHeight: 340, margin: 1, spacing: 2
    })
}
