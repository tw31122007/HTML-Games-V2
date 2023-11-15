function WellDone(game,score,bonus,star)
{
    this.game = game;
    this.score = score;
    this.bonus =bonus;
    this.star = star;
    this.levelEndGroup = this.game.add.group(null,"wellDoneGroup",true);
   // this.levelEndGroup.fixedToCamera = true;
    //this.levelEndGroup.visible = false;
    this.one = this.game.add.image(800, 190, '3_star');
    this.one.anchor.set(0.5);
    this.levelEndGroup.add(this.one);

    this.choiseLabel = this.game.add.text(800, 80, 'MISSION COMPLETED', { font: '66px king_cool_kc', fill: '#ffffff', align:'center' });
    this.choiseLabel.anchor.set(0.5);
   // this.choiseLabel.setShadow(5, 5, 'rgba(0,0,0,0.9)', 5);
    this.levelEndGroup.add(this.choiseLabel);
    

    this.scoreLabel;
    this.bonusLabel;
    this.bonustimer;
    this.nextButton;
    this.starone = 	this.game.add.image(200, -100, 'star01');
    this.starone.anchor.set(0.5);
    this.startwo = 	this.game.add.image(380, -100, 'star01');
    this.startwo.anchor.set(0.5);
    this.starthree = this.game.add.image(600, -100, 'star01');
    this.starthree.anchor.set(0.5);
    this.levelEndGroup.add(this.starone);
    this.levelEndGroup.add(this.startwo);
    this.levelEndGroup.add(this.starthree);
    this.start();
   
};
WellDone.prototype.killDone = function(){
    this.levelEndGroup.destroy();
    jt.well_done =null;
};
WellDone.prototype.start = function(){
    if(jt.sfx)
        jt.sfx.playSound("well_done");
    this.game.add.tween(this.choiseLabel).to( { x: '-400' }, 800, Phaser.Easing.Linear.None, true);
    this.onetween = this.game.add.tween(this.one).to( { x: '-400' }, 800, Phaser.Easing.Linear.None, true);
    this.onetween.onComplete.add(this.addScore, this);
};
WellDone.prototype.addScore = function(){
    if(this.score >0)
    {
        this.scoreLabel = this.game.add.text(400, 410, 'score: '+(this.score).toFixed(0), { font: '28px king_cool_kc', fill: '#ffffff', align:'center' });
        this.scoreLabel.anchor.set(0.5);
        this.levelEndGroup.add(this.scoreLabel);
        this.scoretween = this.game.add.tween(this.scoreLabel).to( { y: '-130' }, 500, Phaser.Easing.Linear.None, true);
        this.scoretween.onComplete.add(this.addBonus, this);
    }
    else
    {
        this.addBonus();
    }
   };
WellDone.prototype.addBonus = function(){
    if(this.bonus > 0)
    {
        this.bonusLabel = this.game.add.text(400, 450, 'bonus: '+this.bonus, { font: '28px king_cool_kc', fill: '#ffffff', align:'center' });
        this.bonusLabel.anchor.set(0.5);
        this.levelEndGroup.add( this.bonusLabel);
        this.bonustween = this.game.add.tween(this.bonusLabel).to( { y: '-130' }, 500, Phaser.Easing.Linear.None, true);
        this.bonustween.onComplete.add(this.startTimer, this);
    }
    else
    {
       this.showNext();
    }
};
WellDone.prototype.startTimer = function(){
  this.bonustimer = this.game.time.events.loop(100, this.adjustScore, this);
};
WellDone.prototype.adjustScore = function(){
    this._sec = this.bonus;
    if(this._sec >0)
    {
        if(this._sec>100)
        {
            this._sec -= 100;
            this.score += 100;
            this.bonus =this._sec;
        }
        else
         {
            this.score += this._sec;
            this._sec =0;
            this.bonus =0;
         }
          if(jt.sfx)
           jt.sfx.playSound("bonus");
         this.scoreLabel.setText('score: '+(this.score).toFixed(0));
         this.bonusLabel.setText('bonus: '+(this.bonus).toFixed(0));
    }
    else
    {
        this.game.time.events.remove(this.bonustimer);
        this.bonusLabel.destroy();
        if(this.star>0)
           this.starOne();
        else
           this.showNext();
       
    }
};
WellDone.prototype.starOne = function(){
  
     this.onestar = this.game.add.tween(this.starone).to( {   x:'190', y: '295' }, 100, Phaser.Easing.Linear.None, true,100);
     if(jt.sfx)
        jt.sfx.playSound("auto_crash_4"); 
    if(this.star>1)
        this.onestar.onComplete.add(this.starTwo, this);
     else
       this.onestar.onComplete.add(this.showNext, this);
};
WellDone.prototype.starTwo = function(){
 
    this.twostar = this.game.add.tween(this.startwo).to( { x: '-32', y: '273',angle:'36' }, 100, Phaser.Easing.Linear.None, true,200);
    if(jt.sfx)
        jt.sfx.playSound("auto_crash_4");
    if(this.star>2)
       this.twostar.onComplete.add(this.starThree, this);
    else
    {
        this.twostar.onComplete.add(this.showNext, this);
    }
};

