// @ifdef INCLUDE_DEFINITIONS
/// <reference path="FullScreenMario.d.ts" />
// @endif
var FullScreenMario;
(function (FullScreenMario) {
    "use strict";
    /**
     * Storage for transport Functions in FullScreenMario.
     */
    var Transports = (function () {
        function Transports() {
        }
        /**
         * Standard map entrance Function for dropping from the ceiling. A new
         * player is placed 16x16 units away from the top-left corner, with
         * location.xloc scrolling applied if necessary.
         *
         * @param FSM
         * @param location   The calling Location entering into (by default,
         *                   not used).
         */
        Transports.prototype.mapEntranceNormal = function (FSM, location) {
            if (location && location.xloc) {
                FSM.scrollWindow(location.xloc * FSM.unitsize);
            }
            FSM.addPlayer(FSM.unitsize * 16, FSM.unitsize * 16);
        };
        /**
         * Standard map entrance Function for starting on the ground. A new player
         * is placed 16x16 units away from the top-left corner, with location.xloc
         * scrolling applied if necessary.
         *
         * @param FSM
         * @param location   The calling Location entering into (by default,
         *                   not used).
         */
        Transports.prototype.mapEntrancePlain = function (FSM, location) {
            if (location && location.xloc) {
                FSM.scrollWindow(location.xloc * FSM.unitsize);
            }
            FSM.addPlayer(FSM.unitsize * 16, FSM.MapScreener.floor * FSM.unitsize);
        };
        /**
         * Map entrance Function for starting on the ground and immediately walking
         * as if in a cutscene. mapEntrancePlain is immediately called, and the
         * player has movement forced to be walking, with nokeys and notime set to
         * true.
         *
         * @param FSM
         * @param location   The calling Location entering into (by default,
         *                   not used).
         */
        Transports.prototype.mapEntranceWalking = function (FSM, location) {
            FSM.transports.mapEntrancePlain(FSM, location);
            FSM.player.keys.run = 1;
            FSM.player.maxspeed = FSM.player.walkspeed;
            FSM.MapScreener.nokeys = true;
            FSM.MapScreener.notime = true;
        };
        /**
         * Map entrance Function for entering a castle area. A player is simply
         * added at 2 x 56.
         *
         * @param FSM
         */
        Transports.prototype.mapEntranceCastle = function (FSM) {
            FSM.addPlayer(FSM.unitsize * 2, FSM.unitsize * 56);
        };
        /**
         * Map entrance Function for entering an area climbing a Vine. The Vine
         * enters first by growing, then a Player climbs it and hops off. The
         * player's actions are done via mapEntranceVinePlayer and are triggered
         * when the Vine's top reaches its threshold.
         *
         * @param FSM
         */
        Transports.prototype.mapEntranceVine = function (FSM) {
            var threshold = FSM.MapScreener.bottom - FSM.unitsize * 40, vine = FSM.addThing("Vine", FSM.unitsize * 32, FSM.MapScreener.bottom + FSM.unitsize * 8);
            FSM.TimeHandler.addEventInterval(function () {
                if (vine.top >= threshold) {
                    return false;
                }
                vine.movement = undefined;
                FSM.transports.mapEntranceVinePlayer(FSM, vine);
                return true;
            }, 1, Infinity);
        };
        /**
         * Continuation of mapEntranceVine for a Player's actions. A player
         * climbs up the Vine; once it reaches the threshold, it hops off using
         * animatePlayerOffVine.
         *
         * @param FSM
         * @param vine   A Vine bringing a Player up.
         */
        Transports.prototype.mapEntranceVinePlayer = function (FSM, vine) {
            var threshold = FSM.MapScreener.bottom - FSM.unitsize * 24, speed = FSM.unitsize / -4, player = FSM.addPlayer(FSM.unitsize * 29, FSM.MapScreener.bottom - FSM.unitsize * 4);
            FSM.shiftVert(player, player.height * FSM.unitsize);
            FSM.collisions.collideVine(player, vine);
            FSM.TimeHandler.addEventInterval(function () {
                FSM.shiftVert(player, speed);
                if (player.top < threshold) {
                    FSM.TimeHandler.addEvent(FSM.animations.animatePlayerOffVine, 49, player);
                    return true;
                }
                return false;
            }, 1, Infinity);
        };
        /**
         * Map entrance Function for coming in through a vertical Pipe. A player
         * is added just below the top of the Pipe, and is animated to rise up
         * through it like an Italian chestburster.
         *
         * @param FSM
         * @param location   The calling Location entering into (by default,
         *                   not used).
         */
        Transports.prototype.mapEntrancePipeVertical = function (FSM, location) {
            if (location && location.xloc) {
                FSM.scrollWindow(location.xloc * FSM.unitsize);
            }
            FSM.addPlayer(location.entrance.left + FSM.player.width * FSM.unitsize / 2, location.entrance.top + FSM.player.height * FSM.unitsize);
            FSM.animations.animatePlayerPipingStart(FSM.player);
            FSM.AudioPlayer.play("Pipe");
            FSM.AudioPlayer.addEventListener("Pipe", "ended", function () {
                FSM.AudioPlayer.playTheme();
            });
            FSM.TimeHandler.addEventInterval(function () {
                FSM.shiftVert(FSM.player, FSM.unitsize / -4);
                if (FSM.player.bottom <= location.entrance.top) {
                    FSM.animations.animatePlayerPipingEnd(FSM.player);
                    return true;
                }
                return false;
            }, 1, Infinity);
        };
        /**
         * Map entrance Function for coming in through a horizontal Pipe. A player
         * is added just to the left of the entrance, and is animated to pass
         * through it like an Italian chestburster.
         *
         * @param FSM
         * @param location   The calling Location entering into (by default,
         *                   not used).
         */
        Transports.prototype.mapEntrancePipeHorizontal = function (FSM, location) {
            throw new Error("mapEntrancePipeHorizontal is not yet implemented.");
        };
        /**
         * Map entrance Function for a Player reincarnating into a level,
         * typically from a random map. A player is placed at 16 x 0 and a
         * Resting Stone placed some spaces below via playerAddRestingStone.
         *
         * @param FSM
         */
        Transports.prototype.mapEntranceRespawn = function (FSM) {
            FSM.MapScreener.nokeys = false;
            FSM.MapScreener.notime = false;
            FSM.MapScreener.canscroll = true;
            FSM.addPlayer(FSM.unitsize * 16, 0);
            FSM.animations.animateFlicker(FSM.player);
            if (!FSM.MapScreener.underwater) {
                FSM.playerAddRestingStone(FSM.player);
            }
            FSM.ModAttacher.fireEvent("onPlayerRespawn");
        };
        /* Map exits
        */
        /**
         * Map exit Function for leaving through a vertical Pipe. A player is
         * animated to pass through it and then transfer locations.
         *
         * @param thing   A Player exiting through other.
         * @param other   A Pipe sucking in thing.
         */
        Transports.prototype.mapExitPipeVertical = function (thing, other) {
            if (!thing.resting || typeof (other.transport) === "undefined"
                || thing.right + thing.FSM.unitsize * 2 > other.right
                || thing.left - thing.FSM.unitsize * 2 < other.left) {
                return;
            }
            thing.FSM.animations.animatePlayerPipingStart(thing);
            thing.FSM.AudioPlayer.play("Pipe");
            thing.FSM.TimeHandler.addEventInterval(function () {
                thing.FSM.shiftVert(thing, thing.FSM.unitsize / 4);
                if (thing.top <= other.top) {
                    return false;
                }
                thing.FSM.TimeHandler.addEvent(function () {
                    if (other.transport.constructor === Object) {
                        thing.FSM.setMap(other.transport.map);
                    }
                    else {
                        thing.FSM.setLocation(other.transport);
                    }
                }, 42);
                return true;
            }, 1, Infinity);
        };
        /**
         * Map exit Function for leaving through a horiontal Pipe. A player is
         * animated to pass through it and then transfer locations.
         *
         * @param thing   A Player exiting through other.
         * @param other   A Pipe sucking in thing.
         * @param shouldTransport   Whether not resting and not paddling does
         *                          not imply a Player cannot pass through the
         *                          Pipe (by default, false, as this is normal).
         * @remarks The shouldTransport argument was added because the "Bouncy
         *          Bounce!" mod rendered some areas unenterable without it.
         */
        Transports.prototype.mapExitPipeHorizontal = function (thing, other, shouldTransport) {
            if (!shouldTransport && !thing.resting && !thing.paddling) {
                return;
            }
            if (thing.top < other.top || thing.bottom > other.bottom) {
                return;
            }
            if (!thing.keys.run) {
                return;
            }
            thing.FSM.animations.animatePlayerPipingStart(thing);
            thing.FSM.AudioPlayer.play("Pipe");
            thing.FSM.TimeHandler.addEventInterval(function () {
                thing.FSM.shiftHoriz(thing, thing.FSM.unitsize / 4);
                if (thing.left <= other.left) {
                    return false;
                }
                thing.FSM.TimeHandler.addEvent(function () {
                    thing.FSM.setLocation(other.transport);
                }, 42);
                return true;
            }, 1, Infinity);
        };
        return Transports;
    })();
    FullScreenMario.Transports = Transports;
})(FullScreenMario || (FullScreenMario = {}));
