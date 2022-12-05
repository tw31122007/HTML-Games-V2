// @ifdef INCLUDE_DEFINITIONS
/// <reference path="FullScreenMario.d.ts" />
// @endif
var FullScreenMario;
(function (FullScreenMario) {
    "use strict";
    /**
     * Storage for maintenance Functions in FullScreenMario.
     */
    var Maintenance = (function () {
        function Maintenance() {
        }
        /**
         * Regular maintenance Function called to decrease time every 25 game ticks.
         *
         * @param FSM
         * @returns Whether time should stop counting, which is whether it's <= 0.
         */
        Maintenance.prototype.maintainTime = function (FSM) {
            if (!FSM.MapScreener.notime) {
                FSM.ItemsHolder.decrease("time", 1);
                return false;
            }
            if (!FSM.ItemsHolder.getItem("time")) {
                return true;
            }
            return false;
        };
        /**
         * Regular maintenance Function called on the Scenery group every 350
         * upkeeps (slightly over 5 seconds). Things are checked for being alive
         * and to the left of QuadsKeeper.left; if they aren't, they are removed.
         *
         * @param FSM
         */
        Maintenance.prototype.maintainScenery = function (FSM) {
            var things = FSM.GroupHolder.getGroup("Scenery"), delx = FSM.QuadsKeeper.left, thing, i;
            for (i = 0; i < things.length; i += 1) {
                thing = things[i];
                if (thing.right < delx && thing.outerok !== 2) {
                    FSM.arrayDeleteThing(thing, things, i);
                    i -= 1;
                }
            }
        };
        /**
         * Regular maintenance Function called on the Solids group every upkeep.
         * Things are checked for being alive and to the right of QuadsKeeper.left;
         * if they aren't, they are removed. Each Thing is also allowed a movement
         * Function.
         *
         * @param FSM
         * @param solids   FSM's GroupHolder's Solid group.
         */
        Maintenance.prototype.maintainSolids = function (FSM, solids) {
            var delx = FSM.QuadsKeeper.left, solid, i;
            FSM.QuadsKeeper.determineAllQuadrants("Solid", solids);
            for (i = 0; i < solids.length; i += 1) {
                solid = solids[i];
                if (solid.alive && solid.right > delx) {
                    if (solid.movement) {
                        solid.movement(solid);
                    }
                }
                else if (!solid.alive || solid.outerok !== 2) {
                    FSM.arrayDeleteThing(solid, solids, i);
                    i -= 1;
                }
            }
        };
        /**
         * Regular maintenance Function called on the Characters group every upkeep.
         * Things have gravity and y-velocities, collision detection, and resting
         * checks applied before they're checked for being alive. If they are, they
         * are allowed a movement Function; if not, they are removed.
         *
         * @param FSM
         * @param characters   FSM's GroupHolder's Characters group.
         */
        Maintenance.prototype.maintainCharacters = function (FSM, characters) {
            var delx = FSM.QuadsKeeper.right, character, i;
            for (i = 0; i < characters.length; i += 1) {
                character = characters[i];
                // Gravity
                if (character.resting) {
                    character.yvel = 0;
                }
                else {
                    if (!character.nofall) {
                        character.yvel += character.gravity || FSM.MapScreener.gravity;
                    }
                    character.yvel = Math.min(character.yvel, FSM.MapScreener.maxyvel);
                }
                // Position updating and collision detection
                character.under = character.undermid = undefined;
                FSM.updatePosition(character);
                FSM.QuadsKeeper.determineThingQuadrants(character);
                FSM.ThingHitter.checkHitsForThing(character);
                // Overlaps
                if (character.overlaps && character.overlaps.length) {
                    FSM.maintenance.maintainOverlaps(character);
                }
                // Resting tests
                if (character.resting) {
                    if (!FSM.physics.isCharacterOnResting(character, character.resting)) {
                        if (character.onRestingOff) {
                            character.onRestingOff(character, character.resting);
                        }
                        else {
                            // Necessary for moving platforms
                            character.resting = undefined;
                        }
                    }
                    else {
                        character.yvel = 0;
                        FSM.setBottom(character, character.resting.top);
                    }
                }
                // Movement or deletion
                // To do: rethink this...
                if (character.alive) {
                    if (!character.player &&
                        (character.numquads === 0 || character.left > delx) &&
                        (!character.outerok || (character.outerok !== 2
                            && character.right < FSM.MapScreener.width - delx))) {
                        FSM.arrayDeleteThing(character, characters, i);
                        i -= 1;
                    }
                    else {
                        if (!character.nomove && character.movement) {
                            character.movement(character);
                        }
                    }
                }
                else {
                    FSM.arrayDeleteThing(character, characters, i);
                    i -= 1;
                }
            }
        };
        /**
         * Maintenance Function only triggered for Things that are known to have
         * overlapping Solids stored in their overlaps attribute. This will slide
         * the offending Thing away from the midpoint of those overlaps once a call
         * until it's past the boundary (and check for those boundaries if not
         * already set).
         *
         * @param character   A Character that is known to be overlapping Solid(s).
         */
        Maintenance.prototype.maintainOverlaps = function (character) {
            // If checkOverlaps is still true, this is the first maintain call
            if (character.checkOverlaps) {
                if (!character.FSM.physics.setOverlapBoundaries(character)) {
                    return;
                }
            }
            character.FSM.slideToX(character, character.overlapGoal, character.FSM.unitsize);
            // Goal to the right: has the thing gone far enough to the right?
            if (character.overlapGoRight) {
                if (character.left >= character.overlapCheck) {
                    character.FSM.setLeft(character, character.overlapCheck);
                }
                else {
                    return;
                }
            }
            else {
                // Goal to the left: has the thing gone far enough to the left?
                if (character.right <= character.overlapCheck) {
                    character.FSM.setRight(character, character.overlapCheck);
                }
                else {
                    return;
                }
            }
            // A check above didn't fail into a return, so overlapping is solved
            character.overlaps.length = 0;
            character.checkOverlaps = true;
        };
        /**
         * Regular maintenance Function called on a Player every upkeep. A barrage
         * of tests are applied, namely falling/jumping, dieing, x- and y-velocities,
         * running, and scrolling. This is separate from the movePlayer movement
         * Function that will be called in maintainCharacters.
         *
         * @param FSM
         */
        Maintenance.prototype.maintainPlayer = function (FSM) {
            var player = FSM.player;
            if (!FSM.physics.isThingAlive(player)) {
                return;
            }
            // Player is falling
            if (player.yvel > 0) {
                if (!FSM.MapScreener.underwater) {
                    player.keys.jump = false;
                }
                // Jumping?
                if (!player.jumping && !player.crouching) {
                    // Paddling? (from falling off a solid)
                    if (FSM.MapScreener.underwater) {
                        if (!player.paddling) {
                            FSM.switchClass(player, "paddling", "paddling");
                            player.paddling = true;
                        }
                    }
                    else {
                        FSM.addClass(player, "jumping");
                        player.jumping = true;
                    }
                }
                // Player has fallen too far
                if (!player.dieing && player.top > FSM.MapScreener.bottom) {
                    // If the map has an exit (e.g. cloud world), transport there
                    if (FSM.AreaSpawner.getArea().exit) {
                        FSM.setLocation(FSM.AreaSpawner.getArea().exit);
                    }
                    else {
                        // Otherwise, since Player is below the screen, kill him dead
                        FSM.deaths.killPlayer(player, 2);
                    }
                    return;
                }
            }
            // Player is moving to the right
            if (player.xvel > 0) {
                if (player.right > FSM.MapScreener.middleX) {
                    // If Player is to the right of the screen's middle, move the screen
                    if (player.right > FSM.MapScreener.right - FSM.MapScreener.left) {
                        player.xvel = Math.min(0, player.xvel);
                    }
                }
            }
            else if (player.left < 0) {
                // Player is moving to the left
                // Stop Player from going to the left.
                player.xvel = Math.max(0, player.xvel);
            }
            // Player is hitting something (stop jumping)
            if (player.under) {
                player.jumpcount = 0;
            }
            // Scrolloffset is how far over the middle player's right is
            if (FSM.MapScreener.canscroll) {
                var scrolloffset = player.right - FSM.MapScreener.middleX;
                if (scrolloffset > 0) {
                    FSM.scrollWindow(Math.min(player.scrollspeed, scrolloffset));
                }
            }
        };
        return Maintenance;
    })();
    FullScreenMario.Maintenance = Maintenance;
})(FullScreenMario || (FullScreenMario = {}));