WellDone.prototype.starThree = function(){
    
    this.threestar = this.game.add.tween(this.starthree).to( {x: '-163', y: '273',angle:'-36'},100, Phaser.Easing.Linear.None, true,300);
     if(jt.sfx)
        jt.sfx.playSound("auto_crash_4");
     this.threestar.onComplete.add(this.showNext, this);
   
};
WellDone.prototype.showNext = function(){
     if(jt.sfx && this.star === 3)
        jt.sfx.playSound("auto_crash_2");
    
     this.nextButton = this.game.add.button(400, 380, "next_mission", this.onNextClick, this, 1, 0, 0);
     this.nextButton.anchor.set(0.5);
     this.levelEndGroup.add(this.nextButton);
     if(jt.sfx)
         jt.sfx.playTruckSound("truck_change");
}
WellDone.prototype.onNextClick = function(){
    this.levelEndGroup.destroy();
    jt.well_done=null;
    if(jt.current_level === parseInt(jt.game_data.lastPlayed))
     {
        if(this.score > jt.game_data.levels[jt.current_level-1].score)
        {
            jt.game_data.levels[jt.current_level-1].score = this.score;
            jt.game_data.levels[jt.current_level-1].star = this.star;
        }
        jt.game_data.lastPlayed = jt.current_level+1;
        jt.SaveData();
        jt.game_data = jt.LoadData();

        if(jt.current_level >= 20){
            jt.menu_in_state =1;
            this.game.physics.box2d.resume();
            this.game.sound.stopAll();
            this.game.state.start("menu");
        }
        else{
            this.game.state.start(this.game.nextlevelNumber);
        }
        
     }
     else
     {
        if(this.score > jt.game_data.levels[jt.current_level-1].score)
        {
            jt.game_data.levels[jt.current_level-1].score = this.score;
            jt.game_data.levels[jt.current_level-1].star = this.star;
        }
        jt.SaveData();
        jt.game_data = jt.LoadData();
        jt.menu_in_state =1;
        this.game.physics.box2d.resume();
        this.game.sound.stopAll();
        this.game.state.start("menu");
     }
};

