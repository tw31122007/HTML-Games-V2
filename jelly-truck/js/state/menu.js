"use strict";

window.JellyTruck.state.menu = {
	preload: function () {
		this.backdrop;
		this.grill;

		this.main_menu;
		this.level_selection;
		this.title;
		this.menu_art
		this.play_button;
		this.help_button;
		this.option_button;
		this.how_to_play_popup;
		this.option_popup;
		this.level_buttons = [];

		this.scene;
		this.ground_art;
		this.map = this.game.add.tilemap("menu_map");
		this.phyBody = this.game.add.tilemap("map");

		//objects
		this.statBody;
		this.jellyObj;
		this.player;
		this.auto1;
		this.auto2;
		this.auto3;
		this.auto4;
		this.auto;
		this.crusher2;

		this.leaf1_anim;
		this.leaf2_anim;
		this.button_over_snd;
		this.button_click_snd;

		this.truck_state;

	},

	create: function () {

		this.game.camera.scale.x = 1;
		this.game.camera.scale.y = 1;
		if (jt.game_fail != null)
			jt.game_fail.killRestart();
		this.game.stage.disableVisibilityChange = true;
		this.button_over_snd = this.game.add.audio("button_over");
		this.button_click_snd = this.game.add.audio("button_click");
		this.menu_state = 0;
		if (jt.sfx == null) {
			jt.sfx = new Sfx(this.game);
			jt.sfx.setupMusic();
		}


		this.backdrop = jt.setupMenuBg(this.game);

		//setup level
		this.scene = jt.setupScene(this.game, this.map, "menu_scene", this.map.objects["Ground"][0].x - 20, this.map.objects["Ground"][0].y - 1060, 400, 400);
		//setup player, flag and camera
		this.player = jt.createTruck(this.game, this.scene.truck_x, this.scene.truck_y, this.scene.truck_type, this.phyBody);
		this.game.camera.follow(this.player.truck.getSprite());
		//setup level objects
		this.joint_ground = jt.setupJointGround(this.game, this.map);
		this.statBody = jt.setupMenuStaticObject(this.game, this.map);
		this.jellyObj = jt.setupJellyObj(this.game, this.map, this.phyBody);

		this.crusher = jt.setupCrusher(this.game, this.map, this.joint_ground);

		this.crusher2 = this.jellyObj[4];
		this.crusher2.enablePrimatic(this.joint_ground, -10, +220, -120, -120);

		//setup ground
		this.ground_art = this.game.add.image(this.map.objects["Ground"][0].x - 22, this.map.objects["Ground"][0].y - 928, "menu_ground");


		this.auto1 = new Phaser.Physics.Box2D.Body(this.game, null, 1152, 1636, 0);
		this.auto1.setRectangle(166, 72, 0, 0)
		this.auto1.sensor = true;
		this.auto1.setCollisionCategory(OTHER_CATEGORYBITS);
		this.auto1.setCollisionMask(OTHER_MASKBITS);
		this.auto1.setCategoryContactCallback(WHEEL_CATEGORYBITS, this.auto1Collision, this);

		this.auto2 = new Phaser.Physics.Box2D.Body(this.game, null, 4894, 1518, 0);
		this.auto2.setRectangle(196, 118, 0, 0)
		this.auto2.sensor = true;
		this.auto2.setCollisionCategory(OTHER_CATEGORYBITS);
		this.auto2.setCollisionMask(OTHER_MASKBITS);
		this.auto2.setCategoryContactCallback(WHEEL_CATEGORYBITS, this.auto2Collision, this);

		this.auto3 = new Phaser.Physics.Box2D.Body(this.game, null, 4433, 739, 0);
		this.auto3.setRectangle(166, 272, 0, 0)
		this.auto3.sensor = true;
		this.auto3.setCollisionCategory(OTHER_CATEGORYBITS);
		this.auto3.setCollisionMask(OTHER_MASKBITS);
		this.auto3.setCategoryContactCallback(WHEEL_CATEGORYBITS, this.auto3Collision, this);

		this.auto4 = new Phaser.Physics.Box2D.Body(this.game, null, 3420, 720, 0);
		this.auto4.setRectangle(100, 600, 0, 0)
		this.auto4.sensor = true;
		this.auto4.setCollisionCategory(OTHER_CATEGORYBITS);
		this.auto4.setCollisionMask(OTHER_MASKBITS);
		this.auto4.setCategoryContactCallback(WHEEL_CATEGORYBITS, this.auto4Collision, this);

		this.menu_art = this.game.add.image(this.game.width / 2, this.game.height / 2, "menu_paint");
		this.menu_art.anchor.set(0.5);
		this.menu_art.fixedToCamera = true;
                
        // this.menu_art.mask = this.ground_art;
		
		if (jt.game_data.sound === "1")
			this.fx = this.game.add.button(this.game.width - 30, 30, "fxIcon", this.onMenuSoundClick, this, 3, 2, 2);
		else
			this.fx = this.game.add.button(this.game.width - 30, 30, "fxIcon", this.onMenuSoundClick, this, 1, 0, 0);
		this.fx.anchor.set(0.5);
		this.fx.fixedToCamera = true;
		this.fx.inputEnabled = true;		

		if (jt.game_data.music === "1")
			this.soundIcon = this.game.add.button(this.game.width - 80, 30, "soundIcon", this.onMenuMusicClick, this, 3, 2, 2);
		else
			this.soundIcon = this.game.add.button(this.game.width - 80, 30, "soundIcon", this.onMenuMusicClick, this, 1, 0, 0);
		this.soundIcon.anchor.set(0.5);
		this.soundIcon.fixedToCamera = true;
		this.soundIcon.inputEnabled = true;		
	
		if (jt.menu_in_state == 0) {
			this.setUpMainMenu();

		} else {
			jt.game_menu = null;
			this.setUpLevelSelection();
		}

		this.koleso1 = this.game.physics.box2d.getBody(this.player.front.getBox());
		this.koleso2 = this.game.physics.box2d.getBody(this.player.back.getBox());
		this.cart = this.game.physics.box2d.getBody(this.player.truck.getBox());
		this.jellyObj[5].getBox().static = true;
		this.game.sound.stopAll();
		if (jt.sfx)
			jt.sfx.playMusic("menufx");
		this.truck_state = 0;
		// this.game.input.addMoveCallback(this.updateMenu, this);

	},
	update: function () {
		if (jt.sfx)
			jt.sfx.loopMusic("menufx");

		if (this.jellyObj[5].getBox().static && jt.dist(this.player.truck.getBox().x, this.player.truck.getBox().y, this.jellyObj[5].getBox().x, this.jellyObj[5].getBox().y) < 900)
			this.jellyObj[5].getBox().static = false;

		switch (this.auto) {
			case 1:
				this.truck_state = 1;
				this.koleso1.ApplyTorque(25 * 6 * 1);
				this.koleso2.ApplyTorque(25 * 6);
				//this.player.truck.getBox().velocity.x = 600;
				this.player.truck.getBox().velocity.y = +600;

				break;
			case 2:
				this.truck_state = 1;
				this.koleso1.ApplyTorque(25 * 6 * 1);
				this.koleso2.ApplyTorque(25 * 6);
				//this.player.truck.getBox().velocity.x = 600;
				//  	this.player.truck.getBox().velocity.y = 0;
				break;
			case 3:
				this.truck_state = 1;
				this.koleso1.ApplyTorque(-18 * 6 * 1);
				this.koleso2.ApplyTorque(-18 * 6);
				//this.player.truck.getBox().velocity.x = 600;
				//  	this.player.truck.getBox().velocity.y = +600;
				break;

			case 4:
				this.truck_state = 1;
				this.koleso1.ApplyTorque(30 * 6 * 1);
				this.koleso2.ApplyTorque(30 * 6);
				//this.player.truck.getBox().velocity.x = 600;
				this.player.truck.getBox().velocity.y = +600;
				//  this.player.truck.getBox().applyForce(10,0);
				break;
		}
		if (this.player.truck.getBox().angle > 0 && this.player.truck.getBox().angle < 180)
			this.cart.ApplyTorque(-180 * 1.8);
		if (this.player.truck.getBox().angle < 0 && this.player.truck.getBox().angle > -180)
			this.cart.ApplyTorque(180 * 1.8);
		this.updateCrusher2();
		this.updateMenu();
		this.truckSound();
	},
	truckSound: function () {
		switch (this.truck_state) {
			case 0:
				if (jt.sfx)
					jt.sfx.playTruckSound("truck_start");
				break;
			case 1:
				//   if(jt.sfx)
				//   jt.sfx.playTruckSound("truck_speed");
				break;
		}
		this._x1 = this.player.truck.getBody(0).x;
		this._y1 = this.player.truck.getBody(0).y;
		this._x2 = this.player.truck.getBody(6).x;
		this._y2 = this.player.truck.getBody(6).y;
		if ((this._y2 - this._y1) < -20)
			if (jt.sfx) {
				jt.sfx.truck_speed.volume = 0.7;
				jt.sfx.playTruckSound("truck_wob");
			}
		else
			jt.sfx.truck_speed.volume = 1;
		//  if(!jt.sfx.wob1.isPlaying&& !jt.sfx.wob2.isPlaying&&!jt.sfx.wob3.isPlaying)
		//    jt.sfx.playTruckSound("truck_speed");
	},
	updateMenu: function () {
		/* switch(this.menu_state)
		 {
		     case 0:
		         if(this.play_button && this.play_button.input.pointerOver())
		            this.button_over_snd.play();
		     break;    
		 }*/
	},
	updateCrusher2: function () {
		this.crusher2.time_trail++;
		if (this.crusher2.time_trail == 1) {

			this.crusher2.joint.m_motorSpeed = 5000;
			this.crusher2.joint.m_maxMotorForce = 12000;
			this.crusher2.joint.m_enableMotor = true;
		}
		if (this.crusher2.time_trail == 100) {
			this.crusher2.joint.m_motorSpeed = -10;
			this.crusher2.joint.m_maxMotorForce = 100;
			this.crusher2.joint.m_enableMotor = true;
		}
		if (this.crusher2.time_trail == 200)
			this.crusher2.time_trail = 0;
	},
	render: function () {
		for (var i = 0; i < this.jellyObj.length; i++)
			this.jellyObj[i].renderJelly();
		this.renderPlayer();
		if (jt.phy_debug) {
			this.game.physics.box2d.debugDraw.joints = true;
			this.game.debug.box2dWorld();
		}
		//this.game.debug.gameInfo(2, 30);
		//  this.game.debug.gameTimeInfo(2, 150);
	},
	renderPlayer: function () {
		this.player.truck.renderJelly();
		this.player.front.renderJelly();
		this.player.back.renderJelly();
	},
	/******* Main Maenu******************/
	setUpMainMenu: function () {

		this.main_menu = this.game.add.group();
		//this.main_menu.fixedToCamera = true;
		this.main_menu.visible = true;

		this.title = this.add.image(40, 40, 'title');
		this.title.fixedToCamera = true;
		this.main_menu.add(this.title);

		this.play_button = this.game.add.button(100, 380, 'playthegame', this.playOnClick, this, 1, 0, 0);
		this.play_button.anchor.setTo(0.5, 0.5);
		this.play_button.inputEnabled = true;
		this.play_button.fixedToCamera = true;
		this.play_button.onDownSound = this.button_click_snd;
		this.play_button.onOverSound = this.button_over_snd;
		this.main_menu.add(this.play_button);

		this.option_button = this.game.add.button(240, 390, 'options', this.optionOnClick, this, 1, 0, 0);
		this.option_button.anchor.setTo(0.5, 0.5);
		this.option_button.inputEnabled = true;
		this.option_button.fixedToCamera = true;
		this.main_menu.add(this.option_button);

		this.help_button = this.game.add.button(380, 390, 'howtoplay', this.helpOnClick, this, 1, 0, 0);
		this.help_button.anchor.setTo(0.5, 0.5);
		this.help_button.inputEnabled = true;
		this.help_button.fixedToCamera = true;
		this.main_menu.add(this.help_button);
				              
	},

	onMenuMusicClick: function () {
		switch (parseInt(jt.game_data.music)) {
			case 0:
				jt.game_data.music = "1";
				this.soundIcon.setFrames(3, 2, 2);
				jt.SaveData();
				jt.game_data = jt.LoadData();
				if (jt.game_data.sound = "1")
					this.button_click_snd.play();
				break;
			case 1:
				jt.game_data.music = "0";
				this.soundIcon.setFrames(1, 0, 0);
				jt.SaveData();
				jt.game_data = jt.LoadData();
				if (jt.game_data.sound = "1")
					this.button_click_snd.play();
				break;
		}
	},
	onMenuSoundClick: function () {
		switch (parseInt(jt.game_data.sound)) {
			case 0:
				jt.game_data.sound = "1";
				this.fx.setFrames(3, 2, 2);
				jt.SaveData();
				jt.game_data = jt.LoadData();
				this.play_button.onDownSound = this.button_click_snd;
				this.play_button.onOverSound = this.button_over_snd;
				this.option_button.onDownSound = this.button_click_snd;
				this.option_button.onOverSound = this.button_over_snd;
				this.help_button.onDownSound = this.button_click_snd;
				this.help_button.onOverSound = this.button_over_snd;
				break;
			case 1:
				jt.game_data.sound = "0";
				this.fx.setFrames(1, 0, 0);
				jt.SaveData();
				jt.game_data = jt.LoadData();
				this.play_button.onDownSound = null;
				this.play_button.onOverSound = null;
				this.option_button.onDownSound = null;
				this.option_button.onOverSound = null;
				this.help_button.onDownSound = null;
				this.help_button.onOverSound = null;
				break;
		}
	},
	playOnClick: function () {
		//if(jt.game_data.sound=="1")
		this.button_click_snd = this.game.add.audio("button_click");
		this.main_menu.destroy();
		this.setUpLevelSelection();
	},
	optionOnClick: function () {

		this.showOptionPopUp();
	},
	helpOnClick: function () {
		this.showHelpPopup();
	},
	showHelpPopup: function () {
		this.play_button.inputEnabled = false;
		this.option_button.inputEnabled = false;
		this.help_button.inputEnabled = false;
		this.how_to_play_popup = this.game.add.group();
		this.how_to_play;
		if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
			this.how_to_play = this.add.image(-10, -20, 'how_to_play_popup_mobile');
			this.how_to_play.fixedToCamera = true;
			this.how_to_play_popup.add(this.how_to_play);
		} else {
			this.how_to_play = this.add.image(-10, -20, 'how_to_play_popup');
			this.how_to_play.fixedToCamera = true;
			this.how_to_play_popup.add(this.how_to_play);
		}
		this.closeBtn = this.game.add.button(555, 105, "closeBtn", this.hideHelpPopup, this);
		this.closeBtn.fixedToCamera = true;
		this.how_to_play_popup.add(this.closeBtn);
	},
	hideHelpPopup: function () {
		//destroy the box when the button is pressed
		this.how_to_play_popup.destroy();
		this.play_button.inputEnabled = true;
		this.option_button.inputEnabled = true;
		this.help_button.inputEnabled = true;
	},
	showOptionPopUp: function () {
		this.play_button.inputEnabled = false;
		this.option_button.inputEnabled = false;
		this.help_button.inputEnabled = false;
		this.option_popup = this.game.add.group();
		this.option = this.game.add.image(-15, -50, 'options_popup');
		this.option.fixedToCamera = true;
		this.option_popup.add(this.option);
		if (jt.game_data.music === "1")
			this.music_radio_button = this.game.add.button(450, 170, "radio_button", this.menumusicBtnClicked, this, 3, 2, 2);
		else
			this.music_radio_button = this.game.add.button(450, 170, "radio_button", this.menumusicBtnClicked, this, 1, 0, 0);
		this.music_radio_button.anchor.setTo(0.5, 0.5);
		this.music_radio_button.fixedToCamera = true;
		this.option_popup.add(this.music_radio_button);
		if (jt.game_data.sound === "1")
			this.sound_radio_button = this.game.add.button(450, 213, "radio_button", this.menuoptionSoundClick, this, 3, 2, 2);
		else
			this.sound_radio_button = this.game.add.button(450, 213, "radio_button", this.menuoptionSoundClick, this, 1, 0, 0);

		this.sound_radio_button.anchor.setTo(0.5, 0.5);
		this.sound_radio_button.fixedToCamera = true;
		this.option_popup.add(this.sound_radio_button);
		this.closeBtn = this.game.add.button(570, 105, "closeBtn", this.hideOptionPopup, this);
		this.closeBtn.fixedToCamera = true;
		this.option_popup.add(this.closeBtn);

		this.option_main_menu = this.game.add.button(320, 256, "option_main_menu", this.hideOptionPopup, this, 1, 0, 0);
		this.option_main_menu.fixedToCamera = true;
		this.option_popup.add(this.option_main_menu);
		this.options_choose_level = this.game.add.button(423, 256, "options_choose_level", this.levelBack, this, 1, 0, 0);
		this.options_choose_level.fixedToCamera = true;
		this.option_popup.add(this.options_choose_level);
		if (jt.game_data.sound === "1") {
			this.option_main_menu.onDownSound = this.button_click_snd;
			this.option_main_menu.onOverSound = this.button_over_snd;
			this.options_choose_level.onDownSound = this.button_click_snd;
			this.options_choose_level.onOverSound = this.button_over_snd;
			this.closeBtn.onDownSound = this.button_click_snd;
		} else {
			this.option_main_menu.onDownSound = null;
			this.option_main_menu.onOverSound = null;
			this.options_choose_level.onDownSound = null;
			this.options_choose_level.onOverSound = null;
			this.closeBtn.onDownSound = null;
		}
	},
	hideOptionPopup: function () {
		//destroy the box when the button is pressed
		this.option_popup.destroy();
		this.play_button.inputEnabled = true;
		this.option_button.inputEnabled = true;
		this.help_button.inputEnabled = true;
		if (jt.game_data.sound === "1") {
			this.play_button.onDownSound = this.button_click_snd;
			this.play_button.onOverSound = this.button_over_snd;
			this.option_button.onDownSound = this.button_click_snd;
			this.option_button.onOverSound = this.button_over_snd;
			this.help_button.onDownSound = this.button_click_snd;
			this.help_button.onOverSound = this.button_over_snd;
		} else {
			this.play_button.onDownSound = null;
			this.play_button.onOverSound = null;
			this.option_button.onDownSound = null;
			this.option_button.onOverSound = null;
			this.help_button.onDownSound = null;
			this.help_button.onOverSound = null;
		}
	},
	menumusicBtnClicked: function () {							
		switch (parseInt(jt.game_data.music)) {
			case 0:
				jt.game_data.music = "1";
				this.soundIcon.setFrames(3, 2, 2);
				this.music_radio_button.setFrames(3, 2, 2);
				jt.SaveData();
				jt.game_data = jt.LoadData();
				if (jt.game_data.sound === "1")
					this.button_click_snd.play();
				break;
			case 1:
				jt.game_data.music = "0";
				this.soundIcon.setFrames(1, 0, 0);
				this.music_radio_button.setFrames(1, 0, 0);
				jt.SaveData();
				jt.game_data = jt.LoadData();
				if (jt.game_data.sound === "1")
					this.button_click_snd.play();
				break;
		}
	},
	menuoptionSoundClick: function () {
		switch (parseInt(jt.game_data.sound)) {
			case 0:
				jt.game_data.sound = "1";
				this.fx.setFrames(3, 2, 2);
				this.sound_radio_button.setFrames(3, 2, 2);
				jt.SaveData();
				jt.game_data = jt.LoadData();
				this.option_main_menu.onDownSound = this.button_click_snd;
				this.option_main_menu.onOverSound = this.button_over_snd;
				this.options_choose_level.onDownSound = this.button_click_snd;
				this.options_choose_level.onOverSound = this.button_over_snd;
				this.closeBtn.onDownSound = this.button_click_snd;
				break;
			case 1:
				jt.game_data.sound = "0";
				this.fx.setFrames(1, 0, 0);
				this.sound_radio_button.setFrames(1, 0, 0);
				jt.SaveData();
				jt.game_data = jt.LoadData();
				this.option_main_menu.onDownSound = null;
				this.option_main_menu.onOverSound = null;
				this.options_choose_level.onDownSound = null;
				this.options_choose_level.onOverSound = null;
				this.closeBtn.onDownSound = null;
				break;
		}
	},
	/******* Level Menu******************/
	setUpLevelSelection: function () {
		
		this.level_selection = this.game.add.group();
		//	this.level_selection.fixedToCamera = true;
		this.level_selection.visible = true;
		var offsetX = 195;
		var offsetY = 80;
		var style = {
			font: "22px king_cool_kc",
			fill: "#ffffff"
		};
		for (var i = 0; i < 20; i++) {
			var x = offsetX + ((i % 5) * (97 + 8));
			var y = offsetY + (Math.floor((i / 5)) * (91 + 8));
			var level;
			if (i < parseInt(jt.game_data.lastPlayed)) {
				level = new LevelButton(this.game, i + 1, x, y, false, 1);
				level.setStars(parseInt(jt.game_data.levels[i].star));
			} else
				level = new LevelButton(this.game, i + 1, x, y, true, 1);
			this.level_selection.add(level._level_group);
			this.level_buttons.push(level);
		}
		this.menuBackBtn = this.game.add.button(90, 230, "back_btn", this.menuBack, this, 1, 0, 0);
		this.menuBackBtn.fixedToCamera = true;
		this.menuBackBtn.anchor.set(0.5, 0.5);

		this.score_txt = this.game.add.text(400, 455, "Score total \n" + jt.GetTotalScore(), {
			font: "20px king_cool_kc",
			fill: "#ffffff",
			align: "center"
		});
		this.score_txt.fixedToCamera = true;
		this.score_txt.visible = true;
		this.score_txt.anchor.set(0.5);

		this.levelVersion = this.game.add.text(700, 430, "version : 1.0", style);
		this.levelVersion.fixedToCamera = true;
		this.level_selection.add(this.menuBackBtn);
		this.level_selection.add(this.levelVersion);		
	},
	menuBack: function () {
		//destroy the box when the button is pressed
		this.level_selection.destroy();
		this.setUpMainMenu();
		/*this.play_button.inputEnabled = true;
		this.option_button.inputEnabled = true;
		this.help_button.inputEnabled = true;*/
	},
	levelBack: function () {
		this.option_popup.destroy();
		this.main_menu.destroy();
		this.setUpLevelSelection();
	},
	auto1Collision: function (body1, body2, fixture1, fixture2, begin) {
		if (begin)
			this.auto = 1;
	},
	auto2Collision: function (body1, body2, fixture1, fixture2, begin) {
		if (begin)
			this.auto = 2;
	},
	auto3Collision: function (body1, body2, fixture1, fixture2, begin) {
		if (begin)
			this.auto = 3;
	},
	auto4Collision: function (body1, body2, fixture1, fixture2, begin) {
		if (begin)
			this.auto = 4;
	},
	shutdown:function(){
		this.game.world.removeAll();
		this.game.physics.box2d.clear();
		
		this.scene.art.destroy();
		this.menu_art.destroy();
		this.scene.grounds[0].destroy();
		this.scene=null;
		
		this.player.truck.destroy();
		this.player.truck=null;
		this.player.front.destroy();
		this.player.front=null;
		this.player.back.destroy();
		
		this.joint_ground.destroy();
		this.joint_ground=null;
		
		for(var i=0;i<this.statBody.length;i++)
			 this.game.physics.box2d.world.DestroyBody(this.statBody[i]);
		this.statBody.clear();
		this.statBody = null;
		
		for(var i=0;i<this.crusher.length;i++)
			 this.game.physics.box2d.world.DestroyBody(this.crusher[i]);
        this.crusher.clear();
		this.crusher=null;
		
		for(var i=0;i<this.jellyObj.length;i++)
			this.jellyObj[i].destroy();
        this.jellyObj.clear();
		this.jellyObj = null;
		
		this.auto1.destroy();
		this.auto1 = null;
		
		this.auto2.destroy();
		this.auto2 = null;
		
		this.auto3.destroy();
		this.auto3 = null;
		
		this.auto4.destroy();
		this.auto4 = null;
		this.main_menu.destroy();
		this.level_selection.destroy();
		
	
   if(this.level_buttons.length >0)
   {
	   for(var i=0;i<this.level_buttons.length;i++)
		   this.level_buttons[i].destroy();
	   this.level_buttons.clear();
	   this.level_buttons=null;
   };
	}

};

