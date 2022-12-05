// @echo '/// <reference path="GameStartr-0.2.0.ts" />'
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/GameStartr-0.2.0.ts" />
/// <reference path="FullScreenMario.d.ts" />
/// <reference path="Animations.ts" />
/// <reference path="Collisions.ts" />
/// <reference path="Cutscenes.ts" />
/// <reference path="Deaths.ts" />
/// <reference path="Inputs.ts" />
/// <reference path="Macros.ts" />
/// <reference path="Maintenance.ts" />
/// <reference path="Movements.ts" />
/// <reference path="Physics.ts" />
/// <reference path="Scoring.ts" />
/// <reference path="Spawns.ts" />
/// <reference path="Transports.ts" />
// @endif
// @include ../Source/FullScreenMario.d.ts
// @include ../Source/Animations.ts
// @include ../Source/Collisions.ts
// @include ../Source/Cutscenes.ts
// @include ../Source/Deaths.ts
// @include ../Source/Inputs.ts
// @include ../Source/Macros.ts
// @include ../Source/Maintenance.ts
// @include ../Source/Movements.ts
// @include ../Source/Physics.ts
// @include ../Source/Spawns.ts
// @include ../Source/Scoring.ts
// @include ../Source/Transports.ts
var FullScreenMario;
(function (FullScreenMario_1) {
    "use strict";
    /**
     * A free HTML5 remake of Nintendo's original Super Mario Bros, expanded for the
     * modern web. It includes the original 32 levels, a random map generator, a
     * level editor, and over a dozen custom mods.
     */
    var FullScreenMario = (function (_super) {
        __extends(FullScreenMario, _super);
        /**
         * Initializes a new instance of the FullScreenMario class using the static
         * settings stored in `FullScreenMario.setting`.
         *
         * @param settings   Extra settings such as screen size.
         */
        function FullScreenMario(settings) {
            _super.call(this, FullScreenMario.settings, GameStartr.GameStartr.prototype.proliferate({
                constantsSource: FullScreenMario,
                constants: ["unitsize", "scale", "gravity", "pointLevels", "customTextMappings"]
            }, settings));
            /**
             * Storage for animation Functions.
             */
            this.animations = new FullScreenMario_1.Animations();
            /**
             * Storage for collision Functions.
             */
            this.collisions = new FullScreenMario_1.Collisions();
            /**
             * Storage for cutscene Functions.
             */
            this.cutscenes = new FullScreenMario_1.Cutscenes();
            /**
             * Storage for death Functions.
             */
            this.deaths = new FullScreenMario_1.Deaths(this);
            /**
             * Storage for input Functions.
             */
            this.inputs = new FullScreenMario_1.Inputs();
            /**
             * Storage for macro Functions.
             */
            this.macros = new FullScreenMario_1.Macros();
            /**
             * Storage for maintenance Functions.
             */
            this.maintenance = new FullScreenMario_1.Maintenance();
            /**
             * Storage for movement Functions.
             */
            this.movements = new FullScreenMario_1.Movements();
            /**
             * Storage for physics Functions.
             */
            this.physics = new FullScreenMario_1.Physics();
            /**
             * Storage for scoring Functions.
             */
            this.scoring = new FullScreenMario_1.Scoring(this);
            /**
             * Storage for spawns Functions.
             */
            this.spawns = new FullScreenMario_1.Spawns();
            /**
             * Storage for transport Functions.
             */
            this.transports = new FullScreenMario_1.Transports();
            /**
             * Container for device motion information, used by this.deviceMotion.
             */
            this.deviceMotionStatus = {
                motionLeft: false,
                motionRight: false,
                x: undefined,
                y: undefined,
                dy: undefined
            };
        }
        /* Resets
        */
        /**
         * Sets this.ObjectMaker.
         *
         * Because many Thing functions require access to other FSM modules, each is
         * given a reference to this container FSM via properties.thing.GameStarter.
         *
         * @param FSM
         * @param customs   Any optional custom settings.
         */
        FullScreenMario.prototype.resetObjectMaker = function (FSM, settings) {
            FSM.ObjectMaker = new ObjectMakr.ObjectMakr(FSM.proliferate({
                properties: {
                    Quadrant: {
                        EightBitter: FSM,
                        GameStarter: FSM,
                        FSM: FSM
                    },
                    Thing: {
                        EightBitter: FSM,
                        GameStarter: FSM,
                        FSM: FSM
                    }
                }
            }, FSM.settings.objects));
        };
        /**
         * Sets this.AudioPlayer.
         *
         * @param FSM
         * @param customs   Any optional custom settings.
         */
        FullScreenMario.prototype.resetAudioPlayer = function (FSM, settings) {
            _super.prototype.resetAudioPlayer.call(this, FSM, settings);
            FSM.AudioPlayer.setGetVolumeLocal(FSM.getVolumeLocal.bind(FSM, FSM));
            FSM.AudioPlayer.setGetThemeDefault(FSM.getAudioThemeDefault.bind(FSM, FSM));
        };
        /**
         * Sets this.AreaSpawner.
         *
         * @param FSM
         * @param customs   Any optional custom settings.
         */
        FullScreenMario.prototype.resetAreaSpawner = function (FSM, settings) {
            FSM.AreaSpawner = new AreaSpawnr.AreaSpawnr({
                "MapsCreator": FSM.MapsCreator,
                "MapScreener": FSM.MapScreener,
                "screenAttributes": FSM.settings.maps.screenAttributes,
                "onSpawn": FSM.settings.maps.onSpawn.bind(FSM),
                "stretchAdd": FSM.mapAddStretched.bind(FSM),
                "afterAdd": FSM.mapAddAfter.bind(FSM)
            });
        };
        /**
         * Resets this.ItemsHolder via the parent GameStartr resetItemsHolder.
         *
         * If the screen isn't wide enough to fit the "lives" display, it's hidden.
         *
         * @param FSM
         * @param customs   Any optional custom settings.
         */
        FullScreenMario.prototype.resetItemsHolder = function (FSM, settings) {
            _super.prototype.resetItemsHolder.call(this, FSM, settings);
            if (settings.width < 560) {
                FSM.ItemsHolder.getContainer().children[0].cells[4].style.display = "none";
            }
        };
        /**
         * Sets this.MathDecider, using its existing MapScreenr as its constants.
         *
         * @param FSM
         * @param customs   Any optional custom settings.
         */
        FullScreenMario.prototype.resetMathDecider = function (FSM, customs) {
            FSM.MathDecider = new MathDecidr.MathDecidr(FSM.proliferate({
                "constants": FSM.MapScreener
            }, FSM.settings.math));
        };
        /**
         * Sets this.container via the parent GameStartr resetContaienr.
         *
         * The container is given the "Press Start" font, the PixelRender is told
         * to draw the scenery, solid, character, and text groups, and the container
         * width is set to the custom's width.
         *
         * @param FSM
         * @param customs   Any optional custom settings.
         */
        FullScreenMario.prototype.resetContainer = function (FSM, settings) {
            _super.prototype.resetContainer.call(this, FSM, settings);
            FSM.container.style.fontFamily = "Press Start";
            FSM.container.className += " FullScreenMario";
            FSM.PixelDrawer.setThingArrays([
                FSM.GroupHolder.getGroup("Scenery"),
                FSM.GroupHolder.getGroup("Solid"),
                FSM.GroupHolder.getGroup("Character"),
                FSM.GroupHolder.getGroup("Text")
            ]);
            FSM.ItemsHolder.getContainer().style.width = settings.width + "px";
            FSM.container.appendChild(FSM.ItemsHolder.getContainer());
        };
        /* Global manipulations
        */
        /**
         * Completely restarts the game. Lives are reset to 3, the map goes back
         * to default, and the onGameStart mod trigger is fired.
         */
        FullScreenMario.prototype.gameStart = function () {
            this.setMap(this.settings.maps.mapDefault, this.settings.maps.locationDefault);
            this.ItemsHolder.setItem("lives", this.settings.items.values.lives.valueDefault);
            this.ModAttacher.fireEvent("onGameStart");
        };
        /**
         * Completely ends the game. All Thing groups are clared, sounds are
         * stopped, the screen goes to black, "GAME OVER" is displayed. After a
         * while, the game restarts again via gameStart.
         */
        FullScreenMario.prototype.gameOver = function () {
            var _this = this;
            var text = this.ObjectMaker.make("CustomText", {
                "texts": [{
                        "text": "GAME OVER"
                    }]
            }), texts, textWidth, i;
            this.deaths.killNPCs();
            this.AudioPlayer.clearAll();
            this.AudioPlayer.play("Game Over");
            this.GroupHolder.clearArrays();
            this.ItemsHolder.hideContainer();
            this.TimeHandler.cancelAllEvents();
            this.PixelDrawer.setBackground("black");
            this.addThing(text, this.MapScreener.width / 2, this.MapScreener.height / 2);
            texts = text.children;
            textWidth = -(texts[texts.length - 1].right - texts[0].left) / 2;
            for (i = 0; i < texts.length; i += 1) {
                this.shiftHoriz(texts[i], textWidth);
            }
            this.TimeHandler.addEvent(function () {
                _this.gameStart();
                _this.ItemsHolder.displayContainer();
            }, 420);
            this.ModAttacher.fireEvent("onGameOver");
        };
        /**
         * Slight addition to the GameStartr thingProcess Function. The Thing's hit
         * check type is cached immediately.
         *
         * @param thing   The Thing being processed.
         * @param title   What type Thing this is (the name of the class).
         * @param settings   Additional settings to be given to the Thing.
         * @param defaults   The default settings for the Thing's class.
         * @remarks This is generally called as the onMake call in an ObjectMakr.
         */
        FullScreenMario.prototype.thingProcess = function (thing, title, settings, defaults) {
            // Infinite height refers to objects that reach exactly to the bottom
            if (thing.height === "Infinity" || thing.height === Infinity) {
                thing.height = thing.FSM.getAbsoluteHeight(thing.y) / thing.FSM.unitsize;
            }
            _super.prototype.thingProcess.call(this, thing, title, settings, defaults);
            thing.FSM.ThingHitter.cacheChecksForType(thing.title, thing.groupType);
        };
        /**
         * Generates a key for a Thing based off the current area and the Thing's
         * basic attributes. This should be used for PixelRender.get calls, to
         * cache the Thing's sprite.
         *
         * @param thing
         * @returns A key that to identify the Thing's sprite.
         */
        FullScreenMario.prototype.generateThingKey = function (thing) {
            return thing.GameStarter.AreaSpawner.getArea().setting
                + " " + thing.groupType + " "
                + thing.title + " " + thing.className;
        };
        /**
         * Adds a Thing via addPreThing based on the specifications in a PreThing.
         * This is done relative to MapScreener.left and MapScreener.floor.
         *
         * @param prething   A PreThing whose Thing is to be added to the game.
         */
        FullScreenMario.prototype.addPreThing = function (prething) {
            var thing = prething.thing, position = prething.position || thing.position;
            thing.FSM.addThing(thing, prething.left * thing.FSM.unitsize - thing.FSM.MapScreener.left, (thing.FSM.MapScreener.floor - prething.top) * thing.FSM.unitsize);
            // Either the prething or thing, in that order, may request to be in the
            // front or back of its container using the "position" attribute
            if (position) {
                thing.FSM.TimeHandler.addEvent(function () {
                    switch (position) {
                        case "beginning":
                            thing.FSM.arrayToBeginning(thing, thing.FSM.GroupHolder.getGroup(thing.groupType));
                            break;
                        case "end":
                            thing.FSM.arrayToEnd(thing, thing.FSM.GroupHolder.getGroup(thing.groupType));
                            break;
                        default:
                            break;
                    }
                });
            }
            thing.FSM.ModAttacher.fireEvent("onAddPreThing", prething);
        };
        /**
         * Adds a new Player Thing to the game and sets it as EightBitter.play. Any
         * required additional settings (namely keys, power/size, and swimming) are
         * applied here.
         *
         * @param left   A left edge to place the Thing at (by default, unitsize * 16).
         * @param bottom   A bottom to place the Thing upon (by default, unitsize * 16).
         * @returns A newly created Player in the game.
         */
        FullScreenMario.prototype.addPlayer = function (left, bottom) {
            var _this = this;
            if (left === void 0) { left = this.unitsize * 16; }
            if (bottom === void 0) { bottom = this.unitsize * 16; }
            var player;
            player = this.player = this.ObjectMaker.make("Player", {
                "power": this.ItemsHolder.getItem("power")
            });
            player.keys = player.getKeys();
            if (this.MapScreener.underwater) {
                player.swimming = true;
                this.TimeHandler.addClassCycle(player, ["swim1", "swim2"], "swimming", 5);
                this.TimeHandler.addEventInterval(function () { return _this.animations.animatePlayerBubbling(player); }, 96, Infinity);
            }
            this.setPlayerSizeSmall(player);
            if (player.power >= 2) {
                this.playerGetsBig(player, true);
                if (player.power === 3) {
                    this.playerGetsFire(player);
                }
            }
            this.addThing(player, left, bottom - player.height * this.unitsize);
            this.ModAttacher.fireEvent("onAddPlayer", player);
            return player;
        };
        /**
         * Shortcut to call scrollThing on a Player.
         *
         * @param dx   How far to scroll horizontally.
         * @param dy   How far to scroll vertically.
         */
        FullScreenMario.prototype.scrollPlayer = function (dx, dy) {
            this.scrollThing(this.player, dx, dy);
            this.ModAttacher.fireEvent("onScrollPlayer", dx, dy);
        };
        /**
         * Triggered Function for when the game is paused. Music stops, the pause
         * bleep is played, and the mod event is fired.
         *
         * @param FSM
         */
        FullScreenMario.prototype.onGamePause = function (FSM) {
            FSM.AudioPlayer.pauseAll();
            FSM.AudioPlayer.play("Pause");
            FSM.ModAttacher.fireEvent("onGamePause");
        };
        /**
         * Triggered Function for when the game is played or unpause. Music resumes
         * and the mod event is fired.
         *
         * @param FSM
         */
        FullScreenMario.prototype.onGamePlay = function (FSM) {
            FSM.AudioPlayer.resumeAll();
            FSM.ModAttacher.fireEvent("onGamePlay");
        };
        /* Collision reactions
        */
        /**
         * Externally facing Function to gain some number of lives. ItemsHolder
         * increases the "score" statistic, an audio is played, and the mod event is
         * fired.
         *
         * @param amount   How many lives to gain (by default, 1).
         * @param nosound   Whether the sound should be skipped (by default,
         *                  false).
         */
        FullScreenMario.prototype.gainLife = function (amount, nosound) {
            amount = Number(amount) || 1;
            this.ItemsHolder.increase("lives", amount);
            if (!nosound) {
                this.AudioPlayer.play("Gain Life");
            }
            this.ModAttacher.fireEvent("onGainLife", amount);
        };
        /**
         * Basic Function for an item to jump slightly into the air, such as from
         * a Player hitting a solid below it.
         *
         * @param thing   An item.
         * @remarks This simply moves the thing up slightly and decreases its
         *          y-velocity, without considering x-direction.
         */
        FullScreenMario.prototype.itemJump = function (thing) {
            thing.yvel -= FullScreenMario.unitsize * 1.4;
            this.shiftVert(thing, -FullScreenMario.unitsize);
        };
        /**
         * Generic Function for when a Player jumps on top of an enemy. The enemy
         * is killed, a Player's velocity points upward, and score is gained.
         *
         * @param thing   A Player jumping on other.
         * @param other   An Enemy being jumped upon.
         */
        FullScreenMario.prototype.jumpEnemy = function (thing, other) {
            if (thing.keys.up) {
                thing.yvel = thing.FSM.unitsize * -1.4;
            }
            else {
                thing.yvel = thing.FSM.unitsize * -0.7;
            }
            thing.xvel *= 0.91;
            thing.FSM.AudioPlayer.play("Kick");
            if (!thing.item || other.shell) {
                thing.jumpcount += 1;
                thing.FSM.scoring.scoreOn(thing.FSM.scoring.findScore(thing.jumpcount + thing.jumpers), other);
            }
            thing.jumpers += 1;
            thing.FSM.TimeHandler.addEvent(function (thing) {
                thing.jumpers -= 1;
            }, 1, thing);
        };
        /**
         * Callback for a Player hitting a Mushroom or FireFlower. A player's
         * power and the ItemsHolder's "power" statistic both go up, and the
         * corresponding animations and mod event are triggered.
         *
         * @param thing   A Player powering up.
         * @param other   A Mushroom powering up hte Player.
         */
        FullScreenMario.prototype.playerShroom = function (thing, other) {
            if (thing.shrooming || !thing.player) {
                return;
            }
            thing.FSM.AudioPlayer.play("Powerup");
            thing.FSM.scoring.scoreOn(1000, thing.FSM.player);
            if (thing.power < 3) {
                thing.FSM.ItemsHolder.increase("power");
                if (thing.power < 3) {
                    thing.shrooming = true;
                    thing.power += 1;
                    if (thing.power === 3) {
                        thing.FSM.playerGetsFire(thing.FSM.player);
                    }
                    else {
                        thing.FSM.playerGetsBig(thing.FSM.player);
                    }
                }
            }
            thing.FSM.ModAttacher.fireEvent("onPlayerShroom", thing, other);
        };
        /**
         * Callback for a Player hitting a Mushroom1Up. The game simply calls
         * gainLife and triggers the mod event.
         *
         * @param thing   A Player gaining a life.
         * @param other   The Mushroom1Up giving the life.
         */
        FullScreenMario.prototype.playerShroom1Up = function (thing, other) {
            if (!thing.player) {
                return;
            }
            thing.FSM.gainLife(1);
            thing.FSM.ModAttacher.fireEvent("onPlayerShroom1Up", thing, other);
        };
        /**
         * Callback for a Player hitting a Star. A set of animation loops and
         * sounds play, and the mod event is triggered. After some long period time,
         * playerStarDown is called to start the process of removing star power.
         *
         * @param thing   A Player gaining star powers.
         * @param timeout   How long to wait before calling playerStarDown
         *                  (by default, 560).
         */
        FullScreenMario.prototype.playerStarUp = function (thing, timeout) {
            if (timeout === void 0) { timeout = 560; }
            thing.star += 1;
            thing.FSM.switchClass(thing, "normal fiery", "star");
            thing.FSM.AudioPlayer.play("Powerup");
            thing.FSM.AudioPlayer.addEventListener("Powerup", "ended", thing.FSM.AudioPlayer.playTheme.bind(thing.FSM.AudioPlayer, "Star", true));
            thing.FSM.TimeHandler.addClassCycle(thing, ["star1", "star2", "star3", "star4"], "star", 2);
            thing.FSM.TimeHandler.addEvent(thing.FSM.playerStarDown, timeout || 560, thing);
            thing.FSM.ModAttacher.fireEvent("onPlayerStarUp", thing);
        };
        /**
         * Trigger to commence reducing a Player's star power. This slows the
         * class cycle, times a playerStarOffCycle trigger, and fires the mod event.
         *
         * @param thing   A Player losing star powers.
         */
        FullScreenMario.prototype.playerStarDown = function (thing) {
            if (!thing.player) {
                return;
            }
            thing.FSM.TimeHandler.cancelClassCycle(thing, "star");
            thing.FSM.TimeHandler.addClassCycle(thing, [
                "star1", "star2", "star3", "star4"
            ], "star", 5);
            thing.FSM.TimeHandler.addEvent(thing.FSM.playerStarOffCycle, 140, thing);
            thing.FSM.AudioPlayer.removeEventListeners("Powerup", "ended");
            thing.FSM.ModAttacher.fireEvent("onPlayerStarDown", thing);
        };
        /**
         * Trigger to continue reducing a Player's star power. This resumes
         * playing the regular theme, times a playerStarOffFinal trigger, and fires
         * the mod event.
         *
         * @param thing   A Player losing star powers.
         */
        FullScreenMario.prototype.playerStarOffCycle = function (thing) {
            if (!thing.player) {
                return;
            }
            if (thing.star > 1) {
                thing.star -= 1;
                return;
            }
            if (!thing.FSM.AudioPlayer.getTheme().paused) {
                thing.FSM.AudioPlayer.playTheme();
            }
            thing.FSM.TimeHandler.addEvent(thing.FSM.playerStarOffFinal, 70, thing);
            thing.FSM.ModAttacher.fireEvent("onPlayerStarOffCycle", thing);
        };
        /**
         * Trigger to finish reducing a Player's star power. This actually reduces
         * a Player's star attribute, cancels the sprite cycle, adds the previous
         * classes back, and fires the mod event.
         *
         * @param thing   A Player losing star powers.
         */
        FullScreenMario.prototype.playerStarOffFinal = function (thing) {
            if (!thing.player) {
                return;
            }
            thing.star -= 1;
            thing.FSM.TimeHandler.cancelClassCycle(thing, "star");
            thing.FSM.removeClasses(thing, "star star1 star2 star3 star4");
            thing.FSM.addClass(thing, "normal");
            if (thing.power === 3) {
                thing.FSM.addClass(thing, "fiery");
            }
            thing.FSM.ModAttacher.fireEvent("onPlayerStarOffFinal", thing);
        };
        /**
         * Sizing modifier for a Player, typically called when entering a location
         * or colliding with a Mushroom. This sets a Player's size to the large
         * mode and optionally plays the animation. The mod event is then fired.
         *
         * @param thing   A Player increasing in size.
         * @param noAnimation   Whether to skip the animation (by default,
         *                      false).
         */
        FullScreenMario.prototype.playerGetsBig = function (thing, noAnimation) {
            thing.FSM.setPlayerSizeLarge(thing);
            thing.FSM.removeClasses(thing, "crouching small");
            thing.FSM.updateBottom(thing, 0);
            thing.FSM.updateSize(thing);
            if (noAnimation) {
                thing.FSM.addClass(thing, "large");
            }
            else {
                thing.FSM.playerGetsBigAnimation(thing);
            }
            thing.FSM.ModAttacher.fireEvent("onPlayerGetsBig", thing);
        };
        /**
         * Animation scheduler for a Player getting big. The shrooming classes are
         * cycled through rapidly while a Player's velocity is paused.
         *
         * @param thing   A Player increasing in size.
         */
        FullScreenMario.prototype.playerGetsBigAnimation = function (thing) {
            var stages = [
                "shrooming1", "shrooming2",
                "shrooming1", "shrooming2",
                "shrooming3", "shrooming2", "shrooming3"
            ];
            thing.FSM.addClass(thing, "shrooming");
            thing.FSM.animations.animateCharacterPauseVelocity(thing);
            // The last stage in the events clears it, resets movement, and stops
            stages.push(function (thing) {
                thing.shrooming = false;
                stages.length = 0;
                thing.FSM.addClass(thing, "large");
                thing.FSM.removeClasses(thing, "shrooming shrooming3");
                thing.FSM.animations.animateCharacterResumeVelocity(thing);
                return true;
            });
            thing.FSM.TimeHandler.addClassCycle(thing, stages, "shrooming", 6);
        };
        /**
         * Sizing modifier for a Player, typically called when going down to
         * normal size after being large. This containst eha nimation scheduling
         * to cycle through paddling classes, then flickers a Player. The mod
         * event is fired.
         *
         * @param thing   A Player decreasing in size.
         */
        FullScreenMario.prototype.playerGetsSmall = function (thing) {
            var bottom = thing.bottom;
            thing.FSM.animations.animateCharacterPauseVelocity(thing);
            // Step one
            thing.nocollidechar = true;
            thing.FSM.animations.animateFlicker(thing);
            thing.FSM.removeClasses(thing, "running skidding jumping fiery");
            thing.FSM.addClasses(thing, "paddling small");
            // Step two (t+21)
            thing.FSM.TimeHandler.addEvent(function (thing) {
                thing.FSM.removeClass(thing, "large");
                thing.FSM.setPlayerSizeSmall(thing);
                thing.FSM.setBottom(thing, bottom - FullScreenMario.unitsize);
            }, 21, thing);
            // Step three (t+42)
            thing.FSM.TimeHandler.addEvent(function (thing) {
                thing.FSM.animations.animateCharacterResumeVelocity(thing, false);
                thing.FSM.removeClass(thing, "paddling");
                if (thing.running || thing.xvel) {
                    thing.FSM.addClass(thing, "running");
                }
                thing.FSM.PixelDrawer.setThingSprite(thing);
            }, 42, thing);
            // Step four (t+70)
            thing.FSM.TimeHandler.addEvent(function (thing) {
                thing.nocollidechar = false;
            }, 70, thing);
            thing.FSM.ModAttacher.fireEvent("onPlayerGetsSmall");
        };
        /**
         * Visual changer for when a Player collides with a FireFlower. The
         * "fiery" class is added, and the mod event is fired.
         *
         * @param thing   A Player gaining fire powers.
         */
        FullScreenMario.prototype.playerGetsFire = function (thing) {
            thing.shrooming = false;
            if (!thing.star) {
                thing.FSM.addClass(thing, "fiery");
            }
            thing.FSM.ModAttacher.fireEvent("onPlayerGetsFire");
        };
        /**
         * Actually sets the size for a player to small (8x8) via setSize and
         * updateSize.
         *
         * @param thing   A Player decreasing in size.
         */
        FullScreenMario.prototype.setPlayerSizeSmall = function (thing) {
            thing.FSM.setSize(thing, 8, 8, true);
            thing.FSM.updateSize(thing);
        };
        /**
         * Actually sets the size for a player to large (8x16) via setSize and
         * updateSize.
         *
         * @param thing   A Player increasing in size.
         */
        FullScreenMario.prototype.setPlayerSizeLarge = function (thing) {
            thing.FSM.setSize(thing, 8, 16, true);
            thing.FSM.updateSize(thing);
        };
        /**
         * Officially unattaches a player from a solid. The thing's physics flags
         * are reset to normal, the two have their attachment flags set, and the
         * thing is set to be jumping off.
         *
         * @param thing   A Player attached to other.
         * @param other   A Solid thing is attached to.
         */
        FullScreenMario.prototype.unattachPlayer = function (thing, other) {
            thing.nofall = false;
            thing.nocollide = false;
            thing.checkOverlaps = true;
            thing.attachedSolid = undefined;
            thing.xvel = thing.keys ? thing.keys.run : 0;
            thing.movement = thing.FSM.movements.movePlayer;
            thing.FSM.addClass(thing, "jumping");
            thing.FSM.removeClasses(thing, "climbing", "animated");
            other.attachedCharacter = undefined;
        };
        /**
         * Adds an invisible RestingStone underneath a Player. It is hidden and
         * unable to collide until a Player falls to its level, at which point the
         * stone is set underneath a Player to be rested upon.
         *
         * @param thing   A Player respawning into the game.
         */
        FullScreenMario.prototype.playerAddRestingStone = function (thing) {
            var stone = thing.FSM.addThing("RestingStone", thing.left, thing.top + thing.FSM.unitsize * 48);
            thing.nocollide = true;
            thing.FSM.TimeHandler.addEventInterval(function () {
                if (thing.bottom < stone.top) {
                    return false;
                }
                thing.nocollide = false;
                thing.FSM.setMidXObj(stone, thing);
                thing.FSM.setBottom(thing, stone.top);
                return true;
            }, 1, Infinity);
        };
        /**
         * Marks a new overlapping Thing in the first Thing's overlaps Array,
         * creating the Array if needed.
         *
         * @param thing   The Thing that is overlapping another Thing.
         * @param other   The Thing being added to the overlaps Array.
         */
        FullScreenMario.prototype.markOverlap = function (thing, other) {
            if (!thing.overlaps) {
                thing.overlaps = [other];
            }
            else {
                thing.overlaps.push(other);
            }
        };
        /* Spawn / activate functions
        */
        /**
         * Activation callback for starting spawnRandomCheep on an interval.
         * MapScreener is notified that spawningCheeps is true.
         *
         * @param thing   A Detector activated to start spawning CheepCheeps.
         */
        FullScreenMario.prototype.activateCheepsStart = function (thing) {
            thing.FSM.MapScreener.spawningCheeps = true;
            thing.FSM.TimeHandler.addEventInterval(thing.FSM.spawns.spawnRandomCheep, 21, Infinity, thing.FSM);
        };
        /**
         * Activation callback to stop spawning CheepCheeps. MapScreener is notified
         * that spawningCheeps is false.
         *
         * @param thing   A Detector activated to stop spawning CheepCheeps.
         */
        FullScreenMario.prototype.activateCheepsStop = function (thing) {
            thing.FSM.MapScreener.spawningCheeps = false;
        };
        /**
         * Activation callback for starting spawnRandomBulletBill on an interval.
         * MapScreener is notified that spawningBulletBills is true.
         *
         * @param thing   A Detector activated to start spawning BulletBills.
         */
        FullScreenMario.prototype.activateBulletBillsStart = function (thing) {
            thing.FSM.MapScreener.spawningBulletBills = true;
            thing.FSM.TimeHandler.addEventInterval(thing.FSM.spawns.spawnRandomBulletBill, 210, Infinity, thing.FSM);
        };
        /**
         * Activation callback to stop spawning BulletBills. MapScreener is notified
         * that spawningBulletBills is false.
         *
         * @param thing   A Detector activated to stop spawning BulletBills.
         */
        FullScreenMario.prototype.activateBulletBillsStop = function (thing) {
            thing.FSM.MapScreener.spawningBulletBills = false;
        };
        /**
         * Activation callback to tell the area's Lakitu, if it exists, to start
         * fleeing the scene.
         *
         * @param thing   A Detector activated to make the Lakitu flee.
         */
        FullScreenMario.prototype.activateLakituStop = function (thing) {
            var lakitu = thing.FSM.MapScreener.lakitu;
            if (!lakitu) {
                return;
            }
            lakitu.fleeing = true;
            lakitu.movement = thing.FSM.movements.moveLakituFleeing;
        };
        /**
         * Activation callback for a warp world area, triggered by a Player
         * touching a collider on top of it. Piranhas disappear and texts are
         * revealed.
         *
         * @param thing   A Player activating the warp world.
         * @param other   A Detector triggered by thing to activate a warp world.
         */
        FullScreenMario.prototype.activateWarpWorld = function (thing, other) {
            var collection = other.collection, key = 0, keyString, texts, j;
            if (!thing.player) {
                return;
            }
            texts = collection.Welcomer.children;
            for (j = 0; j < texts.length; j += 1) {
                if (texts[j].title !== "TextSpace") {
                    texts[j].hidden = false;
                }
            }
            while (true) {
                keyString = key + "-Text";
                if (!collection.hasOwnProperty(keyString)) {
                    break;
                }
                texts = collection[keyString].children;
                for (j = 0; j < texts.length; j += 1) {
                    if (texts[j].title !== "TextSpace") {
                        texts[j].hidden = false;
                    }
                }
                thing.FSM.deaths.killNormal(collection[key + "-Piranha"]);
                key += 1;
            }
        };
        /**
         * Activation callback for when a Player lands on a RestingStone. The
         * stone "appears" (via opacity), the regular theme plays if it wasn't
         * already, and the RestingStone waits to kill itself when a Player isn't
         * touching it.
         *
         * @param thing   A RestingStone being landed on.
         * @param other   A Player landing on thing.
         */
        FullScreenMario.prototype.activateRestingStone = function (thing, other) {
            if (thing.activated) {
                return;
            }
            thing.activated = true;
            thing.opacity = 1;
            thing.FSM.AudioPlayer.playTheme();
            thing.FSM.TimeHandler.addEventInterval(function () {
                if (other.resting === thing) {
                    return false;
                }
                thing.FSM.deaths.killNormal(thing);
                return true;
            }, 1, Infinity);
        };
        /**
         * Generic activation callback for DetectWindow Things. This is typically
         * set as a .movement Function, so it waits until the calling Thing is
         * within the MapScreener's area to call the activate Function and kill
         * itself.
         *
         * @param thing   A DetectWindow that might be activated.
         */
        FullScreenMario.prototype.activateWindowDetector = function (thing) {
            if (thing.FSM.MapScreener.right - thing.FSM.MapScreener.left < thing.left) {
                return;
            }
            thing.activate(thing);
            thing.FSM.deaths.killNormal(thing);
        };
        /**
         * Activation callback for ScrollBlocker Things. These are WindowDetectors
         * that set MapScreener.canscroll to false when they're triggered. If the
         * latest scrollWindow call pushed it too far to the left, it scrolls back
         * the other way.
         *
         * @param thing   A ScrollBlocker that might be activated.
         */
        FullScreenMario.prototype.activateScrollBlocker = function (thing) {
            var dx = thing.FSM.MapScreener.width - thing.left;
            thing.FSM.MapScreener.canscroll = false;
            if (thing.setEdge && dx > 0) {
                thing.FSM.scrollWindow(-dx);
            }
        };
        /**
         * Activation callback for ScrollBlocker Things. These are DetectCollision
         * that set MapScreener.canscroll to true when they're triggered.
         *
         * @param thing   An activated ScrollEnabler.
         */
        FullScreenMario.prototype.activateScrollEnabler = function (thing) {
            thing.FSM.MapScreener.canscroll = true;
        };
        /**
         * Activates the "before" component of a stretchable section. The creation
         * commands of the section are loaded onto the screen as is and a
         * DetectWindow is added to their immediate right that will trigger the
         * equivalent activateSectionStretch.
         *
         * @param thing   An activated SectionDecider.
         */
        FullScreenMario.prototype.activateSectionBefore = function (thing) {
            var FSM = thing.FSM, MapsCreator = FSM.MapsCreator, MapScreener = FSM.MapScreener, AreaSpawner = FSM.AreaSpawner, area = AreaSpawner.getArea(), map = AreaSpawner.getMap(), prethings = AreaSpawner.getPreThings(), section = area.sections[thing.section || 0], left = (thing.left + MapScreener.left) / FSM.unitsize, before = section.before ? section.before.creation : undefined, command, i;
            // If there is a before, parse each command into the prethings array
            if (before) {
                for (i = 0; i < before.length; i += 1) {
                    // A copy of the command must be used to not modify the original 
                    command = FSM.proliferate({}, before[i]);
                    // The command's x must be shifted by the thing's placement
                    if (!command.x) {
                        command.x = left;
                    }
                    else {
                        command.x += left;
                    }
                    // For Platforms that slide around, start and end are dynamic
                    if (command.sliding) {
                        command.begin += left;
                        command.end += left;
                    }
                    MapsCreator.analyzePreSwitch(command, prethings, area, map);
                }
            }
            // Add a prething at the end of all this to trigger the stretch part
            command = {
                "thing": "DetectWindow",
                "x": left + (before ? section.before.width : 0), "y": 0,
                "activate": FSM.activateSectionStretch,
                "section": thing.section || 0
            };
            MapsCreator.analyzePreSwitch(command, prethings, area, map);
            // Spawn new Things that should be placed for being nearby
            AreaSpawner.spawnArea("xInc", MapScreener.top / FSM.unitsize, (MapScreener.left + FSM.QuadsKeeper.right) / FSM.unitsize, MapScreener.bottom / FSM.unitsize, left);
        };
        /**
         * Activates the "stretch" component of a stretchable section. The creation
         * commands of the section are loaded onto the screen and have their widths
         * set to take up the entire width of the screen. A DetectWindow is added
         * to their immediate right that will trigger the equivalent
         * activateSectionAfter.
         *
         * @param thing   An activated SectionDetector.
         */
        FullScreenMario.prototype.activateSectionStretch = function (thing) {
            var FSM = thing.FSM, MapsCreator = FSM.MapsCreator, MapScreener = FSM.MapScreener, AreaSpawner = FSM.AreaSpawner, area = AreaSpawner.getArea(), map = AreaSpawner.getMap(), prethings = AreaSpawner.getPreThings(), section = area.sections[thing.section || 0], stretch = section.stretch ? section.stretch.creation : undefined, left = (thing.left + MapScreener.left) / FSM.unitsize, width = MapScreener.width / FSM.unitsize, command, i;
            // If there is a stretch, parse each command into the current prethings array
            if (stretch) {
                for (i = 0; i < stretch.length; i += 1) {
                    // A copy of the command must be used, so the original isn't modified
                    command = FSM.proliferate({}, stretch[i]);
                    command.x = left;
                    // "stretch" the command by making its width equal to the screen
                    command.width = width;
                    MapsCreator.analyzePreSwitch(command, prethings, area, map);
                }
                // Add a prething at the end of all this to trigger the after part
                command = {
                    "thing": "DetectWindow",
                    "x": left + width,
                    "y": 0,
                    "activate": FSM.activateSectionAfter,
                    "section": thing.section || 0
                };
                MapsCreator.analyzePreSwitch(command, prethings, area, map);
            }
            // Spawn the map, so new Things that should be placed will be spawned if nearby
            AreaSpawner.spawnArea("xInc", MapScreener.top / FSM.unitsize, left + (MapScreener.width / FSM.unitsize), MapScreener.bottom / FSM.unitsize, left);
        };
        /**
         * Activates the "after" component of a stretchable sectin. The creation
         * commands of the stretch are loaded onto the screen as is.
         *
         * @param thing   An activated SectioNDetector.
         */
        FullScreenMario.prototype.activateSectionAfter = function (thing) {
            // Since the section was passed, do the rest of things normally
            var FSM = thing.FSM, MapsCreator = FSM.MapsCreator, MapScreener = FSM.MapScreener, AreaSpawner = FSM.AreaSpawner, area = AreaSpawner.getArea(), map = AreaSpawner.getMap(), prethings = AreaSpawner.getPreThings(), section = area.sections[thing.section || 0], left = (thing.left + MapScreener.left) / FSM.unitsize, after = section.after ? section.after.creation : undefined, command, i;
            // If there is an after, parse each command into the current prethings array
            if (after) {
                for (i = 0; i < after.length; i += 1) {
                    // A copy of the command must be used, so the original isn't modified
                    command = FSM.proliferate({}, after[i]);
                    // The command's x-location must be shifted by the thing's placement
                    if (!command.x) {
                        command.x = left;
                    }
                    else {
                        command.x += left;
                    }
                    // For Platforms that slide around, start and end are dynamic
                    if (command.sliding) {
                        command.begin += left;
                        command.end += left;
                    }
                    MapsCreator.analyzePreSwitch(command, prethings, area, map);
                }
            }
            // Spawn the map, so new Things that should be placed will be spawned if nearby
            AreaSpawner.spawnArea("xInc", MapScreener.top / FSM.unitsize, left + (MapScreener.right / FSM.unitsize), MapScreener.bottom / FSM.unitsize, left);
        };
        /* Appearance utilities
        */
        /**
         * Makes one Thing look towards another, chainging lookleft and moveleft in
         * the process.
         *
         * @param thing   A Character looking towards other.
         * @param other   A Thing being looked at by thing.
         */
        FullScreenMario.prototype.lookTowardsThing = function (thing, other) {
            // Case: other is to the left
            if (other.right <= thing.left) {
                thing.lookleft = true;
                thing.moveleft = true;
                thing.FSM.unflipHoriz(thing);
            }
            else if (other.left >= thing.right) {
                // Case: other is to the right
                thing.lookleft = false;
                thing.moveleft = false;
                thing.FSM.flipHoriz(thing);
            }
        };
        /**
         * Makes one Thing look towards a Player, chainging lookleft and moveleft
         * in the process.
         *
         * @param thing   A Character looking towards the Player.
         * @param big   Whether to always change lookleft and moveleft,
         *              even if lookleft is already accurate (by
         *              default, false).
         */
        FullScreenMario.prototype.lookTowardsPlayer = function (thing, big) {
            // Case: Player is to the left
            if (thing.FSM.player.right <= thing.left) {
                if (!thing.lookleft || big) {
                    thing.lookleft = true;
                    thing.moveleft = false;
                    thing.FSM.unflipHoriz(thing);
                }
            }
            else if (thing.FSM.player.left >= thing.right) {
                // Case: Player is to the right
                if (thing.lookleft || big) {
                    thing.lookleft = false;
                    thing.moveleft = true;
                    thing.FSM.flipHoriz(thing);
                }
            }
        };
        /* Audio
        */
        /**
         * Determines how loud a sound should be at an x-location. This
         * is louder closer to a Player, and nothing to the right of the
         * visible screen.
         *
         * @param FSM
         * @param xloc   The x-location of the sound's source.
         * @returns How loud the sound should be, in [0,1].
         */
        FullScreenMario.prototype.getVolumeLocal = function (FSM, xloc) {
            if (xloc > FSM.MapScreener.right) {
                return 0;
            }
            return Math.max(.14, Math.min(.84, (FSM.MapScreener.width - Math.abs(xloc - FSM.player.left)) / FSM.MapScreener.width));
        };
        /**
         * Determines the name of the default theme for the current area,
         * which is the first word in the area's setting (split on spaces).
         *
         * @param FSM
         * @returns The default theme for the current area.
         */
        FullScreenMario.prototype.getAudioThemeDefault = function (FSM) {
            return FSM.AreaSpawner.getArea().setting.split(" ")[0];
        };
        /* Map sets
        */
        /**
         * Sets the game state to a new map, resetting all Things and inputs in the
         * process. The mod events are fired.
         *
         * @param name   The name of the map (by default, the currently
         *               played one).
         * @param location   The name of the location within the map (by
         *                   default, 0 for the first in Array form).
         * @remarks Most of the work here is done by setLocation.
         */
        FullScreenMario.prototype.setMap = function (name, location) {
            var time, map;
            if (typeof name === "undefined" || name.constructor === FullScreenMario) {
                name = this.AreaSpawner.getMapName();
            }
            map = this.AreaSpawner.setMap(name);
            this.ModAttacher.fireEvent("onPreSetMap", map);
            if (map.seed) {
                this.NumberMaker.resetFromSeed(map.seed);
            }
            this.ItemsHolder.setItem("world", name);
            this.InputWriter.restartHistory();
            this.ModAttacher.fireEvent("onSetMap", map);
            this.setLocation(location || map.locationDefault || this.settings.maps.locationDefault);
            time = this.AreaSpawner.getArea().time || this.AreaSpawner.getMap().time;
            this.ItemsHolder.setItem("time", Number(time));
        };
        /**
         * Sets the game state to a location within the current map, resetting all
         * Things, inputs, the current Area, PixelRender, and MapScreener in the
         * process. The location's entry Function is called to bring a new Player
         * into the game. The mod events are fired.
         *
         * @param name   The name of the location within the map (by
         *               default, 0 for the first in Array form).
         */
        FullScreenMario.prototype.setLocation = function (name) {
            if (name === void 0) { name = 0; }
            var location;
            this.MapScreener.nokeys = false;
            this.MapScreener.notime = false;
            this.MapScreener.canscroll = true;
            this.MapScreener.clearScreen();
            this.GroupHolder.clearArrays();
            this.TimeHandler.cancelAllEvents();
            this.AreaSpawner.setLocation((name || 0).toString());
            this.MapScreener.setVariables();
            location = this.AreaSpawner.getLocation((name || 0).toString());
            this.ModAttacher.fireEvent("onPreSetLocation", location);
            this.PixelDrawer.setBackground(this.AreaSpawner.getArea().background);
            this.TimeHandler.addEventInterval(this.maintenance.maintainTime, 25, Infinity, this);
            this.TimeHandler.addEventInterval(this.maintenance.maintainScenery, 350, Infinity, this);
            this.AudioPlayer.clearAll();
            this.AudioPlayer.playTheme();
            this.QuadsKeeper.resetQuadrants();
            location.entry(this, location);
            this.ModAttacher.fireEvent("onSetLocation", location);
            this.GamesRunner.play();
        };
        /* Map creation
        */
        /**
         * The onMake callback for Areas. Attributes are copied as specified in the
         * prototype, and the background is set based on the setting.
         *
         * @remarks The scope for this will be an Area.
         */
        FullScreenMario.prototype.initializeArea = function () {
            var scope = this, i;
            // Copy all attributes, if they exist
            if (scope.attributes) {
                for (i in scope.attributes) {
                    if (scope.hasOwnProperty(i) && scope[i]) {
                        FullScreenMario.prototype.proliferate(scope, scope.attributes[i]);
                    }
                }
            }
            scope.setBackground(scope);
        };
        /**
         * Sets an area's background as a function of its setting.
         *
         * @param area   An Area having its background set.
         * @remarks In the future, it might be more elegant to make Areas inherit
         * from base Area types (Overworld, etc.) so this inelegant switch
         * statement doesn't have to be used.
         */
        FullScreenMario.prototype.setAreaBackground = function (area) {
            // Non-underwater Underworld, Castle, and all Nights: black background
            if (area.setting.indexOf("Underwater") === -1
                && (area.setting.indexOf("Underworld") !== -1
                    || area.setting.indexOf("Castle") !== -1
                    || area.setting.indexOf("Night") !== -1)) {
                area.background = "#000000";
            }
            else {
                // Default (typically Overworld): sky blue background
                area.background = "#5c94fc";
            }
        };
        /**
         * Determines the absolute height of a y-location, which is the distance
         * from the absolute base (bottom of the user's viewport) to a specific
         * height above the floor.
         *
         * @param yloc   A height to find the distance to the floor from.
         * @param correctUnitsize   Whether the yloc accounts for unitsize
         *                          expansion (e.g. 48 rather than 12, for
         *                          unitsize=4).
         * @returns The absolute height of the y-location.
         */
        FullScreenMario.prototype.getAbsoluteHeight = function (yloc, correctUnitsize) {
            var height = yloc + this.MapScreener.height;
            if (!correctUnitsize) {
                height *= this.unitsize;
            }
            return height;
        };
        /**
         * Adds a PreThing to the map and stretches it to fit a width equal to the
         * current map's outermost boundaries.
         *
         * @param prethingRaw   A raw PreThing descriptor.
         * @returns A strethed Thing, newly added via addThing.
         */
        FullScreenMario.prototype.mapAddStretched = function (prethingRaw) {
            var boundaries = this.AreaSpawner.getArea().boundaries, prething = prethingRaw instanceof String
                ? { "thing": prething }
                : prethingRaw, y = ((this.MapScreener.floor - prething.y)
                * this.unitsize), 
            // It is assumed the PreThing does have a .thing if it's a stretch
            thing = this.ObjectMaker.make(prething.thing, {
                "width": boundaries.right - boundaries.left,
                "height": prething.height || this.getAbsoluteHeight(prething.y)
            });
            return this.addThing(thing, boundaries.left, y);
        };
        /**
         * Analyzes a PreThing to be placed to the right of the current map's
         * boundaries (after everything else).
         *
         * @param prethingRaw   A raw PreThing descriptor.
         */
        FullScreenMario.prototype.mapAddAfter = function (prethingRaw) {
            var MapsCreator = this.MapsCreator, AreaSpawner = this.AreaSpawner, prethings = AreaSpawner.getPreThings(), prething = prethingRaw instanceof String
                ? {
                    "thing": prething
                }
                : prethingRaw, area = AreaSpawner.getArea(), map = AreaSpawner.getMap(), boundaries = this.AreaSpawner.getArea().boundaries;
            prething.x = boundaries.right;
            MapsCreator.analyzePreSwitch(prething, prethings, area, map);
        };
        // For the sake of reset functions, constants are stored as members of the 
        // FullScreenMario Function itself - this allows prototype setters to use 
        // them regardless of whether the prototype has been instantiated yet.
        /**
         * Static settings passed to individual reset Functions. Each of these
         * should be filled out separately, after the FullScreenMario class
         * has been declared but before an instance has been instantiated.
         */
        FullScreenMario.settings = {
            "audio": undefined,
            "collisions": undefined,
            "devices": undefined,
            "editor": undefined,
            "generator": undefined,
            "groups": undefined,
            "events": undefined,
            "help": undefined,
            "input": undefined,
            "math": undefined,
            "maps": undefined,
            "mods": undefined,
            "objects": undefined,
            "quadrants": undefined,
            "renderer": undefined,
            "runner": undefined,
            "scenes": undefined,
            "sprites": undefined,
            "items": undefined,
            "touch": undefined,
            "ui": undefined
        };
        /**
         * How much to expand each pixel from raw sizing measurements to in-game.
         */
        FullScreenMario.unitsize = 4;
        /**
         * How much to scale each pixel from PixelDrawr to the real canvas.
         */
        FullScreenMario.scale = 2;
        /**
         * How much falling Characters accelerate downward by default.
         */
        FullScreenMario.gravity = Math.round(12 * FullScreenMario.unitsize) / 100;
        /**
         * Levels of points to award for hopping on / shelling enemies.
         */
        FullScreenMario.pointLevels = [100, 200, 400, 500, 800, 1000, 2000, 4000, 5000, 8000];
        /**
         * Useful for custom text Things, where "text!" cannot be a Function name.
         */
        FullScreenMario.customTextMappings = {
            " ": "Space",
            ".": "Period",
            "!": "ExclamationMark",
            ":": "Colon",
            "/": "Slash",
            "©": "Copyright"
        };
        return FullScreenMario;
    })(GameStartr.GameStartr);
    FullScreenMario_1.FullScreenMario = FullScreenMario;
})(FullScreenMario || (FullScreenMario = {}));