///Game Menu....................................
function GameMenu(game)
{
    this.game = game;
    this.gameMenuGroup = this.game.add.group(null,"gameMenuGroup",true);
    if(parseInt(jt.game_data.sound)===1)
         this.fx = this.game.add.button(this.game.width-30, 30, "fxIcon", this.onSoundClick, this,3,2,2);
    else
         this.fx = this.game.add.button(this.game.width-30, 30, "fxIcon", this.onSoundClick, this,1,0,0);
    this.fx.anchor.set(0.5);
   // this.fx.fixedToCamera = true;
    this.fx.inputEnabled = true;
    this.gameMenuGroup.add(this.fx);
    if(parseInt(jt.game_data.music)===1)
        this.soundIcon = this.game.add.button(this.game.width-80, 30, "soundIcon", this.onMusicClick, this,3,2,2);
    else
        this.soundIcon = this.game.add.button(this.game.width-80, 30, "soundIcon", this.onMusicClick, this,1,0,0);
    this.soundIcon.anchor.set(0.5);
  //  this.soundIcon.fixedToCamera = true;
    this.soundIcon.inputEnabled = true;
    this.gameMenuGroup.add(this.soundIcon);

    this.restart = this.game.add.button(30,30, "restartIcon", this.onRestartClick, this,1,0,0);
    this.restart.anchor.set(0.5);
  //  this.restart.fixedToCamera = true;
    this.restart.inputEnabled = true;
    this.gameMenuGroup.add(this.restart);

    this.pause = this.game.add.button(75,30, "pauseIcon", this.onPauseClick, this,1,0,0);
    this.pause.anchor.set(0.5);
   // this.pause.fixedToCamera = true;
    this.pause.inputEnabled = true;
    this.gameMenuGroup.add(this.pause);

    this.levelLabel = this.game.add.text(400, this.game.height- 450, this.game.mobLevel, { font: '24px king_cool_kc', fill: '#ffffff', align:'center' });
   // this.levelLabel.fixedToCamera = true;
    this.levelLabel.anchor.set(0.5);
    this.gameMenuGroup.add(this.levelLabel);

    this.score_txt = this.game.add.text(400,420, "Score: ", { font: "26px king_cool_kc", fill: "#ffffff", align: "center" });
	//this.score_txt.fixedToCamera = true;
    this.score_txt.visible = false;
    this.score_txt.anchor.set(0.5);
	this.score=0;
    this.gameMenuGroup.add(this.score_txt);
   
    this.menu_button_over_snd = this.game.add.audio("button_over");
    this.menu_button_click_snd = this.game.add.audio("button_click");
    this.gameMenuGroup.visible = false;


    /// Mobile Controller
    if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i))
    {
        this.gameController();
    }
    

};
GameMenu.prototype.gameController = function() {
    this.buttonleft = this.game.add.button(50, 430, 'left_bt', null, this, 0, 1, 0, 1);
    //this.buttonleft.fixedToCamera = true;
    this.buttonleft.anchor.set(0.5);
    this.gameMenuGroup.add(this.buttonleft);

    this.buttonleft.events.onInputDown.add(function() {
        jt.mobileleft = true;
    });
    this.buttonleft.events.onInputUp.add(function() {
        jt.mobileleft = false;
    });

    this.buttonright = this.game.add.button(150, 430, 'right_bt', null, this, 0, 1, 0, 1);
   // this.buttonright.fixedToCamera = true;
    this.buttonright.anchor.set(0.5);
    this.gameMenuGroup.add(this.buttonright);

    this.buttonright.events.onInputDown.add(function() {
        jt.mobileright = true;
    });
    this.buttonright.events.onInputUp.add(function() {
        jt.mobileright = false;
    });

    this.buttondown = this.game.add.button(this.game.width-150, 430, 'stop_img', null, this, 0, 1, 0, 1);
    //this.buttondown.fixedToCamera = true;
    this.buttondown.anchor.set(0.5);
    this.gameMenuGroup.add(this.buttondown);

    this.buttondown.events.onInputDown.add(function() {
        jt.mobiledown = true;
    });
    this.buttondown.events.onInputUp.add(function() {
        jt.mobiledown = false;
    });

    this.buttonup = this.game.add.button(this.game.width-50, 430, 'go_img', null, this, 0, 1, 0, 1);
    // this.buttonup.fixedToCamera = true;
    this.buttonup.anchor.set(0.5);
    this.gameMenuGroup.add(this.buttonup);

    this.buttonup.events.onInputDown.add(function() {
        jt.mobileup = true;
    });
    this.buttonup.events.onInputUp.add(function() {
        jt.mobileup = false;
    });

};
GameMenu.prototype.onMusicClick = function(){
    switch(parseInt(jt.game_data.music))
    {
        case 0:
            jt.game_data.music="1";
            this.soundIcon.setFrames(3,2,2);
            jt.SaveData();
            jt.game_data = jt.LoadData();
        break;
        case 1:
            jt.game_data.music ="0";
            this.soundIcon.setFrames(1,0,0);
            jt.SaveData();
            jt.game_data = jt.LoadData();
        break;
    }
};
GameMenu.prototype.onSoundClick = function(){
    switch(parseInt(jt.game_data.sound))
    {
        case 0:
            jt.game_data.sound="1";
            this.fx.setFrames(3,2,2);
            jt.SaveData();
            jt.game_data = jt.LoadData();
        break;
        case 1:
            jt.game_data.sound ="0";
            this.fx.setFrames(1,0,0);
            jt.SaveData();
            jt.game_data = jt.LoadData();
        break;
    }
};
GameMenu.prototype.onRestartClick = function(){
    if(jt.game_fail!=null)
    {
        jt.game_fail.killRestart();
        jt.game_fail = null;
    }
    this.game.state.start(this.game.levelNumber);
};
GameMenu.prototype.onPauseClick = function(){
    jt.pause = true;
    if(jt.pause){
        this.game.physics.box2d.pause();
    }
     // this.game.camera.unfollow();
      this.showOption();
};
GameMenu.prototype.destroy = function(){
    this.gameMenuGroup.destroy();
};
GameMenu.prototype.showOption = function(){
    if(jt.sfx)
       jt.sfx.stopAllSound();
    this.fx.inputEnabled = false;
    this.pause.inputEnabled = false;
    this.soundIcon.inputEnabled = false;
    this.restart.inputEnabled = false;
    
    this.option_popup = this.game.add.group(null,"optionGroup",true);
    this.option = this.game.add.image(-15, -50, 'options_popup');
  //  this.option.fixedToCamera = true;
    this.option_popup.add(this.option);
    if(parseInt(jt.game_data.music)===1)
    this.music_radio_button = this.game.add.button(450, 170, "radio_button", this.musicBtnClicked, this,3,2,2);     
    else
    this.music_radio_button = this.game.add.button(450, 170, "radio_button", this.musicBtnClicked, this,1,0,0);  
    this.music_radio_button.anchor.setTo(0.5, 0.5);
  //  this.music_radio_button.fixedToCamera = true;
    this.option_popup.add(this.music_radio_button);
    if(parseInt(jt.game_data.sound)===1)
        this.sound_radio_button = this.game.add.button(450, 213, "radio_button",this.optionSoundClick, this,3,2,2);
    else
        this.sound_radio_button = this.game.add.button(450, 213, "radio_button", this.optionSoundClick, this,1,0,0);
    this.sound_radio_button.anchor.setTo(0.5, 0.5);
  //  this.sound_radio_button.fixedToCamera = true;
    this.option_popup.add(this.sound_radio_button);

    this.closeBtn = this.game.add.button(570, 105, "closeBtn", this.resumeGame, this);
 //   this.closeBtn.fixedToCamera = true;
    this.option_popup.add(this.closeBtn);
    
    this.option_main_menu = this.game.add.button(320, 256, "option_main_menu",function optionToMenu(){
        jt.pause = false;
        if(jt.game_menu !=null)
		    jt.game_menu.killMenu();
        this.option_popup.destroy();
        jt.menu_in_state =0;
        this.game.physics.box2d.resume();
        this.game.state.start("menu");
    }, this,1,0,0);
   // this.option_main_menu.fixedToCamera = true;
    this.option_popup.add(this.option_main_menu);

    this.options_choose_level = this.game.add.button(423, 256, "options_choose_level", function levelBack(){
        jt.pause = false;
	    if(jt.game_menu !=null)
		    jt.game_menu.killMenu();
        this.option_popup.destroy();
        jt.menu_in_state =1;
        this.game.physics.box2d.resume();
        this.game.state.start("menu");
    }, this,1,0,0);
  //  this.options_choose_level.fixedToCamera = true;
    this.option_popup.add(this.options_choose_level);
    if(jt.game_data.sound==="1")
                {
                    this.option_main_menu.onDownSound = this.menu_button_click_snd;
                    this.option_main_menu.onOverSound = this.menu_button_over_snd;
                    this.options_choose_level.onDownSound = this.menu_button_click_snd;
                    this.options_choose_level.onOverSound = this.menu_button_over_snd;
                    this.closeBtn.onDownSound = this.menu_button_click_snd;
                }
                else
                {
                    this.option_main_menu.onDownSound = null;
                    this.option_main_menu.onOverSound = null;
                    this.options_choose_level.onDownSound = null;
                    this.options_choose_level.onOverSound = null;
                    this.closeBtn.onDownSound = null;
                }
};

