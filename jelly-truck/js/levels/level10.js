/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
window.JellyTruck.state.level10 = {
    preload: function () {
        //background
        this.bg;
        this.light;
        this.scene;
        this.ground_art;
        this.map = this.game.add.tilemap("level_10_map");
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
        this.camerFocus;

        //Level win
        this.win;
        this.restart;
        this.space;
        this.level_Fail

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
        this.downArrow1;
        this.downArrow2;
        this.hammerLeft;
        this.hammerRight;
        this.jointHammerLeft;
        this.jointHammerRight;
        this.nextHamer;
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
        this.game.mobLevel = "Level 10";
        this.game.levelNumber = "level10";
        this.game.nextlevelNumber = "level11";
        jt.current_level = 10;

        this.nextHamer = 1;

        //init Game music and sound
        this.game.sound.stopAll();

        if (jt.sfx)
            jt.sfx.playMusic("evenbg");
        if (jt.sfx)
            jt.sfx.playMusic("truckidle");

        //setup sky background
        this.bg = new GameBg(this.game);
        
        //setup level scene
        this.scene = jt.setupScene(this.game, this.map, "scene_10", 4, 0, this.jellyCamera.width, this.jellyCamera.height);
        
        // setup static object
        this.statBody = jt.setupStaticObject(this.game, this.map);
        
        //setup joint ground
        this.joint_ground = jt.setupJointGround(this.game, this.map);
        
        //setup Fail
        this.setupFail();
        
        //setup Score
        this.setupScore();
        
        //setup Flag
        this.setupFlag();
        
        //setup player
        this.player = jt.createTruck(this.game, this.scene.truck_x, this.scene.truck_y, this.scene.truck_type, this.phyBody);
        
        //setup Camera Object
        this.setupCamera();
       
        // setup jelly object
        this.jellyObj = jt.setupJellyObj(this.game, this.map, this.phyBody);
        
        //set ground art
        /*this.ground_art = this.game.add.image(4, 0, 'ground_10');
        this.ground_art.autoCull = true;
        this.ground_art.checkWorldBounds = true;*/
        
        //setup game menu
        if (jt.game_menu != null)
            jt.game_menu.killMenu();
        jt.game_menu = new GameMenu(this.game);
        jt.game_menu.enable();
        
        //setup keyboard
        jt.initInput(this.game);
       // if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
        //    jt.gameController(this.game);
      //  }
        if (jt.sfx)
            jt.sfx.playTruckSound("truck_start");

        this.downArrow1 = this.game.add.sprite(1683, 1622.33, "downArrow");
        this.anim = this.downArrow1.animations.add('down');
        this.downArrow1.animations.play('down', 30, true);

        this.downArrow2 = this.game.add.sprite(3250, 857, "downArrow");
        this.anim = this.downArrow2.animations.add('down');
        this.downArrow2.animations.play('down', 30, true);

        this.hammerLeft = this.jellyObj[1];
        this.hammerRight = this.jellyObj[0];
        this.hammerLeft.enableRevolute(this.joint_ground, 360, 34000, true);
        this.hammerRight.enableRevolute(this.joint_ground, -360, 27000, true);

        this.statBody[0].setCollisionCategory(7);
        this.statBody[0].setCollisionMask(247);
        this.statBody[1].setCollisionCategory(7);
        this.statBody[1].setCollisionMask(247);

        // Adding Lift
        this.lift = this.jellyObj[2];
        this.lift_sprite = this.game.add.image(this.lift.getBox().x, this.lift.getBox().y, "lift_mask");
        this.lift_sprite.anchor.set(0.5, 0.5);
        this.lift_sprite.alpha = 0;
        this.lift.enablePrimatic(this.joint_ground, 0, this.game.physics.box2d.mpx(14.47), -0.08, -1);

        this.statBody[2].setCollisionMask(249);
        this.game.camera.follow(this.player.truck.getSprite());
        this.game.physics.box2d.velocityIterations = 7.5;
    },
    // Level Pause and Resume
    onGamePause: function () {

    },
    onGameResume: function () {

    },
    setupCamera: function () {
        this.camerFocus = jt.setupCameraObject(this.game, this.map);
        for (var i = 0; i < this.camerFocus.length; i++) {
            this.camerFocus[i].setBodyContactCallback(this.player.truck.getBox(), this.camerafocusCollision, this);
        }
    },
    camerafocusCollision: function (body1, body2, fixture1, fixture2, begin, end) {
        if (begin) {
            this.cameraMode = 1;
            this.focusX = body1.m_userData.focusX;
            this.focusY = body1.m_userData.focusY
            
        } else if (end) {
            this.cameraMode = 0;
            this.focusX = -1;
            this.focusY = -1;
        }
    },
    //Level Update and Render
    updateCamera: function () {
        this._plx = this.player.truck.getSprite().x;
        this._ply = this.player.truck.getSprite().y;
        this._vlc = Math.abs(this.player.truck.getBox().data.m_linearVelocity.x);
        this.jellyCamera = jt.updateCamera(this.game, this.jellyCamera, this._plx, this._ply, this._vlc, this.win, this.restart, jt.pause);
    },
    updateForHammers: function () {
        if (this.nextHamer == 1) {
            // Check the distance from first arrow.
            var d = Phaser.Math.distance(this.player.truck.getBox().x, this.player.truck.getBox().y, this.downArrow1.x, this.downArrow1.y);
            if (d <= 67) {
                this.nextHamer = 2;
                this.hammerRight.joint.SetMotorSpeed(-360);
            }
        } else if (this.nextHamer == 2) {
            // Check the distance from first arrow.
            var d = Phaser.Math.distance(this.player.truck.getBox().x, this.player.truck.getBox().y, this.downArrow2.x, this.downArrow2.y);
            if (d <= 60) {
                this.nextHamer = 3;
                this.hammerLeft.joint.EnableMotor(false);
                this.hammerLeft.joint.SetMotorSpeed(360);
                this.hammerLeft.joint.EnableMotor(true);
                this.statBody[3].sensor = this.statBody[4].sensor = true;
            }
        }
    },
    update: function () {
        this.updateCamera();
        if (jt.sfx)
            jt.sfx.loopMusic("evenbg");
        if (!this.win && !this.restart && !jt.pause) {
            this.timeTrail++;
            if (this.timeTrail % 10 == 0) {
                this.second--;
            }
            this.keyEvent();
            this.truckSound();
            this.updateForHammers();
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
    },
    updateLift: function () {
        if (jt.dist(this.lift.getBox().x, this.lift.getBox().y, this.player.truck.getBox().x, this.player.truck.getBox().y) < 65.7 && this.lift_sprite.alpha == 0) {
            this.liftup = this.game.add.tween(this.lift_sprite).to({
                alpha: 1
            }, 1500, "Linear", true);
            this.liftup.onComplete.add(this.liftMoveUp, this);
        } else if (jt.dist(this.lift.getBox().x, this.lift.getBox().y, this.player.truck.getBox().x, this.player.truck.getBox().y) > 85 && this.lift_sprite.alpha == 1) {
            this.liftdown = this.game.add.tween(this.lift_sprite).to({
                alpha: 0
            }, 200, "Linear", true);
            this.liftdown.onComplete.add(this.liftMoveDown, this);
        }
    },
    liftMoveUp: function () {
        this.lift.joint.m_motorSpeed = 5;
        this.lift.joint.m_maxMotorForce = 900;
        this.lift.joint.m_enableMotor = true;
    },
    liftMoveDown: function () {
        this.lift.joint.m_motorSpeed = -5;
        this.lift.joint.m_maxMotorForce = 900;
        this.lift.joint.m_enableMotor = true;
    },
    render: function () {
        if (this.jellyObj) {
            for (var i = 0; i < this.jellyObj.length; i++)
                this.jellyObj[i].renderJelly();
        }
        this.renderPlayer();
        this.renderLift();
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

            // Disable the roof after the first hammer hit.
            if (body1 == this.scorePoint[0]) {
                this.statBody[6].sensor = true;
            }

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
        if (begin) {
            body1.destroy();
			this.game.camera.unfollow();
            this.restart = true;
            this.jellyCamera.cx = (this.player.truck.getSprite().x - (this.jellyCamera.width / 2));
            this.jellyCamera.cy = (this.player.truck.getSprite().y - (this.jellyCamera.height / 2));
            if (jt.game_menu != null)
                jt.game_menu.score_txt.visible = false;
            if (jt.game_fail == null) {
                jt.game_fail = new LevelFail(this.game);
                jt.game_fail.updateFail();
            }
            jt.sfx.stopSound("truck_idle");
            jt.sfx.stopSound("truck_speed");
            jt.sfx.stopSound("truck_slow");
            jt.sfx.playTruckSound("truck_bang1")
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
    // ShutDown
    shutdown: function () {
        this.game.physics.box2d.velocityIterations = 8.5;
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
        
        for(var i=0;i<this.camerFocus.length;i++)
        this.game.physics.box2d.world.DestroyBody(this.camerFocus[i]);

        this.camerFocus.clear();
        this.camerFocus = null;

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
    }

    // End Shutdown
};