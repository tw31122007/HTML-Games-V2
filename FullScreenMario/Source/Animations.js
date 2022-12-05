// @ifdef INCLUDE_DEFINITIONS
/// <reference path="FullScreenMario.d.ts" />
// @endif
var FullScreenMario;
(function (FullScreenMario) {
    "use strict";
    /**
     * Storage for animation Functions in FullScreenMario.
     */
    var Animations = (function () {
        function Animations() {
        }
        /**
         * Removes the crouching flag from a Player and re-adds the running cycle.
         * If a Player is large (has power > 1), size and classes must be set.
         *
         * @param thing   A Player that is no longer crouching.
         */
        Animations.prototype.animatePlayerRemoveCrouch = function (thing) {
            thing.crouching = false;
            thing.toly = thing.tolyOld || 0;
            if (thing.power !== 1) {
                thing.FSM.setHeight(thing, 16, true, true);
                thing.FSM.removeClasses(thing, "crouching");
                thing.FSM.updateBottom(thing, 0);
                thing.FSM.updateSize(thing);
            }
            thing.FSM.animations.animatePlayerRunningCycle(thing);
        };
        /**
         * Animates a solid that has just had its bottom "bumped" by a player. It
         * moves with a dx that is initially negative (up) and increases (to down).
         *
         * @param thing   A Solid being bumped.
         */
        Animations.prototype.animateSolidBump = function (thing) {
            var dx = -3;
            thing.FSM.TimeHandler.addEventInterval(function (thing) {
                thing.FSM.shiftVert(thing, dx);
                dx += .5;
                if (dx === 3.5) {
                    thing.up = undefined;
                    return true;
                }
                return false;
            }, 1, Infinity, thing);
        };
        /**
         * Animates a Block to switch from unused to used.
         *
         * @param thing   A Block that is now marked as used.
         */
        Animations.prototype.animateBlockBecomesUsed = function (thing) {
            thing.used = true;
            thing.FSM.switchClass(thing, "unused", "used");
        };
        /**
         * Animates a solid to have its contents emerge. A new Thing based on the
         * contents is spawned directly on top of (visually behind) the solid, and
         * has its animate callback triggered.
         *
         * @param thing   A Solid whose contents are coming out.
         * @param other   A Playe triggering the Solid contents.
         * @remarks If the contents are "Mushroom" and a large player hits the
         *          solid, they turn into "FireFlower".
         * @remarks For level editors, if thing.contents is falsy, the prototype
         *          is tried (so nothing becomes Coin in Blocks).
         */
        Animations.prototype.animateSolidContents = function (thing, other) {
            var output;
            if (other && other.player && other.power > 1 && thing.contents === "Mushroom") {
                thing.contents = "FireFlower";
            }
            output = thing.FSM.addThing(thing.contents || thing.constructor.prototype.contents);
            thing.FSM.setMidXObj(output, thing);
            thing.FSM.setTop(output, thing.top);
            output.blockparent = thing;
            output.animate(output, thing);
            return output;
        };
        /**
         * Animates a Brick turning into four rotating shards flying out of it. The
         * shards have an initial x- and y-velocities, and die after 70 steps.
         *
         * @param thing   A destroyed Brick to be animated.
         */
        Animations.prototype.animateBrickShards = function (thing) {
            var unitsize = thing.FSM.unitsize, shard, left, top, i;
            for (i = 0; i < 4; i += 1) {
                left = thing.left + Number(i < 2) * thing.width * unitsize - unitsize * 2;
                top = thing.top + (i % 2) * thing.height * unitsize - unitsize * 2;
                shard = thing.FSM.addThing("BrickShard", left, top);
                shard.xvel = shard.speed = unitsize / 2 - unitsize * Number(i > 1);
                shard.yvel = unitsize * -1.4 + i % 2;
                thing.FSM.TimeHandler.addEvent(thing.FSM.deaths.killNormal, 70, shard);
            }
        };
        /**
         * Standard animation Function for Things emerging from a solid as contents.
         * They start at inside the solid, slowly move up, then moveSimple until
         * they're off the solid, at which point they revert to their normal
         * movement.
         *
         * @param thing   A Character emerging from other.
         * @param other   A Solid that thing is emerging from.
         */
        Animations.prototype.animateEmerge = function (thing, other) {
            thing.nomove = thing.nocollide = thing.nofall = thing.alive = true;
            thing.FSM.flipHoriz(thing);
            thing.FSM.AudioPlayer.play("Powerup Appears");
            thing.FSM.arraySwitch(thing, thing.FSM.GroupHolder.getGroup("Character"), thing.FSM.GroupHolder.getGroup("Scenery"));
            thing.FSM.TimeHandler.addEventInterval(function () {
                thing.FSM.shiftVert(thing, thing.FSM.unitsize / -8);
                // Only stop once the bottom has reached the solid's top
                if (thing.bottom > other.top) {
                    return false;
                }
                thing.FSM.setBottom(thing, other.top);
                thing.FSM.GroupHolder.switchMemberGroup(thing, "Scenery", "Character");
                thing.nomove = thing.nocollide = thing.nofall = thing.moveleft = false;
                if (thing.emergeOut) {
                    thing.emergeOut(thing, other);
                }
                // Wait for movement until moveSimple moves this off the solid
                if (thing.movement) {
                    thing.movementOld = thing.movement;
                    thing.movement = thing.FSM.movements.moveSimple;
                    thing.FSM.TimeHandler.addEventInterval(function () {
                        if (thing.resting === other) {
                            return false;
                        }
                        thing.FSM.TimeHandler.addEvent(function () {
                            thing.movement = thing.movementOld;
                        }, 1);
                        return true;
                    }, 1, Infinity);
                }
                return true;
            }, 1, Infinity);
        };
        /**
         * Animation Function for Coins emerging from (or being hit by) a solid. The
         * Coin switches to the Scenery group, rotates between animation classes,
         * moves up then down then dies, plays the "Coin" sound, and increaes the
         * "coins" and "score" statistics.
         *
         * @param thing   A Coin emerging from other.
         * @param other   A Solid thing is emerging from.
         */
        Animations.prototype.animateEmergeCoin = function (thing, other) {
            thing.nocollide = thing.alive = thing.nofall = true;
            thing.yvel -= thing.FSM.unitsize;
            thing.FSM.switchClass(thing, "still", "anim");
            thing.FSM.GroupHolder.switchMemberGroup(thing, "Character", "Scenery");
            thing.FSM.AudioPlayer.play("Coin");
            thing.FSM.ItemsHolder.increase("coins", 1);
            thing.FSM.ItemsHolder.increase("score", 200);
            thing.FSM.TimeHandler.cancelClassCycle(thing, "0");
            thing.FSM.TimeHandler.addClassCycle(thing, [
                "anim1", "anim2", "anim3", "anim4", "anim3", "anim2"
            ], "0", 5);
            thing.FSM.TimeHandler.addEventInterval(function () {
                thing.FSM.movements.moveCoinEmerge(thing, other);
                return !thing.FSM.physics.isThingAlive(thing);
            }, 1, Infinity);
            thing.FSM.TimeHandler.addEvent(function () {
                thing.FSM.deaths.killNormal(thing);
            }, 49);
            thing.FSM.TimeHandler.addEvent(function () {
                thing.yvel *= -1;
            }, 25);
        };
        /**
         * Animation Function for a Vine emerging from a solid. It continues to grow
         * as normal via moveVine for 700 steps, then has its movement erased to
         * stop.
         *
         * @param thing   A Vine emerging from other.
         * @param other   A Solid thing is emerging from.
         */
        Animations.prototype.animateEmergeVine = function (thing, solid) {
            // This allows the thing's movement to keep it on the solid
            thing.attachedSolid = solid;
            thing.FSM.setHeight(thing, 0);
            thing.FSM.AudioPlayer.play("Vine Emerging");
            thing.FSM.TimeHandler.addEvent(function () {
                thing.nocollide = false;
            }, 14);
            thing.FSM.TimeHandler.addEvent(function () {
                thing.movement = undefined;
            }, 700);
        };
        /**
         * Animates a "flicker" effect on a Thing by repeatedly toggling its hidden
         * flag for a little while.
         *
         * @param thing   A Thing switching between hidden and visible.
         * @param cleartime   How long to wait to stop the effect (by default, 49).
         * @param interval   How many steps between hidden toggles (by default, 2).
         */
        Animations.prototype.animateFlicker = function (thing, cleartime, interval) {
            cleartime = Math.round(cleartime) || 49;
            interval = Math.round(interval) || 2;
            thing.flickering = true;
            thing.FSM.TimeHandler.addEventInterval(function () {
                thing.hidden = !thing.hidden;
                thing.FSM.PixelDrawer.setThingSprite(thing);
            }, interval, cleartime);
            thing.FSM.TimeHandler.addEvent(function () {
                thing.flickering = thing.hidden = false;
                thing.FSM.PixelDrawer.setThingSprite(thing);
            }, cleartime * interval + 1);
        };
        /**
         * Animate Function for a HammerBro to throw a hammer. The HammerBro
         * switches to the "throwing" class, waits and throws a few repeats, then
         * goes back to normal.
         *
         * @param thing   A HammerBro throwing hammers.
         * @param count   How many times left there are to throw a hammer. If equal
         *                to 3, a hammer will not be thrown (to mimic the pause in
         *                the original game).
         */
        Animations.prototype.animateThrowingHammer = function (thing, count) {
            if (!thing.FSM.physics.isThingAlive(thing)) {
                return true;
            }
            if (thing.FSM.physics.isThingAlive(thing.FSM.player)
                && thing.right >= thing.FSM.unitsize * -32
                && count !== 3) {
                thing.FSM.switchClass(thing, "thrown", "throwing");
            }
            thing.FSM.TimeHandler.addEvent(function () {
                if (!thing.FSM.physics.isThingAlive(thing)) {
                    return;
                }
                // Schedule the next animateThrowingHammer call
                if (count > 0) {
                    thing.FSM.TimeHandler.addEvent(thing.FSM.animations.animateThrowingHammer, 7, thing, count - 1);
                }
                else {
                    thing.FSM.TimeHandler.addEvent(thing.FSM.animations.animateThrowingHammer, 70, thing, 7);
                    thing.FSM.removeClass(thing, "thrown");
                }
                // Don't throw if a Player is dead, or this is too far to the left
                if (!thing.FSM.physics.isThingAlive(thing.FSM.player) || thing.right < thing.FSM.unitsize * -32) {
                    thing.FSM.switchClass(thing, "throwing", "thrown");
                    return;
                }
                // Don't throw in the third iteration (makes a gap in the hammers)
                if (count === 3) {
                    return;
                }
                // Throw by creating a hammer and visually updating
                thing.FSM.switchClass(thing, "throwing", "thrown");
                thing.FSM.addThing(["Hammer", {
                        "xvel": thing.lookleft
                            ? thing.FSM.unitsize / -1.4
                            : thing.FSM.unitsize / 1.4,
                        "yvel": thing.FSM.unitsize * -1.4,
                        "gravity": thing.FSM.MapScreener.gravity / 2.1
                    }], thing.left - thing.FSM.unitsize * 2, thing.top - thing.FSM.unitsize * 2);
            }, 14);
            return false;
        };
        /**
         * Animation Function for when Bowser jumps. This will only trigger if he is
         * facing left and a player exists. If either Bowser or a Player die, it
         * is cancelled. He is given a negative yvel to jump, and the nocollidesolid
         * flag is enabled as long as he is rising.
         *
         * @param thing   A Bowser about to jump.
         * @returns Whether to stop the event interval occasionally triggering this.
         */
        Animations.prototype.animateBowserJump = function (thing) {
            if (!thing.lookleft || !thing.FSM.physics.isThingAlive(thing.FSM.player)) {
                return false;
            }
            if (!thing.FSM.physics.isThingAlive(thing)) {
                return true;
            }
            thing.resting = undefined;
            thing.yvel = thing.FSM.unitsize * -1.4;
            // If there is a platform, don't bump into it
            thing.nocollidesolid = true;
            thing.FSM.TimeHandler.addEventInterval(function () {
                if (thing.dead || thing.yvel > thing.FSM.unitsize) {
                    thing.nocollidesolid = false;
                    return true;
                }
                return false;
            }, 3, Infinity);
            return false;
        };
        /**
         * Animation Function for when Bowser fires. This will only trigger if he is
         * facing left and a player exists. If either Bowser or a Player die, it
         * is cancelled. His mouth is closed and an animateBowserFireOpen call is
         * scheduled to complete the animation.
         *
         * @param thing   A Bowser about to fire.
         * @returns Whether to stop the event interval occasionally triggering this.
         */
        Animations.prototype.animateBowserFire = function (thing) {
            if (!thing.lookleft || !thing.FSM.physics.isThingAlive(thing.FSM.player)) {
                return false;
            }
            if (!thing.FSM.physics.isThingAlive(thing)) {
                return true;
            }
            // Close the mouth
            thing.FSM.addClass(thing, "firing");
            thing.FSM.AudioPlayer.playLocal("Bowser Fires", thing.left);
            // After a bit, re-open and fire
            thing.FSM.TimeHandler.addEvent(thing.FSM.animations.animateBowserFireOpen, 14, thing);
            return false;
        };
        /**
         * Animation Function for when Bowser actually fires. A BowserFire Thing is
         * placed at his mouth, given a (rounded to unitsize * 8) destination y, and
         * sent firing to a Player.
         *
         * @param thing   A Bowser opening its mouth.
         * @returns Whether to stop the event interval occasionally triggering this.
         */
        Animations.prototype.animateBowserFireOpen = function (thing) {
            var unitsize = thing.FSM.unitsize, ylev = Math.max(-thing.height * unitsize, Math.round(thing.FSM.player.bottom / (unitsize * 8))
                * unitsize * 8);
            if (!thing.FSM.physics.isThingAlive(thing)) {
                return true;
            }
            thing.FSM.removeClass(thing, "firing");
            thing.FSM.addThing(["BowserFire", {
                    "ylev": ylev
                }], thing.left - thing.FSM.unitsize * 8, thing.top + thing.FSM.unitsize * 4);
            return false;
        };
        /**
         * Animation Function for when Bowser throws a Hammer. It's similar to a
         * HammerBro, but the hammer appears on top of Bowser for a few steps
         * before being thrown in the direction Bowser is facing (though it will
         * only be added if facing left).
         *
         * @param thing   A Bowser about to throw a hammer.
         * @returns Whether to stop the event interval occasionally triggering this.
         */
        Animations.prototype.animateBowserThrow = function (thing) {
            if (!thing.lookleft || !thing.FSM.player || !thing.FSM.physics.isThingAlive(thing.FSM.player)) {
                return false;
            }
            if (!thing.FSM.physics.isThingAlive(thing)) {
                return true;
            }
            var hammer = thing.FSM.addThing("Hammer", thing.left + thing.FSM.unitsize * 2, thing.top - thing.FSM.unitsize * 2);
            thing.FSM.TimeHandler.addEventInterval(function () {
                if (!thing.FSM.physics.isThingAlive(thing)) {
                    thing.FSM.deaths.killNormal(hammer);
                    return true;
                }
                thing.FSM.setTop(hammer, thing.top - thing.FSM.unitsize * 2);
                if (thing.lookleft) {
                    thing.FSM.setLeft(hammer, thing.left + thing.FSM.unitsize * 2);
                }
                else {
                    thing.FSM.setLeft(hammer, thing.right - thing.FSM.unitsize * 2);
                }
                return true;
            }, 1, 14);
            thing.FSM.TimeHandler.addEvent(function () {
                hammer.xvel = thing.FSM.unitsize * 1.17;
                hammer.yvel = thing.FSM.unitsize * -2.1;
                // hammer.gravity = thing.FSM.MapScreener.gravity / 1.4;
                if (thing.lookleft) {
                    hammer.xvel *= -1;
                }
            }, 14);
            return false;
        };
        /**
         * Animation Function for when Bowser freezes upon a Player hitting a
         * CastleAxe. Velocity and movement are paused, and the Bowser is added to
         * the current cutscene's settings.
         *
         * @param thing   A Bowser that has just been killed.
         * @remarks This is triggered as Bowser's killonend property.
         */
        Animations.prototype.animateBowserFreeze = function (thing) {
            thing.nofall = true;
            thing.nothrow = true;
            thing.movement = undefined;
            thing.dead = true;
            thing.FSM.animations.animateCharacterPauseVelocity(thing);
            thing.FSM.ScenePlayer.addCutsceneSetting("bowser", thing);
            thing.FSM.TimeHandler.addEvent(function () {
                thing.nofall = false;
            }, 70);
        };
        /**
         * Animation Function for a standard jump, such as what HammerBros do. The
         * jump may be in either up or down, chosen at random by the NumberMaker.
         * Steps are taken to ensure the Thing does not collide at improper points
         * during the jump.
         *
         * @param thing   A HammerBro about to jump.
         * @returns Whether to stop the event interval occasionally triggering this.
         */
        Animations.prototype.animateJump = function (thing) {
            // Finish
            if (!thing.FSM.physics.isThingAlive(thing) || !thing.FSM.physics.isThingAlive(thing.FSM.player)) {
                return true;
            }
            // Skip
            if (!thing.resting) {
                return false;
            }
            // Jump up?
            if (thing.FSM.MapScreener.floor - (thing.bottom / thing.FSM.unitsize) >= 30
                && thing.resting.title !== "Floor"
                && thing.FSM.NumberMaker.randomBoolean()) {
                thing.falling = true;
                thing.yvel = thing.FSM.unitsize * -.7;
                thing.FSM.TimeHandler.addEvent(function () {
                    thing.falling = false;
                }, 42);
            }
            else {
                // Jump down
                thing.nocollidesolid = true;
                thing.yvel = thing.FSM.unitsize * -2.1;
                thing.FSM.TimeHandler.addEvent(function () {
                    thing.nocollidesolid = false;
                }, 42);
            }
            thing.resting = undefined;
            return false;
        };
        /**
         * Animation Function for Bloopers starting to "unsqueeze". The "squeeze"
         * class is removed, their height is reset to 12, and their counter reset.
         *
         * @param thing   An unsqueezing Blooper.
         */
        Animations.prototype.animateBlooperUnsqueezing = function (thing) {
            thing.counter = 0;
            thing.squeeze = 0;
            thing.FSM.removeClass(thing, "squeeze");
            thing.FSM.setHeight(thing, 12, true, true);
        };
        /**
         * Animation Function for Podoboos jumping up. Their top is recorded and a
         * large negative yvel is given; after the jumpheight number of steps, they
         * fall back down.
         *
         * @param thing   A Podoboo jumping up.
         */
        Animations.prototype.animatePodobooJumpUp = function (thing) {
            thing.starty = thing.top;
            thing.yvel = thing.speed * -1;
            thing.FSM.TimeHandler.addEvent(thing.FSM.animations.animatePodobooJumpDown, thing.jumpHeight, thing);
        };
        /**
         * Animation Function for when a Podoboo needs to stop jumping. It obtains
         * the movePodobooFalling movement to track its descent.
         *
         * @param thing   A Podoboo jumping down.
         */
        Animations.prototype.animatePodobooJumpDown = function (thing) {
            thing.movement = thing.FSM.movements.movePodobooFalling;
        };
        /**
         * Animation Function for a Lakitu throwing a SpinyEgg. The Lakitu hides
         * behind its cloud ("hiding" class), waits 21 steps, then throws an egg up
         * and comes out of "hiding".
         *
         * @param thing   A Lakitu throwing a Spiny.
         * @returns Whether to stop the event interval occasionally triggering this.
         */
        Animations.prototype.animateLakituThrowingSpiny = function (thing) {
            if (thing.fleeing || !thing.FSM.physics.isThingAlive(thing)) {
                return true;
            }
            thing.FSM.switchClass(thing, "out", "hiding");
            thing.FSM.TimeHandler.addEvent(function () {
                if (thing.dead) {
                    return;
                }
                var spawn = thing.FSM.addThing("SpinyEgg", thing.left, thing.top);
                spawn.yvel = thing.FSM.unitsize * -2.1;
                thing.FSM.switchClass(thing, "hiding", "out");
            }, 21);
        };
        /**
         * Animation Function for when a SpinyEgg hits the ground. The SpinyEgg is
         * killed and a Spiny is put in its place, moving towards a Player.
         *
         * @param thing   A SpinyEgg hatching into a Spiny.
         */
        Animations.prototype.animateSpinyEggHatching = function (thing) {
            if (!thing.FSM.physics.isThingAlive(thing)) {
                return;
            }
            var spawn = thing.FSM.addThing("Spiny", thing.left, thing.top - thing.yvel);
            spawn.moveleft = thing.FSM.objectToLeft(thing.FSM.player, spawn);
            thing.FSM.deaths.killNormal(thing);
        };
        /**
         * Animation Function for when a Fireball emerges from a Player. All that
         * happens is the "Fireball" sound plays.
         *
         * @param thing   A Fireball emerging from a Player.
         */
        Animations.prototype.animateFireballEmerge = function (thing) {
            thing.FSM.AudioPlayer.play("Fireball");
        };
        /**
         * Animation Function for when a Fireball explodes. It is deleted and,
         * unless big is === 2 (as this is used as a kill Function), a Firework is
         * put in its place.
         *
         * @param thing   An exploding Fireball.
         * @param big   The "level" of death this is (a 2 implies this is a sudden
         *              death, without animations).
         */
        Animations.prototype.animateFireballExplode = function (thing, big) {
            thing.nocollide = true;
            thing.FSM.deaths.killNormal(thing);
            if (big === 2) {
                return;
            }
            var output = thing.FSM.addThing("Firework");
            thing.FSM.setMidXObj(output, thing);
            thing.FSM.setMidYObj(output, thing);
            output.animate(output);
        };
        /**
         * Animation Function for a Firework, triggered immediately upon spawning.
         * The Firework cycles between "n1" through "n3", then dies.
         *
         * @param thing   An exploding Firework.
         */
        Animations.prototype.animateFirework = function (thing) {
            var name = thing.className + " n", i;
            for (i = 0; i < 3; i += 1) {
                thing.FSM.TimeHandler.addEvent(function (i) {
                    thing.FSM.setClass(thing, name + (i + 1).toString());
                }, i * 7, i);
            }
            thing.FSM.AudioPlayer.play("Firework");
            thing.FSM.TimeHandler.addEvent(function () {
                thing.FSM.deaths.killNormal(thing);
            }, i * 7);
        };
        /**
         * Animation Function for a Cannon outputting a BulletBill. This will only
         * happen if the Cannon isn't within 8 units of a Player. The spawn flies
         * at a constant rate towards a Player.
         *
         * @param thing   A firing Cannon.
         */
        Animations.prototype.animateCannonFiring = function (thing) {
            if (!thing.FSM.physics.isThingAlive(thing)) {
                return;
            }
            // Don't fire if Player is too close
            if (thing.FSM.player.right > (thing.left - thing.FSM.unitsize * 8)
                && thing.FSM.player.left < (thing.right + thing.FSM.unitsize * 8)) {
                return;
            }
            var spawn = thing.FSM.ObjectMaker.make("BulletBill");
            if (thing.FSM.objectToLeft(thing.FSM.player, thing)) {
                spawn.direction = 1;
                spawn.moveleft = true;
                spawn.xvel *= -1;
                thing.FSM.flipHoriz(spawn);
                thing.FSM.addThing(spawn, thing.left, thing.top);
            }
            else {
                thing.FSM.addThing(spawn, thing.left + thing.width, thing.top);
            }
            thing.FSM.AudioPlayer.playLocal("Bump", thing.right);
        };
        /**
         * Animation Function for a fiery player throwing a Fireball. A player may
         * only do so if fewer than 2 other thrown Fireballs exist. A new Fireball
         * is created in front of where a Player is facing and are sent bouncing
         * away.
         *
         * @param thing   A Player throwing a fireball.
         */
        Animations.prototype.animatePlayerFire = function (thing) {
            if (thing.numballs >= 2) {
                return;
            }
            var xloc = thing.moveleft
                ? (thing.left - thing.FSM.unitsize / 4)
                : (thing.right + thing.FSM.unitsize / 4), ball = thing.FSM.ObjectMaker.make("Fireball", {
                "moveleft": thing.moveleft,
                "speed": thing.FSM.unitsize * 1.75,
                "jumpheight": thing.FSM.unitsize * 1.56,
                "gravity": thing.FSM.MapScreener.gravity * 1.56,
                "yvel": thing.FSM.unitsize,
                "movement": thing.FSM.movements.moveJumping
            });
            thing.FSM.addThing(ball, xloc, thing.top + thing.FSM.unitsize * 8);
            ball.animate(ball);
            ball.onDelete = function () {
                thing.numballs -= 1;
            };
            thing.numballs += 1;
            thing.FSM.addClass(thing, "firing");
            thing.FSM.TimeHandler.addEvent(function () {
                thing.FSM.removeClass(thing, "firing");
            }, 7);
        };
        /**
         * Animation Function that regularly spings CastleFireballs around their
         * parent CastleBlock. The CastleBlock's location and angle determine the
         * location of each CastleFireball, and its dt and direction determine how
         * the angle is changed for the next call.
         *
         * @param thing   A CastleBlock with CastleFireballs around it.
         * @param balls   CastleFireballs rotating from thing's center.
         */
        Animations.prototype.animateCastleBlock = function (thing, balls) {
            var midx = thing.EightBitter.getMidX(thing), midy = thing.EightBitter.getMidY(thing), ax = Math.cos(thing.angle * Math.PI) * thing.FSM.unitsize * 4, ay = Math.sin(thing.angle * Math.PI) * thing.FSM.unitsize * 4, i;
            for (i = 0; i < balls.length; i += 1) {
                thing.FSM.setMidX(balls[i], midx + ax * i);
                thing.FSM.setMidY(balls[i], midy + ay * i);
            }
            thing.angle += thing.dt * thing.direction;
        };
        /**
         * Animation Function to close a CastleBridge when a Player triggers its
         * killonend after hitting the CastleAxe in EndInsideCastle. Its width is
         * reduced repeatedly on an interval until it's 0.
         *
         * @param thing   A CastleBridge opening from a CastleAxe's trigger.
         * @remarks This is triggered as the killonend property of the bridge.
         */
        Animations.prototype.animateCastleBridgeOpen = function (thing) {
            thing.FSM.ScenePlayer.playRoutine("CastleBridgeOpen", thing);
        };
        /**
         * Animation Function for when a CastleChain opens, which just delays a
         * killNormal call for 7 steps.
         *
         * @param thing   A CastleChain opening from a CastleAxe's trigger.
         * @remarks This is triggered as the killonend property of the chain.
         */
        Animations.prototype.animateCastleChainOpen = function (thing) {
            thing.FSM.TimeHandler.addEvent(thing.FSM.deaths.killNormal, 3, thing);
        };
        /**
         * Animation Function for when a Player paddles underwater. Any previous
         * Any previous paddling classes and cycle are removed, and a new one is
         * added that, when it finishes, remnoves a Player's paddlingCycle as
         * well.
         *
         * @param thing   A Player paddling in water.
         */
        Animations.prototype.animatePlayerPaddling = function (thing) {
            if (!thing.paddlingCycle) {
                thing.FSM.removeClasses(thing, "skidding paddle1 paddle2 paddle3 paddle4 paddle5");
                thing.FSM.addClass(thing, "paddling");
                thing.FSM.TimeHandler.cancelClassCycle(thing, "paddlingCycle");
                thing.FSM.TimeHandler.addClassCycle(thing, [
                    "paddle1", "paddle2", "paddle3", "paddle2", "paddle1",
                    function () { return thing.paddlingCycle = false; }
                ], "paddlingCycle", 7);
            }
            thing.paddling = thing.paddlingCycle = thing.swimming = true;
            thing.yvel = thing.FSM.unitsize * -.84;
        };
        /**
         * Animation Function for when a player lands to reset size and remove
         * hopping (and if underwater, paddling) classes. The mod event is fired.
         *
         * @param thing   A Player landing on a Solid.
         */
        Animations.prototype.animatePlayerLanding = function (thing) {
            if (thing.crouching && thing.power > 1) {
                thing.FSM.setHeight(thing, 11, true, true);
            }
            if (thing.FSM.hasClass(thing, "hopping")) {
                thing.FSM.switchClass(thing, "hopping", "jumping");
            }
            if (thing.FSM.MapScreener.underwater) {
                thing.FSM.removeClass(thing, "paddling");
            }
            thing.FSM.ModAttacher.fireEvent("onPlayerLanding", thing, thing.resting);
        };
        /**
         * Animation Function for when a Player moves off a resting solid. It
         * sets resting to undefined, and if underwater, switches the "running" and
         * "paddling" classes.
         *
         * @param thing   A Player moving off a resting Solid.
         */
        Animations.prototype.animatePlayerRestingOff = function (thing) {
            thing.resting = undefined;
            if (thing.FSM.MapScreener.underwater) {
                thing.FSM.switchClass(thing, "running", "paddling");
            }
        };
        /**
         * Animation Function for when a player breathes a underwater. This creates
         * a Bubble, which slowly rises to the top of the screen.
         *
         * @param thing   An underwater Player.
         */
        Animations.prototype.animatePlayerBubbling = function (thing) {
            thing.FSM.addThing("Bubble", thing.right, thing.top);
        };
        /**
         * Animation Function to give a Player a cycle of running classes. The
         * cycle auto-updates its time as a function of how fast a Player is
         * moving relative to its maximum speed.
         *
         * @param thing   A running player.
         */
        Animations.prototype.animatePlayerRunningCycle = function (thing) {
            thing.FSM.switchClass(thing, "still", "running");
            thing.running = thing.FSM.TimeHandler.addClassCycle(thing, [
                "one", "two", "three", "two"
            ], "running", function () {
                return 5 + Math.ceil(thing.maxspeedsave - Math.abs(thing.xvel));
            });
        };
        /**
         * Completely pauses a Thing by setting its velocities to zero and disabling
         * it from falling, colliding, or moving. Its old attributes for those are
         * saved so thingResumeVelocity may restore them.
         *
         * @param thing   A Character being forzen in place.
         * @param keepMovement   Whether to keep movement instead of wiping it
         *                       (by default, false).
         */
        Animations.prototype.animateCharacterPauseVelocity = function (thing, keepMovement) {
            thing.xvelOld = thing.xvel || 0;
            thing.yvelOld = thing.yvel || 0;
            thing.nofallOld = thing.nofall || false;
            thing.nocollideOld = thing.nocollide || false;
            thing.movementOld = thing.movement || thing.movementOld;
            thing.nofall = thing.nocollide = true;
            thing.xvel = thing.yvel = 0;
            if (!keepMovement) {
                thing.movement = undefined;
            }
        };
        /**
         * Resumes a Thing's velocity and movements after they were paused by
         * thingPauseVelocity.
         *
         * @param thing   A Character being unfrozen.
         * @param noVelocity   Whether to skip restoring the Thing's velocity
         *                     (by default, false).
         */
        Animations.prototype.animateCharacterResumeVelocity = function (thing, noVelocity) {
            if (!noVelocity) {
                thing.xvel = thing.xvelOld || 0;
                thing.yvel = thing.yvelOld || 0;
            }
            thing.movement = thing.movementOld || thing.movement;
            thing.nofall = thing.nofallOld || false;
            thing.nocollide = thing.nocollideOld || false;
        };
        /**
         * Animation Function for when a player hops on an enemy. Resting is set to
         * undefined, and a small vertical yvel is given.
         *
         * @param thing   A Character hopping up.
         */
        Animations.prototype.animateCharacterHop = function (thing) {
            thing.resting = undefined;
            thing.yvel = thing.FSM.unitsize * -1.4;
        };
        /**
         * Animation Function to start a player transferring through a Pipe. This is
         * generic for entrances and exists horizontally and vertically: movement
         * and velocities are frozen, size is reset, and the piping flag enabled.
         * a Player is also moved into the Scenery group to be behind the Pipe.
         *
         * @param thing   A Player entering a Pipe.
         */
        Animations.prototype.animatePlayerPipingStart = function (thing) {
            thing.nocollide = thing.nofall = thing.piping = true;
            thing.xvel = thing.yvel = 0;
            thing.movementOld = thing.movement;
            thing.movement = undefined;
            if (thing.power > 1) {
                thing.FSM.animations.animatePlayerRemoveCrouch(thing);
                thing.FSM.setPlayerSizeLarge(thing);
            }
            else {
                thing.FSM.setPlayerSizeSmall(thing);
            }
            thing.FSM.removeClasses(thing, "jumping running crouching");
            thing.FSM.AudioPlayer.clearTheme();
            thing.FSM.TimeHandler.cancelAllCycles(thing);
            thing.FSM.GroupHolder.switchMemberGroup(thing, "Character", "Scenery");
        };
        /**
         * Animation Function for when a player is done passing through a Pipe. This
         * is abstracted for exits both horizontally and vertically, typically after
         * an area has just been entered.
         *
         * @param thing   A Player completing a pass through a Pipe.
         */
        Animations.prototype.animatePlayerPipingEnd = function (thing) {
            thing.movement = thing.movementOld;
            thing.nocollide = thing.nofall = thing.piping = false;
            thing.FSM.AudioPlayer.resumeTheme();
            thing.FSM.GroupHolder.switchMemberGroup(thing, "Scenery", "Character");
        };
        /**
         * Animation Function for when a player is hopping off a pole. It hops off
         * and faces the opposite direction.
         *
         * @param thing   A Player moving a way from a pole.
         * @param doRun   Whether a Player should have a running cycle added
         *                added immediately, such as during cutscenes (by
         *                default, false).
         */
        Animations.prototype.animatePlayerOffPole = function (thing, doRun) {
            thing.FSM.removeClasses(thing, "climbing running");
            thing.FSM.addClass(thing, "jumping");
            thing.xvel = 1.4;
            thing.yvel = -.7;
            thing.nocollide = thing.nofall = false;
            thing.gravity = thing.FSM.MapScreener.gravity / 14;
            thing.FSM.TimeHandler.addEvent(function () {
                thing.movement = thing.FSM.movements.movePlayer;
                thing.gravity = thing.FSM.MapScreener.gravity;
                thing.FSM.unflipHoriz(thing);
                if (doRun) {
                    thing.FSM.animations.animatePlayerRunningCycle(thing);
                }
            }, 21);
        };
        /**
         * Animation Function for when a player must hop off a Vine during an area's
         * opening cutscene. A player switches sides, waits 14 steps, then calls
         * animatePlayerOffPole.
         *
         * @param thing   A Player moving away from a Vine.
         */
        Animations.prototype.animatePlayerOffVine = function (thing) {
            thing.FSM.flipHoriz(thing);
            thing.FSM.shiftHoriz(thing, (thing.width - 1) * thing.FSM.unitsize);
            thing.FSM.TimeHandler.addEvent(thing.FSM.animations.animatePlayerOffPole, 14, thing);
        };
        return Animations;
    })();
    FullScreenMario.Animations = Animations;
})(FullScreenMario || (FullScreenMario = {}));