GameMenu.prototype.resumeGame = function() {
    jt.pause = false;
    this.option_popup.destroy();
    this.fx.inputEnabled = true;
    this.pause.inputEnabled = true;
    this.soundIcon.inputEnabled = true;
    this.restart.inputEnabled = true;
    if(!jt.pause){
        this.game.physics.box2d.resume();
    }
};
GameMenu.prototype.musicBtnClicked = function() {
    switch(parseInt(jt.game_data.music))
    {
        case 0:
            jt.game_data.music="1";
            this.soundIcon.setFrames(3,2,2);
            this.music_radio_button.setFrames(3,2,2);
            jt.SaveData();
            jt.game_data = jt.LoadData();
            if(jt.game_data.sound==="1")
                this.menu_button_click_snd.play();
        break;
        case 1:
            jt.game_data.music ="0";
            this.soundIcon.setFrames(1,0,0);
            this.music_radio_button.setFrames(1,0,0);
            jt.SaveData();
            jt.game_data = jt.LoadData();
            if(jt.game_data.sound==="1")
                this.menu_button_click_snd.play();
        break;
    }
},
GameMenu.prototype.optionSoundClick = function(){
    switch(parseInt(jt.game_data.sound))
    {
        case 0:
            jt.game_data.sound="1";
            this.fx.setFrames(3,2,2);
            this.sound_radio_button.setFrames(3,2,2);
            jt.SaveData();
            jt.game_data = jt.LoadData();
            this.option_main_menu.onDownSound = this.menu_button_click_snd;
            this.option_main_menu.onOverSound = this.menu_button_over_snd;
            this.options_choose_level.onDownSound = this.menu_button_click_snd;
            this.options_choose_level.onOverSound = this.menu_button_over_snd;
            this.closeBtn.onDownSound = this.menu_button_click_snd;
        break;
        case 1:
            jt.game_data.sound ="0";
            this.fx.setFrames(1,0,0);
            this.sound_radio_button.setFrames(1,0,0);
            jt.SaveData();
            jt.game_data = jt.LoadData();
            this.option_main_menu.onDownSound = null;
                    this.option_main_menu.onOverSound = null;
                    this.options_choose_level.onDownSound = null;
                    this.options_choose_level.onOverSound = null;
                    this.closeBtn.onDownSound = null;
           
        break;
    }
};

