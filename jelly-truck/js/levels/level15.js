window.JellyTruck.state.level15 = {
    preload: function () {
        //background
        this.bg;
        this.light;
        this.scene;
        this.ground_art;
        this.map = this.game.add.tilemap("level_15_map");
        this.phyBody = this.game.add.tilemap("map");

        //camera
        this.jellyCamera = {
            cx: 0,
            cy: 0,
            focx: -1,
            focy: -1,
            focz: -1,
            mode: 0,
            zoom: 1,
            width: 640,
            height: 640,
            levelZoom: 1,
            scale: 0.8
        };

        //player and flag
        this.player;
        this.flag;

        //objects
        this.statBody;
        this.scorePoint;
        this.failPoint;
        this.jellyObj;

        //Level win and level fail
        this.win;
        this.restart;
        this.space;
        this.level_Fail = null;

        //score
        this.timeTrail;
        this.second;
        this.score;
        this.bonus;
        this.score_txt;
        this.spotLight;
        this.contact_count;

        // Level Specific
        this.lift;
        this.lift_sprite;
        this.lift_mask = this.game.add.graphics(0, 0);

        this.bladeup;
        this.bladedown;

        this.liftL;
        this.liftL_sprite;
        this.liftL_mask = this.game.add.graphics(0, 0);

        this.liftR;
        this.liftR_sprite;
        this.liftR_mask = this.game.add.graphics(0, 0);

        this.pusher;
        this.pusher_sprite;
        this.pusher_mask = this.game.add.graphics(0, 0);

    },
    create: function () {
        //score,bonus and win
        this.win = false;
        this.restart = false;
        this.second = 1000;
        this.score = 0;
        this.bonus = 0;
        this.timeTrail = 0;
        this.contact_count = 0;

        //level data
        this.game.mobLevel = "Level 15";
        this.game.levelNumber = "level15";
        this.game.nextlevelNumber = "level16";
        jt.current_level = 15;

        //init Game music and sound
        this.game.sound.stopAll();
        if (jt.sfx)
            jt.sfx.playMusic("oddbg");

        //setup sky background
        this.bg = new GameBg(this.game);
       
        // setup static object
        this.statBody = jt.setupStaticObject(this.game, this.map);
        
        // Ground body
        this.joint_ground = jt.setupJointGround(this.game, this.map);
        
        //setup Fail
        this.setupFail();
        
        //setup Score
        this.setupScore();
        
        //setup Flag
        this.setupFlag();
        
        // setup jelly object
        this.jellyObj = jt.setupJellyObj(this.game, this.map, this.phyBody);
       
        
        //setup game menu
        if (jt.game_menu != null)
            jt.game_menu.killMenu();
        jt.game_menu = new GameMenu(this.game);
        jt.game_menu.enable();
        
        //setup keyboard
        jt.initInput(this.game);
       // if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
       //jt.gameController(this.game);
       //}
        if (jt.sfx)
            jt.sfx.playTruckSound("truck_start");

        // Adding lift
        this.lift = this.jellyObj[5];
        this.lift_sprite = this.game.add.image(this.lift.getBox().x, this.lift.getBox().y, "lift_mask");
        this.lift_sprite.anchor.set(0.5, 0.5);
        this.lift_sprite.alpha = 0;
        this.lift.enablePrimatic(this.joint_ground, 0, this.game.physics.box2d.mpx(4), 0, -1);

        // Auto open bridge
        var b1 = this.statBody[8];
        this.bridge = this.game.add.sprite(2604, 1710, "bridge15");
        this.bridge.anchor.setTo(0.5);
        this.bridge.scale.setTo(1.1, 1.15);
        this.game.physics.box2d.enable(this.bridge);
        this.bridge.body.setCollisionCategory(8);
        this.bridge.body.setCollisionMask(14);
        var a = new box2d.b2Vec2();
        b1.toLocalPoint(a, new box2d.b2Vec2(2515.5, 1710.5));
        var b = new box2d.b2Vec2();
        this.bridge.body.toLocalPoint(b, new box2d.b2Vec2(2515.5, 1710.5));
        this.game.physics.box2d.revoluteJoint(b1, this.bridge.body, a.x, a.y, b.x, b.y, 0, 0, false, 0, 85, true);
        this.bridge.body.setCategoryContactCallback(WHEEL_CATEGORYBITS, this.handleTruckCollidingbridge, this);
        this.bolt = this.game.add.image(2515.5, 1710.5, "mill_bolt");
        this.bolt.anchor.setTo(0.5);
        this.bolt.scale.setTo(0.3);

        // Blades
        this.bladeup = this.jellyObj[7];
        this.bladeup.enablePrimatic(this.joint_ground, -100, 0, 0, 1);
        this.bladeup.setIndex(-50);
        this.bladedown = this.jellyObj[6];
        this.bladedown.enablePrimatic(this.joint_ground, -75, 0, 0, -1);

        // Elevators
        this.liftR = this.jellyObj[8];
        this.liftL = this.jellyObj[9];

        this.liftR.enablePrimatic(this.joint_ground, 0, this.game.physics.box2d.mpx(4.1), 0, -1);
        this.liftR_sprite = this.game.add.image(this.lift.getBox().x, this.lift.getBox().y, "lift_mask");
        this.liftR_sprite.anchor.set(0.5, 0.5);
        this.liftR_sprite.alpha = 0;

        this.liftL.enablePrimatic(this.joint_ground, 0, this.game.physics.box2d.mpx(4.1), 0, -1);
        this.liftL_sprite = this.game.add.image(this.lift.getBox().x, this.lift.getBox().y, "lift_mask");
        this.liftL_sprite.anchor.set(0.5, 0.5);
        this.liftL_sprite.alpha = 0;

        this.pusher = this.jellyObj[10];
        this.pusher.enablePrimatic(this.joint_ground, 0, this.game.physics.box2d.mpx(4), 0.2, -1);
        this.pusher_sprite = this.game.add.image(this.pusher.getBox().x, this.pusher.getBox().y, "lift_mask");
        this.pusher_sprite.anchor.setTo(0.5);
        this.pusher_sprite.alpha = 0;
        this.game.world.setChildIndex(this.pusher_sprite, 32);


        //setup level scene
        this.scene = jt.setupScene(this.game, this.map, "scene_15", 0, 0, this.jellyCamera.width, this.jellyCamera.height, 15000);        

        //set ground art
        /*this.ground_art = this.game.add.image(0, 0, 'ground_15');
        this.ground_art.autoCull = true;
        this.ground_art.checkWorldBounds = true;*/

        //setup player
        this.player = jt.createTruck(this.game, this.scene.truck_x, this.scene.truck_y, this.scene.truck_type, this.phyBody);
        
        //setup Camer Object
        this.setupCamera();
       

        // In order to keep the truck stopped initially. This will be destroyed when moved first.
        this.tempJoint = this.game.physics.box2d.ropeJoint(this.player.truck.getBox(), this.joint_ground, 85, 0, 0, -1448, -480);
        this.game.camera.follow(this.player.truck.getSprite());
    },
    // Level Pause and Resume
    onGamePause: function () {

    },
    onGameResume: function () {

    },
    updateCamera: function () {
        this._plx = this.player.truck.getSprite().x;
        this._ply = this.player.truck.getSprite().y;
        this._vlc = Math.abs(this.player.truck.getBox().data.m_linearVelocity.x);
        this.jellyCamera = jt.updateCamera(this.game, this.jellyCamera, this._plx, this._ply, this._vlc, this.win, this.restart, jt.pause);
    },
    setupCamera: function () {
        this.camerFocus = jt.setupCameraObject(this.game, this.map);
        for (var i = 0; i < this.camerFocus.length; i++) {
            this.camerFocus[i].setBodyContactCallback(this.player.truck.getBox(), this.camerafocusCollision, this);
        }
    },
    camerafocusCollision: function (body1, body2, fixture1, fixture2, begin, end) {
        if (begin) {
            this.jellyCamera.mode = 1;
            this.jellyCamera.focx = body1.m_userData.focusX - 200;
            this.jellyCamera.focy = body1.m_userData.focusY
            this.jellyCamera.focz = body1.m_userData.zoom;
        } else if (end) {
            this.jellyCamera.mode = 0;
            this.jellyCamera.focx = -1;
            this.jellyCamera.focy = -1;
            this.jellyCamera.focz = -1;
        }
    },
    update: function () {
        // this.updateCamera();
        if (jt.sfx)
            jt.sfx.loopMusic("oddbg");

        if (!this.win && !this.restart && !jt.pause) {
            this.timeTrail++;
            if (this.timeTrail % 10 == 0) {
                this.second--;
            }
            this.keyEvent();
            this.truckSound();
        } else if (this.win) {
            if (this.flag.joint)
                this.game.physics.box2d.world.DestroyJoint(this.flag.joint);

        } else if (this.restart) {
            this.game.physics.box2d.world.DestroyJoint(this.player.joint1);
            this.game.physics.box2d.world.DestroyJoint(this.player.joint2);
        }
        if (this.restart && this.level_Fail && this.level_Fail.space.isDown)
            this.level_Fail.restartBtnClicked();
        this.updateLift();
        this.updateBladeUp();
        this.updateBladeDown();
        this.updatePusher();
    },
    updateLift: function () {
        if (jt.dist(this.lift.getBox().x, this.lift.getBox().y, this.player.truck.getBox().x, this.player.truck.getBox().y) < 65.7 && this.lift_sprite.alpha == 0) {
            this.liftup = this.game.add.tween(this.lift_sprite).to({
                alpha: 1
            }, 750, "Linear", true);
            this.liftup.onComplete.add(this.liftMoveUp, this);
        } else if (jt.dist(this.lift.getBox().x, this.lift.getBox().y, this.player.truck.getBox().x, this.player.truck.getBox().y) > 85 && this.lift_sprite.alpha == 1) {
            this.liftdown = this.game.add.tween(this.lift_sprite).to({
                alpha: 0
            }, 200, "Linear", true);
            this.liftdown.onComplete.add(this.liftMoveDown, this);
        }

        if (jt.dist(this.liftL.getBox().x, this.liftL.getBox().y, this.player.truck.getBox().x, this.player.truck.getBox().y) < 120 && this.liftL_sprite.alpha == 0) {
            this.liftLup = this.game.add.tween(this.liftL_sprite).to({
                alpha: 1
            }, 750, "Linear", true);
            this.liftLup.onComplete.add(this.liftLMoveUp, this);
        } else if (jt.dist(this.liftL.getBox().x, this.liftL.getBox().y, this.player.truck.getBox().x, this.player.truck.getBox().y) > 136 && this.liftL_sprite.alpha == 1) {
            this.liftLdown = this.game.add.tween(this.liftL_sprite).to({
                alpha: 0
            }, 250, "Linear", true);
            this.liftLdown.onComplete.add(this.liftLMoveDown, this);
        }

        if (jt.dist(this.liftR.getBox().x, this.liftR.getBox().y, this.player.truck.getBox().x, this.player.truck.getBox().y) < 120 && this.liftR_sprite.alpha == 0) {
            this.liftRup = this.game.add.tween(this.liftR_sprite).to({
                alpha: 1
            }, 750, "Linear", true);
            this.liftRup.onComplete.add(this.liftRMoveUp, this);
        } else if (jt.dist(this.liftR.getBox().x, this.liftR.getBox().y, this.player.truck.getBox().x, this.player.truck.getBox().y) > 136 && this.liftR_sprite.alpha == 1) {
            this.liftRdown = this.game.add.tween(this.liftR_sprite).to({
                alpha: 0
            }, 250, "Linear", true);
            this.liftRdown.onComplete.add(this.liftRMoveDown, this);
        }
    },
    updateBladeUp: function () {
        this.bladeup.time_trail++;
        if (this.bladeup.time_trail == 1) { // Close
            this.bladeup.joint.m_motorSpeed = 20;
            this.bladeup.joint.m_maxMotorForce = 750;
            this.bladeup.joint.EnableMotor(true);
        }
        if (this.bladeup.time_trail >= 100 && this.bladeup.joint.m_motorSpeed > 0) { // Open
            this.bladeup.joint.m_motorSpeed = -20;
            this.bladeup.joint.m_maxMotorForce = 1000;
            this.bladeup.joint.EnableMotor(true);
        }
        if (this.bladeup.time_trail >= 600)
            this.bladeup.time_trail = 0;
    },
    updateBladeDown: function () {
        this.bladedown.time_trail++;
        if (this.bladedown.time_trail == 1) { // Close
            this.bladedown.joint.m_motorSpeed = 25;
            this.bladedown.joint.m_maxMotorForce = 1500;
            this.bladedown.joint.EnableMotor(true);
        }
        if (this.bladedown.time_trail >= 100 && this.bladedown.joint.m_motorSpeed > 0) { // Open
            this.bladedown.joint.m_motorSpeed = -20;
            this.bladedown.joint.m_maxMotorForce = 750;
            this.bladedown.joint.EnableMotor(true);
        }
        if (this.bladedown.time_trail >= 600)
            this.bladedown.time_trail = 0;
    },
    updatePusher: function () {
        if (jt.dist(this.pusher.getBox().x, this.pusher.getBox().y, this.player.truck.getBox().x, this.player.truck.getBox().y) < 70 && this.pusher_sprite.alpha == 0) {
            var pusherUpTween = this.game.add.tween(this.pusher_sprite).to({
                alpha: 1
            }, 1000, "Linear", true);
            pusherUpTween.onComplete.add(this.pusherMoveUp, this);
        } else if (jt.dist(this.pusher.getBox().x, this.pusher.getBox().y, this.player.truck.getBox().x, this.player.truck.getBox().y) > 90 && this.pusher_sprite.alpha == 1) {
            var pusherDownTween = this.game.add.tween(this.pusher_sprite).to({
                alpha: 0
            }, 1000, "Linear", true);
            pusherDownTween.onComplete.add(this.pusherMoveDown, this);
        }
    },
    liftMoveUp: function () {
        this.lift.joint.m_motorSpeed = 5;
        this.lift.joint.m_maxMotorForce = 950;
        this.lift.joint.m_enableMotor = true;
    },
    liftMoveDown: function () {
        this.lift.joint.m_motorSpeed = -5;
        this.lift.joint.m_maxMotorForce = 950;
        this.lift.joint.m_enableMotor = true;
    },
    liftLMoveUp: function () {
        this.liftL.joint.m_motorSpeed = 3.5;
        this.liftL.joint.m_maxMotorForce = 950;
        this.liftL.joint.m_enableMotor = true;
    },
    liftLMoveDown: function () {
        this.liftL.joint.m_motorSpeed = -5;
        this.liftL.joint.m_maxMotorForce = 950;
        this.liftL.joint.m_enableMotor = true;
    },
    liftRMoveUp: function () {
        this.liftR.joint.m_motorSpeed = 3.5;
        this.liftR.joint.m_maxMotorForce = 950;
        this.liftR.joint.EnableMotor(true);
    },
    liftRMoveDown: function () {
        this.liftR.joint.m_motorSpeed = -5;
        this.liftR.joint.m_maxMotorForce = 950;
        this.liftR.joint.m_enableMotor = true;
    },
    pusherMoveUp: function () {
        this.pusher.joint.SetMotorSpeed(50);
        this.pusher.joint.SetMaxMotorForce(5750);
        this.pusher.joint.EnableMotor(true);
    },
    pusherMoveDown: function () {
        this.pusher.joint.SetMotorSpeed(-25);
        this.pusher.joint.SetMaxMotorForce(2500);
        this.pusher.joint.EnableMotor(true);
    },
    render: function () {
        if (this.jellyObj) {
            for (var i = 0; i < this.jellyObj.length; i++)
                this.jellyObj[i].renderJelly();
        }
        this.renderPlayer();
        this.renderLift();
        this.renderLiftL();
        this.renderLiftR();
        this.renderPusher();
        if (jt.phy_debug) {
            this.game.physics.box2d.debugDraw.joints = true;
            this.game.debug.box2dWorld();
        }
    },
    renderLift: function () {
        this.lift_sprite.x = this.lift.getBox().x;
        this.lift_sprite.y = this.lift.getBox().y;
        this.lift_mask.clear();
        this.lift_mask.beginFill(0xffffff);
        for (var j = 0; j < this.lift.getBodies().length; j++) {
            if (j == 0)
                this.lift_mask.moveTo(this.lift.getBodies()[j].getBody().x, this.lift.getBodies()[j].getBody().y);
            else
                this.lift_mask.lineTo(this.lift.getBodies()[j].getBody().x, this.lift.getBodies()[j].getBody().y);
            this.lift_sprite.angle = this.lift.getBodies()[j].getBody().angle;
        }
        this.lift_sprite.mask = this.lift_mask;
    },
    renderLiftL: function () {
        this.liftL_sprite.x = this.liftL.getBox().x;
        this.liftL_sprite.y = this.liftL.getBox().y;
        this.liftL_mask.clear();
        this.liftL_mask.beginFill(0xffffff);
        for (var j = 0; j < this.liftL.getBodies().length; j++) {
            if (j == 0)
                this.liftL_mask.moveTo(this.liftL.getBodies()[j].getBody().x, this.liftL.getBodies()[j].getBody().y);
            else
                this.liftL_mask.lineTo(this.liftL.getBodies()[j].getBody().x, this.liftL.getBodies()[j].getBody().y);
            this.liftL_sprite.angle = this.liftL.getBodies()[j].getBody().angle;
        }
        this.liftL_sprite.mask = this.liftL_mask;
    },
    renderLiftR: function () {
        this.liftR_sprite.x = this.liftR.getBox().x;
        this.liftR_sprite.y = this.liftR.getBox().y;
        this.liftR_mask.clear();
        this.liftR_mask.beginFill(0xffffff);
        for (var j = 0; j < this.liftR.getBodies().length; j++) {
            if (j == 0)
                this.liftR_mask.moveTo(this.liftR.getBodies()[j].getBody().x, this.liftR.getBodies()[j].getBody().y);
            else
                this.liftR_mask.lineTo(this.liftR.getBodies()[j].getBody().x, this.liftR.getBodies()[j].getBody().y);
            this.liftR_sprite.angle = this.liftR.getBodies()[j].getBody().angle;
        }
        this.liftR_sprite.mask = this.liftR_mask;
    },
    renderPusher: function () {
        this.pusher_sprite.x = this.pusher.getBox().x;
        this.pusher_sprite.y = this.pusher.getBox().y;
        this.pusher_mask.clear();
        this.pusher_mask.beginFill(0xffffff);
        for (var j = 0; j < this.pusher.getBodies().length; j++) {
            if (j == 0)
                this.pusher_mask.moveTo(this.pusher.getBodies()[j].getBody().x, this.pusher.getBodies()[j].getBody().y);
            else
                this.pusher_mask.lineTo(this.pusher.getBodies()[j].getBody().x, this.pusher.getBodies()[j].getBody().y);
            this.pusher_sprite.angle = this.pusher.getBodies()[j].getBody().angle;
        }
        this.pusher_sprite.mask = this.pusher_mask;
    },
    renderPlayer: function () {
        this.player.truck.renderJelly();
        this.player.front.renderJelly();
        this.player.back.renderJelly();
    },
    //Keyboard Event
    keyEvent: function () {
        jt.resetInput();
        if (!jt.pause && !this.restart && !this.win) {
            jt.updateinput();
            if ((jt.up || jt.down || jt.left || jt.right||jt.mobileleft||jt.mobileright||jt.mobileup||jt.mobiledown) && this.tempJoint) {
                // Destroying the rope joint that holds the truck from moving automatically when the game starts.
                this.game.physics.box2d.world.DestroyJoint(this.tempJoint);
                this.tempJoint = null;
            }
            jt.gameAction(this.game, this.player.truck.getBox(), this.player.front.getBox(), this.player.back.getBox(), 1, true);
        }
    },
    truckSound: function () {
        if (jt.truck_speed && jt.truck_move > 10) {
            jt.sfx.stopSound("truck_idle");
            jt.sfx.stopSound("truck_slow");
            jt.sfx.playTruckSound("truck_speed");
        } else {
            jt.sfx.stopSound("truck_speed");
            if (jt.truck_move > 30)
                jt.sfx.playTruckSound("truck_slow");
            if (jt.truck_move == 0) {
                jt.sfx.stopSound("truck_speed");
                jt.sfx.stopSound("truck_slow");
                jt.sfx.playTruckSound("truck_idle");
            }
        }
        this._x1 = this.player.truck.getBody(0).x;
        this._y1 = this.player.truck.getBody(0).y;
        this._x2 = this.player.truck.getBody(6).x;
        this._y2 = this.player.truck.getBody(6).y;
        if ((this._y2 - this._y1) < -20 && !jt.pause && !this.restart && !this.win)
            if (jt.sfx) {
                jt.sfx.truck_speed.volume = 0.7;
                jt.sfx.playTruckSound("truck_wob");
            }
        else
            jt.sfx.truck_speed.volume = 1;
    },
    //Score and Bonus
    setupScore: function () {
        this.scorePoint = jt.setupScoreObject(this.game, this.map);
        for (var i = 0; i < this.scorePoint.length; i++)
            this.scorePoint[i].setCategoryContactCallback(TRUCK_CATEGORYBITS, this.scoreCollision, this);
        this.spotLight = this.scorePoint.length;
    },
    scoreCollision: function (body1, body2, fixture1, fixture2, begin) {
        if (begin) {
            body1.destroy();
            this.contact_count++;
        } else {
            this.contact_count = 0;
        }
        if (this.contact_count === 1) {
            var value = this.second / this.spotLight;
            this.score += value;
            if (jt.game_menu != null)
                jt.game_menu.setScore(this.score);
            this.spotLight--;
        }
    },
    //Fail
    setupFail: function () {
        this.failPoint = jt.setupFailObject(this.game, this.map);
        for (var i = 0; i < this.failPoint.length; i++) {
            this.failPoint[i].setCategoryContactCallback(TRUCK_CATEGORYBITS, this.failCollision, this);
            this.failPoint[i].setCategoryContactCallback(WHEEL_CATEGORYBITS, this.failCollision, this);
        }
    },
    failCollision: function (body1, body2, fixture1, fixture2, begin) {
        var isBladeClossing = this.bladeup.joint.m_motorSpeed > 0;
        var isFailedByBlade = this.failPoint.indexOf(body1) == 2;
        if (begin) {
            if (!isFailedByBlade || isBladeClossing) { // If hitted to the fail object at the blade then the blade must be clossing.
                body1.destroy();
                this.restart = true;
                this.jellyCamera.cx = (this.player.truck.getSprite().x - (this.jellyCamera.width / 2));
                this.jellyCamera.cy = (this.player.truck.getSprite().y - (this.jellyCamera.height / 2));
                if (jt.game_menu != null)
                    jt.game_menu.score_txt.visible = false;
                if (this.level_Fail == null) {
                    this.level_Fail = new LevelFail(this.game);
                    this.level_Fail.updateFail();
                }
                jt.sfx.stopSound("truck_idle");
                jt.sfx.stopSound("truck_speed");
                jt.sfx.stopSound("truck_slow");
                jt.sfx.playTruckSound("truck_bang1");
            }
        }
    },
    // Flag
    setupFlag: function () {
        this.flag = jt.createFlag(this.game, "flag_head", "flag_mid", "flag_bot", this.map);
        this.flag.head.body.setCategoryContactCallback(TRUCK_CATEGORYBITS, this.flagCollision, this);
        this.flag.middle.body.setCategoryContactCallback(TRUCK_CATEGORYBITS, this.flagCollision, this);
        this.flag.bottom.body.setCategoryContactCallback(TRUCK_CATEGORYBITS, this.flagCollision, this);
    },
    flagCollision: function (body1, body2, fixture1, fixture2, begin) {
        if (!this.win) {
            this.win = true;
            this.jellyCamera.cx = (this.player.truck.getSprite().x - (this.jellyCamera.width / 2));
            this.jellyCamera.cx = (this.player.truck.getSprite().x - (this.jellyCamera.height / 2));
            this.cameraY = (this.player.truck.getSprite().y - (this.cameraHeight / 2));
            this.str = jt.getStar(this.score, this.second);
            this.flag.head.body.applyForce(150, 0);
            this.flag.middle.body.applyForce(150, 0);
            this.flag.bottom.body.applyForce(150, 0);
            this.flag.head.body.sensor = true;
            this.flag.middle.body.sensor = true;
            this.flag.bottom.body.sensor = true;
            this.player.truck.getBox().linearDamping = 20;
            this.player.truck.getBox().angularDampiong = 20;
            this.player.front.getBox().linearDamping = 20;
            this.player.front.getBox().angularDampiong = 20;
            this.player.back.getBox().linearDamping = 20;
            this.player.back.getBox().angularDampiong = 20;
            if (jt.game_menu != null)
                jt.game_menu.disable();
            if (jt.well_done == null)
                jt.well_done = new WellDone(this.game, this.score, this.second, this.str);
        }
    },
    getStar: function () {
        var scr = this.score + this.second;
        var st = 0;
        if (scr > (jt.getLevelPreScore(jt.current_level) * 0.8))
            st = 1;
        if (scr > (jt.getLevelPreScore(jt.current_level) * 0.9))
            st = 2;
        if (scr > (jt.getLevelPreScore(jt.current_level) * 1.0))
            st = 3;
        return st;
    },

    //Restart
    restartBtnClicked: function (button) {

    },

    createRestart: function () {

    },

    // ShutDown
    shutdown: function () {
        this.map.destroy();
        this.phyBody.destroy();
        
        this.game.physics.box2d.clear();
        this.game.world.removeAll();
		
		this.bg.destroy();
		this.scene.art.destroy();
		//this.ground_art.destroy();
		
		for(var i=0;i<this.statBody.length;i++)
			 this.game.physics.box2d.world.DestroyBody(this.statBody[i]);
		this.statBody.clear();
		this.statBody = null;
		
		for(var i=0;i<this.scorePoint.length;i++)
			 this.game.physics.box2d.world.DestroyBody(this.scorePoint[i]);
        this.scorePoint.clear();
		this.scorePoint=null;
		
		for(var i=0;i<this.failPoint.length;i++)
			 this.game.physics.box2d.world.DestroyBody(this.failPoint[i]);
        this.failPoint.clear();
		this.failPoint=null;
		
		for(var i=0;i<this.jellyObj.length;i++)
			this.jellyObj[i].destroy();
        this.jellyObj.clear();
        this.jellyObj = null;
        
        this.scene.grounds[0].destroy();
        
        this.scene=null;
        if(this.joint_ground)
            this.game.physics.box2d.world.DestroyBody(this.joint_ground);
            
		this.player.truck.destroy();
		this.player.truck=null;
		this.player.front.destroy();
		this.player.front=null;
        this.player.back.destroy();
        
        this.flag.head.destroy();
        this.flag.head=null;
        this.flag.middle.destroy();
        this.flag.middle =null;
        this.flag.bottom.destroy();
        this.flag.bottom = null;        
    },
    // End Shutdown

    //Level Specfic object Methods
    handleTruckCollidingbridge: function (body1, body2, fixture1, fixture2, begin) {
        var distance = Phaser.Math.distance(this.player.truck.getBox().x, this.player.truck.getBox().y, this.bridge.x, this.bridge.y);
        if (distance <= 80) {
            this.statBody[9].destroy();
        }
    }
};