/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
window.JellyTruck.state.level07 = {
    preload: function () {
        //background
        this.bg;
        this.light;
        this.scene;
        this.ground_art;
        this.map = this.game.add.tilemap("level_7_map");
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
            scale: 0.9
        };

        //player and flag
        this.player;
        this.flag;

        //objects
        this.statBody;
        this.scorePoint;
        this.failPoint;
        this.jellyObj;
        this.legoObj;

        //Level win and fail
        this.win;
        this.restart;
    
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
        this.crusher1;
        this.crusher2;
        this.bladeup;
        this.bladedown;
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
        this.truck_status = 0;

        //level data
        this.game.mobLevel = "Level 7";
        this.game.levelNumber = "level07";
        this.game.nextlevelNumber = "level08";
        jt.current_level = 7;

        //init Game music and sound
        this.game.sound.stopAll();
        if (jt.sfx)
            jt.sfx.playMusic("oddbg");


        //setup sky background
        this.bg = new GameBg(this.game);

        //setup level scene
        this.scene = jt.setupScene(this.game, this.map, "scene_7", this.map.objects["Ground"][0].x - 102, this.map.objects["Ground"][0].y - 275, this.jellyCamera.width, this.jellyCamera.height, 15000);
        
        // setup static object
        this.statBody = jt.setupStaticObject(this.game, this.map, 1000);
        
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
        this.player.truck.setIndex(-50);
        this.player.back.setIndex(-50);
        this.player.front.setIndex(-50);

        // setup jelly object
        this.jellyObj = jt.setupJellyObj(this.game, this.map, this.phyBody);

        // setup lego object
        this.legoObj = jt.setupLegoObj(this.game, this.map, this.joint_ground);

        //setup Crusher
        this.crusher = jt.setupCrusher(this.game, this.map, this.joint_ground);

        //setup level specific object
        this.crusher1 = this.jellyObj[0];
        this.crusher1.enablePrimatic(this.joint_ground, -160, this.game.physics.box2d.mpx(0), 0, -1);
        this.crusher2 = this.jellyObj[1];
        this.crusher2.enablePrimatic(this.joint_ground, -160, this.game.physics.box2d.mpx(0), 0, -1);
        this.bladeup = this.jellyObj[2];
        this.bladeup.enablePrimatic(this.joint_ground, -100, this.game.physics.box2d.mpx(0), 0, 1);
        this.bladeup.setIndex(-50);
        this.bladedown = this.jellyObj[3];
        this.bladedown.enablePrimatic(this.joint_ground, -75, this.game.physics.box2d.mpx(1), 0, -1);

        this.pusher = this.jellyObj[4];
        this.pusher.enablePrimatic(this.joint_ground, 10, this.game.physics.box2d.mpx(5), 0.1, -1);
        this.pusher_sprite = this.game.add.sprite(this.pusher.getBox().x, this.pusher.getBox().y, "lift_mask");
        this.pusher_sprite.anchor.set(0.5, 0.5);
        this.pusher_sprite.alpha = 0;

        this.mill = this.jellyObj[5];
        this.mill.enableRevolute(this.joint_ground, 150, 5000, true, -0, 90, false);

        //setup Camera Object
        this.setupCamera();

        //set ground art
        this.ground_art = this.game.add.image(this.map.objects["Ground"][0].x - 102, this.map.objects["Ground"][0].y - 10, 'ground_7');
        this.ground_art.autoCull = true;
        this.ground_art.checkWorldBounds = true;

        //setup game menu
        if (jt.game_menu != null)
            jt.game_menu.killMenu();
        jt.game_menu = new GameMenu(this.game);
        jt.game_menu.enable();

        //setup keyboard
        jt.initInput(this.game);
        // if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)){
        //        jt.gameController(this.game);
        //  }
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
        this.updateCrusher1();
        this.updateCrusher2();
        this.updateBladeUp();
        this.updateBladeDown();
        this.updatePusher();
    },
    render: function () {
        if (this.jellyObj) {
            for (var i = 0; i < this.jellyObj.length; i++)
                this.jellyObj[i].renderJelly();
        }
        this.pusherRender();
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
            this.jellyCamera.focz = body1.m_userData.zoom;
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
    failCollision: function (body1, body2, fixture1, fixture2, begin, end) {
        var isBladeClossing = this.bladeup.joint.m_motorSpeed > 0;
        if (begin && isBladeClossing) {
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
            jt.sfx.playTruckSound("truck_bang1");
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
        
        for(var i=0;i<this.camerFocus.length;i++)
        this.game.physics.box2d.world.DestroyBody(this.camerFocus[i]);

        this.camerFocus.clear();
        this.camerFocus = null;

        for(var i=0;i<this.crusher.length;i++)
        this.game.physics.box2d.world.DestroyBody( this.crusher[i]);

        this.crusher.clear();
        this.crusher = null;

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
    updateCrusher1: function () {
        this.crusher1.time_trail++;
        if (this.crusher1.time_trail == 1) {
            this.crusher1.joint.SetMotorSpeed(-10);
            this.crusher1.joint.SetMaxMotorForce(500);
            this.crusher1.joint.EnableMotor(true);
        }
        if (this.crusher1.time_trail == 210) {
            this.crusher1.joint.SetMotorSpeed (4000);
            this.crusher1.joint.SetMaxMotorForce (5000);
            this.crusher1.joint.EnableMotor(true);
        }
        if (this.crusher1.time_trail == 420)
            this.crusher1.time_trail = 0;
    },
    updateCrusher2: function () {
        this.crusher2.time_trail++;
        if (this.crusher2.time_trail == 1) {
            this.crusher2.joint.SetMotorSpeed(4000);
            this.crusher2.joint.SetMaxMotorForce(5000);
            this.crusher2.joint.EnableMotor(true);

        }
        if (this.crusher2.time_trail == 210) {
            this.crusher2.joint.SetMotorSpeed(-10);
            this.crusher2.joint.SetMaxMotorForce(500);
            this.crusher2.joint.EnableMotor(true);
        }
        if (this.crusher2.time_trail == 420)
            this.crusher2.time_trail = 0;
    },

    updateBladeUp: function () {
        this.bladeup.time_trail++;
        if (this.bladeup.time_trail == 1) {

            this.bladeup.joint.m_motorSpeed = 5;
            this.bladeup.joint.m_maxMotorForce = 5000;
            this.bladeup.joint.EnableMotor(true);
        }
        if (this.bladeup.time_trail == 100) {
            this.bladeup.joint.m_motorSpeed = -20;
            this.bladeup.joint.m_maxMotorForce = 1000;
            this.bladeup.joint.EnableMotor(true);
        }
        if (this.bladeup.time_trail == 600)
            this.bladeup.time_trail = 0;
    },
    updateBladeDown: function () {
        this.bladedown.time_trail++;
        if (this.bladedown.time_trail == 1) {
            this.bladedown.joint.m_motorSpeed = 5;
            this.bladedown.joint.m_maxMotorForce = 4500;
            this.bladedown.joint.EnableMotor(true);
        }
        if (this.bladedown.time_trail == 100) {
            this.bladedown.joint.m_motorSpeed = -20;
            this.bladedown.joint.m_maxMotorForce = 1000;
            this.bladedown.joint.EnableMotor(true);
        }
        if (this.bladedown.time_trail == 600)
            this.bladedown.time_trail = 0;
    },


    updatePusher: function () {

        if (jt.dist(this.pusher.getBox().x, this.pusher.getBox().y, this.player.truck.getBox().x, this.player.truck.getBox().y) < 75.7 && this.pusher_sprite.alpha == 0) {
            this.pushup = this.game.add.tween(this.pusher_sprite).to({
                alpha: 1
            }, 500, "Linear", true);
            this.pushup.onComplete.add(this.pusherMoveUp, this);
        } else if (jt.dist(this.pusher.getBox().x, this.pusher.getBox().y, this.player.truck.getBox().x, this.player.truck.getBox().y) > 70 && this.pusher_sprite.alpha == 1) {
            this.pushdown = this.game.add.tween(this.pusher_sprite).to({
                alpha: 0
            }, 500, "Linear", true);
            this.pushdown.onComplete.add(this.pusherMoveDown, this);
        }
    },
    pusherMoveUp: function () {
        this.pusher.joint.m_motorSpeed = 600;
        this.pusher.joint.m_maxMotorForce = 5000;
        this.pusher.joint.m_enableMotor = true;
    },
    pusherMoveDown: function () {
        this.pusher.joint.m_motorSpeed = 10;
        this.pusher.joint.m_maxMotorForce = 100;
        this.pusher.joint.m_enableMotor = true;
    },
    pusherRender: function () {
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
    }
};