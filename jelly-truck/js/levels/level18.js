/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
window.JellyTruck.state.level18 = {
    preload: function () {
        this.bg;
        this.light;
        this.scene;
        this.ground_art;
        this.map = this.game.add.tilemap("level_18_map");
        this.phyBody = this.game.add.tilemap("map");

        //camera
        this.jellyCamera = { cx: 0, cy: 0, focx: -1, focy: -1, mode: 0, zoom: 0.73, width: 640, height: 640, levelZoom: 0.73, scale: 1 };

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
    

        //score
        this.timeTrail;
        this.second;
        this.score;
        this.bonus;
        this.score_txt;
        this.spotLight;
        this.contact_count;

        // Level Specific
        this.rope;
        this.ropeGraphics;
        this.bridge1;
        this.bridge2;
        this.fallingBalls;
        this.legoObj;
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
        this.game.mobLevel = "Level 18";
        this.game.levelNumber = "level18";
        this.game.nextlevelNumber = "level19";
        jt.current_level = 18;

        //init Game music and sound
        this.game.sound.stopAll();
        if (jt.sfx)
            jt.sfx.playMusic("evenbg");

        //setup sky background
        this.bg = new GameBg(this.game);

        //setup level scene
        this.scene = jt.setupScene(this.game, this.map, "scene_18", 13, 4, this.jellyCamera.width, this.jellyCamera.height, 15000);
        
        // setup static object
        this.statBody = jt.setupStaticObject(this.game, this.map);
       
        // Ground body
        this.joint_ground = jt.setupJointGround(this.game, this.map);
        
        //setup Fail
        this.setupFail();
        
        //setup Score
        this.setupScore();
        
        // setup jelly object
        this.jellyObj = jt.setupJellyObj(this.game, this.map, this.phyBody);

        //setup player
        this.player = jt.createTruck(this.game, this.scene.truck_x, this.scene.truck_y, this.scene.truck_type, this.phyBody);
        
        //setup Camera Object
        // this.setupCamera();

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

        // Level Specific        
        this.ropeGraphics = this.game.add.graphics(0, 0);

        this.player.truck.getBox().gravityScale = 1.8;
        this.player.front.getBox().gravityScale = 1.8;
        this.player.back.getBox().gravityScale = 1.8;
        this.balloon = this.jellyObj[2];
        this.balloon.setIndex(-50);
        this.rope = new Phaser.Physics.Box2D.Body(this.game, null, this.player.truck.getBox().x + 3, this.player.truck.getBox().y - 88);
        this.rope.setRectangle(4, 98, 0, 0);
        this.player.truck.enableRevolute(this.rope, 0, 0, false, -30, 30, true);
        this.balloon.enableRevolute(this.rope, 0, 0, false, -10, 10, false);
        this.linkBalls();
       
        var b1 = this.statBody[9];
        this.bridge1 = this.game.add.sprite(1736, 4583, "bridge18");
        this.bridge1.anchor.setTo(0.5);
        this.bridge1.scale.setTo(1.1, 1.15);
        this.game.physics.box2d.enable(this.bridge1);
        this.bridge1.body.setCollisionCategory(8);
        this.bridge1.body.setCollisionMask(38);
        this.bridge1.body.mass = 15;
        this.bridge1.body.friction = 5;
        var a = new box2d.b2Vec2();
        b1.toLocalPoint(a, new box2d.b2Vec2(1824, 4583));
        var b = new box2d.b2Vec2();
        this.bridge1.body.toLocalPoint(b, new box2d.b2Vec2(1824, 4583));
        this.game.physics.box2d.revoluteJoint(b1, this.bridge1.body, a.x, a.y, b.x, b.y, 0, 0, false, -20, 20, true);
        this.bolt = this.game.add.sprite(1824, 4583, "mill_bolt");
        this.bolt.anchor.setTo(0.5);
        this.bolt.scale.setTo(0.35);

        b1 = this.statBody[1];
        this.bridge2 = this.game.add.sprite(650, 450, "bridge18");
        this.bridge2.anchor.setTo(0.5);
        this.bridge2.scale.setTo(1.1, 1.15);
        this.game.physics.box2d.enable(this.bridge2);
        this.bridge2.body.setCollisionCategory(8);
        this.bridge2.body.setCollisionMask(38);
        a = new box2d.b2Vec2();
        b1.toLocalPoint(a, new box2d.b2Vec2(561, 450));
        b = new box2d.b2Vec2();
        this.bridge2.body.toLocalPoint(b, new box2d.b2Vec2(561, 450));
        this.game.physics.box2d.revoluteJoint(b1, this.bridge2.body, a.x, a.y, b.x, b.y, 0, 0, false, -20, 5, true);
        this.bolt = this.game.add.sprite(561, 450, "mill_bolt");
        this.bolt.anchor.setTo(0.5);
        this.bolt.scale.setTo(0.35);

        //setup Flag
        this.setupFlag();
        this.game.world.setChildIndex(this.flag.bottom, this.game.world.getChildIndex(this.bridge2));

        this.fallingBalls = [];
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 3; j++) {
                var ball = this.game.add.sprite(0, 0, "crusher0005");
                ball.anchor.set(0.5, 0.5);
                ball.scale.setTo(0.350);
                ball.x = 896 + j * (50);
                ball.y = 3368 - i * (50);

                this.game.physics.box2d.enable(ball);
                ball.body.setCircle(ball.width / 2 - 12, -5.5, -2.5);
                ball.body.setCollisionCategory(OTHER_CATEGORYBITS);
                ball.body.setCollisionMask(OTHER_MASKBITS);
                ball.body.mass = 0.5;
                ball.body.restitution = 0.5;
                ball.body.friction = 0.5;

                this.fallingBalls.push(ball);
            }
        }

        this.legoObj = jt.setupLegoObj(this.game, this.map, this.joint_ground);

        this.legoObj[2].sprite.body.setCategoryContactCallback(32, this.failCollision, this);
        this.legoObj[3].sprite.body.setCategoryContactCallback(32, this.failCollision, this);

        this.game.world.setChildIndex(this.ropeGraphics, 7);
    },
    // Level Pause and Resume
    onGamePause: function () {

    },
    onGameResume: function () {

    },

    updateCamera: function () {        
        this._plx = this.player.truck.getSprite().x;
        this._ply = this.player.truck.getSprite().y;
        var offset = {x:-250, y:-225};
        this._vlc = Math.abs(this.player.truck.getBox().data.m_linearVelocity.x);
        this.jellyCamera = jt.updateCamera(this.game, this.jellyCamera, this._plx+offset.x, this._ply+offset.y, this._vlc, this.win, false, jt.pause);
        this.bg.setScale(1.1);
    },

    //Level Update and Render
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
        }
        else if (this.win) {
            if (this.flag.joint)
                this.game.physics.box2d.world.DestroyJoint(this.flag.joint);
        }
       
        if (!this.statBody[14].sensor) {
            if (this.balloon.getBox().x < 950 && this.balloon.getBox().y > 900 && this.balloon.getBox().y < 4096) {
                this.statBody[14].sensor = this.statBody[15].sensor = this.statBody[16].sensor = true;
                this.fallingBalls.forEach((function (ball) {
                    ball.body.static = false;
                    ball.body.applyForce(Phaser.Math.between(-75, 75), 1000);
                }).bind(this));
            }
        }
    },
    render: function () {
        if (this.jellyObj) {
            for (var i = 0; i < this.jellyObj.length; i++)
                this.jellyObj[i].renderJelly();
        }
        this.renderPlayer();
        this.renderString();
        if (jt.phy_debug) {
            this.game.physics.box2d.debugDraw.joints = true;
            this.game.debug.box2dWorld();
        }
    },
    renderString: function () {
        if (!this.restart) {
            this.ropeGraphics.clear();
            this.ropeGraphics.lineStyle(4, 0x000000, 3);
            this.ropeGraphics.moveTo(this.balloon.getBox().x, this.balloon.getBox().y);
            this.ropeGraphics.lineTo(this.player.truck.getCenter().x, this.player.truck.getCenter().y);
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
            jt.gameBalloonAction(this.game, this.balloon.getCenter(), 2);
        }
    },
    truckSound: function () {
        if (jt.truck_speed && jt.truck_move > 10) {
            jt.sfx.stopSound("truck_idle");
            jt.sfx.stopSound("truck_slow");
            jt.sfx.playTruckSound("truck_speed");
        }
        else {
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
        }
        else {
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
            this.failPoint[i].sensor = false;
            this.failPoint[i].setCategoryContactCallback(32, this.failCollision, this);
        }
    },
    failCollision: function (body1, body2, fixture1, fixture2, begin) {
        if (begin && !this.restart) {
            this.showBalloonBurstAnimation();
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
            jt.sfx.playTruckSound("truck_bang2");
        }
    },
    showBalloonBurstAnimation: function () {
        var balloonburstAnim = this.game.add.sprite(this.balloon.getBox().x, this.balloon.getBox().y - 85, "balloonBurst");
        balloonburstAnim.anchor.set(0.5);
        balloonburstAnim.animations.add("anim");

        balloonburstAnim.events.onAnimationComplete.add(function () {
            balloonburstAnim.destroy();
        }, this);

        balloonburstAnim.animations.play("anim", 30);
        this.balloon.disable();
        this.ropeGraphics.destroy();
    },
    // Flag
    setupFlag: function () {
        this.flag = jt.createFlag(this.game, "flag_head", "flag_mid", "flag_bot", this.map);
        this.flag.head.body.setCategoryContactCallback(TRUCK_CATEGORYBITS, this.flagCollision, this);
        this.flag.middle.body.setCategoryContactCallback(TRUCK_CATEGORYBITS, this.flagCollision, this);
        this.flag.bottom.body.setCategoryContactCallback(TRUCK_CATEGORYBITS, this.flagCollision, this);

        // The flag is disconnected from the base and connected to lego bridge
        this.game.physics.box2d.world.DestroyJoint(this.flag.bottom.body.data.m_jointList.next.joint);
        this.game.physics.box2d.revoluteJoint(this.flag.bottom.body, this.bridge2.body, 0, 15, 75, 0, 0, 0, false, 0, 5, true);
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
    //Camera
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
	//	this.ground_art.destroy();
		
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
    linkBalls: function () {
        var joints = [];
        var balls = [this.jellyObj[0], this.jellyObj[1]];
        balls.forEach(
            (function (element) {
                var point = new box2d.b2Vec2();
                this.joint_ground.toLocalPoint(point, new box2d.b2Vec2(element.getBox().x, element.getBox().y));
                var joint = this.game.physics.box2d.distanceJoint(this.joint_ground, element.getBox(), 0, point.x, point.y, 0, 0, 0, 0);
                joints.push(joint);
            }).bind(this));
    },
};