GameMenu.prototype.zoom = function(val) {
    if(val < 1)
    {
        this.restart.scale.x +=val;
        this.restart.scale.y +=val;
        this.pause.scale.x +=val;
        this.pause.scale.y +=val;
        this.levelLabel.scale.x +=val;
        this.levelLabel.scale.y +=val;
        this.fx.scale.x +=val;
        this.fx.scale.y +=val;
        this.soundIcon.scale.x +=val;
        this.soundIcon.scale.y +=val;
    
        this.score_txt.scale.x +=val;
        this.score_txt.scale.y +=val;
    }
    else
    {
        this.restart.scale.x = 1;
        this.restart.scale.y = 1;
        this.pause.scale.x = 1;
        this.pause.scale.y = 1;
        this.levelLabel.scale.x =1;
        this.levelLabel.scale.y =1;
        this.fx.scale.x = 1;
        this.fx.scale.y = 1;
        this.soundIcon.scale.x = 1;
        this.soundIcon.scale.y = 1;
    
        this.score_txt.scale.x = 1;
        this.score_txt.scale.y = 1;
    }
};
GameMenu.prototype.outzoom = function(val,zval) {
    if(val < zval)
    {
        this.restart.scale.x +=val;
        this.restart.scale.y +=val;
        this.pause.scale.x +=val;
        this.pause.scale.y +=val;
        this.levelLabel.scale.x +=val;
        this.levelLabel.scale.y +=val;
        this.fx.scale.x +=val;
        this.fx.scale.y +=val;
        this.soundIcon.scale.x +=val;
        this.soundIcon.scale.y +=val;
    
        this.score_txt.scale.x +=val;
        this.score_txt.scale.y +=val;
    }
    else
    {
        this.restart.scale.x = zval;
        this.restart.scale.y = zval;
        this.pause.scale.x = zval;
        this.pause.scale.y = zval;
        this.levelLabel.scale.x =zval;
        this.levelLabel.scale.y =zval;
        this.fx.scale.x = zval;
        this.fx.scale.y = zval;
        this.soundIcon.scale.x = zval;
        this.soundIcon.scale.y = zval;
    
        this.score_txt.scale.x = zval;
        this.score_txt.scale.y = zval;
    }
};
GameMenu.prototype.setScore = function(score)
{
    if(score>0)
  	this.score_txt.setText("Score: "+  (score).toFixed(0));
    else
        this.score_txt.setText("Score: 0");
	 if(!this.score_txt.visible)
	    this.score_txt.visible = true;  
};
GameMenu.prototype.enable = function()
{
    this.gameMenuGroup.visible = true;
};
GameMenu.prototype.disable = function()
{
    this.gameMenuGroup.visible = false;
};
GameMenu.prototype.killMenu = function()
{
    this.gameMenuGroup.destroy();
    jt.game_menu=null;
};
GameMenu.prototype.setLevelText = function()
{
   this.levelLabel.setText(this.game.mobLevel);
};

