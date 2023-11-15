/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
window.JellyTruck.state.level05 = {
    preload: function () {
        this.game.world.removeAll();
        //background
        this.bg;
        this.light;
        this.scene;
        this.ground_art;
        this.map = this.game.add.tilemap("level_5_map");
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
        this.bridge1;
        this.bridge2;
        this.bridge3;
        this.crusher;

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
        this.game.mobLevel = "Level 5";
        this.game.levelNumber = "level05";
        this.game.nextlevelNumber = "level06";
        jt.current_level = 5;

        //init Game music and sound
        this.game.sound.stopAll();
        if (jt.sfx)
            jt.sfx.playMusic("oddbg");
        if (jt.sfx)
            jt.sfx.playMusic("truckidle");

        //setup sky background
        this.bg = new GameBg(this.game);


        //setup joint ground
        this.joint_ground = jt.setupJointGround(this.game, this.map);
       
        //setup Fail
        this.setupFail();
        
        // setup static object
        this.statBody = jt.setupStaticObject(this.game, this.map, 0.5);
       
        //setup Score
        this.setupScore();
       
        //setup Flag
        this.setupFlag();
       
        // setup jelly object
        this.ground_art = this.game.add.image(3130, 899, 'scene_5_2')
        this.jellyObj = jt.setupJellyObj(this.game, this.map, this.phyBody);
       
        //setup Crusher
        this.crusher = jt.setupCrusher(this.game, this.map, this.joint_ground);
       
        //setup Ground        
        /*this.ground_art = this.game.add.image(this.map.objects["Ground"][0].x - 648, this.map.objects["Ground"][0].y - 1112, 'ground_5');
        this.ground_art.autoCull = true;
        this.ground_art.checkWorldBounds = true;*/

        //setup level scene
        this.scene = jt.setupScene(this.game, this.map, "scene_5", this.map.objects["Ground"][0].x - 648, this.map.objects["Ground"][0].y - 1112, this.jellyCamera.width, this.jellyCamera.height);
           
        //setup player
        this.player = jt.createTruck(this.game, this.scene.truck_x, this.scene.truck_y, this.scene.truck_type, this.phyBody);
        
        //setup Camera Object
        this.setupCamera();

        //setup game menu
        if (jt.game_menu != null)
            jt.game_menu.killMenu();
        jt.game_menu = new GameMenu(this.game);
        jt.game_menu.enable();
        
        //setup keyboard
        jt.initInput(this.game);
        //if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
          //  jt.gameController(this.game);
       // }
        //Level Specfic Object
        this.crusher1 = this.jellyObj[0];
        this.crusher1.time_trail = 1;
        this.crusher1.enablePrimatic(this.joint_ground, -100, +160, 40, -40);
        this.crusher2 = this.jellyObj[1];
        this.crusher2.enablePrimatic(this.joint_ground, -100, +160, 40, -40);
        this.crusher3 = this.jellyObj[2];
        this.crusher3.enablePrimatic(this.joint_ground, -100, +160, -40, -40);
        this.crusher2.time_trail = -200;
        this.crusher3.time_trail = 100;

        this.jellyObj[4].setIndex(-50);
        this.jellyObj[5].setIndex(-50);
        this.jellyObj[6].setIndex(-50);
        this.jellyObj[7].setIndex(-50);
        this.mill1 = this.jellyObj[8];
        this.mill1.enableRevolute(this.joint_ground, 300, 15000, true, 0, 0, false);
        this.jellyObj[8].setIndex(-50);
        this.mill_bolt = this.game.add.sprite(this.mill1.getBox().x, this.mill1.getBox().y, 'mill_bolt');
        this.mill_bolt.anchor.set(0.5);
        this.mill_bolt.scale.set(0.28);

        this.mill2 = this.jellyObj[9];
        this.mill2.enableRevolute(this.joint_ground, 300, 15000, true, 0, 0, false);
        this.jellyObj[9].setIndex(-50);
        this.mill_bolt = this.game.add.sprite(this.mill2.getBox().x, this.mill2.getBox().y, 'mill_bolt');
        this.mill_bolt.anchor.set(0.5);
        this.mill_bolt.scale.set(0.28);

        this.crusher2.getSprite().scale.set(1.2);
        if (jt.sfx)
            jt.sfx.playTruckSound("truck_start");

        this.statBody[9].setCollisionMask(8);// The truck should not touch this object.
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
        this.updateCamera();
        if (jt.sfx)
            jt.sfx.loopMusic("oddbg");
        if (!this.win && !this.restart && !jt.pause) {
            this.timeTrail++;
            if (this.timeTrail % 12 == 0) {
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

        this.updateCrusher1();
        this.updateCrusher3();
        this.updateCrusher2();

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
            this.jellyCamera.focx = body1.m_userData.focusX;
            this.jellyCamera.focy = body1.m_userData.focusY
            this.jellyCamera.focz = body1.m_userData.zoom;
        } else if (end) {
            this.jellyCamera.mode = 0;
            this.jellyCamera.focx = -1;
            this.jellyCamera.focy = -1;
            this.jellyCamera.focz =-1;
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
    },
    // End Shutdown
    //Level Specfic object Methods
    updateCrusher1: function () {
        this.crusher1.time_trail++;
        if (this.crusher1.time_trail == 1) {
            this.crusher1.joint.SetMotorSpeed(-20);
            this.crusher1.joint.SetMaxMotorForce(200);
            this.crusher1.joint.EnableMotor(true);
        }
        if (this.crusher1.time_trail == 200) {
            // The value of he force applied has to be calculated according to the angle of the truck.
            // For example when the truck is in an angle 64, or 360 - 64, the area of contact of truck with the crusher 
            // is more, hence the force must be less (the else part below)            
            var da = 64;
            var angle = this.player.truck.getBox().angle;
            angle = angle < 0 ? 360 + angle : angle;
            if(this.IsIn(angle, 360 - da, 360) || this.IsIn(angle, 0, da)||this.IsIn(angle,180-da, 180+da)){
                this.crusher1.joint.SetMotorSpeed(550);
                this.crusher1.joint.SetMaxMotorForce(5000);                
            }else{
                this.crusher1.joint.SetMotorSpeed(400);
                this.crusher1.joint.SetMaxMotorForce(3500);                
            }            
            this.crusher1.joint.EnableMotor(true);
        }
        if (this.crusher1.time_trail == 400)
            this.crusher1.time_trail = 0;
    },    

    updateCrusher2: function () {
        this.crusher2.time_trail++;
        if (this.crusher2.time_trail == 1) {
            this.crusher2.joint.SetMotorSpeed(-10);
            this.crusher2.joint.SetMaxMotorForce(100);
            this.crusher2.joint.EnableMotor(true);
        }
        if (this.crusher2.time_trail == 300) {
            var da = 64;
            var angle = this.player.truck.getBox().angle;
            angle = angle < 0 ? 360 + angle : angle;
            if(this.IsIn(angle, 360 - da, 360) || this.IsIn(angle, 0, da)||this.IsIn(angle,180-da, 180+da)){
                this.crusher2.joint.SetMotorSpeed(550);
                this.crusher2.joint.SetMaxMotorForce(5000);    
            }else{
                this.crusher2.joint.SetMotorSpeed(400);
                this.crusher2.joint.SetMaxMotorForce(3500);
            }            
            this.crusher2.joint.EnableMotor(true);
        }
        if (this.crusher2.time_trail == 400)
            this.crusher2.time_trail = 0;
    },

    updateCrusher3: function () {
        this.crusher3.time_trail++;
        if (this.crusher3.time_trail == 1) {
            this.crusher3.joint.SetMotorSpeed(-10);
            this.crusher3.joint.SetMaxMotorForce(200);
            this.crusher3.joint.EnableMotor(true);
        }
        if (this.crusher3.time_trail == 300) {
            this.crusher3.joint.SetMotorSpeed(550);
            this.crusher3.joint.SetMaxMotorForce(5000);
            this.crusher3.joint.EnableMotor(true);
        }
        if (this.crusher3.time_trail == 350)
            this.crusher3.time_trail = 0;
    },

    IsIn: function(angle, left, right){
        return angle >= left && angle <= right;
    }
};