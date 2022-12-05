// @ifdef INCLUDE_DEFINITIONS
/// <reference path="FullScreenMario.d.ts" />
// @endif
var FullScreenMario;
(function (FullScreenMario) {
    "use strict";
    /**
     * Storage for macro Functions in FullScreenMario.
     */
    var Macros = (function () {
        function Macros() {
        }
        /**
         * Macro to place a single type of Thing multiple times, drawing from a
         * bottom/left corner to a top/right corner.
         *
         * @alias Fill
         * @param reference   Settings for a FillPreThings macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A single type of Thing any number of times.
         */
        Macros.prototype.macroFillPreThings = function (reference, prethings, area, map, FSM) {
            var defaults = FSM.ObjectMaker.getFullPropertiesOf(reference.thing), xnum = reference.xnum || 1, ynum = reference.ynum || 1, xwidth = reference.xwidth || defaults.width, yheight = reference.yheight || defaults.height, x = reference.x || 0, yref = reference.y || 0, outputs = [], output, o = 0, y, i, j;
            for (i = 0; i < xnum; ++i) {
                y = yref;
                for (j = 0; j < ynum; ++j) {
                    output = {
                        "x": x,
                        "y": y,
                        "macro": undefined
                    };
                    outputs.push(FSM.proliferate(output, reference, true));
                    o += 1;
                    y += yheight;
                }
                x += xwidth;
            }
            return outputs;
        };
        /**
         * Macro to continuously place a listing of Things multiple times, from left
         * to right. This is commonly used for repeating background scenery.
         *
         * @alias Pattern
         * @param reference   Settings for a FillPrePattern macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns Preset Things in a pattern.
         */
        Macros.prototype.macroFillPrePattern = function (reference, prethings, area, map, FSM) {
            if (!FSM.settings.maps.patterns[reference.pattern]) {
                throw new Error("An unknown pattern is referenced: " + reference);
            }
            var pattern = FSM.settings.maps.patterns[reference.pattern], length = pattern.length, defaults = FSM.ObjectMaker.getFullProperties(), repeats = reference.repeat || 1, xpos = reference.x || 0, ypos = reference.y || 0, outputs = [], o = 0, skips = {}, prething, output, i, j;
            // If skips are given, record them in an Object for quick access
            if (typeof reference.skips !== "undefined") {
                for (i = 0; i < reference.skips.length; i += 1) {
                    skips[reference.skips[i]] = true;
                }
            }
            // For each time the pattern should be repeated:
            for (i = 0; i < repeats; i += 1) {
                // For each Thing listing in the pattern:
                for (j = 0; j < length; j += 1) {
                    // Don't place if marked in skips
                    if (skips[j]) {
                        continue;
                    }
                    prething = pattern[j];
                    output = {
                        "thing": prething[0],
                        "x": xpos + prething[1],
                        "y": ypos + prething[2]
                    };
                    output.y += defaults[prething[0]].height;
                    if (prething[3]) {
                        output.width = prething[3];
                    }
                    outputs.push(output);
                    o += 1;
                }
                xpos += pattern.width;
            }
            return outputs;
        };
        /**
         * Macro to place a Floor Thing with infinite height. All settings are
         * passed in except "macro", which becomes undefined.
         *
         * @alias Floor
         * @param reference   Settings for a Floor macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A single Floor.
         */
        Macros.prototype.macroFloor = function (reference, prethings, area, map, FSM) {
            var x = reference.x || 0, y = reference.y || 0, floor = FSM.proliferate({
                "thing": "Floor",
                "x": x,
                "y": y,
                "width": (reference.width || 8),
                "height": "Infinity"
            }, reference, true);
            floor.macro = undefined;
            return floor;
        };
        /**
         * Macro to place a Pipe, possibly with a pirahna, location hooks, and/or
         * infinite height. All settings are copied to Pipe except for "macro",
         * which becomes undefined.
         *
         * @alias Pipe
         * @param reference   Settings for a Pipe macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A Pipe, and potentially a Piranha.
         */
        Macros.prototype.macroPipe = function (reference, prethings, area, map, scope) {
            var x = reference.x || 0, y = reference.y || 0, height = reference.height || 16, pipe = FullScreenMario.FullScreenMario.prototype.proliferate({
                "thing": "Pipe",
                "x": x,
                "y": y,
                "width": 16,
                "height": reference.height === Infinity
                    ? "Infinity"
                    : reference.height || 8
            }, reference, true), output = [pipe];
            pipe.macro = undefined;
            if (height === "Infinity" || height === Infinity) {
                pipe.height = scope.MapScreener.height;
            }
            else {
                pipe.y += height;
            }
            if (reference.piranha) {
                output.push({
                    "thing": "Piranha",
                    "x": x + 4,
                    "y": pipe.y + 12,
                    "onPipe": true
                });
            }
            return output;
        };
        /**
         * Macro to place a horizontal Pipe with a vertical one, likely with
         * location hooks.
         *
         * @alias PipeCorner
         * @param reference   Settings for a PipeCorner macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A horizontal Pipe and a vertical Pipe.
         */
        Macros.prototype.macroPipeCorner = function (reference, prethings, area, map, scope) {
            var x = reference.x || 0, y = reference.y || 0, height = reference.height || 16, output = [
                {
                    "thing": "PipeHorizontal",
                    "x": x,
                    "y": y,
                    "transport": reference.transport || 0
                },
                {
                    "thing": "PipeVertical",
                    "x": x + 16,
                    "y": y + height - 16,
                    "height": height
                }
            ];
            if (reference.scrollEnabler) {
                output.push({
                    "thing": "ScrollEnabler",
                    "x": x + 16,
                    "y": y + height + 48,
                    "height": 64,
                    "width": 16
                });
            }
            if (reference.scrollBlocker) {
                output.push({
                    "thing": "ScrollBlocker",
                    "x": x + 32
                });
            }
            return output;
        };
        /**
         * Macro to place a Tree.
         *
         * @alias Tree
         * @param reference   Settings for a Tree macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A Tree and its trunk.
         */
        Macros.prototype.macroTree = function (reference, prethings, area, map, scope) {
            var x = reference.x || 0, y = reference.y || 0, width = reference.width || 24, output = [
                {
                    "thing": "TreeTop",
                    "x": x,
                    "y": y,
                    "width": width
                }
            ];
            if (width > 16) {
                output.push({
                    "thing": "TreeTrunk",
                    "x": x + 8,
                    "y": y - 8,
                    "width": width - 16,
                    "height": "Infinity",
                    "groupType": reference.solidTrunk ? "Solid" : "Scenery"
                });
            }
            return output;
        };
        /**
         * Macro to place a large Shroom (a Tree that looks like a large Mushroom).
         *
         * @alias Shroom
         * @param reference   Settings for a Shroom macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A Shroom and its trunk.
         */
        Macros.prototype.macroShroom = function (reference, prethings, area, map, scope) {
            var x = reference.x || 0, y = reference.y || 0, width = reference.width || 24, output = [
                {
                    "thing": "ShroomTop",
                    "x": x,
                    "y": y,
                    "width": width
                }
            ];
            if (width > 16) {
                output.push({
                    "thing": "ShroomTrunk",
                    "x": x + (width - 8) / 2,
                    "y": y - 8,
                    "height": Infinity,
                    "groupType": reference.solidTrunk ? "Solid" : "Scenery"
                });
            }
            return output;
        };
        /**
         * Macro to place Water of infinite height. All settings are copied to the
         * Water except for "macro", which becomes undefined.
         *
         * @alias Water
         * @param reference   Settings for a Water macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A Water scenery.
         */
        Macros.prototype.macroWater = function (reference, prethings, area, map, FSM) {
            return FSM.proliferate({
                "thing": "Water",
                "x": reference.x || 0,
                "y": (reference.y || 0) + 2,
                "height": "Infinity",
                "macro": undefined
            }, reference, true);
        };
        /**
         * Macro to place a row of Bricks at y = 88.
         *
         * @alias Ceiling
         * @param reference   Settings for a Ceiling macro.
         * @returns A Brick ceiling.
         */
        Macros.prototype.macroCeiling = function (reference) {
            return {
                "macro": "Fill",
                "thing": "Brick",
                "x": reference.x,
                "y": 88,
                "xnum": (reference.width / 8) | 0,
                "xwidth": 8
            };
        };
        /**
         * Macro to place a bridge, possibly with columns at the start and/or end.
         *
         * @alias Bridge
         * @param reference   Settings for a Bridge macro.
         * @returns A bridge.
         */
        Macros.prototype.macroBridge = function (reference) {
            var x = reference.x || 0, y = reference.y || 0, width = Math.max(reference.width || 0, 16), output = [];
            // A beginning column reduces the width and pushes it forward
            if (reference.begin) {
                width -= 8;
                output.push({
                    "thing": "Stone",
                    "x": x,
                    "y": y,
                    "height": "Infinity"
                });
                x += 8;
            }
            // An ending column just reduces the width 
            if (reference.end) {
                width -= 8;
                output.push({
                    "thing": "Stone",
                    "x": x + width,
                    "y": y,
                    "height": "Infinity"
                });
            }
            // Between any columns is a BridgeBase with a Railing on top
            output.push({ "thing": "BridgeBase", "x": x, "y": y, "width": width });
            output.push({ "thing": "Railing", "x": x, "y": y + 4, "width": width });
            return output;
        };
        /**
         * Macro to place a scale, which is two Platforms seemingly suspended
         * by Strings.
         *
         * @alias Scale
         * @param reference   Settings for a Scale macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A scale group.
         */
        Macros.prototype.macroScale = function (reference, prethings, area, map, FSM) {
            var x = reference.x || 0, y = reference.y || 0, unitsize = FSM.unitsize, widthLeft = reference.widthLeft || 24, widthRight = reference.widthRight || 24, between = reference.between || 40, dropLeft = reference.dropLeft || 24, dropRight = reference.dropRight || 24, collectionName = "ScaleCollection--" + [
                x, y, widthLeft, widthRight, dropLeft, dropRight
            ].join(",");
            return [
                {
                    "thing": "String",
                    "x": x,
                    "y": y - 4,
                    "height": dropLeft - 4,
                    "collectionName": collectionName,
                    "collectionKey": "stringLeft"
                },
                {
                    "thing": "String",
                    "x": x + between,
                    "y": y - 4,
                    "height": dropRight - 4,
                    "collectionName": collectionName,
                    "collectionKey": "stringRight"
                }, {
                    "thing": "String",
                    "x": x + 4,
                    "y": y,
                    "width": between - 7,
                    "collectionName": collectionName,
                    "collectionKey": "stringMiddle"
                }, {
                    "thing": "StringCornerLeft",
                    "x": x,
                    "y": y
                }, {
                    "thing": "StringCornerRight",
                    "x": x + between - 4,
                    "y": y
                }, {
                    "thing": "Platform",
                    "x": x - (widthLeft / 2),
                    "y": y - dropLeft,
                    "width": widthLeft,
                    "inScale": true,
                    "tension": (dropLeft - 1.5) * unitsize,
                    "onThingAdd": FSM.spawns.spawnScalePlatform,
                    "collectionName": collectionName,
                    "collectionKey": "platformLeft"
                }, {
                    "thing": "Platform",
                    "x": x + between - (widthRight / 2),
                    "y": y - dropRight,
                    "width": widthRight,
                    "inScale": true,
                    "tension": (dropRight - 1.5) * unitsize,
                    "onThingAdd": FSM.spawns.spawnScalePlatform,
                    "collectionName": collectionName,
                    "collectionKey": "platformRight"
                }];
        };
        /**
         * Macro to place Platforms traveling and spawning vertically.
         *
         * @alias PlatformGenerator
         * @param reference   Settings for a PlatformGenerator macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns Multiple Platforms.
         */
        Macros.prototype.macroPlatformGenerator = function (reference, prethings, area, map, FSM) {
            var output = [], direction = reference.direction || 1, levels = direction > 0 ? [0, 48] : [8, 56], width = reference.width || 16, x = reference.x || 0, yvel = direction * FSM.unitsize * .42, i;
            for (i = 0; i < levels.length; i += 1) {
                output.push({
                    "thing": "Platform",
                    "x": x,
                    "y": levels[i],
                    "width": width,
                    "yvel": yvel,
                    "movement": FSM.movements.movePlatformSpawn
                });
            }
            output.push({
                "thing": "PlatformString",
                "x": x + (width / 2) - .5,
                "y": FSM.MapScreener.floor,
                "width": 1,
                "height": FSM.MapScreener.height / FSM.unitsize
            });
            return output;
        };
        /**
         * Macro to place a Warp World group of Pipes, Texts, Piranhas, and
         * detectors.
         *
         * @alias WarpWorld
         * @param reference   Settings for a WarpWorld macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A Warp World group.
         */
        Macros.prototype.macroWarpWorld = function (reference, prethings, area, map, FSM) {
            var output = [], x = reference.x || 0, y = reference.y || 0, textHeight = reference.hasOwnProperty("textHeight") ? reference.textHeight : 8, warps = reference.warps, collectionName = "WarpWorldCollection-" + warps.join("."), keys = [], i;
            output.push({
                "thing": "CustomText",
                "x": x + 8,
                "y": y + textHeight + 56,
                "texts": [{
                        "text": "WELCOME TO WARP WORLD!"
                    }],
                "textAttributes": {
                    "hidden": true
                },
                "collectionName": collectionName,
                "collectionKey": "Welcomer"
            });
            output.push({
                "thing": "DetectCollision",
                "x": x + 64,
                "y": y + 174,
                "width": 40,
                "height": 102,
                "activate": FSM.activateWarpWorld,
                "collectionName": collectionName,
                "collectionKey": "Detector"
            });
            for (i = 0; i < warps.length; i += 1) {
                keys.push(i);
                output.push({
                    "macro": "Pipe",
                    "x": x + 8 + i * 32,
                    "height": 24,
                    "transport": { "map": warps[i] + "-1" },
                    "collectionName": collectionName,
                    "collectionKey": i + "-Pipe"
                });
                output.push({
                    "thing": "Piranha",
                    "x": x + 12 + i * 32,
                    "y": y + 36,
                    "collectionName": collectionName,
                    "collectionKey": i + "-Piranha"
                });
                output.push({
                    "thing": "CustomText",
                    "x": x + 14 + i * 32,
                    "y": y + 32 + textHeight,
                    "texts": [{
                            "text": String(warps[i])
                        }],
                    "textAttributes": {
                        "hidden": true
                    },
                    "collectionName": collectionName,
                    "collectionKey": i + "-Text"
                });
            }
            if (warps.length === 1) {
                for (i = 2; i < output.length; i += 1) {
                    output[i].x += 32;
                }
            }
            return output;
        };
        /**
         * Macro to place a DetectCollision that will start the map spawning random
         * CheepCheeps intermittently.
         *
         * @alias CheepsStart
         * @param reference   Settings for a CheepsStart macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A detector to start spawning CheepCheeps.
         */
        Macros.prototype.macroCheepsStart = function (reference, prethings, area, map, FSM) {
            return {
                "thing": "DetectCollision",
                "x": reference.x || 0,
                "y": FSM.MapScreener.floor,
                "width": reference.width || 8,
                "height": FSM.MapScreener.height / FSM.unitsize,
                "activate": FSM.activateCheepsStart
            };
        };
        /**
         * Macro to place a DetectCollision that will stop the map spawning random
         * CheepCheeps intermittently.
         *
         * @alias CheepsStop
         * @param reference   Settings for a CheepsStop macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A detector to stop spawning CheepCheeps.
         */
        Macros.prototype.macroCheepsStop = function (reference, prethings, area, map, FSM) {
            return {
                "thing": "DetectCollision",
                "x": reference.x || 0,
                "y": FSM.MapScreener.floor,
                "width": reference.width || 8,
                "height": FSM.MapScreener.height / FSM.unitsize,
                "activate": FSM.activateCheepsStop
            };
        };
        /**
         * Macro to place a DetectCollision that will start the map spawning random
         * BulletBills intermittently.
         *
         * @alias BulletBillsStart
         * @param reference   Settings for a BulletBillsStart macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A detector to start spawning BulletBills.
         */
        Macros.prototype.macroBulletBillsStart = function (reference, prethings, area, map, FSM) {
            return {
                "thing": "DetectCollision",
                "x": reference.x || 0,
                "y": FSM.MapScreener.floor,
                "width": reference.width || 8,
                "height": FSM.MapScreener.height / FSM.unitsize,
                "activate": FSM.activateBulletBillsStart
            };
        };
        /**
         * Macro to place a DetectCollision that will stop the map spawning random
         * BulletBills intermittently.
         *
         * @alias BulletBillsStop
         * @param reference   Settings for a BulletBillsStop macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A detector to stop spawning BulletBills.
         */
        Macros.prototype.macroBulletBillsStop = function (reference, prethings, area, map, FSM) {
            return {
                "thing": "DetectCollision",
                "x": reference.x || 0,
                "y": FSM.MapScreener.floor,
                "width": reference.width || 8,
                "height": FSM.MapScreener.height / FSM.unitsize,
                "activate": FSM.activateBulletBillsStop
            };
        };
        /**
         * Macro to place a DetectCollision that will tell any current Lakitu to
         * flee the scene.
         *
         * @alias LakituStop
         * @param reference   Settings for a LakituStop macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A detector to cause any current Lakitu to flee.
         */
        Macros.prototype.macroLakituStop = function (reference, prethings, area, map, FSM) {
            return {
                "thing": "DetectCollision",
                "x": reference.x || 0,
                "y": FSM.MapScreener.floor,
                "width": reference.width || 8,
                "height": FSM.MapScreener.height / FSM.unitsize,
                "activate": FSM.activateLakituStop
            };
        };
        /**
         * Macro to place a small castle, which is really a collection of sceneries.
         *
         * @alias CastleSmall
         * @param reference   Settings for a CastleSmall macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A small castle.
         */
        Macros.prototype.macroCastleSmall = function (reference, prethings, area, map, FSM) {
            var output = [], x = reference.x || 0, y = reference.y || 0, i, j;
            // Base filling left
            for (i = 0; i < 2; i += 1) {
                output.push({
                    "thing": "BrickHalf",
                    "x": x + i * 8,
                    "y": y + 4,
                    "position": "end"
                });
                for (j = 1; j < 3; j += 1) {
                    output.push({
                        "thing": "BrickPlain",
                        "x": x + i * 8,
                        "y": y + 4 + j * 8,
                        "position": "end"
                    });
                }
            }
            // Base filling right
            for (i = 0; i < 2; i += 1) {
                output.push({
                    "thing": "BrickHalf",
                    "x": x + 24 + i * 8,
                    "y": y + 4,
                    "position": "end"
                });
                for (j = 1; j < 3; j += 1) {
                    output.push({
                        "thing": "BrickPlain",
                        "x": x + 24 + i * 8,
                        "y": y + 4 + j * 8,
                        "position": "end"
                    });
                }
            }
            // Medium railing left
            output.push({
                "thing": "CastleRailing",
                "x": x,
                "y": y + 24,
                "position": "end"
            });
            // Medium railing center
            for (i = 0; i < 3; i += 1) {
                output.push({
                    "thing": "CastleRailingFilled",
                    "x": x + (i + 1) * 8,
                    "y": y + 24,
                    "position": "end"
                });
            }
            // Medium railing right
            output.push({
                "thing": "CastleRailing",
                "x": x + 32,
                "y": y + 24,
                "position": "end"
            });
            // Top railing
            for (i = 0; i < 3; i += 1) {
                output.push({
                    "thing": "CastleRailing",
                    "x": x + (i + 1) * 8,
                    "y": y + 40,
                    "position": "end"
                });
            }
            // Top bricking
            for (i = 0; i < 2; i += 1) {
                output.push({
                    "thing": "CastleTop",
                    "x": x + 8 + i * 12,
                    "y": y + 36,
                    "position": "end"
                });
            }
            // Door, and detector if required
            output.push({
                "thing": "CastleDoor",
                "x": x + 16,
                "y": y + 20,
                "position": "end"
            });
            if (reference.transport) {
                output.push({
                    "thing": "DetectCollision",
                    "x": x + 24,
                    "y": y + 16,
                    "height": 16,
                    "activate": FSM.collisions.collideCastleDoor,
                    "transport": reference.transport,
                    "position": "end"
                });
            }
            return output;
        };
        /**
         * Macro to place a large castle, which is really a collection of sceneries
         * underneath a small castle.
         *
         * @alias CastleLarge
         * @param reference   Settings for a CastleLarge macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A large castle.
         */
        Macros.prototype.macroCastleLarge = function (reference, prethings, area, map, FSM) {
            var output = [], x = reference.x || 0, y = reference.y || 0, i, j;
            output.push({
                "macro": "CastleSmall",
                "x": x + 16,
                "y": y + 48
            });
            // CastleWalls left
            for (i = 0; i < 2; i += 1) {
                output.push({
                    "thing": "CastleWall",
                    "x": x + i * 8,
                    "y": y + 48
                });
            }
            // Bottom doors with bricks on top
            for (i = 0; i < 3; i += 1) {
                output.push({
                    "thing": "CastleDoor",
                    "x": x + 16 + i * 16,
                    "y": y + 20,
                    "position": "end"
                });
                for (j = 0; j < 2; j += 1) {
                    output.push({
                        "thing": "BrickPlain",
                        "x": x + 16 + i * 16,
                        "y": y + 28 + j * 8
                    });
                    output.push({
                        "thing": "BrickHalf",
                        "x": x + 16 + i * 16,
                        "y": y + 40 + j * 4
                    });
                }
            }
            // Bottom bricks with doors on top
            for (i = 0; i < 2; i += 1) {
                for (j = 0; j < 3; j += 1) {
                    output.push({
                        "thing": "BrickPlain",
                        "x": x + 24 + i * 16,
                        "y": y + 8 + j * 8
                    });
                }
                output.push({
                    "thing": "CastleDoor",
                    "x": x + 24 + i * 16,
                    "y": y + 44
                });
            }
            // Railing (filled)
            for (i = 0; i < 5; i += 1) {
                output.push({
                    "thing": "CastleRailingFilled",
                    "x": x + 16 + i * 8,
                    "y": y + 48
                });
            }
            // CastleWalls right
            j = reference.hasOwnProperty("walls") ? reference.walls : 2;
            for (i = 0; i < j; i += 1) {
                output.push({
                    "thing": "CastleWall",
                    "x": x + 56 + i * 8,
                    "y": y + 48,
                    "position": "end"
                });
            }
            if (reference.transport) {
                output.push({
                    "thing": "DetectCollision",
                    "x": x + 24,
                    "y": y + 16,
                    "height": 16,
                    "activate": FSM.collisions.collideCastleDoor,
                    "transport": reference.transport,
                    "position": "end"
                });
            }
            return output;
        };
        /**
         * Macro to place the typical starting Things for the inside of a castle
         * area.
         *
         * @alias StartInsideCastle
         * @param reference   Settings for a StartInsideCastle macro.
         * @returns A starting zone for the inside of a castle.
         */
        Macros.prototype.macroStartInsideCastle = function (reference) {
            var x = reference.x || 0, y = reference.y || 0, width = (reference.width || 0) - 40, output = [
                {
                    "thing": "Stone",
                    "x": x,
                    "y": y + 48,
                    "width": 24,
                    "height": Infinity
                },
                {
                    "thing": "Stone",
                    "x": x + 24,
                    "y": y + 40,
                    "width": 8,
                    "height": Infinity
                },
                {
                    "thing": "Stone",
                    "x": x + 32,
                    "y": y + 32,
                    "width": 8,
                    "height": Infinity
                }];
            if (width > 0) {
                output.push({
                    "macro": "Floor",
                    "x": x + 40,
                    "y": y + 24,
                    "width": width
                });
            }
            return output;
        };
        /**
         * Macro to place the typical ending Things for the inside of an outdoor
         * area.
         *
         * @alias EndOutsideCastle
         * @param reference   Settings for an EndOutsideCastle macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns An outdoors castle ending.
         */
        Macros.prototype.macroEndOutsideCastle = function (reference, prethings, area, map, FSM) {
            var x = reference.x || 0, y = reference.y || 0, collectionName = "EndOutsideCastle-" + [
                reference.x, reference.y, reference.large
            ].join(","), output;
            // Output starts off with the general flag & collision detection
            output = [
                // Initial collision detector
                {
                    "thing": "DetectCollision", x: x, y: y + 108, height: 100,
                    "activate": FullScreenMario.Collisions.prototype.collideFlagpole,
                    "activateFail": FullScreenMario.FullScreenMario.prototype.killNormal,
                    "noActivateDeath": true,
                    "collectionName": collectionName,
                    "collectionKey": "DetectCollision"
                },
                // Flag (scenery)
                {
                    "thing": "Flag", "x": x - 4.5, "y": y + 79.5,
                    "collectionName": collectionName,
                    "collectionKey": "Flag"
                },
                {
                    "thing": "FlagTop", "x": x + 1.5, "y": y + 84,
                    "collectionName": collectionName,
                    "collectionKey": "FlagTop"
                },
                {
                    "thing": "FlagPole", "x": x + 3, "y": y + 80,
                    "collectionName": collectionName,
                    "collectionKey": "FlagPole"
                },
                // Bottom stone
                {
                    "thing": "Stone", "x": x, "y": y + 8,
                    "collectionName": collectionName,
                    "collectionKey": "FlagPole"
                }];
            if (reference.large) {
                output.push({
                    "macro": "CastleLarge",
                    "x": x + (reference.castleDistance || 24),
                    "y": y,
                    "transport": reference.transport,
                    "walls": reference.walls || 8
                });
            }
            else {
                output.push({
                    "macro": "CastleSmall",
                    "x": x + (reference.castleDistance || 32),
                    "y": y,
                    "transport": reference.transport
                });
            }
            return output;
        };
        /**
         * Macro to place the typical ending Things for the inside of a castle area.
         *
         * @alias EndInsideCastle
         * @param reference   Settings for an EndInsideCastle macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns An ending zone for inside a castle.
         */
        Macros.prototype.macroEndInsideCastle = function (reference, prethings, area, map, FSM) {
            var x = reference.x || 0, y = reference.y || 0, npc = reference.npc || "Toad", output, texts, keys;
            if (npc === "Toad") {
                keys = ["1", "2"];
                texts = [
                    {
                        "thing": "CustomText",
                        "x": x + 164,
                        "y": y + 64,
                        "texts": [{
                                "text": "THANK YOU MARIO!"
                            }],
                        "textAttributes": {
                            "hidden": true
                        },
                        "collectionName": "endInsideCastleText",
                        "collectionKey": "1"
                    }, {
                        "thing": "CustomText",
                        "x": x + 152,
                        "y": y + 48,
                        "texts": [
                            {
                                "text": "BUT OUR PRINCESS IS IN"
                            }, {
                                "text": "ANOTHER CASTLE!"
                            }],
                        "textAttributes": {
                            "hidden": true
                        },
                        "collectionName": "endInsideCastleText",
                        "collectionKey": "2"
                    }];
            }
            else if (npc === "Peach") {
                keys = ["1", "2", "3"];
                texts = [
                    {
                        "thing": "CustomText",
                        "x": x + 164,
                        "y": y + 64,
                        "texts": [{
                                "text": "THANK YOU MARIO!"
                            }],
                        "textAttributes": {
                            "hidden": true
                        },
                        "collectionName": "endInsideCastleText",
                        "collectionKey": "1"
                    }, {
                        "thing": "CustomText",
                        "x": x + 152,
                        "y": y + 48,
                        "texts": [
                            {
                                "text": "YOUR QUEST IS OVER.",
                                "offset": 12
                            }, {
                                "text": "WE PRESENT YOU A NEW QUEST."
                            }],
                        "textAttributes": {
                            "hidden": true
                        },
                        "collectionName": "endInsideCastleText",
                        "collectionKey": "2"
                    }, {
                        "thing": "CustomText",
                        "x": x + 152,
                        "y": 32,
                        "texts": [
                            {
                                "text": "PRESS BUTTON B",
                                "offset": 8
                            }, {
                                "text": "TO SELECT A WORLD"
                            }],
                        "textAttributes": {
                            "hidden": true
                        },
                        "collectionName": "endInsideCastleText",
                        "collectionKey": "3"
                    }];
            }
            output = [
                { "thing": "Stone", "x": x, "y": y + 88, "width": 256 },
                { "macro": "Water", "x": x, "y": y, "width": 104 },
                // Bridge & Bowser area
                { "thing": "CastleBridge", "x": x, "y": y + 24, "width": 104 },
                {
                    "thing": "Bowser", "x": x + 69, "y": y + 42,
                    "hard": reference.hard,
                    "spawnType": reference.spawnType || "Goomba",
                    "throwing": reference.throwing
                },
                { "thing": "CastleChain", "x": x + 96, "y": y + 32 },
                // Axe area
                { "thing": "CastleAxe", "x": x + 104, "y": y + 40 },
                { "thing": "ScrollBlocker", "x": x + 112 },
                { "macro": "Floor", "x": x + 104, "y": y, "width": 152 },
                {
                    "thing": "Stone", "x": x + 104, "y": y + 32,
                    "width": 24, "height": 32
                },
                {
                    "thing": "Stone", "x": x + 112, "y": y + 80,
                    "width": 16, "height": 24
                },
                // Peach's Magical Happy Chamber
                {
                    "thing": "DetectCollision", "x": x + 180,
                    "activate": FSM.collisions.collideCastleNPC,
                    "transport": reference.transport,
                    "collectionName": "endInsideCastleText",
                    "collectionKey": "npc",
                    "collectionKeys": keys
                },
                { "thing": npc, "x": x + 200, "y": 13 },
                { "thing": "ScrollBlocker", "x": x + 256 }
            ];
            if (reference.topScrollEnabler) {
                output.push({
                    "thing": "ScrollEnabler",
                    "x": x + 96, "y": y + 140,
                    "height": 52, "width": 16
                });
                output.push({
                    "thing": "ScrollEnabler",
                    "x": x + 240, "y": y + 140,
                    "height": 52, "width": 16
                });
            }
            output.push.apply(output, texts);
            return output;
        };
        /**
         * Macro to place a DetectSpawn that will call activateSectionBefore to
         * start a stretch section.
         *
         * @alias Section
         * @param reference   Settings for a Section macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A section.
         */
        Macros.prototype.macroSection = function (reference, prethings, area, map, FSM) {
            return {
                "thing": "DetectSpawn",
                "x": reference.x || 0,
                "y": reference.y || 0,
                "activate": FSM.activateSectionBefore,
                "section": reference.section || 0
            };
        };
        /**
         * Macro to place a DetectCollision to mark the current section as passed.
         *
         * @alias SectionPass
         * @param reference   Settings for a SectionPass macro.
         * @returns A section pass detector.
         */
        Macros.prototype.macroSectionPass = function (reference) {
            return {
                "thing": "DetectCollision",
                "x": reference.x || 0,
                "y": reference.y || 0,
                "width": reference.width || 8,
                "height": reference.height || 8,
                "activate": function (thing) {
                    thing.FSM.AudioPlayer.play("Coin");
                    thing.FSM.MapScreener.sectionPassed = true;
                }
            };
        };
        /**
         * Macro to place a DetectCollision to mark the current section as failed.
         *
         * @alias SectionFail
         * @param reference   Settings for a SectionFail macro.
         * @returns A section fail detector.
         */
        Macros.prototype.macroSectionFail = function (reference) {
            return [
                {
                    "thing": "DetectCollision",
                    "x": reference.x,
                    "y": reference.y,
                    "width": reference.width || 8,
                    "height": reference.height || 8,
                    "activate": function (thing) {
                        thing.FSM.AudioPlayer.play("Fail");
                        thing.FSM.MapScreener.sectionPassed = false;
                    }
                }
            ];
        };
        /**
         * Macro to place a DetectSpawn that will spawn a following section based on
         * whether the current one was marked as passed or failed.
         *
         * @alias SectionDecider
         * @param reference   Settings for a SectionDecider macro.
         * @param prethings   The container Area's creation commands.
         * @param area   The container Area.
         * @param map   The container Map.
         * @param FSM   The calling FullScreenMario.
         * @returns A section decider detector.
         */
        Macros.prototype.macroSectionDecider = function (reference) {
            return {
                "thing": "DetectSpawn",
                "x": reference.x || 0,
                "y": reference.y || 0,
                "activate": function (thing) {
                    if (thing.FSM.MapScreener.sectionPassed) {
                        thing.section = reference.pass || 0;
                    }
                    else {
                        thing.section = reference.fail || 0;
                    }
                    thing.FSM.activateSectionBefore(thing);
                }
            };
        };
        return Macros;
    })();
    FullScreenMario.Macros = Macros;
})(FullScreenMario || (FullScreenMario = {}));