/////////////////////// Game Menu End

// Level Fail
function LevelFail(game){
    this.game = game;
    this.gameRestart = this.game.add.group(null,"gameRestartGroup",true);
    this.restart_txt = this.game.add.text(400, 160, "You Failed", { font: "60px king_cool_kc", fill: "#ffffff", align: "center" });
//    this.restart_txt.fixedToCamera = true;
    this.restart_txt.anchor.set(0.5);
    this.restart_txt.scale.set(0.1);
 //   this.restart_txt.visible = false;
    this.gameRestart.add(this.restart_txt);
  //  this.restart_txt.setShadow(5, 5, 'rgba(0,0,0,0.9)', 5);
    
    this.restartButton = this.game.add.button(400, 400, "level_restart", this.restartBtnClicked, this,1,0,0);
   // this.restartButton.visible = false;
  //  this.restartButton.fixedToCamera = true;
    this.restartButton.anchor.set(0.5);
    this.restartButton.scale.set(0.1);
    this.gameRestart.add(this.restartButton);
    this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    if(this.space.isDown)
        this.restartBtnClicked();
 }
LevelFail.prototype.updateFail = function()
{
    this.tweens = this.game.add.tween(this.restart_txt.scale);
    this.tweens.to({x: 1.0, y:1.0}, 1000, Phaser.Easing.Linear.None);
    //s.onComplete.addOnce(theEnd, this);
    this.tweens.start();


    //this.restartthegame.visible = true;
    this.restartButton = this.game.add.tween(this.restartButton.scale)
    this.restartButton.to({x: 1.0, y:1.0}, 1000, Phaser.Easing.Linear.None);
            //s.onComplete.addOnce(theEnd, this);
    this.restartButton.start();
    

    
};
LevelFail.prototype.killRestart = function() {
    this.gameRestart.destroy();
    jt.game_fail=null;
},
LevelFail.prototype.restartBtnClicked = function(){
    this.gameRestart.destroy();
    jt.game_fail=null;
    this.game.state.start(this.game.levelNumber);
};
//Game Bg
   function GameBg(game)
   {
       // this.bgGroup = game.add.group(null,"bgGroup",false);
        this._bg = game.add.image(game.width / 2, game.height / 2, "bg");
        this._bg.anchor.set(0.5);
        this._bg.fixedToCamera = true;

     //   this.bgGroup.add(this._bg);
        
        this._light = game.add.image(689, 108, "bg_light");
        this._light.anchor.set(0.6, 0.3);
        this._light.fixedToCamera = true;
      //  this.bgGroup.add(this._light);
       // this.bgGroup.fixedToCamera=true;
    };
    GameBg.prototype.setScale = function(val,val1)
    {
        this._bg.scale.x = val;
        this._bg.scale.y = val;
        this._light.scale.x = val1;
        this._light.scale.y = val1;
    };
	
	GameBg.prototype.destroy = function()
    {
		this._bg.destroy();
		this._bg=null;
		this._light.destroy();
		this._light=null;
		
	};

