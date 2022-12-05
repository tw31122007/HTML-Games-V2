FullScreenMario.FullScreenMario.settings.maps = {
    "mapDefault": "1-1",
    "locationDefault": "0",
    "groupTypes": ["Character", "Solid", "Scenery", "Text"],
    "requireEntrance": true,
    "screenAttributes": [
        "gravity",
        "setting",
        "time",
        "underwater",
        "floor",
        "jumpmod",
        "maxyvel",
        "maxyvelinv",
        "notime",
        "nokeys",
        "canscroll"
    ],
    "screenVariables": {
        "bottomDeathDifference": function (GameStarter) {
            return GameStarter.unitsize * 12;
        },
        "bottomPlatformMax": function (GameStarter) {
            var area = GameStarter.AreaSpawner.getArea(),
                diff = GameStarter.MapScreener.bottomDeathDifference;
                
            if (!area) {
                return -1;
            }
                
            return (area.floor + diff) * GameStarter.unitsize;
        },
        "gravity": function (GameStarter) {
            var area = GameStarter.AreaSpawner.getArea();
            
            if (area && area.underwater) {
                return GameStarter.gravity / 2.8;
            }
            
            return GameStarter.gravity;
        }
    },
    "onSpawn": FullScreenMario.FullScreenMario.prototype.addPreThing,
    "macros": {
        "Example": FullScreenMario.Macros.prototype.macroExample,
        "Fill": FullScreenMario.Macros.prototype.macroFillPreThings,
        "Pattern": FullScreenMario.Macros.prototype.macroFillPrePattern,
        "Floor": FullScreenMario.Macros.prototype.macroFloor,
        "Pipe": FullScreenMario.Macros.prototype.macroPipe,
        "PipeCorner": FullScreenMario.Macros.prototype.macroPipeCorner,
        "Tree": FullScreenMario.Macros.prototype.macroTree,
        "Shroom": FullScreenMario.Macros.prototype.macroShroom,
        "Water": FullScreenMario.Macros.prototype.macroWater,
        "CastleSmall": FullScreenMario.Macros.prototype.macroCastleSmall,
        "CastleLarge": FullScreenMario.Macros.prototype.macroCastleLarge,
        "Ceiling": FullScreenMario.Macros.prototype.macroCeiling,
        "Bridge": FullScreenMario.Macros.prototype.macroBridge,
        "Scale": FullScreenMario.Macros.prototype.macroScale,
        "PlatformGenerator": FullScreenMario.Macros.prototype.macroPlatformGenerator,
        "WarpWorld": FullScreenMario.Macros.prototype.macroWarpWorld,
        "CheepsStart": FullScreenMario.Macros.prototype.macroCheepsStart,
        "CheepsStop": FullScreenMario.Macros.prototype.macroCheepsStop,
        "BulletBillsStart": FullScreenMario.Macros.prototype.macroBulletBillsStart,
        "BulletBillsStop": FullScreenMario.Macros.prototype.macroBulletBillsStop,
        "LakituStop": FullScreenMario.Macros.prototype.macroLakituStop,
        "StartInsideCastle": FullScreenMario.Macros.prototype.macroStartInsideCastle,
        "EndOutsideCastle": FullScreenMario.Macros.prototype.macroEndOutsideCastle,
        "EndInsideCastle": FullScreenMario.Macros.prototype.macroEndInsideCastle,
        "Section": FullScreenMario.Macros.prototype.macroSection,
        "SectionPass": FullScreenMario.Macros.prototype.macroSectionPass,
        "SectionFail": FullScreenMario.Macros.prototype.macroSectionFail,
        "SectionDecider": FullScreenMario.Macros.prototype.macroSectionDecider
    },
    "entrances": {
        "Normal": FullScreenMario.Transports.prototype.mapEntranceNormal,
        "Plain": FullScreenMario.Transports.prototype.mapEntrancePlain,
        "Castle": FullScreenMario.Transports.prototype.mapEntranceCastle,
        "Walking": FullScreenMario.Transports.prototype.mapEntranceWalking,
        "Vine": FullScreenMario.Transports.prototype.mapEntranceVine,
        "PipeVertical": FullScreenMario.Transports.prototype.mapEntrancePipeVertical,
        "PipeHorizontal": FullScreenMario.Transports.prototype.mapEntrancePipeHorizontal,
    },
    "patterns": (function (patterns) {
        var pattern,
            i;
        for (i in patterns) {
            if (patterns.hasOwnProperty(i)) {
                pattern = patterns[i];
                if (!pattern.length) {
                    continue;
                }
                
                // Pattern's last array should previously be ["blank", width]
                pattern.width = pattern[pattern.length - 1][1];
                pattern.pop();
            }
        }
        return patterns;
    })({
        "BackRegular": [
            ["HillLarge", 0, 0],
            ["Cloud1", 68, 68],
            ["Bush3", 92, 0],
            ["HillSmall", 128, 0],
            ["Cloud1", 156, 76],
            ["Bush1", 188, 0],
            ["Cloud3", 220, 68],
            ["Cloud2", 292, 76],
            ["Bush2", 332, 0],
            ["Blank", 384]
        ],
        "BackCloud": [
            ["Cloud2", 28, 64],
            ["Cloud1", 76, 32],
            ["Cloud2", 148, 72],
            ["Cloud1", 228, 0],
            ["Cloud1", 284, 32],
            ["Cloud1", 308, 40],
            ["Cloud1", 372, 0],
            ["Blank", 384]
        ],
        "BackFence": [
            ["PlantSmall", 88, 0],
            ["PlantLarge", 104, 0],
            ["Fence", 112, 0, 32],
            ["Cloud1", 148, 68],
            ["PlantLarge", 168, 0],
            ["PlantSmall", 184, 0],
            ["PlantSmall", 192, 0],
            ["Cloud1", 220, 76],
            ["Cloud2", 244, 68],
            ["Fence", 304, 0, 16],
            ["PlantSmall", 320, 0],
            ["Fence", 328, 0],
            ["PlantLarge", 344, 0],
            ["Cloud1", 364, 76],
            ["Cloud2", 388, 68],
            ["Blank", 384]
        ],
        "BackFenceMin": [
            ["PlantLarge", 104, 0],
            ["Fence", 112, 0, 32],
            ["Cloud1", 148, 68],
            ["PlantLarge", 168, 0],
            ["PlantSmall", 184, 0],
            ["PlantSmall", 192, 0],
            ["Cloud1", 220, 76],
            ["Cloud2", 244, 68],
            ["Fence", 304, 0, 16],
            ["PlantSmall", 320, 0],
            ["Fence", 328, 0],
            ["Cloud1", 364, 76],
            ["Cloud2", 388, 68],
            ["Blank", 384]
        ],
        "BackFenceMin2": [
            ["Cloud2", 4, 68],
            ["PlantSmall", 88, 0],
            ["PlantLarge", 104, 0],
            ["Fence", 112, 0],
            ["Fence", 128, 0, 16],
            ["Cloud1", 148, 68],
            // ["PlantLarge", 168, 0],
            ["PlantSmall", 184, 0],
            ["PlantSmall", 192, 0],
            ["Cloud1", 220, 76],
            ["Cloud2", 244, 68],
            ["Fence", 304, 0, 16],
            ["PlantSmall", 320, 0],
            ["Fence", 328, 0],
            ["PlantLarge", 344, 0],
            ["Cloud1", 364, 76],
            ["Cloud2", 388, 68],
            ["Blank", 384]
        ],
        "BackFenceMin3": [
            ["Cloud2", 4, 68],
            ["PlantSmall", 88, 0],
            ["PlantLarge", 104, 0],
            ["Fence", 112, 0, 4],
            ["Cloud1", 148, 68],
            ["PlantSmall", 184, 0],
            ["PlantSmall", 192, 0],
            ["Cloud1", 220, 76],
            ["Cloud2", 244, 68],
            ["Cloud1", 364, 76],
            ["Cloud2", 388, 68],
            ["Blank", 384]
        ]
    }),
    "library": {}
};
