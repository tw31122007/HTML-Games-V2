// @ifdef INCLUDE_DEFINITIONS
/// <reference path="FullScreenMario.d.ts" />
// @endif
var FullScreenMario;
(function (FullScreenMario) {
    "use strict";
    /**
     * Storage for movement Functions in FullScreenMario.
     */
    var Movements = (function () {
        function Movements() {
        }
        /**
         * Base, generic movement Function for simple characters. The Thing moves
         * at a constant rate in either the x or y direction, and switches direction
         * only if directed by the engine (e.g. when it hits a Solid)
         *
         * @param thing   A Character that should move.
         * @remarks thing.speed is the only required member attribute; .direction
         *          and .moveleft should be set by the game engine.
         */
        Movements.prototype.moveSimple = function (thing) {
            // If the thing is looking away from the intended direction, flip it
            if (thing.direction !== (thing.moveleft ? 1 : 0)) {
                // thing.moveleft is truthy: it should now be looking to the right
                if (thing.moveleft) {
                    thing.xvel = -thing.speed;
                    if (!thing.noflip) {
                        thing.FSM.unflipHoriz(thing);
                    }
                }
                else {
                    // thing.moveleft is falsy: it should now be looking to the left
                    thing.xvel = thing.speed;
                    if (!thing.noflip) {
                        thing.FSM.flipHoriz(thing);
                    }
                }
                thing.direction = thing.moveleft ? 1 : 0;
            }
        };
        /**
         * Extension of the moveSimple movement Function for Things that shouldn't
         * fall off the edge of their resting blocks
         *
         * @param thing   A Character that should move.
         */
        Movements.prototype.moveSmart = function (thing) {
            // Start off by calling moveSimple for normal movement
            thing.FSM.movements.moveSimple(thing);
            // If this isn't resting, it's the same as moveSimple
            if (thing.yvel !== 0) {
                return;
            }
            if (!thing.resting || !thing.FSM.physics.isCharacterOnResting(thing, thing.resting)) {
                if (thing.moveleft) {
                    thing.FSM.shiftHoriz(thing, thing.FSM.unitsize, true);
                }
                else {
                    thing.FSM.shiftHoriz(thing, -thing.FSM.unitsize, true);
                }
                thing.moveleft = !thing.moveleft;
            }
        };
        /**
         * Extension of the moveSimple movement Function for Things that should
         * jump whenever they start resting.
         *
         * @param thing   A Character that should move.
         * @remarks thing.jumpheight is required to know how high to jump.
         */
        Movements.prototype.moveJumping = function (thing) {
            // Start off by calling moveSimple for normal movement
            thing.FSM.movements.moveSimple(thing);
            // If .resting, jump!
            if (thing.resting) {
                thing.yvel = -Math.abs(thing.jumpheight);
                thing.resting = undefined;
            }
        };
        /**
         * Movement Function for Characters that slide back and forth, such as
         * HammerBros and Lakitus.
         *
         * @param thing   A HammerBro or Lakitu that should move.
         * @remarks thing.counter must be set elsewhere, such as during spawning.
         */
        Movements.prototype.movePacing = function (thing) {
            thing.counter += .007;
            thing.xvel = Math.sin(Math.PI * thing.counter) / 2.1;
        };
        /**
         * Movement Function for HammerBros. They movePacing, look towards the
         * player, and have the nocollidesolid flag if they're jumping up or
         * intentionally falling through a solid.
         *
         * @param thing   A HammerBro that should move.
         */
        Movements.prototype.moveHammerBro = function (thing) {
            thing.FSM.movements.movePacing(thing);
            thing.FSM.lookTowardsPlayer(thing);
            thing.nocollidesolid = thing.yvel < 0 || thing.falling;
        };
        /**
         * Movement Function for Bowser. Bowser always faces a Player and
         * movePaces if he's to the right of a Player, or moves to the right if
         * he's to the left.
         *
         * @param thing   A Bowser that should move.
         */
        Movements.prototype.moveBowser = function (thing) {
            // Facing to the right
            if (thing.flipHoriz) {
                // To the left of player: walk to the right
                if (thing.FSM.objectToLeft(thing, thing.FSM.player)) {
                    thing.FSM.movements.moveSimple(thing);
                }
                else {
                    // To the right of player: look to the left and movePacing as normal
                    thing.moveleft = thing.lookleft = true;
                    thing.FSM.unflipHoriz(thing);
                    thing.FSM.movements.movePacing(thing);
                }
            }
            else {
                // Facing to the left
                // To the left of player: look and walk to the right
                if (thing.FSM.objectToLeft(thing, thing.FSM.player)) {
                    thing.moveleft = thing.lookleft = false;
                    thing.FSM.flipHoriz(thing);
                    thing.FSM.movements.moveSimple(thing);
                }
                else {
                    // To the right of a Player: movePacing as normal
                    thing.FSM.movements.movePacing(thing);
                }
            }
        };
        /**
         * Movement Function for Bowser's spewed fire. It has a ylev stored from
         * creation that will tell it when to stop changing its vertical
         * velocity from this Function; otherwise, it shifts its vertical
         * position to move to the ylev.
         *
         * @param thing   A BowserFire that should move.
         */
        Movements.prototype.moveBowserFire = function (thing) {
            if (Math.round(thing.bottom) === Math.round(thing.ylev)) {
                thing.movement = undefined;
                return;
            }
            thing.FSM.shiftVert(thing, Math.min(Math.max(0, thing.ylev - thing.bottom), thing.FSM.unitsize));
        };
        /**
         * Movement function for Things that float up and down (vertically).
         * If the Thing has reached thing.begin or thing.end, it gradually switches
         * thing.yvel
         *
         * @param thing   A Thing that should move.
         * @remarks thing.maxvel is used as the maximum absolute speed vertically
         * @remarks thing.begin and thing.end are used as the vertical endpoints;
         *          .begin is the bottom and .end is the top (since begin <= end)
         */
        Movements.prototype.moveFloating = function (thing) {
            // If above the endpoint:
            if (thing.top <= thing.end) {
                thing.yvel = Math.min(thing.yvel + thing.FSM.unitsize / 64, thing.maxvel);
            }
            else if (thing.bottom >= thing.begin) {
                // If below the endpoint:
                thing.yvel = Math.max(thing.yvel - thing.FSM.unitsize / 64, -thing.maxvel);
            }
            // Deal with velocities and whether a Player is resting on this
            thing.FSM.movements.movePlatform(thing);
        };
        /**
         * Actual movement Function for Things that float sideways (horizontally).
         * If the Thing has reached thing.begin or thing.end, it gradually switches
         * thing.xvel.
         *
         * @param thing   A Thing that should move.
         * @remarks thing.maxvel is used as the maximum absolute speed horizontally
         * @remarks thing.begin and thing.end are used as the horizontal endpoints;
         *          .begin is the left and .end is the right (since begin <= end)
         */
        Movements.prototype.moveSliding = function (thing) {
            // If to the left of the endpoint:
            if (thing.FSM.MapScreener.left + thing.left <= thing.begin) {
                thing.xvel = Math.min(thing.xvel + thing.FSM.unitsize / 64, thing.maxvel);
            }
            else if (thing.FSM.MapScreener.left + thing.right > thing.end) {
                // If to the right of the endpoint:
                thing.xvel = Math.max(thing.xvel - thing.FSM.unitsize / 64, -thing.maxvel);
            }
            // Deal with velocities and whether a Player is resting on this
            thing.FSM.movements.movePlatform(thing);
        };
        /**
         * Ensures thing.begin <= thing.end (so there won't be glitches pertaining
         * to them in functions like moveFloating and moveSliding
         *
         * @param thing   A spawning Thing that needs its movement endpoings set.
         */
        Movements.prototype.setMovementEndpoints = function (thing) {
            if (thing.begin > thing.end) {
                var temp = thing.begin;
                thing.begin = thing.end;
                thing.end = temp;
            }
            thing.begin *= thing.FSM.unitsize;
            thing.end *= thing.FSM.unitsize;
        };
        /**
         * General movement Function for Platforms. Moves a Platform by its
         * velocities, and checks for whether a Thing is resting on it (if so,
         * the Thing is accordingly).
         *
         * @param thing   A Platform that should move.
         */
        Movements.prototype.movePlatform = function (thing) {
            thing.FSM.shiftHoriz(thing, thing.xvel);
            thing.FSM.shiftVert(thing, thing.yvel);
            // If a Player is resting on this and this is alive, move a Player
            if (thing === thing.FSM.player.resting && thing.FSM.player.alive) {
                thing.FSM.setBottom(thing.FSM.player, thing.top);
                thing.FSM.shiftHoriz(thing.FSM.player, thing.xvel);
                // If a Player is too far to the right or left, stop that overlap
                if (thing.FSM.player.right > thing.FSM.MapScreener.width) {
                    thing.FSM.setRight(thing.FSM.player, thing.FSM.MapScreener.width);
                }
                else if (thing.FSM.player.left < 0) {
                    thing.FSM.setLeft(thing.FSM.player, 0);
                }
            }
        };
        /**
         * Movement Function for platforms that are in a PlatformGenerator. They
         * have the typical movePlatform applied to them, but if they reach the
         * bottom or top of the screen, they are shifted to the opposite side.
         *
         * @param thing   A Platform that should move.
         */
        Movements.prototype.movePlatformSpawn = function (thing) {
            if (thing.bottom < 0) {
                thing.FSM.setTop(thing, thing.FSM.MapScreener.bottomPlatformMax);
            }
            else if (thing.top > thing.FSM.MapScreener.bottomPlatformMax) {
                thing.FSM.setBottom(thing, 0);
            }
            else {
                thing.FSM.movements.movePlatform(thing);
                return;
            }
            if (thing.FSM.player
                && thing.FSM.player.resting === thing) {
                thing.FSM.player.resting = undefined;
            }
        };
        /**
         * Movement Function for Platforms that fall whenever rested upon by a
         * player. Being rested upon means the Platform falls; when it reaches a
         * terminal velocity, it switches to moveFreeFalling forever.
         *
         * @param thing   A Platform that should move.
         */
        Movements.prototype.moveFalling = function (thing) {
            // If a Player isn't resting on this thing (any more?), ignore it
            if (thing.FSM.player.resting !== thing) {
                // Since a Player might have been on this thing but isn't anymore, 
                // set the yvel to 0 just in case
                thing.yvel = 0;
                return;
            }
            // Since a Player is on this thing, start falling more
            thing.FSM.shiftVert(thing, thing.yvel += thing.FSM.unitsize / 8);
            thing.FSM.setBottom(thing.FSM.player, thing.top);
            // After a velocity threshold, start always falling
            if (thing.yvel >= (thing.fallThresholdStart || thing.FSM.unitsize * 2.8)) {
                thing.freefall = true;
                thing.movement = thing.FSM.movements.moveFreeFalling;
            }
        };
        /**
         * Movement Function for Platforms that have reached terminal velocity in
         * moveFalling and are now destined to die. The Platform will continue to
         * accelerate towards certain death until another velocity threshold,
         * and then switches to movePlatform to remain at that rate.
         *
         * @param thing   A Platform that should move.
         */
        Movements.prototype.moveFreeFalling = function (thing) {
            // Accelerate downwards, increasing the thing's y-velocity
            thing.yvel += thing.acceleration || thing.FSM.unitsize / 16;
            thing.FSM.shiftVert(thing, thing.yvel);
            // After a velocity threshold, stop accelerating
            if (thing.yvel >= (thing.fallThresholdEnd || thing.FSM.unitsize * 2.1)) {
                thing.movement = thing.FSM.movements.movePlatform;
            }
        };
        /**
         * Movement Function for Platforms that are a part of a scale.  Nothing
         * happens if a Platform isn't being rested and doesn't have a y-velocity.
         * Being rested upon means the y-velocity increases, and not being rested
         * means the y-velocity decreases: either moves the corresponding Platform
         * "partner" in the other vertical direction. When the Platform is too far
         * down (visually has no string left), they both fall.
         *
         * @param thing   A Platform that should move.
         */
        Movements.prototype.movePlatformScale = function (thing) {
            // If a Player is resting on this, fall hard
            if (thing.FSM.player.resting === thing) {
                thing.yvel += thing.FSM.unitsize / 16;
            }
            else if (thing.yvel > 0) {
                // If this still has velocity from a Player, stop or fall less
                if (!thing.partners) {
                    thing.yvel = 0;
                }
                else {
                    thing.yvel = Math.max(thing.yvel - thing.FSM.unitsize / 16, 0);
                }
            }
            else {
                // Not being rested upon or having a yvel means nothing happens
                return;
            }
            thing.tension += thing.yvel;
            thing.FSM.shiftVert(thing, thing.yvel);
            // The rest of the logic is for the platform's partner(s)
            if (!thing.partners) {
                return;
            }
            thing.partners.partnerPlatform.tension -= thing.yvel;
            // If the partner has fallen off, everybody falls!
            if (thing.partners.partnerPlatform.tension <= 0) {
                thing.FSM.scoring.scoreOn(1000, thing);
                thing.partners.partnerPlatform.yvel = thing.FSM.unitsize / 2;
                thing.collide = thing.partners.partnerPlatform.collide = (thing.FSM.collisions.collideCharacterSolid);
                thing.movement = thing.partners.partnerPlatform.movement = (thing.FSM.movements.moveFreeFalling);
            }
            // The partner has yvel equal and opposite to this platform's
            thing.FSM.shiftVert(thing.partners.partnerPlatform, -thing.yvel);
            // This platform's string grows with its yvel
            thing.FSM.setHeight(thing.partners.ownString, thing.partners.ownString.height + thing.yvel / thing.FSM.unitsize);
            // The partner's string shrinks while this platform's string grows
            thing.FSM.setHeight(thing.partners.partnerString, Math.max(thing.partners.partnerString.height - (thing.yvel / thing.FSM.unitsize), 0));
        };
        /**
         * Movement Function for Vines. They are constantly growing upward, until
         * some trigger (generally from animateEmergeVine) sets movement to
         * undefined. If there is an attached Thing, it is moved up at the same rate
         * as the Vine.
         *
         * @param thing   A Vine that should move.
         */
        Movements.prototype.moveVine = function (thing) {
            thing.FSM.increaseHeight(thing, thing.speed);
            thing.FSM.updateSize(thing);
            if (thing.attachedSolid) {
                thing.FSM.setBottom(thing, thing.attachedSolid.top);
            }
            if (thing.attachedCharacter) {
                thing.FSM.shiftVert(thing.attachedCharacter, -thing.speed);
            }
        };
        /**
         * Movement Function for Springboards that are "pushing up" during or after
         * being hit by a player. The Springboard changes its height based on its
         * tension. If a Player is still on it, then a Player is given extra
         * vertical velocity and taken off.
         *
         * @param thing   A Springboard that should move.
         */
        Movements.prototype.moveSpringboardUp = function (thing) {
            var player = thing.FSM.player;
            thing.FSM.reduceHeight(thing, -thing.tension, true);
            thing.tension *= 2;
            // If the spring height is past the normal, it's done moving
            if (thing.height > thing.heightNormal) {
                thing.FSM.reduceHeight(thing, (thing.height - thing.heightNormal) * thing.FSM.unitsize);
                if (thing === player.spring) {
                    player.yvel = thing.FSM.MathDecider.compute("springboardYvelUp", thing);
                    player.resting = player.spring = undefined;
                    player.movement = thing.FSM.movements.movePlayer;
                }
                thing.tension = 0;
                thing.movement = undefined;
            }
            else {
                thing.FSM.setBottom(player, thing.top);
            }
            if (thing === player.spring) {
                if (!thing.FSM.physics.isThingTouchingThing(player, thing)) {
                    player.spring = undefined;
                    player.movement = Movements.prototype.movePlayer;
                }
            }
        };
        /**
         * Movement Function for Shells. This actually does nothing for moving
         * Shells (since they only interact unusually on collision). For Shells with
         * no x-velocity, a counting variable is increased. Once it reaches 350, the
         * shell is "peeking" visually; when it reaches 490, the Shell spawns back
         * into its original spawner (typically Koopa or Beetle).
         *
         * @param thing   A Shell that should move.
         */
        Movements.prototype.moveShell = function (thing) {
            if (thing.xvel !== 0) {
                return;
            }
            thing.counting += 1;
            if (thing.counting === 350) {
                thing.peeking = 1;
                thing.height += thing.FSM.unitsize / 8;
                thing.FSM.addClass(thing, "peeking");
                thing.FSM.updateSize(thing);
            }
            else if (thing.counting === 455) {
                thing.peeking = 2;
            }
            else if (thing.counting === 490) {
                thing.spawnSettings = {
                    "smart": thing.smart
                };
                thing.FSM.deaths.killSpawn(thing);
            }
        };
        /**
         * Movement Function for Piranhas. These constantly change their height
         * except when they reach 0 or full height (alternating direction), at which
         * point they switch to movePiranhaLatent to wait to move in the opposite
         * direction.
         *
         * @param thing   A Piranha that should move.
         */
        Movements.prototype.movePiranha = function (thing) {
            var bottom = thing.bottom, height = thing.height + thing.direction, atEnd = false;
            if (thing.resting && !thing.FSM.physics.isThingAlive(thing.resting)) {
                bottom = thing.constructor.prototype.height * thing.FSM.unitsize + thing.top;
                height = Infinity;
                thing.resting = undefined;
            }
            if (height <= 0) {
                height = thing.height = 0;
                atEnd = true;
            }
            else if (height >= thing.constructor.prototype.height) {
                height = thing.height = thing.constructor.prototype.height;
                atEnd = true;
            }
            thing.FSM.setHeight(thing, height);
            thing.FSM.setBottom(thing, bottom);
            // Canvas height should be manually reset, as PixelRendr will otherwise
            // store the height as the initial small height from spawnPiranha...
            thing.canvas.height = height * thing.FSM.unitsize;
            thing.FSM.PixelDrawer.setThingSprite(thing);
            if (atEnd) {
                thing.counter = 0;
                thing.movement = thing.FSM.movements.movePiranhaLatent;
            }
        };
        /**
         * Movement Function for Piranhas that are not changing size. They wait
         * until a counter reaches a point (and then, if their height is 0, for the
         * player to go away) to switch back to movePiranha.
         *
         * @param thing   A Piranha that should move.
         */
        Movements.prototype.movePiranhaLatent = function (thing) {
            var playerX = thing.FSM.getMidX(thing.FSM.player);
            if (thing.counter >= thing.countermax
                && (thing.height > 0
                    || playerX < thing.left - thing.FSM.unitsize * 8
                    || playerX > thing.right + thing.FSM.unitsize * 8)) {
                thing.movement = undefined;
                thing.direction *= -1;
                thing.FSM.TimeHandler.addEvent(function () {
                    thing.movement = thing.FSM.movements.movePiranha;
                }, 7);
            }
            else {
                thing.counter += 1;
            }
        };
        /**
         * Movement Function for the Bubbles that come out of a player's mouth
         * underwater. They die when they reach a top threshold of unitsize * 16.
         *
         * @param thing   A Thing that should move.
         */
        Movements.prototype.moveBubble = function (thing) {
            if (thing.top < (thing.FSM.MapScreener.top + thing.FSM.unitsize * 16)) {
                thing.FSM.deaths.killNormal(thing);
            }
        };
        /**
         * Movement Function for typical CheepCheeps, which are underwater. They
         * move according to their native velocities except that they cannot travel
         * above the unitsize * 16 top threshold.
         *
         * @param thing   A CheepCheep that should move.
         */
        Movements.prototype.moveCheepCheep = function (thing) {
            if (thing.top < thing.FSM.unitsize * 16) {
                thing.FSM.setTop(thing, thing.FSM.unitsize * 16);
                thing.yvel *= -1;
            }
        };
        /**
         * Movement Function for flying CheepCheeps, like in bridge areas. They
         * lose a movement Function (and therefore just fall) at a unitsize * 28 top
         * threshold.
         *
         * @param thing   A CheepCheep that should move.
         */
        Movements.prototype.moveCheepCheepFlying = function (thing) {
            if (thing.top < thing.FSM.unitsize * 28) {
                thing.movement = undefined;
                thing.nofall = false;
            }
        };
        /**
         * Movement Function for Bloopers. These switch between "squeezing" (moving
         * down) and moving up ("unsqueezing"). They always try to unsqueeze if the
         * player is above them.
         *
         * @param thing   A Blooper that should move.
         */
        Movements.prototype.moveBlooper = function (thing) {
            // If a Player is dead, just drift aimlessly
            if (!thing.FSM.physics.isThingAlive(thing.FSM.player)) {
                thing.xvel = thing.FSM.unitsize / -4;
                thing.yvel = 0;
                thing.movement = undefined;
                return;
            }
            switch (thing.counter) {
                case 56:
                    thing.squeeze = 1;
                    thing.counter += 1;
                    break;
                case 63:
                    thing.FSM.movements.moveBlooperSqueezing(thing);
                    break;
                default:
                    thing.counter += 1;
                    if (thing.top < thing.FSM.unitsize * 18) {
                        thing.FSM.movements.moveBlooperSqueezing(thing);
                    }
                    break;
            }
            if (thing.squeeze) {
                thing.yvel = Math.max(thing.yvel + .021, .7); // going down
            }
            else {
                thing.yvel = Math.min(thing.yvel - .035, -.7); // going up
            }
            if (thing.top > thing.FSM.unitsize * 16) {
                thing.FSM.shiftVert(thing, thing.yvel, true);
            }
            if (!thing.squeeze) {
                if (thing.FSM.player.left > thing.right + thing.FSM.unitsize * 8) {
                    // Go to the right
                    thing.xvel = Math.min(thing.speed, thing.xvel + thing.FSM.unitsize / 32);
                }
                else if (thing.FSM.player.right < thing.left - thing.FSM.unitsize * 8) {
                    // Go to the left
                    thing.xvel = Math.max(-thing.speed, thing.xvel - thing.FSM.unitsize / 32);
                }
            }
        };
        /**
         * Additional movement Function for Bloopers that are "squeezing". Squeezing
         * Bloopers travel downard at a gradual pace until they reach either the
         * player's bottom or a threshold of unitsize * 90.
         *
         * @param thing   A Blooper that should move.
         */
        Movements.prototype.moveBlooperSqueezing = function (thing) {
            if (thing.squeeze !== 2) {
                thing.squeeze = 2;
                thing.FSM.addClass(thing, "squeeze");
                thing.FSM.setHeight(thing, 10, true, true);
            }
            if (thing.squeeze < 7) {
                thing.xvel /= 1.4;
            }
            else if (thing.squeeze === 7) {
                thing.xvel = 0;
            }
            thing.squeeze += 1;
            if (thing.top > thing.FSM.player.bottom || thing.bottom > thing.FSM.unitsize * 91) {
                thing.FSM.animations.animateBlooperUnsqueezing(thing);
            }
        };
        /**
         * Movement Function for Podoboos that is only used when they are falling.
         * Podoboo animations trigger this when they reach a certain height, and
         * use this to determine when they should stop accelerating downward, which
         * is their starting location.
         *
         * @param thing   A Podoboo that should move.
         */
        Movements.prototype.movePodobooFalling = function (thing) {
            if (thing.top >= thing.starty) {
                thing.yvel = 0;
                thing.movement = undefined;
                thing.FSM.unflipVert(thing);
                thing.FSM.setTop(thing, thing.starty);
                return;
            }
            if (thing.yvel >= thing.speed) {
                thing.yvel = thing.speed;
                return;
            }
            if (!thing.flipVert && thing.yvel > 0) {
                thing.FSM.flipVert(thing);
            }
            thing.yvel += thing.gravity;
        };
        /**
         * Movement Function for Lakitus that have finished their moveLakituInitial
         * run. This is similar to movePacing in that it makes the Lakitu pace to
         * left and right of a Player, and moves with a Player rather than the
         * scrolling window.
         *
         * @param thing   A Lakitu that should move.
         */
        Movements.prototype.moveLakitu = function (thing) {
            var player = thing.FSM.player;
            // If a Player is moving quickly to the right, move in front and stay there
            if (player.xvel > thing.FSM.unitsize / 8
                && player.left > thing.FSM.MapScreener.width / 2) {
                if (thing.left < player.right + thing.FSM.unitsize * 16) {
                    // slide to xloc
                    thing.FSM.slideToX(thing, player.right + player.xvel + thing.FSM.unitsize * 32, player.maxspeed * 1.4);
                    thing.counter = 0;
                }
            }
            else {
                thing.counter += .007;
                thing.FSM.slideToX(thing, player.left + player.xvel + Math.sin(Math.PI * thing.counter) * 117, player.maxspeed * .7);
            }
        };
        /**
         * Initial entry movement Function for Lakitus. They enter by sliding across
         * the top of the screen until they reach a Player, and then switch to
         * their standard moveLakitu movement.
         *
         * @param thing   A Lakitu that should move.
         */
        Movements.prototype.moveLakituInitial = function (thing) {
            if (thing.right < thing.FSM.player.left) {
                thing.counter = 0;
                thing.movement = thing.FSM.movements.moveLakitu;
                thing.movement(thing);
                return;
            }
            thing.FSM.shiftHoriz(thing, -thing.FSM.unitsize);
        };
        /**
         * Alternate movement Function for Lakitus. This is used when a Player
         * reaches the ending flagpole in a level and the Lakitu just flies to the
         * left.
         *
         * @param thing   A Lakitu that should move.
         */
        Movements.prototype.moveLakituFleeing = function (thing) {
            thing.FSM.shiftHoriz(thing, -thing.FSM.unitsize);
        };
        /**
         * Movement Function for Coins that have been animated. They move based on
         * their yvel, and if they have a parent, die when they go below the parent.
         *
         * @param thing   A Coin that should move up.
         * @param parent   A parent Solid spawning thing.
         */
        Movements.prototype.moveCoinEmerge = function (thing, parent) {
            thing.FSM.shiftVert(thing, thing.yvel);
            if (parent && thing.bottom >= thing.blockparent.bottom) {
                thing.FSM.deaths.killNormal(thing);
            }
        };
        /**
         * Movement Function for a Player. It reacts to almost all actions that
         * to be done, but is horribly written so that is all the documentation you
         * get here. Sorry! Sections are labeled on the inside.
         *
         * @param thing   A player that should move.
         */
        Movements.prototype.movePlayer = function (thing) {
            // Not jumping
            if (!thing.keys.up) {
                thing.keys.jump = false;
            }
            else if (
            // Jumping
            thing.keys.jump
                && (thing.yvel <= 0 || thing.FSM.MapScreener.underwater)) {
                if (thing.FSM.MapScreener.underwater) {
                    thing.FSM.animations.animatePlayerPaddling(thing);
                    thing.FSM.removeClass(thing, "running");
                }
                if (thing.resting) {
                    if (thing.resting.xvel) {
                        thing.xvel += thing.resting.xvel;
                    }
                    thing.resting = undefined;
                }
                else {
                    // Jumping, not resting
                    if (!thing.jumping && !thing.FSM.MapScreener.underwater) {
                        thing.FSM.switchClass(thing, "running skidding", "jumping");
                    }
                    thing.jumping = true;
                    if (thing.power > 1 && thing.crouching) {
                        thing.FSM.removeClass(thing, "jumping");
                    }
                }
                if (!thing.FSM.MapScreener.underwater) {
                    thing.keys.jumplev += 1;
                    thing.FSM.MathDecider.compute("decreasePlayerJumpingYvel", thing);
                }
            }
            // Crouching
            if (thing.keys.crouch && !thing.crouching && thing.resting) {
                if (thing.power > 1) {
                    thing.crouching = true;
                    thing.FSM.removeClass(thing, "running");
                    thing.FSM.addClass(thing, "crouching");
                    thing.FSM.setHeight(thing, 11, true, true);
                    thing.height = 11;
                    thing.tolyOld = thing.toly;
                    thing.toly = thing.FSM.unitsize * 4;
                    thing.FSM.updateBottom(thing, 0);
                    thing.FSM.updateSize(thing);
                }
                // Pipe movement
                if (thing.resting.actionTop) {
                    thing.FSM.ModAttacher.fireEvent("onPlayerActionTop", thing, thing.resting);
                    thing.resting.actionTop(thing, thing.resting);
                }
            }
            // Running
            if (thing.FSM.MathDecider.compute("decreasePlayerRunningXvel", thing)) {
                if (thing.skidding) {
                    thing.FSM.addClass(thing, "skidding");
                }
                else {
                    thing.FSM.removeClass(thing, "skidding");
                }
            }
            // Movement mods
            // Slowing down
            if (Math.abs(thing.xvel) < .14) {
                if (thing.running) {
                    thing.running = false;
                    if (thing.power === 1) {
                        thing.FSM.setPlayerSizeSmall(thing);
                    }
                    thing.FSM.removeClasses(thing, "running skidding one two three");
                    thing.FSM.addClass(thing, "still");
                    thing.FSM.TimeHandler.cancelClassCycle(thing, "running");
                }
            }
            else if (!thing.running) {
                // Not moving slowly
                thing.running = true;
                thing.FSM.animations.animatePlayerRunningCycle(thing);
                if (thing.power === 1) {
                    thing.FSM.setPlayerSizeSmall(thing);
                }
            }
            if (thing.xvel > 0) {
                thing.xvel = Math.min(thing.xvel, thing.maxspeed);
                if (thing.moveleft && (thing.resting || thing.FSM.MapScreener.underwater)) {
                    thing.FSM.unflipHoriz(thing);
                    thing.moveleft = false;
                }
            }
            else if (thing.xvel < 0) {
                thing.xvel = Math.max(thing.xvel, thing.maxspeed * -1);
                if (!thing.moveleft && (thing.resting || thing.FSM.MapScreener.underwater)) {
                    thing.moveleft = true;
                    thing.FSM.flipHoriz(thing);
                }
            }
            // Resting stops a bunch of other stuff
            if (thing.resting) {
                // Hopping
                if (thing.hopping) {
                    thing.hopping = false;
                    thing.FSM.removeClass(thing, "hopping");
                    if (thing.xvel) {
                        thing.FSM.addClass(thing, "running");
                    }
                }
                // Jumping
                thing.keys.jumplev = thing.yvel = thing.jumpcount = 0;
                if (thing.jumping) {
                    thing.jumping = false;
                    thing.FSM.removeClass(thing, "jumping");
                    if (thing.power === 1) {
                        thing.FSM.setPlayerSizeSmall(thing);
                    }
                    thing.FSM.addClass(thing, Math.abs(thing.xvel) < .14 ? "still" : "running");
                }
                // Paddling
                if (thing.paddling) {
                    thing.paddling = thing.swimming = false;
                    thing.FSM.TimeHandler.cancelClassCycle(thing, "paddling");
                    thing.FSM.removeClasses(thing, "paddling swim1 swim2");
                    thing.FSM.addClass(thing, "running");
                }
            }
        };
        /**
         * Alternate movement Function for players attached to a Vine. They may
         * climb up or down the Vine, or jump off.
         *
         * @param thing   A Player that should move.
         */
        Movements.prototype.movePlayerVine = function (thing) {
            var attachedSolid = thing.attachedSolid, animatedClimbing;
            if (!attachedSolid) {
                thing.movement = thing.FSM.movements.movePlayer;
                return;
            }
            if (thing.bottom < thing.attachedSolid.top) {
                thing.FSM.unattachPlayer(thing, thing.attachedSolid);
                return;
            }
            // Running away from the vine means dropping off
            if (thing.keys.run !== 0 && thing.keys.run === thing.attachedDirection) {
                // Leaving to the left
                if (thing.attachedDirection === -1) {
                    thing.FSM.setRight(thing, attachedSolid.left - thing.FSM.unitsize);
                }
                else if (thing.attachedDirection === 1) {
                    // Leaving to the right
                    thing.FSM.setLeft(thing, attachedSolid.right + thing.FSM.unitsize);
                }
                thing.FSM.unattachPlayer(thing, attachedSolid);
                return;
            }
            // If a Player is moving up, simply move up
            if (thing.keys.up) {
                animatedClimbing = true;
                thing.FSM.shiftVert(thing, thing.FSM.unitsize / -4);
            }
            else if (thing.keys.crouch) {
                // If the thing is moving down, move down and check for unattachment
                animatedClimbing = true;
                thing.FSM.shiftVert(thing, thing.FSM.unitsize / 2);
                if (thing.top > attachedSolid.bottom) {
                    thing.FSM.unattachPlayer(thing, thing.attachedSolid);
                }
                return;
            }
            else {
                animatedClimbing = false;
            }
            if (animatedClimbing && !thing.animatedClimbing) {
                thing.FSM.addClass(thing, "animated");
            }
            else if (!animatedClimbing && thing.animatedClimbing) {
                thing.FSM.removeClass(thing, "animated");
            }
            thing.animatedClimbing = animatedClimbing;
            if (thing.bottom < thing.FSM.MapScreener.top - thing.FSM.unitsize * 4) {
                thing.FSM.setLocation(thing.attachedSolid.transport);
            }
        };
        /**
         * Movement Function for players pressing down onto a Springboard. This does
         * basically nothing except check for when a Player is off the spring or
         * the spring is fully contracted. The former restores a Player's movement
         * and the latter clears it (to be restored in moveSpringboardUp).
         *
         * @param thing   A Player that should move.
         */
        Movements.prototype.movePlayerSpringboardDown = function (thing) {
            var other = thing.spring;
            // If a Player has moved off the spring, get outta here
            if (!thing.FSM.physics.isThingTouchingThing(thing, other)) {
                thing.movement = thing.FSM.movements.movePlayer;
                other.movement = thing.FSM.movements.moveSpringboardUp;
                thing.spring = undefined;
                return;
            }
            // If the spring is fully contracted, go back up
            if (other.height < thing.FSM.unitsize * 2.5
                || other.tension < thing.FSM.unitsize / 32) {
                thing.movement = undefined;
                other.movement = thing.FSM.movements.moveSpringboardUp;
                return;
            }
            // Make sure it's hard to slide off
            if (thing.left < other.left + thing.FSM.unitsize * 2
                || thing.right > other.right - thing.FSM.unitsize * 2) {
                thing.xvel /= 1.4;
            }
            thing.FSM.reduceHeight(other, other.tension, true);
            other.tension /= 2;
            thing.FSM.setBottom(thing, other.top);
            thing.FSM.updateSize(other);
        };
        return Movements;
    })();
    FullScreenMario.Movements = Movements;
})(FullScreenMario || (FullScreenMario = {}));
