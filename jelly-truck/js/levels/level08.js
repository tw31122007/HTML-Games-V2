/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
window.JellyTruck.state.level08 = {
    preload: function () {
        //background
        this.bg;
        this.light;
        this.scene;
        this.ground_art;
        this.map = this.game.add.tilemap("level_8_map");
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
            scale: 0.5
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

        // Level specific
        this.lift;
        this.lift_sprite;
        this.lift_mask = this.game.add.graphics(0, 0);

        this.player2;
        this.player3;

        this.door3;
        this.door2;

        this.truckIcon2;
        this.truckIcon2Tween;
        this.truckIcon3;
        this.truckIcon3Tween;

        this.hitBodyPlayer2;
        this.hitBodyPlayer3;
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
        this.game.mobLevel = "Level 8";
        this.game.levelNumber = "level08";
        this.game.nextlevelNumber = "level09";
        jt.current_level = 8;

        //init Game music and sound
        this.game.sound.stopAll();

        if (jt.sfx)
            jt.sfx.playMusic("evenbg");
       
        //setup sky background
        this.bg = new GameBg(this.game);
        this.bg.setScale(2,1);
        
        //setup level scene        
        this.scene = jt.setupScene(this.game, this.map, "scene_8", this.map.objects["Ground"][0].x, this.map.objects["Ground"][0].y, this.jellyCamera.width, this.jellyCamera.height, 15000);
        
        //setup joint ground
        this.joint_ground = jt.setupJointGround(this.game, this.map);
       
        //setup Fail
        this.setupFail();
        
        // setup static object
        this.statBody = jt.setupStaticObject(this.game, this.map, 1000);
        
        //setup Score
        this.setupScore();
        
        //setup Flag
        this.setupFlag();
        
        //setup player
        this.player = this.player1 = jt.createTruck(this.game, this.scene.truck_x, this.scene.truck_y, this.scene.truck_type, this.phyBody);

        this.player2 = jt.createTruck(this.game, 2786, 1162, 2, this.phyBody);
        this.player2.truck.disable();
        this.player2.back.disable();
        this.player2.front.disable();

        this.player3 = jt.createTruck(this.game, 2426, 1162, 3, this.phyBody); // make 2 to 3    
        this.player3.truck.disable();
        this.player3.back.disable();
        this.player3.front.disable();

        //setup Camera Object
        this.setupCamera();

        // setup jelly object
        this.jellyObj = jt.setupJellyObj(this.game, this.map, this.phyBody);
        this.linkAllBall4();

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

        // Adding Lift
        this.lift = this.jellyObj[6];
        this.lift_sprite = this.game.add.sprite(this.lift.getBox().x, this.lift.getBox().y, "lift_mask");
        this.lift_sprite.anchor.set(0.5, 0.5);
        this.lift_sprite.alpha = 0;
        this.lift.enablePrimatic(this.joint_ground, 0, this.game.physics.box2d.mpx(18.5), -0.07, -1);

        this.door3 = this.game.add.sprite(3202.67, 1491.25, "level_8_door_1");
        this.door3.scale.setTo(0.5, 0.5);
        this.game.physics.box2d.enable(this.door3);
        this.door3.body.setRectangle(this.door3.width / 2, this.door3.height, -this.door3.width / 4, 0, 0);
        this.door3.body.static = true;
        this.door3.body.setCollisionCategory(TRUCK_CATEGORYBITS);

        this.door2 = this.game.add.sprite(3260.17, 1491.25, "level_8_door_2");
        this.door2.scale.setTo(0.5, 0.5);
        this.game.physics.box2d.enable(this.door2);
        this.door2.body.setRectangle(this.door2.width / 2, this.door2.height, -this.door2.width / 4, 0, 0);
        this.door2.body.static = true;
        this.door2.body.setCollisionCategory(TRUCK_CATEGORYBITS);

        this.door3.body.y += this.door3.height / 2;
        this.door2.body.y += this.door2.height / 2;

        this.truckIcon2 = this.game.add.image(2806.00, 1179.33, "truck2_icon");
        this.truckIcon2.anchor.setTo(0.5, 0.5);
        this.truckIcon3 = this.game.add.image(2445.33, 1179.33, "truck3_icon");
        this.truckIcon3.anchor.setTo(0.5, 0.5);
        this.truckIcon2Tween = this.game.add.tween(this.truckIcon2).to({
            scaleX: 1.3,
            scaleY: 1.3
        }, 1200, "Linear", true, 0, -1);
        this.truckIcon2Tween.yoyo(true, 0);

        this.truckIcon3Tween = this.game.add.tween(this.truckIcon3).to({
            scaleX: 1.3,
            scaleY: 1.3
        }, 1200, "Linear", true, 0, -1);
        this.truckIcon3Tween.yoyo(true, 0);

        this.hitBodyPlayer2 = this.scorePoint[1];
        this.hitBodyPlayer3 = this.scorePoint[0];

        if (jt.sfx)
            jt.sfx.playMusic("truck_start");
    },
    // Level Pause and Resume
    onGamePause: function () {

    },
    onGameResume: function () {

    },
    //Level Update and Render
    update: function () {
        this.updateCamera();
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
        this.updateLift();
    },
    linkAllBall4: function () {
      //  var groundBodies = this.joint_ground;
      /*  this.jellyObj.forEach((function (element) {
            if (element.getSprite().key === "gum_5") { // Ball4 has texture 'gum_5'       
            // element.enableRevolute(this.joint_ground, 0, 0, false, -0.1, 0.1,false);         
            this.game.physics.box2d.distanceJoint(this.joint_ground, element.getBox());
             
            }
        }.bind(this)));*/
        var groundBodies = [];
        var joints = [];
        this.jellyObj.forEach((function (element) {
            if (element.getSprite().key === "gum_5") { // Ball4 has texture 'gum_5'                
                var _groundBody = new Phaser.Physics.Box2D.Body(this.game, null, element.getBox().x, element.getBox().y, 0);
                _groundBody.setRectangle(10, 10);
                _groundBody.static = true;
                groundBodies.push(_groundBody);

                var joint = this.game.physics.box2d.distanceJoint(_groundBody, element.getBox(), 0, 0, 0, 0, 0.0001, 5, 2);
                joints.push(joint);
            }
        }.bind(this)));
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
    },
    //Keyboard Event
    keyEvent: function () {
        jt.resetInput();
        if (!jt.pause && !this.restart && !this.win) {
            jt.updateinput();
            switch (this.player) {
                case this.player1:
                    jt.gameAction(this.game, this.player1.truck.getBox(), this.player1.front.getBox(), this.player1.back.getBox(), 1, true);
                    break;
                case this.player2:
                    jt.gameAction(this.game, this.player2.truck.getBox(), this.player2.front.getBox(), this.player2.back.getBox(), 2, true);
                    break;
                case this.player3:
                    var boxRotation = Math.abs(Phaser.Math.radToDeg(this.player.truck.getBox().rotation)) % 360;
                    // If the truck is tilted then do not move forward and backward
                    if (boxRotation > 170 && boxRotation < 210)
                        jt.up = jt.mobileup = jt.down = jt.mobiledown = false;
                    jt.gameAction(this.game, this.player3.truck.getBox(), this.player3.front.getBox(), this.player3.back.getBox(), 7, true);
                    break;
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
    updateCamera: function () {
        this._plx = this.player.truck.getSprite().x;
        this._ply = this.player.truck.getSprite().y;
        this._vlc = Math.abs(this.player.truck.getBox().data.m_linearVelocity.x);
        this.jellyCamera = jt.updateCamera(this.game, this.jellyCamera, this._plx, this._ply, this._vlc, this.win, this.restart, jt.pause);
    },
    setupCamera: function () {
        this.camerFocus = jt.setupCameraObject(this.game, this.map);
        for (var i = 0; i < this.camerFocus.length; i++) {
            this.camerFocus[i].setBodyContactCallback(this.player1.truck.getBox(), this.camerafocusCollision, this);
            this.camerFocus[i].setBodyContactCallback(this.player2.truck.getBox(), this.camerafocusCollision, this);
            this.camerFocus[i].setBodyContactCallback(this.player3.truck.getBox(), this.camerafocusCollision, this);
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
    updateLift: function () {
        if (jt.dist(this.lift.getBox().x, this.lift.getBox().y, this.player.truck.getBox().x, this.player.truck.getBox().y) < 75 && this.lift_sprite.alpha == 0) {
            this.liftup = this.game.add.tween(this.lift_sprite).to({
                alpha: 1
            }, 1500, "Linear", true);
            this.liftup.onComplete.add(this.liftMoveUp, this);
        } else if (jt.dist(this.lift.getBox().x, this.lift.getBox().y, this.player.truck.getBox().x, this.player.truck.getBox().y) > 90 && this.lift_sprite.alpha == 1) {
            this.liftdown = this.game.add.tween(this.lift_sprite).to({
                alpha: 0
            }, 500, "Linear", true);
            this.liftdown.onComplete.add(this.liftMoveDown, this);
        }
    },
    liftMoveUp: function () {
        this.lift.joint.m_motorSpeed = 3.5;
        this.lift.joint.m_maxMotorForce = 1500;
        this.lift.joint.m_enableMotor = true;
    },
    liftMoveDown: function () {
        this.lift.joint.m_motorSpeed = -5;
        this.lift.joint.m_maxMotorForce = 1100;
        this.lift.joint.m_enableMotor = true;
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
            this.contact_count++;
            if (this.player != this.player3 && body1 == this.hitBodyPlayer3) { // Sports car
                this.hitBodyPlayer3 = null; // Makes sure that it happens only once.
                this.contact_count = 1; // As the player willbe switched, there wont be a call with 'begin' = false hence overriding the value
                this.game.time.events.add(Phaser.Timer.SECOND * this.game.physics.box2d.frameRate, function () {
                    this.truckIcon3Tween.stop();
                    this.truckIcon3.visible = false;
                    this.switchToPlayer3();
                    this.openDoor3();
                }, this);
            } else if (this.player != this.player2 && body1 == this.hitBodyPlayer2) { // Big Truck
                this.hitBodyPlayer2 = null; // Makes sure that it happens only once.
                this.contact_count = 1; // As the player willbe switched, there wont be a call with 'begin' = false hence overriding the value
                this.game.time.events.add(Phaser.Timer.SECOND * this.game.physics.box2d.frameRate, function () {
                    this.truckIcon2Tween.stop();
                    this.truckIcon2.visible = false;
                    this.switchToPlayer2();
                    this.openDoor2();
                }, this);
            }
            body1.destroy();
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
    switchToPlayer2: function () {
        console.log("To 2");

        this.game.physics.box2d.world.DestroyJoint(this.player.joint1);
        this.game.physics.box2d.world.DestroyJoint(this.player.joint2);

        this.player.truck.getBox().setCollisionCategory(0);
        this.player.front.getBox().setCollisionCategory(0);
        this.player.back.getBox().setCollisionCategory(0);
        this.player.back.disable();
        this.player.front.disable();
        this.player.truck.disable();

        this.player.back.kill();
        this.player.front.kill();
        this.player.truck.kill();

        this.player = this.player2;

        this.player.truck.enable();
        this.player.back.enable();
        this.player.front.enable();

        if (jt.sfx)
            jt.sfx.playTruckSound("truck_change");
    },
    switchToPlayer3: function () {
        console.log("To 3");
        this.game.physics.box2d.world.DestroyJoint(this.player.joint1);
        this.game.physics.box2d.world.DestroyJoint(this.player.joint2);

        this.player.truck.getBox().setCollisionCategory(0);
        this.player.front.getBox().setCollisionCategory(0);
        this.player.back.getBox().setCollisionCategory(0);
        this.player.back.disable();
        this.player.front.disable();
        this.player.truck.disable();

        this.player.back.kill();
        this.player.front.kill();
        this.player.truck.kill();

        this.player = this.player3;

        this.player.truck.enable();
        this.player.back.enable();
        this.player.front.enable();

        if (jt.sfx)
            jt.sfx.playTruckSound("truck_change");
    },
    openDoor3: function () {
        this.door3.body.destroy();
        this.door3.x = 3125.67;
        this.door3.y = 1523.25;
        this.door3.angle = 80;
    },
    openDoor2: function () {
        this.door2.body.destroy();
        this.door2.x = 3315.17;
        this.door2.y = 1501.25;
        this.door2.angle = -80;
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
    },

    // End Shutdown
   
    //Restart
    restartBtnClicked: function (button) {

    },

    createRestart: function () {

    }
    //Level Specfic object Methods
};