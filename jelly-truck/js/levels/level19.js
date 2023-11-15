window.JellyTruck.state.level19 = {
    preload: function () {
        this.game.world.removeAll();
        //background
        this.bg;
        this.light;
        this.scene;
        this.ground_art;
        this.map = this.game.add.tilemap("level_19_map");
        this.phyBody = this.game.add.tilemap("map");

        //camera
        this.jellyCamera = {
            cx: 0,
            cy: 0,
            focx: -1,
            focy: -1,
            focz: -1,
            mode: 0,
            zoom: 0.7,
            width: 1200,
            height: 1120,
            levelZoom: 0.7,
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

        //Level win and fail
        this.win;
        this.restart;
        this.level_Fail = null;

        //score
        this.timeTrail;
        this.second;
        this.score;
        this.bonus;
        this.score_txt;
        this.spotLight;
        this.contact_count;
        this.truck_status;

        //Level Specific Objects
        this.balloon;
        this.rope;
        this.graphic;
        this.banim;
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
        this.truck_status = 0;
        this.banim = false;

        //level data
        this.game.mobLevel = "Level 19";
        this.game.levelNumber = "level19";
        this.game.nextlevelNumber = "level20";
        jt.current_level = 19;

        //init Game music and sound
        this.game.sound.stopAll();
        if (jt.sfx)
            jt.sfx.playMusic("oddbg");

        //setup sky background
        this.bg = new GameBg(this.game);
        this.bg.setScale(1.5);

        //setup level scene
        this.scene = jt.setupScene(this.game, this.map, "scene_19", this.map.objects["Ground"][0].x - 30, this.map.objects["Ground"][0].y - 1425, this.jellyCamera.width, this.jellyCamera.height);

        //setup joint ground
        this.joint_ground = jt.setupJointGround(this.game, this.map);

        // setup lego object
        this.legoObj = jt.setupLegoObj(this.game, this.map, this.joint_ground);

        //setup Fail
        this.setupFail();

        //setup Score
        this.setupScore();

        //setup Flag
        this.setupFlag();
        this.graphic = this.game.add.graphics(0, 0);

        //setup player
        this.player = jt.createTruck(this.game, this.scene.truck_x, this.scene.truck_y, this.scene.truck_type, this.phyBody);
        this.player.truck.getBox().gravityScale = 2;
        this.player.front.getBox().gravityScale = 2;
        this.player.back.getBox().gravityScale = 2;

        // setup jelly object
        this.jellyObj = jt.setupJellyObj(this.game, this.map, this.phyBody);
        this.jellyObj[0].getBox().static = true;
        this.balloon = this.jellyObj[1];

        //set ground art
        this.ground_art = this.game.add.image(this.map.objects["Ground"][0].x-30, this.map.objects["Ground"][0].y - 1425, 'ground_19');
        this.ground_art.autoCull = true;
        this.ground_art.checkWorldBounds = true;

        //setup game menu
        if (jt.game_menu != null)
            jt.game_menu.killMenu();
        jt.game_menu = new GameMenu(this.game);
        jt.game_menu.enable();

        //setup keyboard
        jt.initInput(this.game);
       // if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
        //    jt.gameController(this.game);
       // }
        if (jt.sfx)
            jt.sfx.playTruckSound("truck_start");

        this.rope = new Phaser.Physics.Box2D.Body(this.game, null, 1022, 1080);
        this.rope.setRectangle(4, 90, 0, 0);
        this.player.truck.enableRevolute(this.rope, 0, 0, false, -10, 10, true);
        this.balloon.enableRevolute(this.rope, 0, 0, false, -5, 5, false);

        this.game.camera.follow(this.balloon.getSprite());
		this.game.camera.scale.setTo(0.8,0.8);
    },
    // Level Pause and Resume
    onGamePause: function () {

    },
    onGameResume: function () {

    },

    //Level Update and Render
    updateCamera: function () {
        this._plx = this.player.truck.getSprite().x;
        this._ply = this.player.truck.getSprite().y;
        this._vlc = Math.abs(this.player.truck.getBox().data.m_linearVelocity.x);
        this.jellyCamera = jt.updateCamera(this.game, this.jellyCamera, this._plx, this._ply, this._vlc, this.win, this.restart, jt.pause);
    },
    update: function () {
        // this.updateCamera();
        if (jt.sfx)
            jt.sfx.loopMusic("oddbg");

        if (!this.win && !this.restart && !jt.pause) {
            this.timeTrail++;
            if (this.timeTrail % 12 == 0) {
                this.second--;
            }

            this.keyEvent();
            this.truckSound();

            if (jt.dist(this.player.truck.getSprite().x, this.player.truck.getSprite().y, this.jellyObj[0].getBox().x, this.jellyObj[0].getBox().y) < 200) {
                this.jellyObj[0].getBox().static = false;

            }

        } else if (this.win) {
            if (this.flag.joint)
                this.game.physics.box2d.world.DestroyJoint(this.flag.joint);

        } else if (this.restart) {
            this.game.physics.box2d.world.DestroyJoint(this.balloon.joint);
            this.game.physics.box2d.world.DestroyJoint(this.player.truck.joint);


        }
        if (this.restart && this.level_Fail && this.level_Fail.space.isDown)
            this.level_Fail.restartBtnClicked();

    },
    render: function () {

        if (this.jellyObj) {
            for (var i = 0; i < this.jellyObj.length; i++)
                this.jellyObj[i].renderJelly();
        }
        this.renderPlayer();
        if (jt.phy_debug) {
            this.game.physics.box2d.debugDraw.joints = true;
            this.game.debug.box2dWorld();
        }
        this.graphic.clear();
        this.graphic.lineStyle(4, 0x000000, 3);
        this.graphic.moveTo(this.balloon.getBox().x, this.balloon.getBox().y);
        this.graphic.lineTo(this.player.truck.getCenter().x, this.player.truck.getCenter().y);
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
            this.gameBalloonAction(this.game, this.balloon.getCenter())
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
            this.failPoint[i].setCategoryContactCallback(ALLTOUCH_CATEGORYBITS, this.failCollision, this);

        }
    },
    failCollision: function (body1, body2, fixture1, fixture2, begin) {
        if (begin) {
            if (!this.banim) {
                this.showBalloonBurstAnimation();
                jt.sfx.playTruckSound("truck_bang1")
                this.banim = true;
            

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
        }
        }
    },

    showBalloonBurstAnimation: function () {
        var balloonburstAnim = this.abcd = this.game.add.sprite(this.balloon.getBox().x, this.balloon.getBox().y - 85, "balloonBurst");
        balloonburstAnim.anchor.set(0.5);
        balloonburstAnim.animations.add("anim");

        balloonburstAnim.events.onAnimationComplete.add(function () {
            balloonburstAnim.destroy();
        }, this);

        balloonburstAnim.animations.play("anim", 30);
        this.balloon.disable();
        this.rope.destroy();
        this.graphic.destroy();
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
        this.map.destroy();
        this.phyBody.destroy();
        
        this.game.physics.box2d.clear();
        this.game.world.removeAll();
		
		this.bg.destroy();
		this.scene.art.destroy();
		this.ground_art.destroy();
		
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
    gameBalloonAction: function (game, body) {

        if (jt.up || jt.mobileup) {
            body.applyForce(0, -300);
        }
        if (!jt.up || !jt.mobileup) {
            body.applyForce(0, -150);
        }
        if (jt.left || jt.mobileleft) {
            body.applyForce(-200, 0);
        }
        if (jt.right || jt.mobileright) {
            body.applyForce(200, 0);
        }
    },


};