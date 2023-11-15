window.JellyTruck.state.level06 = {
    preload: function () {
        this.game.world.removeAll();
        //background
        this.bg;
        this.light;
        this.scene;
        this.ground_art;
        this.map = this.game.add.tilemap("level_6_map");
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
        this.jellyObj;

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

        //Level Specific Objects
        this.cart;
        this.rope;
        this.cart_front;
        this.cart_back;
        this.graphics;


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
        this.game.mobLevel = "Level 6";
        this.game.levelNumber = "level06";
        this.game.nextlevelNumber = "level07";
        jt.current_level = 6;        

        //init Game music and sound
        this.game.sound.stopAll();
        if (jt.sfx)
            jt.sfx.playMusic("evenbg");

        //setup sky background
        this.bg = new GameBg(this.game);

        //setup level scene
        this.scene = jt.setupScene(this.game, this.map, "scene_6", this.map.objects["Ground"][0].x - 12, this.map.objects["Ground"][0].y - 1158, this.jellyCamera.width, this.jellyCamera.height, 1000);

        // The ground 'scene.grounds' by default is implemented as a single body with chain fixture.
        // With this the truck and the cart is sometimes sinking through the ground.
        // So the ground has to be implemented using static bodies.
        // The maskbit for the ground 'scene.grounds' is changed here from 46 to 40 to avoid stucking of truck with it.
        // But 'scene.grounds' is not removed as it can be used to see if the jelly in the cart has fallen or not.
        for (var i = 0; i < this.scene.grounds.length; i++) {
            var _gb = this.scene.grounds[0];
            _gb.setCollisionMask(40);
        }
        this.createGroundBodies(this.game, this.map);
      
        //setup Score
        this.setupScore();

        //setup Flag
        this.setupFlag();

        this.graphics = this.game.add.graphics(0,0);
        //setup player
        this.rope = this.game.add.sprite(680, 2180, 'rope1');
        this.player = jt.createTruck(this.game, this.scene.truck_x, this.scene.truck_y, this.scene.truck_type, this.phyBody);
        this.game.physics.box2d.enable(this.rope);
        this.rope.body.setCollisionMask(0);
        this.rope.visible = false;

        //setup level objects
        this.cart_front = new Jelly(this.game, "Wheel", 615 + 30, 2216, this.phyBody, "CartWheel", 0.5, 0.5, -10);
        this.cart_back = new Jelly(this.game, "Wheel", 615 - 30, 2216, this.phyBody, "CartWheel", 0.5, 0.5, -10);
        
        //setup Jelly object
        this.jellyObj = jt.setupJellyObj(this.game, this.map, this.phyBody);
        this.jellyObj[0].collisionFilter(OTHER_CATEGORYBITS, OTHER_MASKBITS);
        this.jellyObj[0].collisionJelly(OTHER_CATEGORYBITS, this.cubeComeOutCallback, this);
       
        //set ground art
        this.ground_art = this.game.add.image(this.map.objects["Ground"][0].x - 12, this.map.objects["Ground"][0].y - 1017.5, "ground_6");
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
       //     jt.gameController(this.game);
       // }

        // Level Specfic object
        this.cart = this.jellyObj[1];
        this.cj1 = this.game.physics.box2d.revoluteJoint(this.cart.getBox(), this.cart_front.getBox(), 30, this.cart_front.getLocal().y, 0, 0);
        this.cj1.collideConnected = false;
        this.cj2 = this.game.physics.box2d.revoluteJoint(this.cart.getBox(), this.cart_back.getBox(), -30, this.cart_back.getLocal().y, 0, 0);
        this.cj2.collideConnected = false;
        
        this.jBodyA = this.cart.getBody(6);
        this.la = new box2d.b2Vec2();
       
        this.rope.body.toLocalPoint(this.la, new box2d.b2Vec2());
        this.game.physics.box2d.revoluteJoint(this.jBodyA, this.rope.body, -15, 10, -this.rope.width / 2);
    
        this.jBodyB = this.player.truck.getBody(7);
        this.game.physics.box2d.revoluteJoint(this.jBodyB, this.rope.body, 5, 10, this.rope.width / 2);
        this.game.physics.box2d.distanceJoint(this.player.truck.getBody(7), this.cart.getBody(5), 20, 0, 35);
        this.game.physics.box2d.ropeJoint(this.player.truck.getBody(7), this.cart.getBody(7), 60, 5, 10, -15, 10);

        this.game.camera.follow(this.player.truck.getSprite());

    },
    cubeComeOutCallback: function (body1, body2, fixture1, fixture2, begin) {
        if (begin && !this.win && !this.restart) {
            this.scene.grounds.forEach((function (element) {
                if (element == body2) {
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
                    return;
                }
            }).bind(this));
        }
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
            if (this.timeTrail % 10 == 0) {
                this.second--;
            }
            this.keyEvent();
            this.truckSound();
        } else if (this.win) {
            if (this.flag.joint)
                this.game.physics.box2d.world.DestroyJoint(this.flag.joint);

        } else if (this.restart) {
            //this.game.physics.box2d.world.DestroyJoint(this.player.joint1);
            //this.game.physics.box2d.world.DestroyJoint(this.player.joint2);
        }
       
    },
    render: function () {
        if (this.jellyObj) {
            for (var i = 0; i < this.jellyObj.length; i++)
                this.jellyObj[i].renderJelly();
        }
        this.cart_front.renderJelly();
        this.cart_back.renderJelly();

        this.renderPlayer();
        if (jt.phy_debug) {
            this.game.physics.box2d.debugDraw.joints = true;
            this.game.debug.box2dWorld();
        }

        // Rendering rope
        this.graphics.clear();
        this.graphics.lineStyle(4, 0x333333, 2);
        this.graphics.moveTo(this.jellyObj[1].getBody(6).x-5, this.jellyObj[1].getBody(6).y);
        this.graphics.lineTo(this.player.truck.getBody(7).x+10, this.player.truck.getBody(7).y+15);
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
            jt.gameAction(this.game, this.player.truck.getBox(), this.player.front.getBox(), this.player.back.getBox(), 2, true);

            if((jt.up && !jt.right && !jt.left)||(jt.mobileup && !jt.mobileright && !jt.mobileleft)){
                this.game.physics.box2d.getBody(this.player.truck.getBox()).ApplyTorque(180 * 2);
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
        
        for(var i=0;i<this.grounds.length;i++)
        this.game.physics.box2d.world.DestroyBody(this.grounds[i]);
        this.grounds.clear();
        this.grounds = null;
		
		for(var i=0;i<this.jellyObj.length;i++)
			this.jellyObj[i].destroy();
        this.jellyObj.clear();
        this.jellyObj = null;
  		
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
        this.graphics.destroy();
        this.graphics = null;       
    },
    // End Shutdown

    /**
     * Creates static bodies according tto the vertices used to define the chain fixture of ground
     */
    createGroundBodies: function (game, map) {
        this.grounds = [];
        map.objects["Ground"].forEach((function (element) {
            this._tx = element.x;
            this._ty = element.y;
            if (element.type === "ground") {
                for (var k = 0; k < element.polyline.length - 1; k += 1) {
                    var _gv = [];
                    _gv.push(element.polyline[k][0]);
                    _gv.push(element.polyline[k][1]);
                    _gv.push(element.polyline[k + 1][0]);
                    _gv.push(element.polyline[k + 1][1]);
                    _gv.push(element.polyline[k + 1][0]);
                    _gv.push(50);
                    _gv.push(element.polyline[k][0]);
                    _gv.push(50);

                    var _gb = new Phaser.Physics.Box2D.Body(game, null, this._tx, this._ty, 0);
                    _gb.static = true;
                    _gb.setPolygon(_gv);
                    _gb.friction = 15000;
                    _gb.setCollisionCategory(OTHER_CATEGORYBITS);
                    _gb.setCollisionMask(OTHER_MASKBITS);
                    this.grounds.push(_gb);
                }
            }
        }).bind(this));
    }
};