"use strict";
var orientated = false;

window.JellyTruck.state.boot = {
    preload: function () {
       // this.game.plugins.add(Phaser.Plugin.AdvancedTiming, {mode: 'text'});       
        this.game.load.image("title", "assets/menu/title.png");
        this.game.load.image("splash", "assets/Loading/splash_coolmath.png");
        this.game.load.image("loadbg", "assets/Loading/loader.png");
        this.game.load.image("bar", "assets/Loading/preload.png");
        this.game.sound.autoplay = true;
        //this.game.forceSingleUpdate = false;
        this.game.time.advancedTiming = true;
               
        //this.game.physics.box2d.frameRate = 1/60;
        //this.game.physics.box2d.velocityIterations = 2.5;
        //this.game.physics.box2d.positionIterations = 2.5;
        //this.game.physics.box2d.useElapsedTime=true;       

        this.game.physics.startSystem(Phaser.Physics.BOX2D);
        this.game.physics.box2d.useElapsedTime = true; 
        this.game.physics.box2d.frameRate = 1/60;
        this.game.physics.box2d.physicsElapsed = 1/60;        

        if(navigator.userAgent.match(/iPhone|iPad|iPod/i)){
            //set Box2D     
            this.game.physics.box2d.gravity.y = 800;        
            this.game.physics.box2d.friction = 0.8;
            this.game.physics.box2d.ptmRatio = 50;
            this.game.physics.box2d.velocityIterations = 5;
            this.game.physics.box2d.positionIterations = 6; 
        }
        if (navigator.userAgent.match(/Android|BlackBerry|Opera Mini|IEMobile/i)) {            
            //set Box2D     
            this.game.physics.box2d.gravity.y = 800;        
            this.game.physics.box2d.friction = 0.8;
            this.game.physics.box2d.ptmRatio = 50;
            this.game.physics.box2d.velocityIterations = 4.5;
            this.game.physics.box2d.positionIterations = 6; 
        }
        else{   
            //set Box2D     
            this.game.physics.box2d.gravity.y = 800;        
            this.game.physics.box2d.friction = 0.8;
            this.game.physics.box2d.ptmRatio = 50;
            this.game.physics.box2d.velocityIterations = 4.5;
            this.game.physics.box2d.positionIterations = 6;    
        }
        
        this.game.scale.pageAlignVertically = true;
        this.game.scale.pageAlignHorizontally = true;

        // forces orientation. First parameter is for landscape, 2nd - portrait. Enable only one
        this.game.scale.forceOrientation(true, false);
        
        //orientation change callback functions
        this.game.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
        this.game.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);                    

        // set world size
        this.game.world.setBounds(0, 0, 8000,4000);
        
        // enable resize
        this.enableScaling();
        if (!jt.trace) {
            console.log = function () {}
        }
    },
    create: function () {
        // add all game states
        for (var stateName in window.JellyTruck.state) {
            this.game.state.add(stateName, window.JellyTruck.state[stateName]);
        }
        var gameWidth = 800;
        var gameHeight = 480;
        var gameObject = this;
        var deviceWidth;
        var deviceHeight;
        this.game.stage.backgroundColor = '#000000';
        this.game.stage.disableVisibilityChange = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        if (!this.game.device.desktop) {
            deviceWidth = window.innerWidth;
            deviceHeight = window.innerHeight;
            if (deviceHeight > deviceWidth) {
                document.getElementById('orientation').style.width = deviceWidth + "px";
                document.getElementById('orientation').style.height = deviceHeight + "px";
            }
        }
        if (this.game.device.desktop) {
            //	If you have any desktop specific settings, they can go in here            
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.minWidth = gameWidth / 2;
            this.game.scale.minHeight = gameHeight / 2;
            this.game.scale.maxWidth = gameWidth;
            this.game.scale.maxHeight = gameHeight;
            this.game.scale.pageAlignHorizontally = false;
            this.game.scale.pageAlignVertically = true;
        } 
        else {
            //	Same goes for mobile settings.
            //	In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            //scaling options
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.minWidth = gameWidth / 2;
            this.game.scale.minHeight = gameHeight / 2;
            this.game.scale.maxWidth = 2048;
            // IPad change
            var gameObj = this;
            //You can change this to gameWidth*2.5 if needed      
            //this.scale.maxHeight = 1228;

            if (gameObj.game.device.iPad === true) {
                this.game.scale.maxHeight = 1228;
            } else {
                this.game.scale.maxHeight = 736;
            }
            //Make sure these values are proportional to the gameWidth and gameHeight    
            this.scale.pageAlignHorizontally = false;
            this.game.scale.pageAlignVertically = true;
            //var gameObj = this;

            this.game.scale.forceOrientation(true, false);
            this.game.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.game.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);

            this.game.scale.refresh();
            if (this.game.scale.isLandscape) {
                this.leaveIncorrectOrientation();
            } else {
                this.enterIncorrectOrientation();
            }
            if (this.game.scale.isLandscape && (gameObj.game.device.iPhone === true || gameObj.game.device.iPad === true)) {
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            }
            window.addEventListener("orientationchange", function () {
              /*if (screen.width < screen.height) {
                    gameObj.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                    //document.getElementById('orientation').style.width = document.width + "px";
                    //document.getElementById('orientation').style.height = document.height + "px";
                    document.getElementById('orientation').style.width = "100%";
                    document.getElementById('orientation').style.height = "100%";
                     gameObj.enterIncorrectOrientation();
                } 
                else {                                       
                    gameObj.leaveIncorrectOrientation();
                    gameObj.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                }
                
                if (gameObj.game.device.iPhone === true || gameObj.game.device.iPad === true) {
                    if (window.matchMedia("(orientation: portrait)").matches) {
                        // you're in PORTRAIT mode
                        gameObj.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                        gameObj.enterIncorrectOrientation();
                    }
                    if (window.matchMedia("(orientation: landscape)").matches) {
                        // you're in LANDSCAPE mode
                        gameObj.leaveIncorrectOrientation();
                        gameObj.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                    }
                }*/
            });
        }        
        //console.log(this.game.device.ieVersion + " " + navigator.userAgent + " " + navigator.appVersion.indexOf("Windows NT 10.0"));    
        if(this.game.device.ieVersion === 11 && navigator.appVersion.indexOf("Windows NT 10.0") !== -1 ){            
            document.getElementById('msg').style.display = 'block';            
        }
        else{
            // goto load state
            document.getElementById('msg').style.display = 'none';
            this.game.state.start("load");
        }                
    },
    enableScaling: function () {
        var game = this.game;
        game.scale.parentIsWindow = (game.canvas.parentNode == document.body);
        game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    },
    enterIncorrectOrientation: function () {        
        this.game.sound.stopAll();
        this.game.sound.volume = 0;
        document.getElementById('orientation').style.width = "100%";
        document.getElementById('orientation').style.height = "100%";   
        this.game.scale.refresh();     
        document.getElementById('orientation').style.display = 'block';

    },
    leaveIncorrectOrientation: function () {
        this.game.sound.stopAll();
        this.game.sound.volume = 0.8;
        document.getElementById('orientation').style.display = 'none';
    },	
	shutdown:function(){
	}
};