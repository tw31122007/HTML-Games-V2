window.JellyTruck.state.level03 = {
    preload: function () {
        this.game.world.removeAll();
        //background
        this.bg;
        this.light;
        this.scene;
        this.ground_art;
        this.map = this.game.add.tilemap("level_3_map");
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
        this.player1;
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
        this.mill;
        this.mill_bolt;
        this.switch;
        this.switch_sprite;
        this.switch_mask = this.game.add.graphics(0, 0);
        this.bridge;
        this.lock_body1;
        this.lock_body2;
        this.on = 0;
        this.truck02_icon;
        this.change = 1;
        this.downArrow;
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
        this.game.mobLevel = "Level 3";
        this.game.levelNumber = "level03";
        this.game.nextlevelNumber = "level04";
        jt.current_level = 3;

        //init Game music and sound
        this.game.sound.stopAll();
        if (jt.sfx)
            jt.sfx.playMusic("oddbg");
        if (jt.sfx)
            jt.sfx.playMusic("truckidle");

        //setup sky background
        this.bg = new GameBg(this.game);
         this.bg.setScale(1.5,1);
        //setup level scene
        this.scene = jt.setupScene(this.game, this.map, "scene_3", this.map.objects["Ground"][0].x - 148, this.map.objects["Ground"][0].y - 792, this.jellyCamera.width, this.jellyCamera.height);

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

        //setup truck icon
        this.truck02_icon = this.game.add.sprite(4778, 1482, 'truck2_icon');
        this.game.physics.box2d.enable(this.truck02_icon);
        this.truck02_icon.body.addRectangle(40, 40, 0, 40);
        this.truck02_icon.body.setCollisionCategory(OTHER_CATEGORYBITS);
        this.truck02_icon.body.setCollisionMask(OTHER_MASKBITS);
        this.truck02_icon.body.setCategoryContactCallback(TRUCK_CATEGORYBITS, this.transformCollision, this);
        // this.truck02_icon.body.setCategoryContactCallback(WHEEL_CATEGORYBITS,this.transformCollision,this);
        this.truck02_icon.body.static = true;
        // setup other level images
        this.setupExtras();

        //setup player
        this.player = jt.createTruck(this.game, this.scene.truck_x, this.scene.truck_y, this.scene.truck_type, this.phyBody);
        this.player1 = jt.createTruck(this.game, 4700, 1500, 2, this.phyBody);
        this.player1.truck.disable();
        this.player1.back.disable();
        this.player1.front.disable();

        // setup jelly object
        this.jellyObj = jt.setupJellyObj(this.game, this.map, this.phyBody);

        //setup Camer Object
        this.setupCamera();

        //set ground mask        
        this.ground_art = this.game.add.image(this.map.objects["Ground"][0].x - 148, this.map.objects["Ground"][0].y - 792, 'ground_3');
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
        //   }

        //Level Specific object
        this.mill = this.jellyObj[4];
        this.mill.enableRevolute(this.joint_ground, 150, 5000, true, -0, 90, false);
        this.mill_bolt = this.game.add.sprite(this.mill.getBox().x, this.mill.getBox().y, 'mill_bolt');
        this.mill_bolt.anchor.set(0.5);
        this.mill_bolt.scale.set(0.28);

        this.jellyObj[5].enableRevolute(this.joint_ground, 0, 0, false, -0.1, 0.1, true);
        this.jellyObj[6].enableRevolute(this.joint_ground, 0, 0, false, -0.1, 0.1, true);
        this.jellyObj[7].enableRevolute(this.joint_ground, 0, 0, false, -0.1, 0.1, true);
        this.jellyObj[8].enableRevolute(this.joint_ground, 0, 0, false, -0.1, 0.1, true);
        this.jellyObj[9].enableRevolute(this.joint_ground, 0, 0, false, -0.1, 0.1, true);
        this.jellyObj[12].getBox().static = true;

        /*this.obj2 =  this.jellyObj[11];
        this.obj3 =  this.jellyObj[12];*/

        this.switch = this.jellyObj[13];
        this.switch_sprite = this.game.add.sprite(this.switch.getBox().x, this.switch.getBox().y, "lift_mask");
        this.switch_sprite.anchor.set(0.5, 0.5);
        this.switch_sprite.alpha = 0;
        this.switch.getBox().setBodyContactCallback(this.player.truck.getBox(), this.bridgeCollision, this);

        this.bridge = this.jellyObj[14];
        this.bridge.getSprite().scale.set(1.5, 1.5);
        this.bridge.enableRevolute(this.joint_ground, 0, 0, false, 0, 0, true); //+(Math.PI / 2) - .06,true);

        this.lock_body1 = new Phaser.Physics.Box2D.Body(this.game, null, 3949, 1633);
        this.lock_body1.setRectangle(192, 128, 0, 0);
        this.lock_body1.static = true;
        this.lock_body1.setCollisionCategory(WHEEL_CATEGORYBITS);
        this.lock_body1.setCollisionMask(WHEEL_MASKBITS);
        this.lock_body1.setCategoryContactCallback(PLATFORM_CATEGORYBITS, this.unlockCollision, this);

        this.lock_body2 = new Phaser.Physics.Box2D.Body(this.game, null, 4471, 1173);
        this.lock_body2.setRectangle(118, 368, 0, 0);
        this.lock_body2.static = true;
        this.lock_body2.setCollisionCategory(WHEEL_CATEGORYBITS);
        this.lock_body2.setCollisionMask(WHEEL_MASKBITS);
        this.lock_body2.setCategoryContactCallback(PLATFORM_CATEGORYBITS, this.lockCollision, this);
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
            if (this.timeTrail % 12 == 0) {
                this.second--;
            }
            if (jt.dist(this.player.truck.getBox().x, this.player.truck.getBox().y, this.jellyObj[12].getBox().x, this.jellyObj[12].getBox().y) < 500)
                this.jellyObj[12].getBox().static = false;

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

        if(this.change == 2){

            this.game.physics.box2d.world.DestroyJoint(this.player.joint1);
            this.game.physics.box2d.world.DestroyJoint(this.player.joint2);
            this.player.back.disable();
            this.player.front.disable();
            this.player.truck.disable();
            // this.player.back.kill();
            //this.player.front.kill();
            //this.player.truck.kill();
            jt.sfx.playTruckSound("truck_change");
            this.player1.truck.enable();
            this.player1.back.enable();
            this.player1.front.enable();            
            this.game.camera.follow(this.player1.truck.getSprite());
            this.change = 3; 
        }


        this.updateBridge();
    },
    render: function () {        
        if (this.jellyObj) {
            for (var i = 0; i < this.jellyObj.length; i++)
                this.jellyObj[i].renderJelly();
        }
        this.switchRender();
        this.renderPlayer();
        if (jt.phy_debug) {
            this.game.physics.box2d.debugDraw.joints = true;
            this.game.debug.box2dWorld();
        }
    },
    renderPlayer: function () {
        if(this.change === 1){
            this.player.truck.renderJelly();
            this.player.front.renderJelly();
            this.player.back.renderJelly();
        }
        else {
            this.player1.truck.renderJelly();
            this.player1.front.renderJelly();
            this.player1.back.renderJelly();
        }                
    },
    //Keyboard Event
    keyEvent: function () {
        jt.resetInput();
        if (!jt.pause && !this.restart && !this.win) {
            jt.updateinput();
            
            if(this.change === 1){
                jt.gameAction(this.game, this.player.truck.getBox(), this.player.front.getBox(), this.player.back.getBox(), 1, true);
            }
            else{
                jt.gameAction(this.game, this.player1.truck.getBox(), this.player1.front.getBox(), this.player1.back.getBox(), 5, true);
            }            
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
    },
    // End Shutdown

    //Level Specfic object Methods
    updateBridge: function () {
        if (jt.dist(this.player.truck.getBox().x, this.player.truck.getBox().y, this.switch.getBox().x, this.switch.getBox().y) < 50) {
            this.bridge.joint.m_lowerAngle = -90;
            this.lifton = this.game.add.tween(this.switch_sprite).to({
                alpha: 1
            }, 200, "Linear", true);
            if (this.downArrow.alpha === 1)
                this.game.add.tween(this.downArrow).to({
                    alpha: 0
                }, 500, "Linear", true);
            this.lifton.onComplete.add(this.bridgeMoveUp, this);
        } else if (jt.dist(this.player.truck.getBox().x, this.player.truck.getBox().y, this.switch.getBox().x, this.switch.getBox().y) > 50) {
            this.bridge.joint.m_lowerAngle = 90;
            this.liftoff = this.game.add.tween(this.switch_sprite).to({
                alpha: 0
            }, 200, "Linear", true);
            this.liftoff.onComplete.add(this.bridgeMoveDown, this);

        }

    },
    bridgeMoveUp: function () {
        this.bridge.joint.m_lowerAngle = -90;
        this.bridge.joint.m_motorSpeed = -0.3;
        this.bridge.joint.m_maxMotorTorque = 1000;
        this.bridge.joint.m_enableMotor = true;
    },
    bridgeMoveDown: function () {
        this.bridge.joint.m_lowerAngle = 90;
        this.bridge.joint.m_motorSpeed = 0.3;
        this.bridge.joint.m_maxMotorTorque = 1000;
        this.bridge.joint.m_enableMotor = true;

    },
    switchRender: function () {          
        this.switch_sprite.x = this.switch.getBox().x;
        this.switch_sprite.y = this.switch.getBox().y;
        this.switch_mask.clear();
        this.switch_mask.beginFill(0xffffff);
        for (var j = 0; j < this.switch.getBodies().length; j++) {
            if (j == 0)
                this.switch_mask.moveTo(this.switch.getBodies()[j].getBody().x, this.switch.getBodies()[j].getBody().y);
            else
                this.switch_mask.lineTo(this.switch.getBodies()[j].getBody().x, this.switch.getBodies()[j].getBody().y);
            this.switch_sprite.angle = this.switch.getBodies()[j].getBody().angle;
        }
        this.switch_sprite.mask = this.switch_mask;
        
    },
    setupExtras: function () {
        this.downArrow = this.game.add.sprite(3918, 1467, "downArrow");
        this.anim = this.downArrow.animations.add('down');
        this.downArrow.animations.play('down', 30, true);
    },
    transformCollision: function (body1, body2, fixture1, fixture2, begin) {
       
            this.truck02_icon.destroy();
            body1.destroy();
            this.change = 2;      
        
    },
    bridgeCollision: function (body1, body2, fixture1, fixture2, begin) {
        if (begin)
            this.on = 1;
    },
    lockCollision: function (body1, body2, fixture1, fixture2, begin) {
        //    if(begin)
        this.bridge.joint.m_enableMotor = false;
    },
    unlockCollision: function (body1, body2, fixture1, fixture2, begin) {
        if (jt.dist(this.player.truck.getBox().x, this.player.truck.getBox().y, this.switch.getBox().x, this.switch.getBox().y) < 40)
            this.bridge.joint.m_enableMotor = false;
        else
            this.bridge.joint.m_enableMotor = true;
    }

};