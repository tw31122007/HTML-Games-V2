var WHEEL_CATEGORYBITS = 2;
var TRUCK_CATEGORYBITS = 4;
var OTHER_CATEGORYBITS = 8;
var PLATFORM_CATEGORYBITS = 16;
var ALLTOUCH_CATEGORYBITS = 32;

var WHEEL_MASKBITS = 58;
var TRUCK_MASKBITS = 60;
var OTHER_MASKBITS = 46;
var PLATFORM_MASKBITS = 54;
var ALLTOUCH_MASKBITS = 62;

window.jt = {
    phy_debug: false, // show or hide physics body debug
    trace: false, // show or hide console
    showFPS: false,
    worldScale: 1,
    cursors: null,
    left: false,
    right: false,
    up: false,
    down: false,
    pause: false,
    mobileup: false,
    mobiledown: false,
    mobileright: false,
    mobileleft: false,
    music: true,
    sound: true,
    menu_in_state: 0,
    current_level: 0,
    game_data: null,
    game_menu: null,
    game_bg: null,
    game_fail: null,
    well_done: null,
    truck_speed: false,
    truck_move: 0,
    sfx: null,
    balloonForce: {
        min: 200,
        max: 800, 
		currentHorizontal: 0, 
        currentVertical: 0, 
        speedHorozontal: 3.5, 
        speedVertical: 7
    },
    initInput: function (game) {
        this.cursors = game.input.keyboard.createCursorKeys();
    },
    androidfpsSetup:function(game,ratio,fp,ve,po){
            game.time.physicsElapsed = 1 / fp;
            game.physics.box2d.ptmRatio = ratio;
        //  this.game.physics.box2d.frameRate = 1/100;
            game.physics.box2d.velocityIterations = ve;
            game.physics.box2d.positionIterations = po;
            game.physics.box2d.useElapsedTime = true;
    },
    gameController: function (game) {

        buttonleft = game.add.button(50, 430, 'left_bt', null, this, 0, 1, 0, 1);
        buttonleft.fixedToCamera = true;
        buttonleft.anchor.set(0.5);
        //go_img

        buttonleft.events.onInputDown.add(function () {
            jt.mobileleft = true;
        });
        buttonleft.events.onInputUp.add(function () {
            jt.mobileleft = false;
        });

        buttonright = game.add.button(150, 430, 'right_bt', null, this, 0, 1, 0, 1);
        buttonright.fixedToCamera = true;
        buttonright.anchor.set(0.5);


        buttonright.events.onInputDown.add(function () {
            jt.mobileright = true;
        });
        buttonright.events.onInputUp.add(function () {
            jt.mobileright = false;
        });

        buttondown = game.add.button(game.width - 150, 430, 'stop_img', null, this, 0, 1, 0, 1);
        buttondown.fixedToCamera = true;
        buttondown.anchor.set(0.5);


        buttondown.events.onInputDown.add(function () {
            jt.mobiledown = true;
        });
        buttondown.events.onInputUp.add(function () {
            jt.mobiledown = false;
        });

        buttonup = game.add.button(game.width - 50, 430, 'go_img', null, this, 0, 1, 0, 1);
        buttonup.fixedToCamera = true;
        buttonup.anchor.set(0.5);

        buttonup.events.onInputDown.add(function () {
            jt.mobileup = true;
        });
        buttonup.events.onInputUp.add(function () {
            jt.mobileup = false;
        });


    },
    gameAction: function (game, body, front, back, type) {
        var tractor_addition = 0;
        var kart_moment = 0;
        switch (type) {
            case 1:
                tractor_addition = 1;
                kart_moment = 12;
                break;
            case 2:
				if(jt.current_level === 8){
					tractor_addition = 1;
                    kart_moment  =  12;
                }else{
					tractor_addition = 3;
					kart_moment = 18;
                }  				
				break;				
            case 3:
                tractor_addition = 3;
                kart_moment = 60;
                break;
            case 4:
                tractor_addition = 3;
                kart_moment = 70;
                break;
            case 5:
                tractor_addition = 3;
                kart_moment = 18;
                break;
            case 6:
                tractor_addition  =  3;
                kart_moment  =  15;
                break;
            case 7:
                tractor_addition  =  3;
                if(jt.current_level === 14){
                    kart_moment  =  55;
                }else{
                    kart_moment  =  12;    
                }                
                break;
            case 8:
                tractor_addition = 3;
                kart_moment = 24;
                break;
			case 9:
                tractor_addition = 2;
                kart_moment = 15;
                break;
        }
        //console.log("Type & Speed: " + type + "/" + kart_moment);
        this.cart = game.physics.box2d.getBody(body);
        this.koleso1 = game.physics.box2d.getBody(front);
        this.koleso2 = game.physics.box2d.getBody(back);

        if ((jt.up && this.koleso1.GetAngularVelocity() < +(kart_moment + 100)) || jt.mobileup) {
            this.koleso1.ApplyTorque(kart_moment * 6 * tractor_addition);
            this.koleso2.ApplyTorque(kart_moment * 6);
            this.truck_speed = true;
            if (this.truck_move < 150)
                this.truck_move += 5;                
            // truckbg.play();
            //	 front.applyForce(kart_moment * 0.7 * tractor_addition,0);
            //	 back.applyForce(kart_moment *0.7);


            //this.game.sound.stopAll();
        }
        if ((jt.down && this.koleso1.GetAngularVelocity() > -(kart_moment + 100)) || jt.mobiledown) {
            this.koleso1.ApplyTorque(-kart_moment * 6 * tractor_addition);
            this.koleso2.ApplyTorque(-kart_moment * 6);
            this.truck_speed = true;
            if (this.truck_move < 150)
                this.truck_move += 5;
            //	front.applyForce(-kart_moment * 0.7 * tractor_addition,0);
            //	back.applyForce(-kart_moment *0.7);
        }
        if (jt.left || jt.mobileleft) {
            // body.applyForce(-18,0);
            // body.velocity.x = -180 * 1.5;
            if (type !== 3 && type !== 7)
                this.cart.ApplyTorque(-180 * 1.75);
            else
                this.cart.ApplyTorque(-180 * 2.5);
        }
        if (jt.right || jt.mobileright) {
            //body.applyForce(18,0);
            //body.velocity.x = 180 * 1.5;
            //body.moveRight(180 * 1.5);
            if (type != 3 && type !== 7){
                this.cart.ApplyTorque(180 * 1.75);
                console.log(this.cart.m_torque);
            }
            else{
                this.cart.ApplyTorque(180 * 2.5);
            }
            //front.moveRight(kart_moment * 14 * tractor_addition,0);

        }
    },
    gameBalloonAction: function (game, body, type) {
		if(type===undefined)
			type=1;
        if(type == 1)return this.gameBalloonActionType1(game,body);
        if(type == 2)return this.gameBalloonActionType2(game,body);
    },

    //Round 9 Ballon Settings
    gameBalloonActionType1: function (game, body) {

        if (jt.up || jt.mobileup) {
            body.applyForce(0, -400);
        }
        if (!jt.up || !jt.mobileup) {
            body.applyForce(0, -300);
        }
        if (jt.left || jt.mobileleft) {
            body.applyForce(-220, 0);
        }
        if (jt.right || jt.mobileright) {
            body.applyForce(220, 0);
        }
    },

    //Round 18 Ballon Settings
    gameBalloonActionType2: function (game, body) {
        if(jt.up || jt.mobileup){
            this.balloonForce.currentVertical += this.balloonForce.speedVertical;
            this.balloonForce.currentVertical = this.balloonForce.currentVertical>this.balloonForce.max?this.balloonForce.max:this.balloonForce.currentVertical;
        }else{
            this.balloonForce.currentVertical = this.balloonForce.min+200;
        }                
        if(jt.left||jt.mobileleft||jt.right||jt.mobileright){            
            this.balloonForce.currentHorizontal += this.balloonForce.speedHorozontal;
            this.balloonForce.currentHorizontal = this.balloonForce.currentHorizontal>this.balloonForce.max?this.balloonForce.max:this.balloonForce.currentHorizontal;         
        }else{
            this.balloonForce.currentHorizontal -= this.balloonForce.speedHorozontal*2;
            this.balloonForce.currentHorizontal = this.balloonForce.currentHorizontal < this.balloonForce.min?this.balloonForce.min:this.balloonForce.currentHorizontal;
        }
        
        if (jt.up || jt.mobileup) {
            body.applyForce(0, -1*this.balloonForce.currentVertical);
        }
        if (!jt.up || !jt.mobileup) {            
            body.applyForce(0, -400);
        }
        if (jt.left || jt.mobileleft) {
            body.applyForce(-1*this.balloonForce.currentHorizontal, 0);            
        }
        if (jt.right || jt.mobileright) {
            body.applyForce(this.balloonForce.currentHorizontal, 0);
        }        
    },
    resetInput: function () {
        jt.down = false;
        jt.up = false;
        jt.left = false;
        jt.right = false;
        jt.truck_speed = false;
        if (jt.truck_move > 0)
            jt.truck_move--;
        else
            jt.truck_move = 0;
        //jt.truck_bg_wobble = false;
    },
    updateinput: function () {

        if (this.cursors.down.isDown && !jt.down) {
            jt.down = true;
            jt.truck_bg = true;
            //alert(jt.truck_bg);
        }
        if (this.cursors.up.isDown && !jt.up) {

            jt.up = true;
            jt.truck_bg = true;
        }
        if (this.cursors.right.isDown && !jt.right) {
            jt.right = true;
            jt.truck_bg_wobble = true;
        }
        if (this.cursors.left.isDown && !jt.left) {
            jt.left = true;
            jt.truck_bg_wobble = true;
        }

    },
    //Flag
    createFlag: function (game, img, img1, img2, map) {
        this._fx = map.objects["Flag"][0].x + map.objects["Flag"][0].width / 2;
        this._fy = map.objects["Flag"][0].y + map.objects["Flag"][0].height / 2;
        
        this.base = null;
        this.base = new Phaser.Physics.Box2D.Body(game, null, this._fx, this._fy);
        this.base.setRectangle(60, 80, 0, 0);
        this.base.static = true;

        this.flag_bot = game.add.sprite(this._fx, this._fy - 34, img2);
        game.physics.box2d.enable(this.flag_bot);
        this.flag_bot.body.setRectangle(9, 36, 0, 0);
        this.flag_bot.body.setCollisionCategory(PLATFORM_CATEGORYBITS);
        this.flag_bot.body.setCollisionMask(PLATFORM_MASKBITS);
        game.physics.box2d.revoluteJoint(this.base, this.flag_bot.body, 0, -25, 0, 25, 0, 0, false, 0, 5, true);

        this.flag_mid = game.add.sprite(this._fx, this._fy - 76, img1);
        game.physics.box2d.enable(this.flag_mid);
        this.flag_mid.body.setRectangle(9, 36, 0, 0);
        this.flag_mid.body.setCollisionCategory(PLATFORM_CATEGORYBITS);
        this.flag_mid.body.setCollisionMask(PLATFORM_MASKBITS);
        //  this.flag_mid.body.static = true;
        game.physics.box2d.revoluteJoint(this.flag_bot.body, this.flag_mid.body, 0, -15, 0, 15, 0, 0, false, 0, 6, true);

        this.flag_head = game.add.sprite(this._fx + 15, this._fy - 114, img);
        game.physics.box2d.enable(this.flag_head);
        this.flag_head.body.setRectangle(9, 36, -15, 0);
        this.flag_head.body.setCollisionCategory(PLATFORM_CATEGORYBITS);
        this.flag_head.body.setCollisionMask(PLATFORM_MASKBITS);
        //   this.flag_head.body.static=true;
        game.physics.box2d.revoluteJoint(this.flag_mid.body, this.flag_head.body, 0, -15, -14, 15, 0, 0, false, 0, 6, true);
        this._jot = game.physics.box2d.distanceJoint(this.base, this.flag_head.body, 75, -60, -100, 0, -10)
        return {
            head: this.flag_head,
            middle: this.flag_mid,
            bottom: this.flag_bot,
            joint: this._jot,
            xpos: this._fx,
            ypos: this._fy
        };

    },
    //Game Data
    InitData: function () {

        this._data = {
            "lastPlayed": "1",
            "music": "1",
            "sound": "1",
            "levels": [{
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                },
                {
                    "score": "0",
                    "star": "0"
                }
            ]
        };
        if (window.localStorage) window.localStorage.setItem("coolmath_jellytruck", JSON.stringify(this._data));
    },
    LoadData: function () {
        if (window.localStorage)
            return JSON.parse(window.localStorage.getItem("coolmath_jellytruck"));
        else
            return -1;
    },
    SaveData: function () {
        if (window.localStorage) {
            window.localStorage.setItem("coolmath_jellytruck", JSON.stringify(this.game_data));
        }
    },
    GetTotalScore: function () {
        if (window.localStorage) {
            var data = JSON.parse(window.localStorage.getItem("coolmath_jellytruck"));
            this.total_score = 0;
            for (var i = 0; i < data.levels.length; i++) {
                this.total_score += parseInt(data.levels[i].score);
            }
        }
        return this.total_score;
    },
    getLevelPreScore: function (level) {
        var _level_pre_score = [0,
            2371 - 100, //1
            2557 - 100, //2
            2453 - 100, //3
            2486 - 50, //4
            2570 - 50, //5
            2836 - 50, //6
            2385, //7
            2272, //8
            2356, //9
            2181, //10
            2066, //11
            2428, //12
            2279, //13
            2810, //14
            2129, //15
            2213, //16
            2440, //17
            2534, //18
            2161, //19
            2813, //20
            0
        ]; //21
        return _level_pre_score[level];
    },
    getStar: function (score, second) {
        var scr = score + second;
        var st = 0;
        if (scr > (jt.getLevelPreScore(jt.current_level) * 0.8))
            st = 1;
        if (scr > (jt.getLevelPreScore(jt.current_level) * 0.9))
            st = 2;
        if (scr > (jt.getLevelPreScore(jt.current_level) * 1.0))
            st = 3;
        return st;
    },
    updateCamera: function (game, jc, px, py, lvec, win, restart, pause) {
        this._cx = jc.cx;
        this._cy = jc.cy;
        this._focx = jc.focx;
        this._focy = jc.focy;
        this._focz = jc.focz;
        this._mode = jc.mode;
        this._zoom = jc.zoom;
        this._width = jc.width;
        this._height = jc.height;
        this._levelZoom = jc.levelZoom;
        this._scale = jc.scale;

        if (!win && !restart && !pause) {

            switch (jc.mode) {
                case 0:
                    this._cx = (px - (this._width / 2)) * this._zoom;
                    this._cy = (py - (this._height / 2)) * this._zoom;
                    game.camera.x = this._cx;
                    game.camera.y = this._cy;
                    game.camera.scale.x = this._zoom;
                    game.camera.scale.y = this._zoom;
                    if (jt.up || jt.down || jt.right || jt.left) {
                        if (lvec > 10) {
                            if (this._zoom > this._scale)
                                this._zoom -= 0.005;
                        } else {
                            if (this._zoom < this._levelZoom)
                                this._zoom += 0.005;
                        }
                    } else {
                        if (this._zoom < this._levelZoom)
                            this._zoom += 0.005;
                    }
                    break;
                case 1:
                  
                    if (this._focx != -1 && this._focy != -1 && this._focz != -1) {
                        if (this._zoom > this._focz) {
                            this._zoom -= 0.005;
                        }
                        this._cx = (px - (this._width / 2)) * this._zoom;
                        this._cy = (py - (this._height / 2)) * this._zoom;
                        game.camera.x = this._cx;
                        game.camera.y = this._cy;
                        game.camera.scale.x = this._zoom;
                        game.camera.scale.y = this._zoom;
                        // if(this._zoom <this._focz)
                       /* {
                            this._fcx = (this._focx - (this._width / 2)) * this._zoom;
                            this._fcy = (this._focy - (this._height / 2)) * this._zoom;
                            this._ang = game.math.angleBetween(this._cx, this._cy, this._fcx, this._fcy);
                            this._dt = jt.dist(this._cx, this._cy, this._fcx, this._fcy);
                            if (this._dt > 5) {
                                // this._cx += 2 * Math.cos(this._ang); 
                                //  this._cy += 2 * Math.sin(this._ang); 
                                this._cx = ((this._focx - (this._width / 2)) * this._zoom) + (0.005 * Math.cos(this._ang));
                                this._cy = ((this._focy - (this._height / 2)) * this._zoom) + (0.005 * Math.sin(this._ang));
                            } else {
                                this._cx = (this._focx - (this._width / 2)) * this._zoom;
                                this._cy = (this._focy - (this._height / 2)) * this._zoom;
                            }
                        }*/

                    } else {
                        this._cx = (px - (this._width / 2)) * this._zoom;
                        this._cy = (py - (this._height / 2)) * this._zoom;

                    }

                    break;
            }

        } else {
            if (this._zoom < this._levelZoom)
                this._zoom += 0.005;
            if (win || pause) {
                this._cx = (px - (this._width / 2)) * this._zoom;
                this._cy = (py - (this._height / 2)) * this._zoom;
                game.camera.x = this._cx;
                game.camera.y = this._cy;
                game.camera.scale.x = this._zoom;
                game.camera.scale.y = this._zoom;
            } else {
                game.camera.scale.x = this._zoom;
                game.camera.scale.y = this._zoom;
                game.camera.x = this._cx * this._zoom;
                game.camera.y = this._cy * this._zoom;

            }


        }
        return {
            cx: this._cx,
            cy: this._cy,
            focx: this._focx,
            focy: this._focy,
            focz: this._focz,
            mode: this._mode,
            zoom: this._zoom,
            width: this._width,
            height: this._height,
            levelZoom: this._levelZoom,
            scale: this._scale
        };
    },
    /***************************** Level Setup Method ********************************/
    setupMenuBg: function (game) {
        this._bg = game.add.image(game.width / 2, game.height / 2, "menubg");
        this._bg.anchor.set(0.5);
        this._bg.fixedToCamera = true;
        //bg.autoCull=false;
        this._light = game.add.image(689, 108, "bg_light");
        this._light.fixedToCamera = true;
        //light.autoCull=false;
        this._light.anchor.set(0.6, 0.3);
        return {
            background: this._bg,
            light: this._light
        }
    },
    /*setupBg: function(game, bg, light) {
        this._bg = game.add.sprite(game.width / 2, game.height / 2, "bg");
        this._bg.anchor.set(0.5);
        this._bg.fixedToCamera = true;
        //bg.autoCull=false;
        this._light = game.add.sprite(689, 108, "bg_light");
        this._light.fixedToCamera = true;
        //light.autoCull=false;
        this._light.anchor.set(0.6, 0.3);
        return {
            background: this._bg,
            light: this._light
        }
    },*/
    setupScene: function (game, map, name, x, y, cw, ch, fric) {
        this._tx = map.objects["Truck"][0].x + map.objects["Truck"][0].width / 2;
        this._ty = map.objects["Truck"][0].y + map.objects["Truck"][0].height / 2;
        this._tt = map.objects["Truck"][0].properties.type;
        this._sp = new Phaser.Physics.Box2D.Body(game, null, map.objects["Start"][0].x + map.objects["Start"][0].width / 2, map.objects["Start"][0].y + map.objects["Start"][0].height / 2, 0);
        this._sp.setRectangle(map.objects["Start"][0].width, map.objects["Start"][0].height, 0, 0);
        this._sp.setCollisionCategory(OTHER_CATEGORYBITS);
        this._sp.setCollisionMask(OTHER_MASKBITS);
        this._sp.static = true;

        this._ep = new Phaser.Physics.Box2D.Body(game, null, map.objects["End"][0].x + map.objects["End"][0].width / 2, map.objects["End"][0].y + map.objects["End"][0].height / 2, 0);
        this._ep.setRectangle(map.objects["End"][0].width, map.objects["End"][0].height, 0, 0);
        this._ep.static = true;
        this._ep.setCollisionCategory(OTHER_CATEGORYBITS);
        this._ep.setCollisionMask(OTHER_MASKBITS);

        game.camera.x = (this._sp.x + map.objects["Start"][0].width / 2);
        game.camera.y = (game.height * 0.5);
        // game.camera.width = cw;
        // game.camera.height = ch;
        //  if(this.current_level!==17)
        game.world.setBounds(this._sp.x + map.objects["Start"][0].width / 2, 0, this._ep.x - 200, 8000);
        //  else
        //    game.world.setBounds(0,0,this._ep.x,8000);
        this._scene = game.add.image(x, y, name);
        this._scene.autoCull = true;
        this._scene.checkWorldBounds = true;
        //  this._art= game.add.sprite(x,y,name);
        var _groundBody = [];
        map.objects["Ground"].forEach(function (element) {
            var _gb = new Phaser.Physics.Box2D.Body(game, null, element.x, element.y, 0);

            if (element.type === "ground") {
                var _gv = [];
                for (var k = 0; k < element.polyline.length; k++) {
                    _gv.push(element.polyline[k][0]);
                    _gv.push(element.polyline[k][1]);
                }
                _gb.setChain(_gv);
                _gb.friction = fric;
                _gb.setCollisionCategory(OTHER_CATEGORYBITS);
                _gb.setCollisionMask(OTHER_MASKBITS);
                _groundBody.push(_gb);

            }
        });

        return {
            start_body: this._sp,
            end_body: this._ep,
            art: this._scene,
            truck_x: this._tx,
            truck_y: this._ty,
            truck_type: this._tt,
            grounds: _groundBody,
            bound_x: this._sp.x + map.objects["Start"][0].width / 2,
            bound_y: 0,
            bound_w: this._ep.x - 200,
            bound_h: 8000
        };
    },
    setupLegoScene: function (game, map, name, x, y) {
        this._tx = map.objects["Truck"][0].x + map.objects["Truck"][0].width / 2;
        this._ty = map.objects["Truck"][0].y + map.objects["Truck"][0].height / 2;
        this._tt = map.objects["Truck"][0].properties.type;
        this._sp = new Phaser.Physics.Box2D.Body(game, null, map.objects["Start"][0].x + map.objects["Start"][0].width / 2, map.objects["Start"][0].y + map.objects["Start"][0].height / 2, 0);
        this._sp.setRectangle(map.objects["Start"][0].width, map.objects["Start"][0].height, 0, 0);
        this._sp.setCollisionCategory(OTHER_CATEGORYBITS);
        this._sp.setCollisionMask(OTHER_MASKBITS);
        this._sp.static = true;

        this._ep = new Phaser.Physics.Box2D.Body(game, null, map.objects["End"][0].x + map.objects["End"][0].width / 2, map.objects["End"][0].y + map.objects["End"][0].height / 2, 0);
        this._ep.setRectangle(map.objects["End"][0].width, map.objects["End"][0].height, 0, 0);
        this._ep.static = true;
        this._ep.setCollisionCategory(OTHER_CATEGORYBITS);
        this._ep.setCollisionMask(OTHER_MASKBITS);

        game.camera.x = (this._sp.x + map.objects["Start"][0].width / 2);
        game.camera.y = (game.height * 0.5);
        game.camera.width = 400;
        //  if(this.current_level!==17)
        game.world.setBounds(this._sp.x + map.objects["Start"][0].width / 2, 0, this._ep.x, 8000);
        //  else
        //    game.world.setBounds(0,0,this._ep.x,8000);
        this._scene = game.add.image(x, y, name);

        return {
            start_body: this._sp,
            end_body: this._ep,
            art: this._scene,
            truck_x: this._tx,
            truck_y: this._ty,
            truck_type: this._tt
        };
    },
    setupStaticObject: function (game, map, fric) {
        var _statBody = [];
        map.objects["Ground_Static"].forEach(function (element) {
            if (element.type === "static") {
                this._tx = element.x;
                this._ty = element.y;
                var poly = [element.polygon[0][0], element.polygon[0][1],
                    element.polygon[1][0], element.polygon[1][1],
                    element.polygon[2][0], element.polygon[2][1],
                    element.polygon[3][0], element.polygon[3][1]
                ];
                var _gb = new Phaser.Physics.Box2D.Body(game, null, this._tx, this._ty, 0);
                _gb.setPolygon(poly);
                _gb.friction = fric;
                _gb.setCollisionCategory(OTHER_CATEGORYBITS);
                _gb.setCollisionMask(OTHER_MASKBITS);
                _statBody.push(_gb);
            }
        });
        return _statBody;
    },
    setupMenuStaticObject: function (game, map) {
        var _statBody = [];
        map.objects["Ground_Static"].forEach(function (element) {
            if (element.type === "static") {
                this._tx = element.x;
                this._ty = element.y;
                var poly = [element.polygon[0][0], element.polygon[0][1],
                    element.polygon[1][0], element.polygon[1][1],
                    element.polygon[2][0], element.polygon[2][1],
                    element.polygon[3][0], element.polygon[3][1]
                ];
                var _gb = new Phaser.Physics.Box2D.Body(game, null, this._tx, this._ty, 0);
                _gb.setPolygon(poly);
                _gb.friction = 0.2;
                _gb.setCollisionCategory(OTHER_CATEGORYBITS);
                _gb.setCollisionMask(OTHER_MASKBITS);
                _statBody.push(_gb);
            }
        });
        return _statBody;
    },
    setupScoreObject: function (game, map) {
        var _scoreBody = [];
        map.objects["Score_Point"].forEach(function (element) {
            if (element.type === "score") {
                this._tx = element.x;
                this._ty = element.y;
                var _gb = new Phaser.Physics.Box2D.Body(game, null, this._tx, this._ty, 0);
                _gb.setPolygon([element.polygon[0][0], element.polygon[0][1],
                    element.polygon[1][0], element.polygon[1][1],
                    element.polygon[2][0], element.polygon[2][1],
                    element.polygon[3][0], element.polygon[3][1]
                ]);
                _gb.setCollisionCategory(OTHER_CATEGORYBITS);
                _gb.setCollisionMask(OTHER_MASKBITS);
                _gb.sensor = true;
                _scoreBody.push(_gb);
            }
        });
        return _scoreBody;
    },
    setupFailObject: function (game, map) {
        var _failBody = [];
        map.objects["Fail"].forEach(function (element) {
            if (element.type === "fail") {
                this._tx = element.x + element.width / 2;
                this._ty = element.y + element.height / 2;
                this._fb = new Phaser.Physics.Box2D.Body(game, null, this._tx, this._ty, 0);
                this._fb.setRectangle(element.width, element.height);
                this._fb.setCollisionCategory(OTHER_CATEGORYBITS);
                this._fb.setCollisionMask(OTHER_MASKBITS);
                this._fb.static = true;
                this._fb.sensor = true;
                _failBody.push(this._fb);
            }
            if (element.type === "touch") {
                this._tx = element.x;
                this._ty = element.y;
                var poly = [element.polygon[0][0], element.polygon[0][1],
                    element.polygon[1][0], element.polygon[1][1],
                    element.polygon[2][0], element.polygon[2][1],
                    element.polygon[3][0], element.polygon[3][1]
                ];
                this._fb = new Phaser.Physics.Box2D.Body(game, null, this._tx, this._ty, 0);
                this._fb.setPolygon(poly);
                this._fb.setCollisionCategory(OTHER_CATEGORYBITS);
                this._fb.setCollisionMask(OTHER_MASKBITS);
                //     this._fb.setCollisionCategory(TRUCK_CATEGORYBITS);
                //     this._fb.setCollisionMask(TRUCK_MASKBITS);
                this._fb.static = true;
                this._fb.sensor = true;
                _failBody.push(this._fb);
            }
        });
        return _failBody;
    },
    setupCameraObject: function (game, map) {
        var _cameraBody = [];
        map.objects["Camera"].forEach(function (element) {
            if (element.type === "focus") {
                this._tx = element.x + element.width / 2;
                this._ty = element.y + element.height / 2;
                this._cb = new Phaser.Physics.Box2D.Body(game, null, this._tx, this._ty, 0);
                this._cb.setRectangle(element.width, element.height);
                this._cb.setCollisionCategory(OTHER_CATEGORYBITS);
                this._cb.setCollisionMask(OTHER_MASKBITS);
                this._cb.static = true;
                this._cb.sensor = true;
                this._cb.m_userData = {
                    focusX: element.properties.focusX,
                    focusY: element.properties.focusY,
                    zoom: element.properties.zoom
                };
                _cameraBody.push(this._cb);
            }

        });
        return _cameraBody;
    },
    setupJointGround: function (game, map) {
        var _groundBody;
        map.objects["Joints"].forEach(function (element) {

            if (element.type === "ground") {
                this._tx = element.x + element.width / 2;
                this._ty = element.y + element.height / 2;
                _groundBody = new Phaser.Physics.Box2D.Body(game, null, this._tx, this._ty, 0);
                _groundBody.setRectangle(element.width, element.height);
                _groundBody.static = true;

            }
        });
        return _groundBody;
    },
    setupJellyObj: function (game, map, phy) {
        var _jellyBody = [];
        var count = -10;
        map.objects["Jelly_Obj"].forEach(function (element) {
            if (element.type === "jelly") {
                this._tx = element.x + element.width / 2;
                this._ty = element.y + element.height / 2;
                this._img = element.properties.texture;
                this._name = element.properties.obj_name;
                this._ox = (element.properties.xoffset).toFixed(2);
                this._oy = (element.properties.yoffset).toFixed(2);
                var _gb = new Jelly(game, this._img, this._tx, this._ty, phy, _name, this._ox, this._oy, count);
                count--;
                _jellyBody.push(_gb);
            }
        });
        return _jellyBody;
    },
    setupCrusher: function (game, map, ground) {
        var _crushBody = [];
        var count = -10;
        map.objects["Crusher"].forEach(function (element) {
            if (element.type === "crusher") {
                this._tx = element.x + element.width / 2;
                this._ty = element.y + element.height / 2;
                this._img = element.properties.texture;
                this._speed = (element.properties.speed).toFixed(2);
                this._torque = (element.properties.torque).toFixed(2);
                var _gb = game.add.sprite(this._tx, this._ty, this._img);
                _gb.anchor.set(0.5, 0.5);
                game.physics.box2d.enable(_gb);
                _gb.body.setCircle(130 / 2, 0, 0)
                _gb.body.friction = 20.0;
                _gb.body.setCollisionCategory(PLATFORM_CATEGORYBITS);
                _gb.body.setCollisionMask(PLATFORM_MASKBITS);
                this.la = new box2d.b2Vec2();
                //       this.lb = new box2d.b2Vec2();
                ground.toLocalPoint(this.la, new box2d.b2Vec2(this._tx, this._ty));
                // this._bodyB.toLocalPoint(this.lb, new box2d.b2Vec2(x,y));
                game.physics.box2d.revoluteJoint(ground, _gb.body, this.la.x, this.la.y, 0, 0, this._speed, this._torque, true);
                //
                _crushBody.push(_gb);
            }
        });

        return _crushBody;
    },
    setupLegoObj: function (game, map, ground) {
        var _legoBody = [];
        map.objects["Lego"].forEach(function (element) {
            if (element.type == "bolt") {
                this._tx = element.x + element.width / 2;
                this._ty = element.y + element.height / 2;
                this._img = element.properties.texture;
                this._physics_key = element.properties.physics_key;
                this._bolt = element.properties.bolt;
                this._fr = (element.properties.friction).toFixed(2);
                this._rs = (element.properties.bounce).toFixed(2);
                this.den = (element.properties.mass).toFixed(2);
                var _lego = new Lego(game, this._tx, this._ty, this._img, this._physics_key, this._fr, this._rs, this.den);

                if (this._bolt) {
                    this._bs = (element.properties.bolt_scale).toFixed(2);
                    _lego.setBolt(this._tx, this._ty, this._bs)
                }
                _legoBody.push(_lego);
            }

            if (element.type == "balanceBox") {
                this._tx = element.x + element.width / 2;
                this._ty = element.y + element.height / 2;
                this._img = element.properties.texture;
                this._physics_key = element.properties.physics_key;
                this._bolt = element.properties.bolt;
                this._fr = (element.properties.friction).toFixed(2);
                this._rs = (element.properties.bounce).toFixed(2);
                this.den = (element.properties.mass).toFixed(2);
                var _lego = new Lego(game, this._tx, this._ty, this._img, this._physics_key, this._fr, this._rs, this.den);

                if (this._bolt) {
                    this._bs = (element.properties.bolt_scale).toFixed(2);
                    _lego.setBolt(this._tx, this._ty, this._bs)
                }
                _legoBody.push(_lego);
            }

            if (element.type === "mill") {
                this._tx = element.x + element.width / 2;
                this._ty = element.y + element.height / 2;
                this._img = element.properties.texture;
                this._physics_key = element.properties.physics_key;
                this._speed = (element.properties.speed).toFixed(2);
                this._torque = (element.properties.torque).toFixed(2);
                this._motor = element.properties.motor;
                this._limit = element.properties.limit;
                this._low = (element.properties.low).toFixed(2);
                this._up = (element.properties.up).toFixed(2);
                this._bolt = element.properties.bolt;
                this._fr = (element.properties.friction).toFixed(2);
                this._rs = (element.properties.bounce).toFixed(2);
                this.den = (element.properties.mass).toFixed(2);
                var _lego = new Lego(game, this._tx, this._ty, this._img, this._physics_key, this._fr, this._rs, this.den);
                _lego.enableRevolute(ground, this._speed, this._torque, this._motor, this._low, this._up, this._limit);
                if (this._bolt) {
                    this._bs = (element.properties.bolt_scale).toFixed(2);
                    _lego.setBolt(this._tx, this._ty, this._bs)

                }
                _legoBody.push(_lego);
            }

            if (element.type == "solid") {
                this._tx = element.x + element.width / 2;
                this._ty = element.y + element.height / 2;
                this._img = element.properties.texture;
                this._physics_key = element.properties.physics_key;
                this._fr = (element.properties.friction).toFixed(2);
                this.den = (element.properties.mass).toFixed(2);
                var _lego = new Lego(game, this._tx, this._ty, this._img, this._physics_key, this._fr, 0, this.den);

                _legoBody.push(_lego);

            }
            if (element.type === "platform") {
                this._tx = element.x + element.width / 2;
                this._ty = element.y + element.height / 2;
                this._img = element.properties.texture;
                this._physics_key = element.properties.physics_key;
                this._speed = (element.properties.speed).toFixed(2);
                this._torque = (element.properties.torque).toFixed(2);
                this._motor = element.properties.motor;
                this._limit = element.properties.limit;
                this._low = (element.properties.low).toFixed(2);
                this._up = (element.properties.up).toFixed(2);
                this._bolt = element.properties.bolt;
                this._fr = (element.properties.friction).toFixed(2);
                this._rs = (element.properties.bounce).toFixed(2);
                this.den = (element.properties.mass).toFixed(2);
                var _lego = new Lego(game, this._tx, this._ty, this._img, this._physics_key, this._fr, this._rs, this.den);
                _lego.enableRevolute(ground, this._speed, this._torque, this._motor, this._low, this._up, this._limit);
                if (this._bolt) {
                    this._bs = (element.properties.bolt_scale).toFixed(2);
                    _lego.setBolt(this._tx, this._ty, this._bs)

                }
                _legoBody.push(_lego);
            }
        });
        return _legoBody;
    },
   /* setupJoints: function (game, map, ground) {
        var _jellyJoint = [];
        map.objects["Joints"].forEach(function (element) {
            if (element.type === "joint") {
                this._tx = element.x + element.width / 2;
                this._ty = element.y + element.height / 2;
                this._st = element.properties.static;
                this._ax = element.properties.ax;
                this._ay = element.properties.ay;
                this._limit = element.properties.limit;
                this._mo = element.properties.motor;
                this._speed = element.properties.speed;
                this._torque = element.properties.motor;
                this._up = element.properties.limit_up;
                this._low = element.properties.limit_low;
                switch (element.properties.joint_name) {
                    case "prismatic":
                        this.joint = jt.primaticJoint(game, ground, this._tx, this._ty, this._up, this._low, 101);
                        _jellyJoint.push({
                            joint: this.joint,
                            speed: this._speed,
                            torque: this._torque,
                            time_trail: 0
                        });
                        break;
                }
            }
        });
        return _jellyJoint;
    },
    primaticJoint: function (game, ground, x, y, up, low, angle) {
        this._bodyA = ground;
        this._bodies = game.physics.box2d.getBodiesAtPoint(x, y);
        this._bodyB = this._bodies[0];
        this.la = new box2d.b2Vec2();
        this.lb = new box2d.b2Vec2();
        this._bodyA.toLocalPoint(this.la, new box2d.b2Vec2(x, y));
        this._bodyB.toLocalPoint(this.lb, new box2d.b2Vec2(x, y));
        this.xs = Math.cos(angle * Math.PI / 180);
        this.ys = Math.sin(angle * Math.PI / 180);
        this.xs = (this.xs * 1000) / 1000;
        this.ys = (this.ys * 1000) / 1000;
        this.joint = game.physics.box2d.prismaticJoint(this._bodyA, this._bodyB, this.xs, this.ys, this.la.x, this.la.y, this.lb.x, this.lb.y, 0, 0, false, low, up, true);
        this.joint.collideConnected = false;
        return this.joint;
    },
    revoluteJoint: function (game, bodyA, bodyB, x, y) {
        this.la = new box2d.b2Vec2();
        this.lb = new box2d.b2Vec2();
        bodyA.toLocalPoint(this.la, new box2d.b2Vec2(x, y));
        bodyB.toLocalPoint(this.lb, new box2d.b2Vec2(x, y));
        this.joint = game.physics.box2d.revoluteJoint(bodyA, bodyB, this.la.x, this.la.y, this.lb.x, this.lb.y);
        this.joint.collideConnected = false;
        return this.joint;
    },*/
    dist: function (_x1, _y1, _x2, _y2) {
        //changed by Arun Vashist 11/30/2018
        //return Math.sqrt(Math.pow((_x1 - _x2), 2) + Math.pow((_y1 - _y2), 2));          
        return Phaser.Math.distance(_x1, _y1, _x2, _y2); 
        
    },
    createTruck: function (game, x, y, type, map) {
        var tk = null;
        var bk = null;
        var ft = null;
        var j1 = null;
        var j2 = null;
        switch (type) {
            case 1:
                bk = new Jelly(game, "Wheel", x - 30, y, map, "Wheel1", 0.5, 0.5, -1);
                ft = new Jelly(game, "Wheel", x + 30, y, map, "Wheel1", 0.5, 0.5, -1);
                tk = new Jelly(game, "Truck1", x, y, map, "Truck1", 0.5, 0.5, -1);
                this.xs = Math.cos(90 * Math.PI / 180);
                this.ys = Math.sin(90 * Math.PI / 180);
                this.xs = (this.xs * 1000) / 1000;
                this.ys = (this.ys * 1000) / 1000;
                j1 = game.physics.box2d.revoluteJoint(tk.getBox(), ft.getBox(), 30, ft.getLocal().y, 0, 0);
                j1.collideConnected = false;
                j2 = game.physics.box2d.revoluteJoint(tk.getBox(), bk.getBox(), -30, bk.getLocal().y, 0, 0);
                j2.collideConnected = false;

                break;
            case 2:
            case 4:
                tk = new Jelly(game, "Truck2", x, y, map, "Truck2", 0.5, 0.72, -1);
                bk = new Jelly(game, "Wheel", x - 30, y, map, "Wheel2", 0.5, 0.5, -1);
                ft = new Jelly(game, "Wheel", x + 30, y, map, "Wheel1", 0.5, 0.5, -1);
                this.xs = Math.cos(90 * Math.PI / 180);
                this.ys = Math.sin(90 * Math.PI / 180);
                this.xs = (this.xs * 1000) / 1000;
                this.ys = (this.ys * 1000) / 1000;
                j1 = game.physics.box2d.revoluteJoint(tk.getBox(), ft.getBox(), 28, ft.getLocal().y, 0, 0);
                j1.collideConnected = false;
                j2 = game.physics.box2d.revoluteJoint(tk.getBox(), bk.getBox(), -38, bk.getLocal().y - 2, 0, 0);
                j2.collideConnected = false;

                break;
            case 3:
            case 5:
                tk = new Jelly(game, "Truck3", x, y, map, "Truck3", 0.5, 0.6, -1);
                bk = new Jelly(game, "Wheel", x - 45, y, map, "Wheel3", 0.5, 0.5, -1);
                ft = new Jelly(game, "Wheel", x + 45, y, map, "Wheel3", 0.5, 0.5, -1);
                this.xs = Math.cos(90 * Math.PI / 180);
                this.ys = Math.sin(90 * Math.PI / 180);
                this.xs = (this.xs * 1000) / 1000;
                this.ys = (this.ys * 1000) / 1000;
                j1 = game.physics.box2d.revoluteJoint(tk.getBox(), ft.getBox(), 45, ft.getLocal().y, 0, 0);
                j1.collideConnected = false;
                j2 = game.physics.box2d.revoluteJoint(tk.getBox(), bk.getBox(), -45, bk.getLocal().y, 0, 0);
                j2.collideConnected = false;

                break;

        }
        return {
            truck: tk,
            back: bk,
            front: ft,
            joint1: j1,
            joint2: j2
        };
    },

};