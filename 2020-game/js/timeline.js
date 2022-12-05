import Properties from './properties.js'
import Level0 from './levels/level0.js'
import Level1 from './levels/level1.js'
import Level2 from './levels/level2.js'
import Level3 from './levels/level3.js'
import Level4 from './levels/level4.js'
import Level5 from './levels/level5.js'
import Level6 from './levels/level6.js'
import Level7 from './levels/level7.js'
import Outro from './levels/outro.js'

const HANDLERS = {
    // Level 0
    '0-load': Level0.preloadLevel,
    '0-checkpoint0': Level0.checkpoint0,
    '0-title': Level0.showTitle,
    // Level 1
    '1-load': Level1.preloadLevel,
    '1-checkpoint1': Level1.checkpoint1,
    '1-title': Level1.showTitle,
    '1-checkpoint2': Level1.checkpoint2,
    '1-wildfires': Level1.startWildfires,
    '1-tree-falls': Level1.treeFalls,
    '1-koala-jumps': Level1.koalaJumps,
    '1-clear': Level1.clear,
    // Level 2
    '2-load': Level2.preloadLevel,
    '2-checkpoint3': Level2.checkpoint3,
    '2-bat': Level2.addFlyingBat,
    '2-quarantine-ready': Level2.showQuarantineTitle,
    '2-clear': Level2.clear,
    // Level 3
    '3-load': Level3.preloadLevel,
    '3-checkpoint4': Level3.checkpoint4,
    '3-title': Level3.showTitle,
    '3-checkpoint5': Level3.checkpoint5,
    '3-google': Level3.stockGoogle,
    '3-amazon': Level3.stockAmazon,
    '3-microsoft': Level3.stockMicrosoft,
    '3-facebook': Level3.stockFacebook,
    '3-apple': Level3.stockApple,
    '3-checkpoint6': Level3.checkpoint6,
    '3-quarantine': Level3.startQuarantine,
    '3-resume-music': Level3.resumeMusic,
    // Level 4
    '4-load': Level4.preloadLevel,
    '4-checkpoint7': Level4.checkpoint7,
    '4-title': Level4.showTitle,
    '4-smog': Level4.fadeOutSmog,
    '4-dolphins': Level4.addDolphins,
    '4-checkpoint8': Level4.checkpoint8,
    '4-checkpoint9': Level4.checkpoint9,
    '4-clear': Level4.clear,
    // Level 5
    '5-load': Level5.preloadLevel,
    '5-checkpoint10': Level5.checkpoint10,
    '5-checkpoint11': Level5.checkpoint11,
    '5-5G-start': Level5.startCoronaGeneration,
    '5-5G-stop': Level5.stopCoronaGeneration,
    '5-checkpoint12': Level5.checkpoint12,
    '5-clear': Level5.clear,
    // Level 6
    '6-load': Level6.preloadLevel,
    '6-checkpoint13': Level6.checkpoint13,
    '6-floods': Level6.floodsTitle,
    '6-checkpoint14': Level6.checkpoint14,
    '6-race': Level6.raceTitle,
    '6-race1': () => Level6.startRace(),
    '6-race2': () => Level6.bidenLeads(),
    '6-race3': () => Level6.trumpLeads(),
    '6-race4': () => Level6.bidenNitro(),
    '6-clear': Level6.clear,
    // Level 7
    '7-load': Level7.preloadLevel,
    '7-checkpoint15': Level7.checkpoint15,
    '7-title': Level7.showTitle,
    '7-attack-start': Level7.startCorona,
    '7-attack-stop': Level7.removeCorona,
    '7-reset': Level7.removeSyringe,
    '7-game-win': Level7.gameWin,
    '7-clear': Level7.clear,
    // Outro
    'o-load': Outro.preloadLevel
}

let current = 0

export function moveToEvent(eventName) {
    // Shift
    shiftTimeline(eventName)
    // Get event
    let event = Properties.timelineEvents[current]
    // Get current level number
    let level = parseInt(event.name[0])
    // Check and load previous level
    if (level > 0) { handleEvent(`${level - 1}-load`) }
    // Then load current level
    handleEvent(`${level}-load`)
    // Move camera and player
    if (level === 0) {
        // Place in the beginning for Level 0
        let offsetX = 250
        Properties.camera.scrollX = event.x
        Properties.player.x = event.x + offsetX
    } else {
        // Place in center for other levels
        Properties.camera.scrollX = event.x - Properties.sceneSize.width / 2
        Properties.player.x = event.x
    }
}

export function shiftTimeline(eventName) {
    // Seek for the event
    let index = Properties.timelineEvents.findIndex(event => event.name === eventName)
    // Set current from index (to 0 if not found)
    current = index !== -1 ? index : 0
}

export function checkTimeline() {
    if (current >= Properties.timelineEvents.length) { return }

    if (Properties.timelineEvents[current].x <= Properties.player.x) {
        let currentEvent = Properties.timelineEvents[current].name
        // Handle
        handleEvent(currentEvent)
        // Move to next event
        current++
    }
}

function handleEvent(event) {
    if (event in HANDLERS) {
        HANDLERS[event]()
    } else {
        console.log(`${event} event handler not found`)
    }
}
