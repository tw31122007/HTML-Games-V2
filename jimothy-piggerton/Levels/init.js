var LEVEL_CREATION_FUNCTIONS = [];
var PLAYER_ABILITIES = [
  function(player){},
  function(player) {player.wallJumps = true;},
  function(player) {player.maxJumps = 2; player.jumpCount = 1;},
  function(player) {player.canDash = true;},
];

var WORLDTYPE = 0;

function changeWorldType(worldType) {
  LEVEL_CREATION_FUNCTIONS[LEVEL_CREATION_FUNCTIONS.length-1].isFinalInWorld=true;
  WORLDTYPE = worldType;
}

function addLevel(func) {
  func.worldType = WORLDTYPE;
  LEVEL_CREATION_FUNCTIONS.push(func);
}

var levelsMap = {};

function createLevels() {
  var supportedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var nameSpace = {};
  for(var i = 0; i < supportedChars.length; i += 1) {
    nameSpace[supportedChars[i]] = i + 10;
  }
  var levels = [
  ];
  for(var i = 0; i < LEVEL_CREATION_FUNCTIONS.length; i += 1) {
    var creator = LEVEL_CREATION_FUNCTIONS[i];
    var level = creator(nameSpace);
    level.worldType = creator.worldType;
    level.isFinalInWorld = creator.isFinalInWorld;
    levels.push(level);
    levelsMap[level.name] = level;
  }
  return levels;
}


/*
********************************************************************************
**************************** BLANK LEVEL TEMPLATE ******************************
********************************************************************************

addLevel( function(nameSpace) {
  {

    retun {
        name: "title",
        grid: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        ]
    };

  }
});

*/