//-------------End Game Bg
//Game Sound Manager
function Sfx(game)
{
    this.game= game;
    this.menufx;
    this.oddbg;
    this.evenbg;
    this.truck_idle;
  
    this.well_done_snd;
    this.bonus_snd;
    this.autocrash2_snd;
    this.autocrash4_snd ;
    
    this.truck_idle;
    this.truck_speed;
    this.truck_slow;
    this.wob1;
    this.wob2;
    this.wob3;
    this.truck_start;
    this.truck_change;
    this.truck_bang1;
};

Sfx.prototype.setupMusic = function()
{
  this.menufx = this.game.add.audio('bgmusic');
  this.menufx.loop=true;
  this.oddbg = this.game.add.audio('odd_music');
  this.oddbg.loop=true;
  this.evenbg = this.game.add.audio('even_music');
  this.evenbg.loop =true;
  this.truck_idle = this.game.add.audio('truck_idle');
  this.truck_idle.loop =true;
  
  this.well_done_snd = this.game.add.audio("end_of_Level_yeah");
  this.bonus_snd = this.game.add.audio("bonus")
  this.autocrash2_snd = this.game.add.audio("auto_crash2");
  this.autocrash4_snd = this.game.add.audio("auto_crash4");
   
  this.truck_speed = this.game.add.audio("truck_speed");
  this.truck_slow = this.game.add.audio("truck_slow");
  this.truck_start = this.game.add.audio("truck_start");
  this.wob1 = this.game.add.audio("truck_wobble1");
  this.wob2 = this.game.add.audio("truck_wobble2");
  this.wob3 = this.game.add.audio("truck_wobble3");
  this.truck_change = this.game.add.audio("truck_change");
  this.truck_bang1 = this.game.add.audio("truck_bang1");
  this.truck_bang2 = this.game.add.audio("truck_bang2");   
};

