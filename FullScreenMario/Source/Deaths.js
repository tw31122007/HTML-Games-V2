// @ifdef INCLUDE_DEFINITIONS
/// <reference path="FullScreenMario.ts" />
// @endif
var FullScreenMario;
(function (FullScreenMario) {
    "use strict";
    /**
     * Storage for death Functions in FullScreenMario.
     */
    var Deaths = (function () {
        /**
         * Initializes a new instance of the Deaths class.
         *
         * @param FSM   The container FullScreenMario.
         */
        function Deaths(FSM) {
            this.FSM = FSM;
        }
        /**
         * Standard Function to kill a Thing, which means marking it as dead and
         * clearing its numquads, resting, movement, and cycles. It will later be
         * marked as gone by its maintain* Function (Solids or Characters).
         *
         * @param thing   A Thing to kill.
         */
        Deaths.prototype.killNormal = function (thing) {
            if (!thing) {
                return;
            }
            thing.hidden = thing.dead = true;
            thing.alive = false;
            thing.numquads = 0;
            thing.movement = undefined;
            if (thing.hasOwnProperty("resting")) {
                thing.resting = undefined;
            }
            if (thing.FSM) {
                thing.FSM.TimeHandler.cancelAllCycles(thing);
            }
            thing.FSM.ModAttacher.fireEvent("onKillNormal", thing);
        };
        /**
         * Death Function commonly called on characters to animate a small flip
         * before killNormal is called.
         *
         * @param thing   A Thing to kill.
         * @param extra   How much time to wait beyond the standard 70 steps
         *                before calling killNormal (by default, 0).
         */
        Deaths.prototype.killFlip = function (thing, extra) {
            if (extra === void 0) { extra = 0; }
            thing.FSM.flipVert(thing);
            if (thing.bottomBump) {
                thing.bottomBump = undefined;
            }
            thing.nocollide = thing.dead = true;
            thing.speed = thing.xvel = 0;
            thing.nofall = false;
            thing.resting = thing.movement = undefined;
            thing.yvel = -thing.FSM.unitsize;
            thing.FSM.TimeHandler.addEvent(thing.FSM.deaths.killNormal, 70 + extra, thing);
        };
        /**
         * Kill Function to replace a Thing with a spawned Thing, determined by the
         * thing's spawnType, in the same location.
         *
         * @param thing    A Thing to kill.
         * @param big   Whether this should skip creating the spawn (by default,
         *              false).
         */
        Deaths.prototype.killSpawn = function (thing, big) {
            if (big) {
                thing.FSM.deaths.killNormal(thing);
                return;
            }
            if (!thing.spawnType) {
                throw new Error("Thing " + thing.title + " has no .spawnType.");
            }
            var spawn = thing.FSM.ObjectMaker.make(thing.spawnType, thing.spawnSettings || {});
            thing.FSM.addThing(spawn);
            thing.FSM.setBottom(spawn, thing.bottom);
            thing.FSM.setMidXObj(spawn, thing);
            thing.FSM.deaths.killNormal(thing);
            return spawn;
        };
        /**
         * A kill Function similar to killSpawn but more configurable. A spawned
         * Thing is created with the given attributes and copies over any specified
         * attributes from the original Thing.
         *
         * @param thing   A Thing to kill.
         * @param title   The type of new Thing to create, such as "Goomba".
         * @param attributes   An optional object to pass in to the ObjectMaker.make
         *                     call (by default, {}).
         * @param attributesCopied   An optional listing of attributes to copy from
         *                           the original Thing (by default, none).
         */
        Deaths.prototype.killReplace = function (thing, title, attributes, attributesCopied) {
            if (attributes === void 0) { attributes = {}; }
            var spawn, i;
            if (typeof attributesCopied !== "undefined") {
                for (i = 0; i < attributesCopied.length; i += 1) {
                    attributes[attributesCopied[i]] = thing[attributesCopied[i]];
                }
            }
            spawn = thing.FSM.ObjectMaker.make(title, attributes);
            if (thing.flipHoriz) {
                thing.FSM.flipHoriz(spawn);
            }
            if (thing.flipVert) {
                thing.FSM.flipVert(spawn);
            }
            thing.FSM.addThing(spawn, thing.left, thing.top);
            thing.FSM.deaths.killNormal(thing);
            return spawn;
        };
        /**
         * Kill Function for Goombas. If big isn't specified, it replaces the
         * killed Goomba with a DeadGoomba via killSpawn.
         *
         * @param thing   A Goomba to kill.
         * @param big   Whether to call killFlip on the Thing instead of
         *              killSpawn, such as when a Shell hits it.
         */
        Deaths.prototype.killGoomba = function (thing, big) {
            if (big) {
                thing.FSM.deaths.killFlip(thing);
                return;
            }
            thing.FSM.deaths.killSpawn(thing);
        };
        /**
         * Kill Function for Koopas. Jumping and floating Koopas are replacing with
         * an equivalent Koopa that's just walking, while walking Koopas become
         * Shells.
         *
         * @param thing   A Koopa to kill.
         * @param big   Whether shells should be immediately killed.
         * @remarks This isn't called when a Shell hits a Koopa.
         */
        Deaths.prototype.killKoopa = function (thing, big) {
            var spawn;
            if (thing.jumping || thing.floating) {
                spawn = thing.FSM.deaths.killReplace(thing, "Koopa", undefined, ["smart", "direction", "moveleft"]);
                spawn.xvel = spawn.moveleft ? -spawn.speed : spawn.speed;
            }
            else {
                spawn = thing.FSM.deaths.killToShell(thing, Number(big));
            }
            return spawn;
        };
        /**
         * Kill Function for Lakitus. If this is the last Lakitu in Characters,
         * a new one is scheduled to be spawned at the same y-position.
         *
         * @param thing   A Lakitu to kill.
         */
        Deaths.prototype.killLakitu = function (thing) {
            var characters = thing.FSM.GroupHolder.getGroup("Character"), i;
            thing.FSM.deaths.killFlip(thing);
            thing.FSM.MapScreener.lakitu = undefined;
            // If any other Lakitu exists after killNormal, killLakitu is done
            for (i = 0; i < characters.length; i += 1) {
                if (characters[i].title === "Lakitu") {
                    thing.FSM.MapScreener.lakitu = characters[i];
                    return;
                }
            }
            // The next Lakitu is spawned ~5 seconds later, give or take
            thing.FSM.TimeHandler.addEvent(thing.FSM.addThing.bind(thing.FSM), 350, "Lakitu", thing.FSM.MapScreener.right, thing.top);
        };
        /**
         * Kill Function for Bowsers. In reality this is only called when a Player
         * Fireballs him or all NPCs are to be killed. It takes five Fireballs to
         * killFlip a Bowser, which scores 5000 points.
         *
         * @param thing   A Bowser to kill.
         * @param big   Whether this should default to killFlip, as in an
         *              EndInsideCastle cutscene.
         */
        Deaths.prototype.killBowser = function (thing, big) {
            if (big) {
                thing.nofall = false;
                thing.movement = undefined;
                thing.FSM.deaths.killFlip(thing.FSM.deaths.killSpawn(thing));
                return;
            }
            thing.deathcount += 1;
            if (thing.deathcount === 5) {
                thing.yvel = thing.speed = 0;
                thing.movement = undefined;
                thing.FSM.deaths.killFlip(thing.FSM.deaths.killSpawn(thing), 350);
                thing.FSM.scoring.scoreOn(5000, thing);
            }
        };
        /**
         * Kills a Thing by replacing it with another Thing, typically a Shell or
         * BeetleShell (determined by thing.shelltype). The spawn inherits smartness
         * and location from its parent, and is temporarily given nocollidechar to
         * stop double collision detections.
         *
         * @param thing   A Character to kill.
         * @param big   Whether the spawned Shell should be killed
         *              immediately (by default, false).
         */
        Deaths.prototype.killToShell = function (thing, big) {
            var spawn, nocollidecharold, nocollideplayerold;
            thing.spawnSettings = {
                "smart": thing.smart
            };
            if (big && big !== 2) {
                thing.spawnType = thing.title;
            }
            else {
                thing.spawnType = thing.shelltype || "Shell";
            }
            thing.spawnSettings = {
                "smart": thing.smart
            };
            spawn = thing.FSM.deaths.killSpawn(thing);
            nocollidecharold = spawn.nocollidechar;
            nocollideplayerold = spawn.nocollideplayer;
            spawn.nocollidechar = true;
            spawn.nocollideplayer = true;
            thing.FSM.TimeHandler.addEvent(function () {
                spawn.nocollidechar = nocollidecharold;
                spawn.nocollideplayer = nocollideplayerold;
            }, 7);
            thing.FSM.deaths.killNormal(thing);
            if (big === 2) {
                thing.FSM.deaths.killFlip(spawn);
            }
            return spawn;
        };
        /**
         * Wipes the screen of any characters or solids that should be gone during
         * an important cutscene, such as hitting an end-of-level flag.
         * For characters, they're deleted if .nokillonend isn't truthy. If they
         * have a .killonend function, that's called on them.
         * Solids are only deleted if their .killonend is true.
         *
         * @remarks If thing.killonend is a Function, it is called on the Thing.
         */
        Deaths.prototype.killNPCs = function () {
            var group, character, solid, i;
            // Characters: they must opt out of being killed with .nokillonend, and
            // may opt into having a function called instead (such as Lakitus).
            group = this.FSM.GroupHolder.getGroup("Character");
            for (i = group.length - 1; i >= 0; --i) {
                character = group[i];
                if (!character.nokillend) {
                    this.killNormal(character);
                    this.FSM.arrayDeleteThing(character, group, i);
                }
                else if (character.killonend) {
                    character.killonend(character);
                }
            }
            // Solids: they may opt into being deleted
            group = this.FSM.GroupHolder.getGroup("Solid");
            for (i = group.length - 1; i >= 0; --i) {
                solid = group[i];
                if (solid.killonend) {
                    if (solid.killonend.constructor === Function) {
                        solid.killonend(solid, group, i);
                    }
                    else {
                        this.FSM.arrayDeleteThing(solid, group, i);
                    }
                }
            }
        };
        /**
         * Kill Function for Bricks. The Brick is killed an an animateBrickShards
         * animation is timed. If other is provided, it's also marked as the Brick's
         * up, which will kill colliding characters: this works because
         * maintainSolids happens before maintainCharacters, so the killNormal won't
         * come into play until after the next maintainCharacters call.
         *
         * @param thing   A Brick to kill.
         * @param other   An optional Character to mark as the cause of the
         *                Brick's death (its up attribute).
         */
        Deaths.prototype.killBrick = function (thing, other) {
            thing.FSM.AudioPlayer.play("Break Block");
            thing.FSM.TimeHandler.addEvent(thing.FSM.animations.animateBrickShards, 1, thing);
            thing.FSM.deaths.killNormal(thing);
            if (other instanceof thing.FSM.ObjectMaker.getFunction("Thing")) {
                thing.up = other;
            }
            else {
                thing.up = undefined;
            }
        };
        /**
         * Kill Function for a Player. It's big and complicated, but in general...
         * 1. If big === 2, just kill it altogether
         * 2. If a Player is large and big isn't true, just power down a Player.
         * 3. A player can't survive this, so animate the "shrug" class and an
         *    up-then-down movement.
         * At the end of 1. and 3., decrease the "lives" and "power" statistics and
         * call the equivalent onPlayerDeath or onGameOver callbacks, depending on
         * how many lives are left. The mod event is also fired.
         *
         * @param thing   A Player to kill.
         * @param big   The severity of this death: 0 for normal, 1 for not
         *              survivable, or 2 for immediate death.
         */
        Deaths.prototype.killPlayer = function (thing, big) {
            if (!thing.alive || thing.flickering || thing.dieing) {
                return;
            }
            var FSM = thing.FSM, area = thing.FSM.AreaSpawner.getArea();
            // Large big: real, no-animation death
            if (big === 2) {
                thing.dead = thing.dieing = true;
                thing.alive = false;
                FSM.MapScreener.notime = true;
            }
            else {
                // Regular big: regular (enemy, time, etc.) kill
                // If a Player can survive this, just power down
                if (!big && thing.power > 1) {
                    thing.power = 1;
                    FSM.ItemsHolder.setItem("power", 1);
                    FSM.AudioPlayer.play("Power Down");
                    FSM.playerGetsSmall(thing);
                    return;
                }
                else {
                    // a Player can't survive this: animate a death
                    thing.dieing = true;
                    FSM.setSize(thing, 7.5, 7, true);
                    FSM.updateSize(thing);
                    FSM.setClass(thing, "character player dead");
                    FSM.animations.animateCharacterPauseVelocity(thing);
                    FSM.arrayToEnd(thing, FSM.GroupHolder.getGroup(thing.groupType));
                    FSM.MapScreener.notime = true;
                    FSM.MapScreener.nokeys = true;
                    FSM.TimeHandler.cancelAllCycles(thing);
                    FSM.TimeHandler.addEvent(function () {
                        FSM.animations.animateCharacterResumeVelocity(thing, true);
                        thing.nocollide = true;
                        thing.movement = thing.resting = undefined;
                        thing.gravity = FSM.MapScreener.gravity / 2.1;
                        thing.yvel = FullScreenMario.FullScreenMario.unitsize * -1.4;
                    }, 7);
                }
            }
            thing.nocollide = thing.nomove = thing.dead = true;
            FSM.MapScreener.nokeys = true;
            FSM.AudioPlayer.clearAll();
            FSM.AudioPlayer.play("Player Dies");
            FSM.ItemsHolder.decrease("lives");
            FSM.ItemsHolder.setItem("power", 1);
            if (FSM.ItemsHolder.getItem("lives") > 0) {
                FSM.TimeHandler.addEvent(area.onPlayerDeath.bind(FSM), area.onPlayerDeathTimeout, FSM);
            }
            else {
                FSM.TimeHandler.addEvent(area.onGameOver.bind(FSM), area.onGameOverTimeout, FSM);
            }
        };
        return Deaths;
    })();
    FullScreenMario.Deaths = Deaths;
})(FullScreenMario || (FullScreenMario = {}));
