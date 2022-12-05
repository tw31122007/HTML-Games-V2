(function (window) {

    //add prototype to window
    window.Game = new Game();

    //main prototype
    function Game(){
        //prototype functions
        this.init = function() {
            //initiate object variables
            this.showFPS = false;
            this.gamePaused = false;
            this.speed = 1;
            this.speedMultiplier = 1;
            this.gravityMultiplier = 1;
            document.addEventListener("deviceready", function(){ StatusBar.hide(); }, false);
            document.addEventListener("pause", function(){ window.Game.pauseGame(); window.Game.stopMusic(); }, false);
            document.addEventListener("resume", function(){ /*window.Game.resumeGame();*/ window.Game.playMusic(); StatusBar.hide(); }, false);
            document.addEventListener("backbutton", function(){  }, false);
            document.addEventListener("contextmenu", function(e) { e.preventDefault(); }, false);
            document.onkeydown = this.handleKeyDown;
            document.onkeyup = this.handleKeyUp;
            window.addEventListener('resize', function(){ window.Game.resizeCanvas(); });

            this.canvas = document.getElementById("gameCanvas");
            this.resizeCanvas();
            this.stage = new createjs.Stage(this.canvas);
            this.stage.enableMouseOver(60);
            createjs.Touch.enable(this.stage);
            this.box12 = (this.canvas.width / 12); //12 = 1.25em
            this.box16 = (this.canvas.width / 16); //16 = 1em
            this.fontSize = this.box16 * 0.75; //0.75 = 12/16

            this.assetManager = new AssetManager(this.canvas.width, this.canvas.height, this.box16);
            this.assetManager.init();
            this.stage.addChild(this.assetManager);
            this.stage.on("stagemousedown", function(event){ window.Game.stageMouseDown(event); });
            this.stage.on("stagemousemove", function(event){ window.Game.stageMouseMove(event); });
            this.stage.on("stagemouseup", function(event){ window.Game.stageMouseUp(event); });

            if (this.canvas.addEventListener) {
                this.canvas.addEventListener("mousewheel", function(e){ window.Game.doScroll(e); }, false);
                this.canvas.addEventListener("DOMMouseScroll", function(e){ window.Game.doScroll(e); }, false);
            } else { window.attachEvent("onmousewheel", function(e){ window.Game.doScroll(e); }); }

            this.assetManager.preload.on("complete", function(){ window.Game.setStage(); window.Game.syncLocalVolume(); window.Game.playMusic(); });
            this.assetManager.preload.on("progress", function(){ window.Game.assetManager.updateLoading(); window.Game.stage.update(); });
        };
        this.tick = function(event){
            this.delta = event.delta * this.speed * this.speedMultiplier; //elapsedTimeInMS / 1000msPerSecond

            //tick according to game view
            if (this.view == 0){ //intro scene
                this.theme.tick(this.delta);
                this.player.tick(this.delta); //moves theme background
            }
            else if (this.view == 1){ //home
                this.dialog.tick(this.delta);
                this.theme.tick(this.delta, true);
                this.home.tick(this.delta);
                this.player.tick(this.delta, this.levelMap); //moves theme background
            }
            else if (this.view == 2){ //main game
                if (this.gamePaused == false){
                    this.theme.tick(this.delta);
                    this.interface.tick(this.delta);
                    this.levelMap.tick(this.delta);
                    this.player.tick(this.delta, this.levelMap);
                    this.particles.tick(this.delta);
                }
                else {
                    this.dialog.tick(this.delta);
                    this.particles.tick(this.delta); //continue even if paused
                }

                //decide what screen to return to if the player respawns
                if (this.player.playerState == 2){
                    this.setView(this.prevView);
                    this.player.playerState = 0;
                    if (this.prevView == 3) this.levelEditor.editCurrentLevel(true);
                }
            }
            else if (this.view == 3){
                this.levelEditor.tick(this.delta);
                this.dialog.tick(this.delta);
            }

            this.fps.text = parseInt(createjs.Ticker.getMeasuredFPS());
            this.stage.update();
        };
        this.setStage = function() {
            this.ready = true;

            if (this.fps == null){
                this.fps = new createjs.Text(10, this.fontSize +"px prstart", "#000000");
                this.fps.textAlign = "right";
                this.fps.x = this.getWidth() - this.box16;
                this.fps.y = this.box16;
            }

            //initialize game objects
            if (this.artboard == null){ 
                this.artboard = new createjs.Container(); 
                this.theme = new Theme();
                this.home = new Home();
                this.interface = new Interface();
                this.dialog = new DialogWindow();
                this.levelMap = new LevelMap();
                this.levelEditor = new LevelEditor();
                this.player = new Player();
                this.particles = new Particles();
                this.view = 1; //eventually change to 0
            }

            //clean up stage
            this.stage.clear();
            this.stage.removeAllChildren();
            this.artboard.removeAllChildren();
            
            switch(this.view){
                case(0): this.artboard.addChild(this.theme); break;
                case(1): this.artboard.addChild(this.theme, this.home); break;
                case(2): this.artboard.addChild(this.theme, this.levelMap, this.player, this.particles); break;
                case(3): this.artboard.addChild(this.levelEditor); break;
            }
            this.stage.addChild(this.artboard, this.interface, this.dialog);
            if (this.showFPS == true) this.stage.addChild(this.fps);

            //start game timer
            if (!createjs.Ticker.hasEventListener("tick")) {
                createjs.Ticker.addEventListener("tick", function(event){ window.Game.tick(event); });
                createjs.Ticker.timingMode = createjs.Ticker.RAF;
                //createjs.Ticker.timingMode = createjs.Ticker.TIMEOUT;
                //createjs.Ticker.setFPS(24);
            }
        };
        this.stageMouseDown = function(event){
            if (this.view == 0){ }
            else if (this.view == 1){ }
            else if (this.view == 2){ this.player.jump(); }
            else if (this.view == 3){ this.levelEditor.stageMouseDown(event); }
        };
        this.stageMouseMove = function(event){
            if (this.view == 0){ }
            else if (this.view == 1){ }
            else if (this.view == 2){ }
            else if (this.view == 3){ this.levelEditor.stageMouseMove(event); }
        };
        this.stageMouseUp = function(event){
            if (this.view == 0){}
            else if (this.view == 1){}
            else if (this.view == 2){}
            else if (this.view == 3){ this.levelEditor.stageMouseUp(event); }
        };
        this.scrollWheel = function(e){
            if (this.view == 3){
                this.levelEditor.scrollWheel(e);
            }
        };
        this.setView = function(view, prevView){
            this.view = view;
            this.prevView = prevView == null ? view : prevView;
            this.setStage();
        };
        this.getWidth = function(){ return this.canvas.width; };
        this.getHeight = function(){ return this.canvas.height; };
        this.resizeCanvas = function(){
            var content = document.getElementById("content");
            content.style.height = window.innerHeight+"px";
            content.style.width = (this.canvas.width/this.canvas.height)*parseInt(content.style.height)+"px";
            if (parseInt(content.style.width) > window.innerWidth) content.style.width = window.innerWidth + "px";
        };
        this.pauseGame = function(){
            if (this.view == 1){ /*intro screen*/ }
            else if (this.view == 2){ //game pause setting
                if (this.gamePaused == false){
                    this.dialog.openDialogWindow("pause");
                    window.timer.pause();
                    this.gamePauseStart = Date.now();
                    this.gamePauseDiff = 0;
                    this.gamePaused = true;
                }
            }
        };
        this.resumeGame = function(retry){
            if (this.view == 1){ /*intro screen*/ 
                if (this.gamePaused == false && window.Game.home.selectedLevel > 0){
                    window.Game.home.play_button.toggle();
                }
            }
            else if (this.view == 2){
                if (this.gamePaused == true){
                    if (window.Game.dialog.state == "complete"){
                        if (window.Game.home.selectedLevel == 
                            window.Game.home.levels.children.length &&
                            window.Game.prevView == 1){
                            window.Game.dialog.openDialogWindow("gameover");
                            if (retry == true) this.gamePaused = false; //retry if on last level
                        }
                        else{
                            if (retry == true){ this.gamePaused = false; }
                            else {
                                window.Game.dialog.quit(true);
                                this.gamePaused = false;
                            }
                        }
                    }
                    else if (window.Game.dialog.state == "gameover"){
                        window.Game.dialog.quit(true);
                        this.gamePaused = false;
                    }
                    else {
                        window.timer.resume();
                        this.gamePaused = false;
                        this.gamePauseDiff = Date.now() - this.gamePauseStart;
                        this.player.gravity.setPauseDiff(this.gamePauseDiff);
                        //this.particles.pauseParticles(this.gamePauseDiff);
                        this.dialog.removeDialogWindow();
                    }
                }
            }
            else if (this.view == 3){
                if (this.levelEditor.screen == 1){
                    if (window.Game.levelEditor.edit_button.isEnabled()){
                        window.Game.levelEditor.edit_button.toggleColor(true);
                    }
                }
                else if (this.levelEditor.screen == 2){
                    if (this.gamePaused == false){
                        window.Game.levelEditor.play_button.toggle();
                    }
                }
            }
        };
        this.retry = function(retry){
            this.resumeGame(retry);
            this.player.respawn(true); //force a full respawn
            window.timer.start();
        };
        this.escapeKey = function(){
            if (this.view == 0){}
            else if (this.view == 1){}
            else if (this.view == 2){ 
                if (this.gamePaused == true) this.resumeGame();
                else this.pauseGame();
            }
            else if (this.view == 3){ this.levelEditor.escapeKey(); }
        };
        this.handleKeyDown = function(e) {
            if (!e) { var e = window.event; } //cross browser issues exist
            switch (e.keyCode) {
                case 16: this.shiftKey = true; break; //shift
                case 17: this.ctrlKey = true; break; //ctrl
                case 27: window.Game.escapeKey(); break; //esc
                case 32: window.Game.resumeGame(); window.Game.player.jump(); break; //space
                case 38: window.Game.resumeGame(); window.Game.player.jump(); break; //up
                case 37: window.Game.levelEditor.leftKey(); break; //left
                case 39: window.Game.levelEditor.rightKey(); break; //right
                case 46: window.Game.levelEditor.deleteKey(); break; //delete
                case 65: window.Game.levelEditor.leftKey(); break; //a
                case 68: window.Game.levelEditor.rightKey(); break; //d
                case 69: window.Game.gamePaused = true; window.Game.dialog.quit(false); break; //e
                case 82: window.Game.dialog.retry(true); break; //r
                case 90:
                    if (this.ctrlKey && !this.shiftKey) window.Game.levelEditor.undo();
                    else if (this.ctrlKey && this.shiftKey) window.Game.levelEditor.redo();
                    break;
            }
        };
        this.handleKeyUp = function(e){
            if (!e) { var e = window.event; } //cross browser issues exist
            switch (e.keyCode) {
                case 16: this.shiftKey = false; break;
                case 17: this.ctrlKey = false; break;
            }
        };
        this.doScroll = function (e) { 
            if (this.view == 3) {
                e.preventDefault();
                e=window.event || e; this.scrollWheel(e);
            }
        };
        this.playMusic = function(){ createjs.Sound.play("track", {interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1}); };
        this.stopMusic = function(){ createjs.Sound.stop(); };
        this.muteVolume = function(){ createjs.Sound.volume = 0; window.storageManager.storeVolume(0); };
        this.unmuteVolume = function(){ createjs.Sound.volume = 1; window.storageManager.storeVolume(1); };
        this.getVolume = function(){ return createjs.Sound.volume; }
        this.setVolume = function(volume){ createjs.Sound.volume = volume; }
        this.syncLocalVolume = function(){ createjs.Sound.volume = window.storageManager.getVolume(); }
        this.resetMultipliers = function(){ this.speedMultiplier = 1; this.gravityMultiplier = 1; }

        //initiate prototype variables
        this.init();
    }
}(window));