Sfx.prototype.playMusic = function(name)
{
    switch(name)
    {
       case "menufx":
             if(this.menufx && jt.game_data.music=="1" && !this.menufx.isPlaying)
             {
               this.menufx.play();
               this.menufx.volume = 0.5;
            }
       break;
       case "oddbg":
             if( jt.game_data.music=="1" && !this.oddbg.isPlaying)
             {
               this.oddbg.play();
               this.oddbg.volume = 0.5;
             }
       break;
       case "evenbg":
            if( jt.game_data.music=="1" && !this.evenbg.isPlaying)
            {
               this.evenbg.play();
               this.evenbg.volume = 0.6;
            } 
       break;
    }
   
};
Sfx.prototype.loopMusic = function(name)
{
    switch(name)
    {
       case "menufx":
             if(this.menufx && jt.game_data.music=="1" && !this.menufx.isPlaying)
             {
               this.menufx.play();
               this.menufx.volume = 0.5;
             }
           else if(this.menufx && jt.game_data.music=="0" && this.menufx.isPlaying)
               this.menufx.stop();
       break;
       case "oddbg":
             if( jt.game_data.music=="1" && !this.oddbg.isPlaying)
             {
               this.oddbg.play();
               this.oddbg.volume = 0.5;
             }
           else if( jt.game_data.music=="0" && this.oddbg.isPlaying)
               this.oddbg.stop();
       break;
       case "evenbg":
             if( jt.game_data.music=="1" && !this.evenbg.isPlaying)
             {
               this.evenbg.play();
               this.evenbg.volume = 0.6;
             } 
           else if( jt.game_data.music=="0" && this.evenbg.isPlaying)
               this.evenbg.stop();
       break;
       
    }
  };
  Sfx.prototype.playSound = function(name)
  {
      if(jt.game_data.sound == "1")
      {
          switch(name)
          {
              case "well_done":
                  this.well_done_snd.play();
              break;
              case "bonus":
                  this.bonus_snd.play();
              break;
              case "auto_crash_2":
                   this.autocrash2_snd.play();
              break;
              case "auto_crash_4":
                  this.autocrash4_snd.play();
              break;
             
          }
      }
  };
  
  Sfx.prototype.playTruckSound = function(name)
  {
      if(jt.game_data.sound === "1")
      {
        switch(name)
          {
             case "truck_start": 
              if(!this.truck_start.isPlaying)
              {
                   this.truck_start.play();
              }
             break;
             case "truck_idle": 
              if(!this.truck_idle.isPlaying)
              {
                   this.truck_idle.play();
                   //this.truck_idle.volume=0.8;
                  
              }
             break;
             case "truck_speed":
                if(!this.truck_speed.isPlaying)
                {
                 
                  this.truck_speed.play();
               }
            break;
            case "truck_slow":
                if(!this.truck_slow.isPlaying)
                {
                   this.truck_slow.play();
                }
            break;
            case "truck_wob":
                   this.snd =  (Math.random() * 3 + 1).toFixed(0);
                   if(!this.wob1.isPlaying && !this.wob2.isPlaying && !this.wob3.isPlaying)
                   {
                        this.wob1.play();
                   }
                    switch(this.snd)
                   {
                       case 1:
                           this.wob1.play();
                       break;
                       case 2:
                           this.wob2.play();
                       break;
                       case 3:
                           this.wob3.play();
                       break;
                   }
              break;
              case "truck_bang1":
                  this.truck_bang1.play();
              break;
          case "truck_change":
              this.truck_change.play();
          break;
          case "truck_bang2":
                this.truck_bang2.play();
          break;
          }
      }
      else
      {
        if(this.truck_idle.isPlaying)
          this.truck_idle.stop();
         if(this.truck_speed.isPlaying)
          this.truck_speed.stop();
         if(this.truck_slow.isPlaying)
          this.truck_slow.stop();
         if(this.wob1.isPlaying)
          this.wob1.stop();
 
      }
  };
  Sfx.prototype.stopSound = function(name)
  {
      switch(name)
          {
            case "truck_idle":
            this.truck_idle.stop();
            break;
              
            case "truck_speed":
                    this.truck_speed.stop();
            break;
            case "truck_slow":
                this.truck_slow.stop();
            break;
        }
  };
  
  Sfx.prototype.stopAllSound = function(name)
  {
      if(this.truck_start.isPlaying)
          this.truck_start.pause();
      else
          this.truck_start.stop();
       if(this.truck_idle.isPlaying)
          this.truck_idle.pause();
      else
          this.truck_idle.stop();
      
       if(this.truck_speed.isPlaying)
          this.truck_speed.pause();
      else
          this.truck_speed.stop();
      
       if(this.truck_slow.isPlaying)
          this.truck_slow.pause();
      else
          this.truck_slow.stop();
      
        if(this.wob1.isPlaying)
          this.wob1.pause();
      else
          this.wob1.stop();
      
       if(this.truck_change.isPlaying)
          this.truck_change.pause();
      else
          this.truck_change.stop();
      
       if(this.truck_bang1.isPlaying)
          this.truck_bang1.pause();
      else
          this.truck_bang1.stop();

  };
  Sfx.prototype.resumeAllSound = function(name)
  {
      if(this.truck_start.onPause)
          this.truck_start.resume();
      else
          this.truck_start.stop();
      
       if(this.truck_idle.onPause)
          this.truck_idle.resume();
      else
          this.truck_idle.stop();
      
       if(this.truck_speed.onPause)
          this.truck_speed.resume();
      else
          this.truck_speed.stop();
      
       if(this.truck_slow.onPause)
          this.truck_slow.resume();
      else
          this.truck_slow.stop();
      
        if(this.wob1.onPause)
          this.wob1.resume();
      else
          this.wob1.stop();
      
       if(this.truck_change.onPause)
          this.truck_change.resume();
      else
          this.truck_change.stop();
      
       if(this.truck_bang1.onPause)
          this.truck_bang1.resume();
      else
          this.truck_bang1.stop();
   };

