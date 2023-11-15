"use strict";
var images;
window.JellyTruck.state.load = {
    preload: function(){
    // we have preloaded assets required for Loading group objects in the Boot state
	this.ready = false;
	this.title = this.game.add.sprite(this.game.width/2+20,this.game.height/2-50,"splash");
	this.title.anchor.set(0.5,0.5);

	/*this.load_border = this.game.add.sprite(this.game.width/2,this.game.height/2+50,"loadbg");
	this.load_border.anchor.set(0.5,0.5);
    this.bar = this.game.add.sprite(this.game.width/2-95,this.game.height/2+50,"bar");
	this.bar.anchor.set(0,0.5);
    this.game.load.setPreloadSprite(this.bar);*/
	this.text = this.game.add.text(this.game.width/2+15, this.game.height/2+40, "Loading...", { font: "22px king_cool_kc",fill: '#ffffff' });
	this.text.anchor.set(0.5,0.5);
      /*  this.press_txt;
        if(navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i))
        {
           this.press_txt = this.game.add.text(this.game.width/2, this.game.height/2+220, "Tap to Continue", { font: "22px king_cool_kc",fill: '#ffffff' });
           this.press_txt.anchor.set(0.5,0.5);
           this.press_txt.visible=false;
        }
        else
        {
            
           this.press_txt = this.game.add.text(this.game.width/2, this.game.height/2+220, "Click to Continue", { font: "22px king_cool_kc",fill: '#ffffff' });
           this.press_txt.anchor.set(0.5,0.5);
           this.press_txt.visible=false;
        }*/

    //Loading asset File
	this.game.load.image("bg", "assets/background/bg.png");
    this.game.load.image("bg_light", "assets/background/bg_light.png");
    
    //Game Ui and Menu
	this.game.load.image("menubg", "assets/menu/menu_bg.png");
	this.game.load.image("menu_paint", "assets/menu/paint.png");
	this.game.load.spritesheet("playthegame", "assets/menu/play.png", 154, 151);
	this.game.load.spritesheet("howtoplay", "assets/menu/help.png", 144, 139);
	this.game.load.spritesheet("options", "assets/menu/options.png", 138, 137);
	this.game.load.spritesheet("radio_button", "assets/menu/radio_button.png", 44,39);
	this.game.load.spritesheet("options_choose_level", "assets/menu/options_choose_level.png",94,91);
	this.game.load.spritesheet("option_main_menu", "assets/menu/option_main_menu.png",94,91);
	this.game.load.spritesheet("fxIcon", "assets/menu/fx.png",47,48);
	this.game.load.spritesheet("soundIcon", "assets/menu/sound.png",46,48);
	this.game.load.spritesheet("pauseIcon", "assets/menu/pause.png",42,45);
	this.game.load.spritesheet("restartIcon", "assets/menu/restart.png",44,46);
	this.game.load.atlasJSONHash("leaf1", "assets/menu/leaf1.png", "assets/menu/leafData.json");	
	this.game.load.atlasJSONHash("yellow_leaf", "assets/menu/yellow_leaf.png", "assets/menu/leafData.json");
	this.game.load.spritesheet("level_bg", "assets/menu/level_bg.png",93,88);
	this.game.load.image("level_lock", "assets/menu/level_lock.png");
	this.game.load.spritesheet("back_btn", "assets/menu/back_btn.png",66,68);
    this.game.load.spritesheet("next_mission", "assets/menu/next_mission.png",104,102);
    this.game.load.spritesheet("downArrow", "assets/texture/down_arrow.png", 58, 96, 50);
	this.game.load.image("3_star", "assets/menu/3_star.png");
	this.game.load.image("how_to_play_popup", "assets/menu/how_to_play_popup.png");
	this.game.load.image("how_to_play_popup_mobile", "assets/menu/how_to_play_popup_mobile.png");	
	this.game.load.image("closeBtn", "assets/menu/closeBtn.png");	
	this.game.load.spritesheet("level_restart", "assets/menu/level_restart.png",105,103);
	this.game.load.image("mill_bolt", "assets/texture/bolt.png");
	this.game.load.image("flag_head", "assets/texture/flag_head.png");
    this.game.load.image("flag_mid", "assets/texture/flag_mid.png");
    this.game.load.image("flag_bot", "assets/texture/flag_bot.png");
	this.game.load.image("Truck1", "assets/truck/Truck1.png");
    this.game.load.image("Truck2", "assets/truck/Truck2.png");
    this.game.load.image("Truck3", "assets/truck/Truck3.png");
    this.game.load.image("Wheel", "assets/truck/wheel.png");
    this.game.load.image("Enemy_Truck", "assets/truck/enemy_truck.png");
    this.game.load.image("Enemy_Truck_Back", "assets/truck/enemy_wheel_back.png");
    this.game.load.image("Enemy_Truck_Front", "assets/truck/enemy_wheel_front.png");
    this.game.load.image("gum_1", "assets/texture/gum_1.png");
	this.game.load.image("gum_2", "assets/texture/gum_2.png");
	this.game.load.image("gum_3", "assets/texture/gum_3.png");
	this.game.load.image("gum_4", "assets/texture/gum_4.png");
	this.game.load.image("gum_5", "assets/texture/gum_5.png");
	this.game.load.image("gum_6", "assets/texture/gum_6.png");
    this.game.load.image("gum_7", "assets/texture/gum_7.png");
    this.game.load.image("hallow", "assets/texture/hallow.png");    
	this.game.load.image("rope1", "assets/texture/rope1.png");
	this.game.load.image("crusher", "assets/texture/crusher0002.png");
	this.game.load.image("lift_mask", "assets/texture/platform_mark.png");
	this.game.load.image("mill1", "assets/texture/mill1.png");
    this.game.load.image("mill2", "assets/texture/mill2.png");
    this.game.load.image("truck2_icon", "assets/truck/truck2_icon.png");
    this.game.load.image("arrow14", "assets/texture/arrow14.png");
    this.game.load.image("level_8_door_1", "assets/texture/level_8_door_1.png");
    this.game.load.image("level_8_door_2", "assets/texture/level_8_door_2.png");    
    this.game.load.image("truck3_icon", "assets/truck/truck3_icon.png");
	this.game.load.image("star01", "assets/menu/star01.png");
	this.game.load.image("star02", "assets/menu/star02.png");
	this.game.load.image("go_img", "assets/menu/go_img.png");
	this.game.load.image("stop_img", "assets/menu/stop_img.png");
	this.game.load.image("left_bt", "assets/menu/left.png");
    this.game.load.image("right_bt", "assets/menu/right.png");
    this.game.load.image("ballIcon13", "assets/texture/ballIcon13.png");
    this.game.load.image("mill3", "assets/texture/mill3.png");
    this.game.load.image("bridge2", "assets/texture/bridge2.png");
    this.game.load.image("Box1", "assets/texture/Box1.png");
    this.game.load.image("Box2", "assets/texture/Box2.png"); 
    this.game.load.image("bridge12", "assets/texture/bridge12.png");
    this.game.load.image("bolt12", "assets/texture/bolt12.png");
    this.game.load.image("bridge15", "assets/texture/bridge15.png");
    this.game.load.image("crusher0001", "assets/texture/crusher0001.png");
    this.game.load.image("box17_small", "assets/texture/box17_small.png");
    this.game.load.image("box17_long", "assets/texture/box17_long.png");
    this.game.load.image("bridge17", "assets/texture/bridge17.png");
    this.game.load.image("mill17_1", "assets/texture/mill17_1.png");
    this.game.load.image("mill17_2", "assets/texture/mill17_2.png");
    this.game.load.image("bar17", "assets/texture/bar17.png");
    this.game.load.image("barWheel17", "assets/texture/barWheel17.png");
    this.game.load.image("bridge18", "assets/texture/bridge18.png");
    this.game.load.image("crusher0005", "assets/texture/crusher0005.png");
    this.game.load.spritesheet("balloonBurst", "assets/texture/balloonburst.png", 555, 453, 7);
    this.game.load.image("mill18_2", "assets/texture/mill18_2.png");
    this.game.load.image("mill18_3", "assets/texture/mill18_3.png");
    this.game.load.image("Blade_mill", "assets/texture/Blade_mill.png");
    this.game.load.image("yellow_hor_bar", "assets/texture/yellow_hor_bar.png");
    this.game.load.image("small_orange_ver_bar", "assets/texture/small_orange_ver_bar.png");
    this.game.load.image("red_ver_bar", "assets/texture/red_ver_bar.png");
    this.game.load.image("orange_hor_bar", "assets/texture/orange_hor_bar.png");
    this.game.load.image("dark_orange_ver_bar", "assets/texture/dark_orange_ver_bar.png");
    this.game.load.spritesheet("balloonBurst", "assets/texture/balloonburst.png", 555, 453, 7);
    this.game.load.image("options_popup", "assets/menu/options_popup.png");
    
    this.game.load.audio("truck_bang2",["assets/sounds/mp3/100_truck_bang2.mp3","assets/sounds/m4a/100_truck_bang2.m4a"]);
	//this.game.load.spritesheet("buttonvertical", "assets/menu/button-vertical.png",64,64);
    //this.game.load.spritesheet("buttonhorizontal", "assets/menu/button-horizontal.png",96,64);
	
    this.game.load.image("menu_scene", "assets/scene/menu_scene.png");
    this.game.load.image("scene_1", "assets/scene/scene_1.png");
    this.game.load.image("scene_2", "assets/scene/scene_2.png");
    this.game.load.image("scene_3", "assets/scene/scene_3.png");
    this.game.load.image("scene_4", "assets/scene/scene_4.png");
    this.game.load.image("scene_5", "assets/scene/scene_5.png");
    this.game.load.image("scene_5_2", "assets/scene/scene_5_2.png");
    this.game.load.image("scene_6", "assets/scene/scene_6.png");
    this.game.load.image("scene_7", "assets/scene/scene_7.png");
    this.game.load.image("scene_8", "assets/scene/scene_8.png");
    this.game.load.image("scene_9", "assets/scene/scene_9.png");
    this.game.load.image("scene_10", "assets/scene/scene_10.png");
    this.game.load.image("scene_11", "assets/scene/scene_11.png");
    this.game.load.image("scene_12", "assets/scene/scene_12.png");
    this.game.load.image("scene_13", "assets/scene/scene_13.png");
    this.game.load.image("scene_14", "assets/scene/scene_14.png");
    this.game.load.image("scene_15", "assets/scene/scene_15.png");
    this.game.load.image("scene_16", "assets/scene/scene_16.png");
    this.game.load.image("scene_17", "assets/scene/scene_17.png");
    this.game.load.image("scene_18", "assets/scene/scene_18.png");
    this.game.load.image("scene_19", "assets/scene/scene_19.png");
    this.game.load.image("scene_20", "assets/scene/scene_20.png");

	this.game.load.image("menu_ground", "assets/ground/menu_ground.png");
    this.game.load.image("ground_1", "assets/ground/ground_1.png");
    this.game.load.image("ground_2", "assets/ground/ground_2.png");
    this.game.load.image("ground_3", "assets/ground/ground_3.png");
    this.game.load.image("ground_4", "assets/ground/ground_4.png");
    //this.game.load.image("ground_5", "assets/ground/ground_5.png");
    this.game.load.image("ground_6", "assets/ground/ground_6.png");
    this.game.load.image("ground_7", "assets/ground/ground_7.png");
    this.game.load.image("ground_9", "assets/ground/ground_9.png");
    //this.game.load.image("ground_10", "assets/ground/ground_10.png");
    this.game.load.image("ground_12", "assets/ground/ground_12.png");
    this.game.load.image("ground_13", "assets/ground/ground_13.png");
    this.game.load.image("ground_14", "assets/ground/ground_14.png");
    //this.game.load.image("ground_15", "assets/ground/ground_15.png");
    //this.game.load.image("ground_16", "assets/ground/ground_16.png");
    this.game.load.image("ground_17", "assets/ground/ground_17.png");
    this.game.load.image("ground_19", "assets/ground/ground_19.png");
    this.game.load.image("ground_20", "assets/ground/ground_20.png");
    //this.game.load.image("ground_mask","assets/ground/ground_mask.png");

    this.game.load.tilemap("map", "js/physics.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("menu_map", "js/data/menu.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_1_map", "js/data/Level01.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_2_map", "js/data/Level02.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_3_map", "js/data/Level03.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_4_map", "js/data/Level04.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_5_map", "js/data/Level05.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_6_map", "js/data/Level06.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_7_map", "js/data/Level07.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_8_map", "js/data/Level08.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_9_map", "js/data/Level09.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_10_map", "js/data/Level10.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_11_map", "js/data/Level11.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_12_map", "js/data/Level12.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_13_map", "js/data/Level13.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_14_map", "js/data/Level14.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_15_map", "js/data/Level15.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_16_map", "js/data/Level16.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_17_map", "js/data/Level17.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_18_map", "js/data/Level18.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_19_map", "js/data/Level19.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("level_20_map", "js/data/Level20.json", null, Phaser.Tilemap.TILED_JSON);
	this.game.load.physics("legoData", "js/lego.json");

	this.game.load.audio("bgmusic", ["assets/sounds/mp3/93_melodia1.mp3","assets/sounds/m4a/93_melodia1.m4a"]);
	this.game.load.audio("odd_music",["assets/sounds/mp3/92_melodia2a.mp3","assets/sounds/m4a/92_melodia2a.m4a"]);
	this.game.load.audio("even_music",["assets/sounds/mp3/74_melodia2.mp3","assets/sounds/m4a/74_melodia2.m4a"]);
	this.game.load.audio("truck_slow",["assets/sounds/mp3/84_truck_slow.mp3","assets/sounds/m4a/84_truck_slow.m4a"]);
	this.game.load.audio("truck_speed",["assets/sounds/mp3/80_truck_speed.mp3","assets/sounds/m4a/80_truck_speed.m4a"]);
	this.game.load.audio("truck_idle",["assets/sounds/mp3/94_truck_idle.mp3","assets/sounds/m4a/94_truck_idle.m4a"]);
    this.game.load.audio("truck_bang1",["assets/sounds/mp3/99_truck_bang1.mp3","assets/sounds/m4a/99_truck_bang1.m4a"]);
    this.game.load.audio("truck_change",["assets/sounds/mp3/70_truck_hit.mp3","assets/sounds/m4a/70_truck_hit.m4a"]);
    this.game.load.audio("truck_wobble1", ["assets/sounds/mp3/83_wo11.mp3","assets/sounds/m4a/83_wo11.m4a"]);
	this.game.load.audio("truck_wobble2", ["assets/sounds/mp3/82_wo22.mp3","assets/sounds/m4a/82_wo22.m4a"]);
    this.game.load.audio("truck_wobble3", ["assets/sounds/mp3/81_wo33.mp3","assets/sounds/m4a/81_wo33.m4a"]);
    this.game.load.audio("truck_start",["assets/sounds/mp3/77_truck_start.mp3","assets/sounds/m4a/77_truck_start.m4a"]);
	this.game.load.audio("button_over", ["assets/sounds/mp3/98_zvuk_over.mp3","assets/sounds/m4a/98_zvuk_over.m4a"]);	  
    this.game.load.audio("button_click", ["assets/sounds/mp3/68_zvuk_click.mp3","assets/sounds/m4a/68_zvuk_click.m4a"]);	
    this.game.load.audio("bonus",["assets/sounds/mp3/97_zvuk_odraz.mp3","assets/sounds/m4a/97_zvuk_odraz.m4a"]);
    this.game.load.audio("auto_crash2",["assets/sounds/mp3/95_auto_crash2.mp3","assets/sounds/m4a/95_auto_crash2.m4a"])
    this.game.load.audio("auto_crash4",["assets/sounds/mp3/79_auto_crash4.mp3","assets/sounds/m4a/79_auto_crash4.m4a"])
	this.game.load.audio("end_of_Level_yeah",["assets/sounds/mp3/62_yeah.mp3","assets/sounds/m4a/62_yeah.m4a"]);

	//if (window.localStorage) window.localStorage.removeItem("coolmath_jellytruck");
	if(window.localStorage.getItem("coolmath_jellytruck")===null)
            { 
                jt.InitData()
		jt.game_data = jt.LoadData();
            }
	else
            {
                jt.game_data = jt.LoadData();
            }
			
	 this.game.input.addPointer();
         this.game.input.addPointer();
    },
    loadUpdate:function()
	{
		this.text.setText("Loading   "+this.game.load.progress +"%");
	},
    create: function(){
	this.game.levelNumber = 0;
         // images = this.game.cache.getKeys(Phaser.Cache.IMAGE);
          if (navigator.userAgent.match(/Android|BlackBerry|Opera Mini|IEMobileiPhone|iPad|iPod/i)) {
              this.ready = true;
          }
          else
          {
              this.ready = true;
          }
          
      
    },
    loadComplete:function(){
	//this.ready = true;
    },
    update:function() {
	if( window.localStorage.getItem("coolmath_jellytruck")!==null && this.ready && this.game.cache.checkSoundKey("end_of_Level_yeah"))
	{
        //  this.press_txt.visible=true;
      //  this.game.sound.context.resume();
        this.game.state.start("menu");
      	}
  /*      if(this.game.input.activePointer.justPressed()  && this.press_txt.visible)
          {
             this.game.sound.context.resume();
              this.game.state.start("menu");
              
          }*/
    },
	/*createSoundAndMusic: function() {
        //this.gameMusic = this.game.add.audio('music');
      //  if (typeof this.game.gameMusic !== 'object')
		  {
			this.game.sound.stopAll();	
            this.game.bgMusic = this.game.add.audio('bgmusic');
			this.game.truck_idle = this.game.add.audio('truckidle');
			this.game.sound.volume = 0.8;
			this.game.level1_music = this.game.add.audio('level01_music');
			this.game.level2_music = this.game.add.audio('level02_music');


        }
	}*/
    onTap:function(pointer) {
           this.game.sound.context.resume();
              this.game.state.start("menu");
    },
	shutdown:function(){
		this.game.world.removeAll();
		this.title.destroy();
		this.title=null;
		//this.load_border.destroy();
		//this.load_border=null;
		//this.bar.destroy();
		//this.bar=null;
		this.text.destroy();
		this.text=null;
	}
};
