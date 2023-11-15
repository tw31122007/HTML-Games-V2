/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
window.JellyTruck.state.level04 = {
    preload: function () {
        this.game.world.removeAll();
        //background
        this.bg;
        this.light;
        this.scene;
        this.ground_art;
        this.map = this.game.add.tilemap("level_4_map");
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
        this.level_Fail = null;

        //score
        this.timeTrail;
        this.second;
        this.score;
        this.bonus;
        this.score_txt;
        this.spotLight;
        this.contact_count;

        //Level Specific Objects
        this.crusher1;
        this.crusher2;
        this.crusher3;
        this.crusher;
        this.mill1;
        this.mill2;

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
        this.game.mobLevel = "Level 4";
        this.game.levelNumber = "level04";
        this.game.nextlevelNumber = "level05";
        jt.current_level = 4;
        //this.game.forceSingleUpdate = false;

        //init Game music and sound
        this.game.sound.stopAll();
        if (jt.sfx)
            jt.sfx.playMusic("evenbg");

        //setup sky background
        this.bg = new GameBg(this.game);

        //setup level scene
        this.scene = jt.setupScene(this.game, this.map, "scene_4", this.map.objects["Ground"][0].x - 10, this.map.objects["Ground"][0].y - 1118, this.jellyCamera.width, this.jellyCamera.height);

        //setup joint ground
        this.joint_ground = jt.setupJointGround(this.game, this.map);

        //setup Fail
        this.setupFail();

        // setup static object
        this.statBody = jt.setupStaticObject(this.game, this.map, 50);

        //setup Score
        this.setupScore();

        //setup Flag
        this.setupFlag();

        //setup player
        this.player = jt.createTruck(this.game, this.scene.truck_x, this.scene.truck_y, this.scene.truck_type, this.phyBody);

        // setup jelly object
        this.jellyObj = jt.setupJellyObj(this.game, this.map, this.phyBody);

        //setup Camer Object
        this.setupCamera();

        //setup Crusher
        this.crusher = jt.setupCrusher(this.game, this.map, this.joint_ground);

        //set ground art        
        this.ground_art = this.game.add.image(this.map.objects["Ground"][0].x - 5, this.map.objects["Ground"][0].y - 1110, 'ground_4');
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
        //Level Specfic Object
        this.bridge1 = this.jellyObj[0];
        this.bridge1.getSprite().scale.set(1.5, 1.5);
        this.bridge1.getBody(0).static = true;
        this.bridge1.getBody(1).static = true;
        this.bridge1.getBody(29).static = true;
        this.bridge1.getBody(30).static = true;
        this.bridge1.getBody(14).static = true;
        this.bridge1.getBody(15).static = true;
        this.bridge1.getBody(16).static = true;

        this.bridge2 = this.jellyObj[1];
        this.bridge2.getSprite().scale.set(1.5, 1.5);
        this.bridge2.getBody(0).static = true;
        this.bridge2.getBody(1).static = true;
        this.bridge2.getBody(8).static = true;
        this.bridge2.getBody(9).static = true;
        this.bridge2.getBody(10).static = true;
        this.bridge2.getBody(17).static = true;
        this.bridge2.getBody(18).static = true;
        this.bridge2.getBody(19).static = true;


        this.bridge3 = this.jellyObj[2];
        this.bridge3.getSprite().scale.set(1.8, 1.8);
        this.bridge3.getBody(0).static = true;
        this.bridge3.getBody(1).static = true;
        this.bridge3.getBody(29).static = true;
        this.bridge3.getBody(30).static = true;
        this.bridge3.getBody(14).static = true;
        this.bridge3.getBody(15).static = true;
        this.bridge3.getBody(16).static = true;

        this.jellyObj[3].enableRevolute(this.joint_ground, 0, 0, false, -0.1, 0.1, true);
        this.jellyObj[4].enableRevolute(this.joint_ground, 0, 0, false, -0.1, 0.1, true);
        this.jellyObj[5].enableRevolute(this.joint_ground, 0, 0, false, -0.1, 0.1, true);

        this.jellyObj[6].getBox().static = true;
        if (jt.sfx)
            jt.sfx.playTruckSound("truck_start");
        
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
        //this.updateCamera();
        if (jt.sfx)
            jt.sfx.loopMusic("evenbg");
        if (!this.win && !this.restart && !jt.pause) {
            this.timeTrail++;
            if (this.timeTrail % 12 == 0) {
                this.second--;
            }
            if (jt.dist(this.player.truck.getBox().x, this.player.truck.getBox().y, this.jellyObj[6].getBox().x, this.jellyObj[6].getBox().y) < 200)
                this.jellyObj[6].getBox().static = false;

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
    },
    renderPlayer: function () {
        this.player.truck.renderJelly();
        this.player.front.renderJelly();
        this.player.back.renderJelly();
    },
    //Keyboard Event
    keyEvent: function () {
        jt.resetInput();
        if (!jt.pause) {
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
    //Camera Object
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
            this.jellyCamera.focz= body1.m_userData.zoom;
        } else if (end) {
            this.jellyCamera.mode = 0;
            this.jellyCamera.focx = -1;
            this.jellyCamera.focy = -1;
            this.jellyCamera.focz = -1;
        }
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
            //alert(this.second);
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
        //this.game.forceSingleUpdate = true;
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
        
        for(var i=0;i<this.camerFocus.length;i++)
        this.game.physics.box2d.world.DestroyBody(this.camerFocus[i]);

        this.camerFocus.clear();
        this.camerFocus = null;

        for(var i=0;i<this.crusher.length;i++)
        this.game.physics.box2d.world.DestroyBody( this.crusher[i]);

        this.crusher.clear();
        this.crusher = null;
		
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


    //Level Specfic object Methods

};