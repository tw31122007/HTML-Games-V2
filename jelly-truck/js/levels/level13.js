window.JellyTruck.state.level13 = {
    preload: function () {
        this.game.world.removeAll();
        //background
        this.bg;
        this.light;
        this.scene;
        this.ground_art;
        this.map = this.game.add.tilemap("level_13_map");
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
        this.rope;
        this.graphic;
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
        
        //level data
        this.game.mobLevel = "Level 13";
        this.game.levelNumber = "level13";
        this.game.nextlevelNumber = "level14";
        jt.current_level = 13;

        //init Game music and sound
        this.game.sound.stopAll();
        if (jt.sfx)
            jt.sfx.playMusic("oddbg");


        //setup sky background
        this.bg = new GameBg(this.game);
       
        //setup level scene
        this.scene = jt.setupScene(this.game, this.map, "scene_13", this.map.objects["Ground"][0].x - 120, this.map.objects["Ground"][0].y - 430, this.jellyCamera.width, this.jellyCamera.height, 1000);
        this.addIcon();
        
        // setup static object
        this.statBody = jt.setupStaticObject(this.game, this.map, 100);
        
        //setup Fail
        this.setupFail();
        
        //setup Score
        this.setupScore();
        
        //setup Flag
        this.setupFlag();
        this.graphic = this.game.add.graphics(0, 0);
        
        //setup player
        this.player = jt.createTruck(this.game, this.scene.truck_x, this.scene.truck_y, this.scene.truck_type, this.phyBody);
        this.player.truck.getBox().mass = 4;
        this.player.front.getBox().mass = 4;
        this.player.back.getBox().mass = 3;

        //setup joint ground
        this.joint_ground = jt.setupJointGround(this.game, this.map);

        //setup jelly object
        this.jellyObj = jt.setupJellyObj(this.game, this.map, this.phyBody);

        //setup lego object
        this.legoObj = jt.setupLegoObj(this.game, this.map, this.joint_ground);

        //set ground art
        this.ground_art = this.game.add.image(this.map.objects["Ground"][0].x - 120, this.map.objects["Ground"][0].y - 240, 'ground_13');
        this.ground_art.autoCull = true;
        this.ground_art.checkWorldBounds = true;
        
        //setup game menu
        if (jt.game_menu != null)
            jt.game_menu.killMenu();
        jt.game_menu = new GameMenu(this.game);
        jt.game_menu.enable();
        
        //setup keyboard
        jt.initInput(this.game);
        //    if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)){
        //            jt.gameController(this.game);
        //     }
        if (jt.sfx)
            jt.sfx.playTruckSound("truck_start");

        this.circle1 = new Phaser.Physics.Box2D.Body(this.game, null, this.legoObj[1].sprite.x - 140, this.legoObj[1].sprite.y);
        this.circle1.setCircle(5, 0, 0);
        this.game.physics.box2d.revoluteJoint(this.circle1, this.legoObj[1].sprite, 0, 0, -140, 0);
        this.rope1 = new Phaser.Physics.Box2D.Body(this.game, null, 3217, 1415);
        this.rope1.setRectangle(4, 60, 0, 0);
        this.rope1.sensor = true;
        this.game.physics.box2d.revoluteJoint(this.circle1, this.rope1, 0, 0, 0, -38);
        this.legoObj[3].enableRevolute(this.rope1, 0, 0, false, 0, 0, true);

        this.circle2 = new Phaser.Physics.Box2D.Body(this.game, null, this.legoObj[1].sprite.x + 140, this.legoObj[1].sprite.y);
        this.circle2.setCircle(5, 0, 0);
        this.game.physics.box2d.revoluteJoint(this.circle2, this.legoObj[1].sprite, 0, 0, 150, 0);
        this.rope2 = new Phaser.Physics.Box2D.Body(this.game, null, 3533, 1420);
        this.rope2.setRectangle(4, 60, 0, 0);
        this.rope2.sensortrue;
        this.game.physics.box2d.revoluteJoint(this.circle2, this.rope2, 0, 0, 0, -40);
        this.legoObj[2].enableRevolute(this.rope2, 0, 0, false, 0, 0, true);

        this.game.camera.follow(this.player.truck.getSprite());
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
        this.graphic.moveTo(this.circle1.x, this.circle1.y);
        this.graphic.lineTo(this.legoObj[3].sprite.x, this.legoObj[3].sprite.y);
        this.graphic.moveTo(this.circle2.x, this.circle2.y);
        this.graphic.lineTo(this.legoObj[2].sprite.x, this.legoObj[2].sprite.y);
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
            jt.gameAction(this.game, this.player.truck.getBox(), this.player.front.getBox(), this.player.back.getBox(), 6, true);
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
        if (begin) {
            body1.destroy();
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
        this.map.destroy();
        this.phyBody.destroy();
        
        this.game.physics.box2d.clear();
        this.game.world.removeAll();
		
		this.bg.destroy();
		this.scene.art.destroy();
		this.ground_art.destroy();
		
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
        
        for(var i=0;i<this.legoObj.length;i++)
            this.legoObj[i].destroy();

            this.legoObj.clear();
            this.legoObj = null;
		
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
    addIcon: function () {
        this.icon = this.game.add.image(609, 1063, "ballIcon13")
    },
};