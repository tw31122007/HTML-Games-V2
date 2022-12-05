import './lib/phaser.min.js'
import Constants from './constants.js'
import Properties from './properties.js'
import { preloadAssets } from './preload.js'
import { initObjects } from './create.js'
import { processEachStep } from './update.js'
import { fontFolder, getText, lang, updateLanguage, SUPPORTED_LANGUAGES, getDonateImage } from './translate.js'

// Device sizes
const WIDTH = window.outerWidth, HEIGHT = window.outerHeight
// Check ratio from URL
let urlRatio = parseFloat(new URL(window.location.href).searchParams.get('ratio'))
// Height is constant - adjust width and scale
const GAME_HEIGHT = 640
// Game container and loading block objects
const CONTAINER = document.getElementById('game')

// Load main font with CSS
loadFont()

function loadFont() {
    let pixelFont = new FontFace('Pixel', `url(${Constants.ASSETS_URL}/assets/fonts/${fontFolder()}/main.ttf)`)
    pixelFont.load().then(function(loadedFontFace) {
        document.fonts.add(loadedFontFace)
        document.body.style.fontFamily = 'Pixel'
        updateWebsiteText()
        loadGame()
    })
}

function updateWebsiteText() {
    document.getElementById('warning').textContent = getText('warningRotate')
    document.getElementById('title').textContent = getText('title')
    document.getElementById('description').textContent = getText('description')
    document.getElementById('shareText1').textContent = getText('shareText')
    document.getElementById('shareText2').textContent = getText('shareText')
    document.getElementById('emailMe').textContent = getText('emailMe')
    document.getElementById('pressKit').textContent = getText('pressKit')
    // Donate
    let donateUrl = getText('donateUrl'), donateImgUrl = getDonateImage()
    let donate1 = document.getElementById('donate1')
    let donate2 = document.getElementById('donate2')
    // Update link
    donate1.setAttribute('href', donateUrl)
    donate2.setAttribute('href', donateUrl)
    // Update image
    donate1.children[0].setAttribute('src', donateImgUrl)
    donate2.children[0].setAttribute('src', donateImgUrl)
}

function loadGame() {
    if (Constants.IS_TOUCH_DEVICE) {
        if (WIDTH < HEIGHT) {
            // Tell to rotate
            document.body.classList.add('rotate')
        } else {
            document.body.classList.add('mobile')

            // Check for loaded
            let interval = setInterval(() => {
                if (document.body) {
                    // Clear checking and scroll to the top
                    clearInterval(interval)
                    window.scrollTo(0, 0)
                    // Get sizes
                    let offsetY = 30
                    let leftHeight = window.innerHeight - offsetY
                    let ratio = WIDTH / leftHeight
                    let finalRatio = Math.max(Math.min(ratio, Constants.MAX_GAME_RATIO), Constants.MIN_GAME_RATIO)
                    // Check from URL
                    const GAME_RATIO = urlRatio ? urlRatio : finalRatio
                    const GAME_WIDTH = GAME_HEIGHT * GAME_RATIO
                    // Define scale from current window inner width
                    const SCALE = window.innerWidth / GAME_WIDTH
                    initGame(GAME_WIDTH, GAME_HEIGHT, SCALE)
                    // Check to remove logo
                    let logo = document.getElementById('logo')
                    if (logo.clientHeight + SCALE * GAME_HEIGHT > window.innerHeight) {
                        logo.style.display = 'none'
                    }
                }
            }, 100)
        }
    } else {
        // Usual computers – leave max ratio
        const GAME_RATIO = urlRatio ? urlRatio : Constants.MAX_GAME_RATIO
        const GAME_WIDTH = GAME_HEIGHT * GAME_RATIO
        // Define scale from current window inner width
        const SCALE = window.innerWidth / GAME_WIDTH
        initGame(GAME_WIDTH, GAME_HEIGHT, SCALE)
    }
}

function initGame(gameWidth, gameHeight, scale) {
    // Config for the game
    let config = {
        type: Phaser.CANVAS,
        width: gameWidth,
        height: gameHeight,
        physics: {
            default: 'arcade',
            arcade: {
                debug: new URL(window.location.href).searchParams.get('debug') == 1
            }
        },
        fps: {
            target: 60,
        },
        scene: {
            preload: preloadAssets,
            create: initObjects,
            update: processEachStep
        },
        backgroundColor: 0x4ab2ed,
        parent: CONTAINER,
        // Show container after loading
        callbacks: {
            postBoot: () => {
                // Show canvas
                document.body.classList.add('loaded')
            }
        }
    }

    // Init Phaser game
    new Phaser.Game(config)

    // Set height from scale
    CONTAINER.style.height = `${scale * gameHeight}px`
    // Set transform - scale
    CONTAINER.children[0].style.transform = `scale(${scale}) translateY(-2px)`

    // Process language selecting
    initLanguageSelect()
    // Add sponsors click events
    handleSponsorsClick()
}

// Reload page on rotate
window.addEventListener('orientationchange', () => {
    if (!Properties.gameIsLoaded) {
        window.location.reload()
    } else {
        setTimeout(() => {
            if (window.innerWidth < window.innerHeight) {
                document.body.classList.remove('loaded')
                document.body.classList.add('rotate')
            } else {
                document.body.classList.add('loaded')
                document.body.classList.remove('rotate')
            }
        }, 500)
    }
})

function initLanguageSelect() {
    const LANGUAGE_SELECTS = document.getElementsByClassName('language-select')
    for (const select of LANGUAGE_SELECTS) {
        // Child elements
        let languageSelected = select.children[0]
        let languageDropdown = select.children[1]
        // Update current value
        languageSelected.textContent = SUPPORTED_LANGUAGES[lang]
        // Toggle dropdown on click
        languageSelected.addEventListener('click', () => languageDropdown.parentElement.classList.toggle('shown'))
        // Add other languages with update event
        for (const languageKey in SUPPORTED_LANGUAGES) {
            if (languageKey !== lang) {
                let languageElement = document.createElement('p')
                languageElement.id = languageKey
                languageElement.textContent = SUPPORTED_LANGUAGES[languageKey]
                // Update language and reload on click
                languageElement.addEventListener('click', function() {
                    updateLanguage(this.id)
                    window.location.reload()
                })
                languageDropdown.appendChild(languageElement)
            }
        }
    }
}

function handleSponsorsClick() {
    let [sponsor1, sponsor2] = document.querySelectorAll('.sponsors > a')
    // Yandex.Metrika
    sponsor1.addEventListener('click', () => ym(70640851, 'reachGoal', 'SPONSOR1_CLICK'))
    sponsor2.addEventListener('click', () => ym(70640851, 'reachGoal', 'SPONSOR2_CLICK'))
}
