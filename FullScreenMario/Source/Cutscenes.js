// @ifdef INCLUDE_DEFINITIONS
/// <reference path="FullScreenMario.d.ts" />
// @endif
var FullScreenMario;
(function (FullScreenMario) {
    "use strict";
    /**
     * Storage for cutscene Functions in FullScreenMario.
     */
    var Cutscenes = (function () {
        function Cutscenes() {
        }
        /**
         * First cutscene for the Flagpole routine. A player becomes invincible and
         * starts sliding down the flagpole, while all other Things are killed.
         * A score calculated by scorePlayerFlag is shown at the base of the pole and
         * works its way up. The collideFlagBottom callback will be fired when a Player
         * reaches the bottom.
         *
         * @param FSM
         * @param settings   Storage for the cutscene from ScenePlayr.
         */
        Cutscenes.prototype.cutsceneFlagpoleStartSlidingDown = function (FSM, settings) {
            var thing = settings.player, other = settings.collider, height = (other.bottom - thing.bottom) | 0, scoreAmount = FSM.scoring.scorePlayerFlag(thing, height / FSM.unitsize), scoreThing = FSM.ObjectMaker.make("Text" + scoreAmount);
            // This is a cutscene. No movement, no deaths, no scrolling.
            thing.star = 1;
            thing.nocollidechar = true;
            FSM.MapScreener.nokeys = true;
            FSM.MapScreener.notime = true;
            FSM.MapScreener.canscroll = false;
            // Kill all other characters and pause a Player next to the pole
            FSM.deaths.killNPCs();
            FSM.animations.animateCharacterPauseVelocity(thing);
            FSM.setRight(thing, other.left + FSM.unitsize * 3);
            FSM.deaths.killNormal(other);
            // a Player is now climbing down the pole
            FSM.removeClasses(thing, "running jumping skidding");
            FSM.addClass(thing, "climbing animated");
            FSM.TimeHandler.addClassCycle(thing, ["one", "two"], "climbing", 0);
            // Animate the Flag to the base of the pole
            FSM.TimeHandler.addEventInterval(FSM.shiftVert, 1, 64, other.collection.Flag, FSM.unitsize);
            // Add a ScoreText element at the bottom of the flag and animate it up
            FSM.addThing(scoreThing, other.right, other.bottom);
            FSM.TimeHandler.addEventInterval(FSM.shiftVert, 1, 72, scoreThing, -FSM.unitsize);
            FSM.TimeHandler.addEvent(FSM.ItemsHolder.increase.bind(FSM.ItemsHolder), 72, "score", scoreAmount);
            // All audio stops, and the flagpole clip is played
            FSM.AudioPlayer.clearAll();
            FSM.AudioPlayer.clearTheme();
            FSM.AudioPlayer.play("Flagpole");
            FSM.TimeHandler.addEventInterval(function () {
                // While a Player hasn't reached the bottom yet, slide down
                if (thing.bottom < other.bottom) {
                    FSM.shiftVert(thing, FSM.unitsize);
                    return false;
                }
                // If the flag hasn't reached it but a Player has, don't move yet
                if ((other.collection.Flag.bottom | 0) < (other.bottom | 0)) {
                    return false;
                }
                // a Player is done climbing: trigger the flag bottom collision
                thing.movement = undefined;
                FSM.setBottom(thing, other.bottom);
                FSM.TimeHandler.cancelClassCycle(thing, "climbing");
                FSM.TimeHandler.addEvent(FSM.ScenePlayer.bindRoutine("HitBottom"), 21);
                return true;
            }, 1, Infinity);
        };
        /**
         * Routine for when a player hits the bottom of a flagpole. It is
         * flipped horizontally, shifted to the other side of the pole, and the
         * animatePlayerOffPole callback is quickly timed.
         *
         * @param FSM
         * @param settings   Storage for the cutscene from ScenePlayr.
         */
        Cutscenes.prototype.cutsceneFlagpoleHitBottom = function (FSM, settings) {
            var thing = settings.player;
            thing.keys.run = 1;
            thing.maxspeed = thing.walkspeed;
            thing.FSM.flipHoriz(thing);
            thing.FSM.shiftHoriz(thing, (thing.width + 1) * thing.FSM.unitsize);
            thing.FSM.TimeHandler.addEvent(function () {
                thing.FSM.AudioPlayer.play("Stage Clear");
                thing.FSM.animations.animatePlayerOffPole(thing, true);
            }, 14);
        };
        /**
         * Routine for counting down time and increasing score at the end of
         * a level. When it's done, it calls the Fireworks routine.
         *
         * @param FSM
         * @param settings   Storage for the cutscene from ScenePlayr.
         */
        Cutscenes.prototype.cutsceneFlagpoleCountdown = function (FSM, settings) {
            FSM.TimeHandler.addEventInterval(function () {
                FSM.ItemsHolder.decrease("time");
                FSM.ItemsHolder.increase("score", 50);
                FSM.AudioPlayer.play("Coin");
                if (FSM.ItemsHolder.getItem("time") > 0) {
                    return false;
                }
                FSM.TimeHandler.addEvent(FSM.ScenePlayer.bindRoutine("Fireworks"), 35);
                return true;
            }, 1, Infinity);
        };
        /**
         * Animation routine for the fireworks found at the end of EndOutsideCastle.
         * Fireworks are added on a timer (if there should be any), and the level
         * transport is called when any fireworks are done.
         *
         * @param FSM
         * @param settings   Storage for the cutscene from ScenePlayr.
         */
        Cutscenes.prototype.cutsceneFlagpoleFireworks = function (FSM, settings) {
            var numFireworks = FSM.MathDecider.compute("numberOfFireworks", settings.time), player = settings.player, detector = settings.detector, doorRight = detector.left, doorLeft = doorRight - FSM.unitsize * 8, doorBottom = detector.bottom, doorTop = doorBottom - FSM.unitsize * 16, flag = FSM.ObjectMaker.make("CastleFlag", {
                "position": "beginning"
            }), flagMovements = 28, fireInterval = 28, fireworkPositions = [
                [0, -48],
                [-8, -40],
                [8, -40],
                [-8, -32],
                [0, -48],
                [-8, -40]
            ], i = 0, firework, position;
            // Add a flag to the center of the castle, behind everything else
            FSM.addThing(flag, doorLeft + FSM.unitsize, doorTop - FSM.unitsize * 24);
            FSM.arrayToBeginning(flag, FSM.GroupHolder.getGroup(flag.groupType));
            // Animate the flag raising
            FSM.TimeHandler.addEventInterval(function () {
                FSM.shiftVert(flag, FSM.unitsize * -.25);
            }, 1, flagMovements);
            // If there should be fireworks, add each of them on an interval
            if (numFireworks > 0) {
                FSM.TimeHandler.addEventInterval(function () {
                    position = fireworkPositions[i];
                    firework = FSM.addThing("Firework", player.left + position[0] * FSM.unitsize, player.top + position[1] * FSM.unitsize);
                    firework.animate(firework);
                    i += 1;
                }, fireInterval, numFireworks);
            }
            // After everything, activate the detector's transport to leave
            FSM.TimeHandler.addEvent(function () {
                FSM.AudioPlayer.addEventImmediate("Stage Clear", "ended", function () {
                    FSM.collisions.collideLevelTransport(player, detector);
                    FSM.ScenePlayer.stopCutscene();
                });
            }, i * fireInterval + 420);
        };
        /**
         * Routine for when a player collides with a castle axe. All unimportant NPCs
         * are killed and a Player running again is scheduled.
         *
         * @param FSM
         * @param settings   Storage for the cutscene from ScenePlayr.
         */
        Cutscenes.prototype.cutsceneBowserVictoryCollideCastleAxe = function (FSM, settings) {
            var player = settings.player, axe = settings.axe;
            FSM.animations.animateCharacterPauseVelocity(player);
            FSM.deaths.killNormal(axe);
            FSM.deaths.killNPCs();
            FSM.AudioPlayer.clearTheme();
            FSM.MapScreener.nokeys = true;
            FSM.MapScreener.notime = true;
            player.FSM.TimeHandler.addEvent(function () {
                player.keys.run = 1;
                player.maxspeed = player.walkspeed;
                FSM.animations.animateCharacterResumeVelocity(player);
                player.yvel = 0;
                FSM.MapScreener.canscroll = true;
                FSM.AudioPlayer.play("World Clear");
            }, 140);
        };
        /**
         * Routine for a castle bridge opening. Its width is reduced repeatedly on an
         * interval until it's 0, at which point the BowserFalls routine plays.
         *
         * @param FSM
         * @param settings   Storage for the cutscene from ScenePlayr.
         * @remarks The castle bridge's animateCastleBridgeOpen (called via killNPCs
         *          as the bridge's this.deaths.killonend attribute) is what triggers this.
         */
        Cutscenes.prototype.cutsceneBowserVictoryCastleBridgeOpen = function (FSM, settings) {
            var bridge = settings.routineArguments[0];
            FSM.TimeHandler.addEventInterval(function () {
                bridge.right -= FSM.unitsize * 2;
                FSM.setWidth(bridge, bridge.width - 2);
                FSM.AudioPlayer.play("Break Block");
                if (bridge.width <= 0) {
                    FSM.ScenePlayer.playRoutine("BowserFalls");
                    return true;
                }
                return false;
            }, 1, Infinity);
        };
        /**
         * Routine for Bowser falling after his bridge opens.
         *
         * @param settings   Storage for the cutscene from ScenePlayr.
         * @param FSM
         * @remarks This is called by the CastleBridgeOpen routine, once the bridge
         *          has been reduced to no width.
         */
        Cutscenes.prototype.cutsceneBowserVictoryBowserFalls = function (FSM, settings) {
            FSM.AudioPlayer.play("Bowser Falls");
            // Bowser won't exist if a Player already killed him with a star or fireballs
            if (settings.bowser) {
                settings.bowser.nofall = true;
            }
        };
        /**
         * Routine for displaying text above a castle NPC. Each "layer" of text
         * is added in order, after which collideLevelTransport is called.
         *
         * @param settings   Storage for the cutscene from ScenePlayr.
         * @param FSM
         * @remarks This is called by collideCastleNPC.
         */
        Cutscenes.prototype.cutsceneBowserVictoryDialog = function (FSM, settings) {
            var player = settings.player, detector = settings.detector, keys = settings.keys, interval = 140, i = 0, j, letters;
            player.keys.run = 0;
            player.FSM.deaths.killNormal(detector);
            player.FSM.TimeHandler.addEventInterval(function () {
                letters = detector.collection[keys[i]].children;
                for (j = 0; j < letters.length; j += 1) {
                    if (letters[j].title !== "TextSpace") {
                        letters[j].hidden = false;
                    }
                }
                i += 1;
            }, interval, keys.length);
            player.FSM.TimeHandler.addEvent(function () {
                player.FSM.collisions.collideLevelTransport(player, detector);
            }, 280 + interval * keys.length);
        };
        return Cutscenes;
    })();
    FullScreenMario.Cutscenes = Cutscenes;
})(FullScreenMario || (FullScreenMario = {}));
