// @ifdef INCLUDE_DEFINITIONS
/// <reference path="FullScreenMario.d.ts" />
// @endif
var FullScreenMario;
(function (FullScreenMario) {
    "use strict";
    /**
     * Storage for physics Functions in FullScreenMario.
     */
    var Physics = (function () {
        function Physics() {
        }
        /**
         * Function generator for the generic canThingCollide checker. This is used
         * repeatedly by ThingHittr to generate separately optimized Functions for
         * different Thing types.
         *
         * @returns A Function that generates a canThingCollide checker.
         */
        Physics.prototype.generateCanThingCollide = function () {
            /**
             * Generic checker for canCollide, used for both Solids and Characters.
             * This just returns if the Thing is alive and doesn't have the
             * nocollide flag.
             *
             * @param thing
             * @returns Whether the thing can collide.
             */
            return function canThingCollide(thing) {
                return thing.alive && !thing.nocollide;
            };
        };
        /**
         * @param thing
         * @returns Whether the Thing is alive, meaning it has a true alive flag
         *          and a false dead flag.
         */
        Physics.prototype.isThingAlive = function (thing) {
            return thing && thing.alive && !thing.dead;
        };
        /**
         * Generic base function to check if one Thing is touching another. This
         * will be called by the more specific Thing touching functions.
         *
         * @param thing
         * @param other
         * @returns Whether the two Things are touching.
         * @remarks The horizontal checks use allow a unitsize of flexibility.
         */
        Physics.prototype.isThingTouchingThing = function (thing, other) {
            return (!thing.nocollide && !other.nocollide
                && thing.right - thing.FSM.unitsize > other.left
                && thing.left + thing.FSM.unitsize < other.right
                && thing.bottom >= other.top
                && thing.top <= other.bottom);
        };
        /**
         * General top collision detection Function for two Things to determine if
         * one Thing is on top of another. This takes into consideration factors
         * such as which are solid or an enemy, and y-velocity.
         *
         * @param thing
         * @param other
         * @returns Whether thing is on top of other.
         * @remarks This is a more specific form of isThingTouchingThing.
         */
        Physics.prototype.isThingOnThing = function (thing, other) {
            // If thing is a solid and other is falling, thing can't be above other
            if (thing.groupType === "Solid" && other.yvel > 0) {
                return false;
            }
            // If other is falling faster than thing, and isn't a solid,
            // thing can't be on top (if anything, the opposite is true)
            if (thing.yvel < other.yvel && other.groupType !== "Solid") {
                return false;
            }
            // If thing is a Player, and it's on top of an enemy, that's true
            if (thing.player && thing.bottom < other.bottom && other.enemy) {
                return true;
            }
            // If thing is too far to the right, it can't be touching other
            if (thing.left + thing.FSM.unitsize >= other.right) {
                return false;
            }
            // If thing is too far to the left, it can't be touching other
            if (thing.right - thing.FSM.unitsize <= other.left) {
                return false;
            }
            // If thing's bottom is below other's top, factoring tolerance and
            // other's vertical velocity, they're touching
            if (thing.bottom <= other.top + other.toly + other.yvel) {
                return true;
            }
            // Same as before, but with velocity as the absolute difference
            // between their two velocities
            if (thing.bottom <= other.top + other.toly + Math.abs(thing.yvel - other.yvel)) {
                return true;
            }
            // None of the above checks passed for true, so this is false (thing's
            // bottom is above other's top)
            return false;
        };
        /**
         * Top collision Function to determine if a Thing is on top of a Solid.
         *
         * @param thing
         * @param other
         * @returns Whether thing is on top of other.
         * @remarks Similar to isThingOnThing, but more specifically used for
         *          isCharacterOnSolid and isCharacterOnResting
         */
        Physics.prototype.isThingOnSolid = function (thing, other) {
            // If thing is too far to the right, they're not touching
            if (thing.left + thing.FSM.unitsize >= other.right) {
                return false;
            }
            // If thing is too far to the left, they're not touching
            if (thing.right - thing.FSM.unitsize <= other.left) {
                return false;
            }
            // If thing's bottom is below other's top, factoring thing's velocity
            // and other's tolerance, they're touching
            if (thing.bottom - thing.yvel <= other.top + other.toly + thing.yvel) {
                return true;
            }
            // Same as before, but with velocity as the absolute difference between
            // their two velocities
            if (thing.bottom <= other.top + other.toly + Math.abs(thing.yvel - other.yvel)) {
                return true;
            }
            // None of the above checks passed for true, so this is false (thing's
            // bottom is above other's top
            return false;
        };
        /**
         * Top collision Function to determine if a character is on top of a solid.
         * This is always true for resting (since resting checks happen before when
         * this should be called).
         *
         * @param thing
         * @param other
         * @returns Whether thing is on top of other.
         */
        Physics.prototype.isCharacterOnSolid = function (thing, other) {
            // If character is resting on solid, this is automatically true
            if (thing.resting === other) {
                return true;
            }
            // If the character is jumping upwards, it's not on a solid
            // (removing this check would cause Mario to have "sticky" behavior when
            // jumping at the corners of solids)
            if (thing.yvel < 0) {
                return false;
            }
            // The character and solid must be touching appropriately
            if (!thing.FSM.physics.isThingOnSolid(thing, other)) {
                return false;
            }
            // Corner case: when character is exactly falling off the right (false)
            if (thing.left + thing.xvel + thing.FSM.unitsize === other.right) {
                return false;
            }
            // Corner case: when character is exactly falling off the left (false)
            if (thing.right - thing.xvel - thing.FSM.unitsize === other.left) {
                return false;
            }
            // None of the above checks caught a falsity, so this must be true
            return true;
        };
        /**
         * Top collision Function to determine if a character should be considered
         * resting on a solid. This mostly uses isThingOnSolid, but also checks for
         * the corner cases of the character being exactly at the edge of the solid
         * (such as when jumping while next to it).
         *
         * @param thing
         * @param other
         * @returns Whether thing is on top of other.
         */
        Physics.prototype.isCharacterOnResting = function (thing, other) {
            if (!thing.FSM.physics.isThingOnSolid(thing, other)) {
                return false;
            }
            // Corner case: when character is exactly falling off the right (false)
            if (thing.left + thing.xvel + thing.FSM.unitsize === other.right) {
                return false;
            }
            // Corner case: when character is exactly falling off the left (false)
            if (thing.right - thing.xvel - thing.FSM.unitsize === other.left) {
                return false;
            }
            // None of the above checks caught a falsity, so this must be true
            return true;
        };
        /**
         * Function generator for the generic isCharacterTouchingCharacter checker.
         * This is used repeatedly by ThingHittr to generate separately optimized
         * Functions for different Thing types.
         *
         * @returns A Function that generates isCharacterTouchingCharacter.
         */
        Physics.prototype.generateIsCharacterTouchingCharacter = function () {
            /**
             * Generic checker for whether two characters are touching each other.
             * This mostly checks to see if either has the nocollidechar flag, and
             * if the other is a player. isThingTouchingThing is used after.
             *
             * @param thing
             * @param other
             * @returns Whether thing is touching other.
             */
            return function isCharacterTouchingCharacter(thing, other) {
                if (thing.nocollidechar && (!other.player || thing.nocollideplayer)) {
                    return false;
                }
                if (other.nocollidechar && (!thing.player || other.nocollideplayer)) {
                    return false;
                }
                return thing.FSM.physics.isThingTouchingThing(thing, other);
            };
        };
        /**
         * Function generator for the generic isCharacterTouchingSolid checker. This
         * is used repeatedly by ThingHittr to generate separately optimized
         * Functions for different Thing types.
         *
         * @returns A Function that generates isCharacterTouchingSolid.
         */
        Physics.prototype.generateIsCharacterTouchingSolid = function () {
            /**
             * Generic checker for whether a character is touching a solid. The
             * hidden, collideHidden, and nocollidesolid flags are most relevant.
             *
             * @param thing
             * @param other
             * @returns Whether thing is touching other.
             */
            return function isCharacterTouchingSolid(thing, other) {
                // Hidden solids can only be touched by a Player bottom-bumping
                // them, or by specifying collideHidden
                if (other.hidden && !other.collideHidden) {
                    if (!thing.player || !thing.FSM.physics.isSolidOnCharacter(other, thing)) {
                        return false;
                    }
                }
                if (thing.nocollidesolid && !(thing.allowUpSolids && other.up)) {
                    return false;
                }
                return thing.FSM.physics.isThingTouchingThing(thing, other);
            };
        };
        /**
         * @param thing
         * @param other
         * @returns Whether thing's bottom is above other's top, allowing for
         *          other's toly.
         */
        Physics.prototype.isCharacterAboveEnemy = function (thing, other) {
            return thing.bottom < other.top + other.toly;
        };
        /**
         * @param thing
         * @param other
         * @returns Whether thing's top is above other's bottom, allowing for
         *          the Thing's toly and yvel.
         */
        Physics.prototype.isCharacterBumpingSolid = function (thing, other) {
            return thing.top + thing.toly + Math.abs(thing.yvel) > other.bottom;
        };
        /**
         * @param thing
         * @param other
         * @returns Whether thing is "overlapping" other.
         */
        Physics.prototype.isCharacterOverlappingSolid = function (thing, other) {
            return thing.top <= other.top && thing.bottom > other.bottom;
        };
        /**
         * @param thing
         * @param other
         * @returns Whether thing, typically a solid, is on top of other.
         * @remarks This is similar to isThingOnThing, but more specifically
         *          used for characterTouchedSolid.
         */
        Physics.prototype.isSolidOnCharacter = function (thing, other) {
            // This can never be true if other is falling
            if (other.yvel >= 0) {
                return false;
            }
            // Horizontally, all that's required is for the other's midpoint to
            // be within the thing's left and right
            var midx = thing.FSM.getMidX(other);
            if (midx <= thing.left || midx >= thing.right) {
                return false;
            }
            // If the thing's bottom is below the other's top, factoring
            // tolerance and velocity, that's false (this function assumes they're
            // already touching)
            if (thing.bottom - thing.yvel > other.top + other.toly - other.yvel) {
                return false;
            }
            // The above checks never caught falsities, so this must be true
            return true;
        };
        /**
         * Function generator for the generic hitCharacterSolid callback. This is
         * used repeatedly by ThingHittr to generate separately optimized Functions
         * for different Thing types.
         *
         * @returns A Function that generates hitCharacterSolid.
         */
        Physics.prototype.generateHitCharacterSolid = function () {
            /**
             * Generic callback for when a character touches a solid. Solids that are
             * "up" kill anything that didn't cause the up, but otherwise this will
             * normally involve the solid's collide callback being called and
             * under/undermid checks activating.
             *
             * @param thing
             * @param other
             * @returns Whether thing is hitting other.
             */
            return function hitCharacterSolid(thing, other) {
                // "Up" solids are special (they kill things that aren't their .up)
                if (other.up && thing !== other.up) {
                    return thing.FSM.collisions.collideCharacterSolidUp(thing, other);
                }
                other.collide(thing, other);
                // If a character is bumping into the bottom, call that
                if (thing.undermid) {
                    if (thing.undermid.bottomBump) {
                        thing.undermid.bottomBump(thing.undermid, thing);
                    }
                }
                else if (thing.under && thing.under && thing.under.bottomBump) {
                    thing.under.bottomBump(thing.under[0], thing);
                }
                // If the character is overlapping the solid, call that too
                if (thing.checkOverlaps
                    && thing.FSM.physics.isCharacterOverlappingSolid(thing, other)) {
                    thing.FSM.markOverlap(thing, other);
                }
            };
        };
        /**
         * Function generator for the generic hitCharacterCharacter callback. This
         * is used repeatedly by ThingHittr to generate separately optimized
         * Functions for different Thing types.
         *
         * @returns A Function that generates hitCharacterCharacter.
         */
        Physics.prototype.generateHitCharacterCharacter = function () {
            /**
             * Generic callback for when a character touches another character. The
             * first Thing's collide callback is called unless it's a player, in
             * which the other Thing's is.
             *
             * @param thing
             * @param other
             * @returns Whether thing is hitting other.
             */
            return function hitCharacterCharacter(thing, other) {
                // a Player calls the other's collide function, such as playerStar
                if (thing.player) {
                    if (other.collide) {
                        return other.collide(thing, other);
                    }
                }
                else if (thing.collide) {
                    // Otherwise just use thing's collide function
                    thing.collide(other, thing);
                }
            };
        };
        /**
         * Sets the overlapping properties of a Thing when it is first detected as
         * overlapping in maintainOverlaps. All Solids in its overlaps Array are
         * checked to find the leftmost and rightmost extremes and midpoint.
         * Then, the Thing is checked for being to the left or right of the
         * midpoint, and the goal set to move it away from the midpoint.
         *
         * @param thing
         * @returns Whether the Thing's overlaps were successfully recorded.
         */
        Physics.prototype.setOverlapBoundaries = function (thing) {
            // Only having one overlap means nothing should be done
            if (thing.overlaps.length === 1) {
                thing.overlaps.length = 0;
                return false;
            }
            var rightX = -Infinity, leftX = Infinity, overlaps = thing.overlaps, other, leftThing, rightThing, midpoint, i;
            for (i = 0; i < overlaps.length; i += 1) {
                other = overlaps[i];
                if (other.right > rightX) {
                    rightThing = other;
                }
                if (other.left < leftX) {
                    leftThing = other;
                }
            }
            midpoint = (leftX + rightX) / 2;
            if (thing.FSM.getMidX(thing) >= midpoint) {
                thing.overlapGoal = Infinity;
                thing.overlapGoRight = true;
                thing.overlapCheck = rightThing.right;
            }
            else {
                thing.overlapGoal = -Infinity;
                thing.overlapGoRight = false;
                thing.overlapCheck = leftThing.left;
            }
            thing.checkOverlaps = false;
            return true;
        };
        return Physics;
    })();
    FullScreenMario.Physics = Physics;
})(FullScreenMario || (FullScreenMario = {}));
