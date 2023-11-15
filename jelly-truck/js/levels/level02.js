window.JellyTruck.state.level02 = {
    preload: function () {
        this.game.world.removeAll();
        //background
        this.bg;
        this.light;
        this.scene;
        this.ground_art;
        this.map = this.game.add.tilemap("level_2_map");
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

        this.lift;
        this.lift_sprite;
        this.lift_mask = this.game.add.graphics(0, 0);
        this.lift_active = false;
        this.crusher1;
        this.crusher2;
        this.downArrow;
        this.counter;
    },
    create: function () {
        //score,bonus and win
        this.counter=0;
        this.win = false;
        this.restart = false;
        this.second = 1000;
        this.score = 0;
        this.bonus = 0;
        this.timeTrail = 0;
        this.contact_count = 0;

        //level data
        this.game.mobLevel = "Level 2";
        this.game.levelNumber = "level02";
        this.game.nextlevelNumber = "level03";
        jt.current_level = 2;

        //init Game music and sound
        this.game.sound.stopAll();
        if (jt.sfx)
            jt.sfx.playMusic("evenbg");

        //setup sky background
        this.bg = new GameBg(this.game);

        //setup level scene
        this.scene = jt.setupScene(this.game, this.map, "scene_2", this.map.objects["Ground"][0].x - 113, this.map.objects["Ground"][0].y - 1337, this.jellyCamera.width, this.jellyCamera.height);
      
        //setup joint ground
        this.joint_ground = jt.setupJointGround(this.game, this.map);
       
        // setup static object
        this.statBody = jt.setupStaticObject(this.game, this.map, 50);
       
        //setup Fail
        this.setupFail();
      
        //setup Score
        this.setupScore();
       
        //setup Flag
        this.setupFlag();
       
        //setup player
        this.player = jt.createTruck(this.game, this.scene.truck_x, this.scene.truck_y, this.scene.truck_type, this.phyBody);

        // setup jelly object
        this.jellyObj = jt.setupJellyObj(this.game, this.map, this.phyBody);

        //set ground mask
        this.ground_art = this.game.add.image(this.map.objects["Ground"][0].x - 113, this.map.objects["Ground"][0].y - 1337, 'ground_2');
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
        //      jt.gameController(this.game);
        //  }

        // Level Specfic Object
        this.count = 0;
       
       //setup level specific object
        this.lift = this.jellyObj[3];
        this.lift_sprite = this.game.add.sprite(this.lift.getBox().x, this.lift.getBox().y, "lift_mask");
        this.lift_sprite.anchor.set(0.5, 0.5);
        this.lift_sprite.alpha = 0;
        this.lift.enablePrimatic(this.joint_ground, -10, this.game.physics.box2d.mpx(16.5), 0.205, -1);
        this.crusher1 = this.jellyObj[6];
        this.crusher1.enablePrimatic(this.joint_ground, -120, this.game.physics.box2d.mpx(28), 0, 1);
        this.crusher2 = this.jellyObj[7];
        this.crusher2.enablePrimatic(this.joint_ground, -120, this.game.physics.box2d.mpx(28), 0, 1);

        this.setupExtras();
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
            jt.sfx.loopMusic("evenbg");
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
        this.updateWall();
        this.updateLift();
        this.updateCrusher1();
        this.updateCrusher2();
    },
    render: function () {
        if (this.jellyObj) {
            for (var i = 0; i < this.jellyObj.length; i++)
                this.jellyObj[i].renderJelly();
        }
        this.liftRender();
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
            this.count = 0;
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
        if (begin && !this.restart && this.game.math.distance(this.player.truck.getBox().x, this.player.truck.getBox().y, this.player.front.getBox().x, this.player.front.getBox().y) > 3.9 ||
            this.game.math.distance(this.player.truck.getBox().x, this.player.truck.getBox().y, this.player.back.getBox().x, this.player.back.getBox().y) > 3.9
        ) {
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
        
        if(this.joint_ground)
        this.game.physics.box2d.world.DestroyBody(this.joint_ground);

		this.scene.grounds[0].destroy();
		this.scene=null;
		
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
    updateWall: function () {
        
      
    /*    if(this.counter < 200)
        {
            this.counter++;
            this.jellyObj[0].setGravity(8);
            this.jellyObj[1].setGravity(5);
        }
        else
        {
           this.jellyObj[0].setGravity(1);
           this.jellyObj[1].setGravity(1);
        }   */
    },
    updateLift: function () {

        var lift_car_distance = jt.dist(this.lift.getBox().x, this.lift.getBox().y, this.player.truck.getBox().x, this.player.truck.getBox().y);      
        if (lift_car_distance < 65.7 && this.lift_sprite.alpha == 0) {
            this.liftup = this.game.add.tween(this.lift_sprite).to({
                alpha: 1
            }, 1500, "Linear", true);
            this.liftup.onComplete.add(this.liftMoveUp, this);
            this.game.add.tween(this.downArrow).to({
                alpha: 0
            }, 5000, Phaser.Easing.Linear.None, true);
        } else if (lift_car_distance > 70 && this.lift_sprite.alpha == 1) {
            this.liftdown = this.game.add.tween(this.lift_sprite).to({
                alpha: 0
            }, 200, "Linear", true);
            this.liftdown.onComplete.add(this.liftMoveDown, this);
        }
    },
    liftMoveUp: function () {
        this.lift.joint.m_motorSpeed = 3;
        this.lift.joint.m_maxMotorForce = 900;
        this.lift.joint.m_enableMotor = true;        
    },
    liftMoveDown: function () {
        this.lift.joint.m_motorSpeed = -5;
        this.lift.joint.m_maxMotorForce = 900;
        this.lift.joint.m_enableMotor = true;        
    },
    updateCrusher1: function () {
        this.crusher1.time_trail++;
        if (this.crusher1.time_trail == 1) {

            this.crusher1.joint.SetMotorSpeed(-50);
            this.crusher1.joint.SetMaxMotorForce(1100);
            this.crusher1.joint.EnableMotor(true);
        }
        if (this.crusher1.time_trail == 100) {
            this.crusher1.joint.SetMotorSpeed (50);
            this.crusher1.joint.SetMaxMotorForce(1100);
            this.crusher1.joint.EnableMotor(true);
        }
        if (this.crusher1.time_trail == 200)
            this.crusher1.time_trail = 0;
    },
    updateCrusher2: function () {
        this.crusher2.time_trail++;
        if (this.crusher2.time_trail == 1) {
            this.crusher2.joint.SetMotorSpeed (50);
            this.crusher2.joint.SetMaxMotorForce (1100);
            this.crusher2.joint.EnableMotor (true);
        }
        if (this.crusher2.time_trail == 100) {
            this.crusher2.joint.SetMotorSpeed (-50);
            this.crusher2.joint.SetMaxMotorForce (1100);
            this.crusher2.joint.EnableMotor (true);
        }
        if (this.crusher2.time_trail == 200)
            this.crusher2.time_trail = 0;
    },
    setupExtras: function () {
        this.downArrow = this.game.add.sprite(1500, 1296, "downArrow");
        this.anim = this.downArrow.animations.add('down');
        this.downArrow.animations.play('down', 30, true);
        this._Arrowbody = new Phaser.Physics.Box2D.Body(this.game, null, 1506, 1194, 0);
        this._Arrowbody.setRectangle(200, 300, 0, 0);
        this._Arrowbody.setBodyContactCallback(this.lift.getBox(), this.arrowCollision, this);
    },
    arrowCollision: function (body1, body2, fixture1, fixture2, begin) {
        if (this.downArrow.alpha != 0)
            this.downArrow.alpha -= 0.5;
    },
    liftRender: function () {
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
    }

};