function LevelButton(game, level, x, y, lock, star) {
	//	alert("yes");
	this.game = game;
	this._level_group = game.add.group();
	// this._level_group.anchor.setTo(0.5,0.5);
	// this._level_group.fixedToCamera = true;
	this._level = level;
	this._level_button = game.add.image(x, y, "level_bg");
	this._level_button.anchor.setTo(0.5, 0.5);
	this._level_button.fixedToCamera = true;
	this._level_button.inputEnabled = true;
	this._level_group.add(this._level_button);
	this.style = {
		font: "22px king_cool_kc",
		fill: "#ffffff"
	};
	this._level_text = game.add.text(x, y - 10, "level " + level, this.style);
	this._level_text.anchor.setTo(0.5, 0.5);
	this._level_text.fixedToCamera = true;
	this._level_group.add(this._level_text);
	this._level_lock = game.add.image(x, y, "level_lock");
	this._level_lock.anchor.setTo(0.5, 0.5);
	this._level_lock.fixedToCamera = true;
	this._level_lock.visible = lock;
	this._level_group.add(this._level_lock);
	this._level_lock.inputEnabled = false;

	this._level_group.onChildInputDown.add(this.onDown, this);
	this._level_group.onChildInputOver.add(this.onOver, this);
	this._level_group.onChildInputOut.add(this.onOut, this);
};
LevelButton.prototype.update = function () {
	if (this._level_lock.visible)
		this._level_button.inputEnabled = false;
	else
		this._level_button.inputEnabled = true;

};
LevelButton.prototype.unLock = function () {
	this._level_lock.visible = false;
}
LevelButton.prototype.setStars = function (val) {
	this._level_button.frame = val;
}
LevelButton.prototype.onDown = function () {
	if (!this._level_lock.visible) {
		this._level_button.scale.set(1);
		this._level_text.scale.set(1);
		this.lvl_state = this._level < 10 ? "level0" + this._level : "level" + this._level;
		this.game.state.start(this.lvl_state);
	}
};
LevelButton.prototype.onOver = function () {
	if (this._level_lock.visible)
		this._level_lock.scale.set(1.1);
	this._level_button.scale.set(1.1);
	this._level_text.scale.set(1.1);
};
LevelButton.prototype.onOut = function () {
	if (this._level_lock.visible)
		this._level_lock.scale.set(1);
	this._level_button.scale.set(1);
	this._level_text.scale.set(1);
};
LevelButton.prototype.destroy = function(){
this._level_group.destroy();
this._level_group=null;
};