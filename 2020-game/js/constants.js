export default {
    // For device params
    IS_TOUCH_DEVICE: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    MIN_GAME_RATIO: 2,
    MAX_GAME_RATIO: 3.3,
    // CDN
    // ASSETS_URL: 'https://3ad68020-4d43-4164-8772-43d3de9c78fd.akamaized.net',
    ASSETS_URL: '.',
    // Debug
    DEBUG: false,
    DEBUG_POINT: '7-game-win',
    // Checkpoints
    CHECKPOINTS: {
        0: '0-checkpoint0',
        1: '1-checkpoint1',
        2: '1-checkpoint2',
        3: '2-checkpoint3',
        4: '3-checkpoint4',
        5: '3-checkpoint5',
        6: '3-checkpoint6',
        7: '4-checkpoint7',
        8: '4-checkpoint8',
        9: '4-checkpoint9',
        10: '5-checkpoint10',
        11: '5-checkpoint11',
        12: '5-checkpoint12',
        13: '6-checkpoint13',
        14: '6-checkpoint14',
        15: '7-checkpoint15',
    },
    VOLUME: {
        intro: 0.1,
        hell: 0.6,
        main: 0.3
    },
    // For Arcade
    GRAVITY_FROM_HEIGHT: 3,
    VELOCITY_X_FROM_HEIGHT: 0.8,
    VELOCITY_Y_FROM_HEIGHT: -5,
    // Foreground from height
    FOREGROUND: 0.1,
    // Game objects params
    TITLE_FONT_SIZE: 64,
    // Depth values
    DEPTH: {
        // Super first plan
        important: 1,
        // Main plan
        foregroundMain: 0,
        // Secondary
        foregroundSecondary: -1,
        // Background
        background: -2
    },
    // Tween durations
    DURATION: {
        bird: 8000,
        treeFalls: 2000,
        bat: 8000,
        quarantine: 13000,
        smogMoves: 4000,
        floodObjects: 1000
    },
    // Tilemap main image types
    OBJECT_TYPES: {
        image: 'image',
        static: 'static',
        background: 'background'
    }
}
