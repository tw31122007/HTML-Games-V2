(function (window) {

    //extend & promote createjs.Container functions to window
    createjs.extend(DialogWindow, createjs.Container);
    window.DialogWindow = createjs.promote(DialogWindow, "Container");

	//constructor
	function DialogWindow() {

        this.init = function(){
            this.Container_constructor();
            this.width = window.Game.getWidth();
            this.height = window.Game.getHeight();
            this.box = window.Game.box16;
            this.fontSize = this.box * 0.75;
            this.fontColor = "#ffffff";
        };

        //update
        this.tick = function (delta) {
            //check confirmation window
            if (this.dialog != null){
                if (this.dialog.state == "pause"){ //pause screen
                    //loop through skin options
                    for (var i=0; i < this.skins.children.length; i++){
                        if (this.skins.getChildAt(i).isClicked()){
                            window.storageManager.setSkinId(i);
                            window.Game.player.reskin();
                            this.createDialogWindow("pause"); //redraw pause
                            break;
                        }
                    }
                    //check button actions
                    if (this.retry_button.isClicked()) this.retry();
                    else if (this.volume_button.isClicked()){
                        if (this.volume_button.text == "r"){
                            window.Game.muteVolume();
                            this.volume_button.text = "_s";
                            this.volume_button.redraw();
                        }
                        else {
                            window.Game.unmuteVolume();
                            this.volume_button.text = "_r";
                            this.volume_button.redraw();
                        }
                    }
                    else if (this.button_1.isClicked()) {
                        this.quit(); //do not select next level
                        window.Game.gamePaused = false;
                    }
                    else if (this.button_2.isClicked()) this.resume();
                }
                else if (this.dialog.state == "tip"){ //tip dialog actions
                    if (this.button_2.isClicked()) this.resume();
                }
                else if (this.dialog.state == "complete"){
                    //level complete dialog actions
                    if (this.button_1.isClicked()) { this.retry(true); }
                    else if (this.button_2.isClicked()) { this.checkGameOverOptions(); }
                }
                else if (this.dialog.state == "gameover"){ //level editor delete confirmation
                    if (this.button_2.isClicked()){ this.quit(); }
                }
                else if (this.dialog.state == "delete"){ //level editor delete confirmation
                    if (this.button_1.isClicked()){ this.deleteLevel(); /*this.resume();*/ }
                    else if (this.button_2.isClicked()){ this.removeDialogWindow(); /*this.resume();*/ }
                }
                else if (this.dialog.state == "shareCode"){ //share code
                    if (this.button_2.isClicked()){ this.removeDialogWindow(); }
                }
                else if (this.dialog.state == "uploadSuccess"){ //upload successful
                    if (this.button_1.isClicked()){ this.copyCode(); }
                    else if (this.button_2.isClicked()){ this.removeDialogWindow(); }
                }
                else if (this.dialog.state == "uploadError"){ //upload successful
                    if (this.button_1.isClicked()){ this.removeDialogWindow(); }
                    else if (this.button_2.isClicked()){ window.Game.shareCurrentLevel(); }
                }
                else if (this.dialog.state == "downloadOptions"){ //upload successful
                    if (this.button_back.isClicked()){ this.removeDialogWindow(); }
                    else if (this.button_1.isClicked()){ window.storageManager.loadLevelFromFile(); this.removeDialogWindow(); }
                    else if (this.button_2.isClicked()){ this.openDialogWindow("playCode"); }
                }
                else if (this.dialog.state == "uploadOptions"){ //upload successful
                    if (this.button_back.isClicked()){ this.removeDialogWindow(); }
                    else if (this.button_1.isClicked()){ window.storageManager.saveLevelToFile(); this.removeDialogWindow(); }
                    else if (this.button_2.isClicked()){  window.Game.levelEditor.shareCurrentLevel(); }
                }
                else if (this.dialog.state == "playCode"){  //play code
                    //check list of chars for clicked action
                    for (var i=0; i < this.input.options.length; i++){
                        if (this.input.getChildByName(this.input.options.charAt(i)).isClicked()){
                            this.addToCode(this.input.options.charAt(i));
                            break;
                        }
                    }
                    //check other buttons
                    if (this.button_1.isClicked()) { this.removeDialogWindow(); }
                    else if (this.input.getChildByName("input").isClicked()){ //use navite input
                        var btn = this.input.getChildByName("input");
                        var tip = window.prompt("Level code", btn.getText().replace('#',''));
                        if (tip != null) btn.setText((("#"+(tip).replace('#','')).toUpperCase()).substring(0,7));
                    }
                    else if (this.input.getChildByName("_i").isClicked()) this.clearCode();
                    else if (this.input.getChildByName("_b").isClicked()){ this.submitCode(); }
                }
                else if (this.dialog.state == "downloading"){
                    if (this.button_2.isClicked()){ this.removeDialogWindow(); }
                }
                else if (this.dialog.state == "downloadSuccess"){
                    if (this.button_1.isClicked()){ this.saveDownload(); }
                    else if (this.button_2.isClicked()){ this.retry(); } //start
                }else if (this.dialog.state == "saveDownload"){
                    if (this.button_1.isClicked()){ this.editSaveDownload(); } //edit
                    else if (this.button_2.isClicked()){ this.retry(); } //start
                }
                else if (this.dialog.state == "error500"){ //download error with connection
                    if (this.button_1.isClicked()){ this.removeDialogWindow(); }
                    else if (this.button_2.isClicked()){ this.submitCode(); }
                }
                else if (this.dialog.state == "error404"){ //download error null value
                    if (this.button_1.isClicked()){ this.removeDialogWindow(); }
                    else if (this.button_2.isClicked()){ this.openDialogWindow("playCode"); }
                }
                else if (this.dialog.state == "errorLimit"){
                    if (this.button_1.isClicked()){ addRewards(); }
                    else if (this.button_2.isClicked()){ this.removeDialogWindow(); }
                }
                else if (this.dialog.state == "errorLevelLimit"){
                    if (this.button_1.isClicked()){ addRewards(); }
                    else if (this.button_2.isClicked()){ 
                        this.removeDialogWindow();
                        if (window.Game.gamePaused) this.retry();
                    }
                }
            }
        };
        this.createDialogWindow = function(state){
            this.state = state;
            this.removeAllChildren();
            this.skins = new createjs.Container();
            //default values
            this.dialog = new createjs.Container();
            this.dialog.state = state != null ? state : "pause";
            this.setDefaultDialogElements();

            if (state == "pause"){ //menu dialog
                this.text_1.text = "";
                this.text_2.text = "";
                this.text_2.text = "Custom skins";
                this.text_1.y = this.box * 6;
                this.text_2.y = this.box * 8;
                this.button_1.setText('Quit');
                this.button_2.setText('Continue');
                this.button_1.y += this.box * 5;
                this.button_2.y += this.box * 5;
                this.addSkinOptions();
                this.dialog.addChild(this.bg, this.text_1, this.text_2, this.skins, this.button_1, this.button_2);
                this.dialog.addChild(this.retry_button, this.pause_header, this.volume_button); //exclude text
            }
            else if (state == "tip"){ //tip dialog
                this.text_2.text = window.storageManager.tipString;
                this.button_2.setText('Continue');
                this.dialog.addChild(this.bg, this.text_1, this.text_2, this.button_2); //exclude button_1
            }
            else if (state == "complete"){ //level complete dialog
                var level = window.Game.home.selectedLevel;
                var storageScore = window.storageManager.getLevelScore(level);
                var parsedGameScore = parseInt(window.Game.score.replace(":",""));
                var parsedStorageScore = parseInt(storageScore.replace(":",""));
                this.text_1.y = this.box * 6;
                this.text_2.y = this.box * 8;
                this.button_1.y += this.box * 5;
                this.button_2.y += this.box * 5;
                this.button_1.setText('Retry');
                this.button_2.setText('Continue');
                
                //if home was the origin
                if (window.Game.prevView == 1){
                    if (parsedGameScore < parsedStorageScore || parsedStorageScore == 0){
                        window.storageManager.saveLevelScore(window.Game.home.selectedLevel, window.Game.score);
                        window.storageManager.uploadLocalStorageToChromeStorage(); //upload to chrome storage
                        this.text_1.text = window.Game.score;
                        this.text_2.text = "New Record!";
                    }
                    else { 
                        this.text_1.text = "Finished!"; 
                        this.text_2.text = "Best - "+storageScore;
                    }
                    window.storageManager.unlockLevelSkin(level);
                }
                else {
                    this.text_1.text = window.Game.score; 
                    this.text_2.text = "Great job!";
                }
                //check if the over level 10 and if no license exists
                this.dialog.addChild(this.bg, this.text_1, this.text_2, this.button_1, this.button_2);
            }
            else if (state == "gameover"){ //level complete dialog
                this.text_1.text = "Game Over!";
                this.text_2.text = "Great work! You beat all the levels! Now go make your own levels!";
                this.text_1.y = this.box * 6;
                this.text_2.y = this.box * 8;
                this.button_2.setText('Continue');
                this.dialog.addChild(this.bg, this.text_1, this.text_2, this.button_2); //exclude button_1
            }
            else if (state == "delete"){ //level editor delete confirmation
                this.button_1.setText('Delete');
                this.button_2.setText('Cancel');
                this.dialog.addChild(this.bg, this.button_1, this.button_2); //exclude text
            }
            else if (state == "shareCode"){ //share code
                this.text_1.text = "Uploading";
                this.text_2.text = "Please wait for the level to upload.";
                this.text_1.y = this.box * 6;
                this.text_2.y = this.box * 8;
                this.button_2.setText('Cancel');
                this.dialog.addChild(this.bg, this.text_1, this.text_2, this.button_2); //exclude button_1
            }
            else if (state == "uploadSuccess"){ //upload success dialog
                this.text_1.text = this.input.value;
                this.text_2.text = "Your temporary level code has been generated. Share this code with a friend who is brave enough to play your level.";
                this.text_1.y = this.box * 4;
                this.text_2.y = this.box * 6;
                this.button_1.setText('Copy');
                this.button_2.setText('Continue');
                this.button_1.y += this.box * 2;
                this.button_2.y += this.box * 2;
                this.dialog.addChild(this.bg, this.text_1, this.text_2, this.button_1, this.button_2); //exclude button_1
            }
            else if (state == "uploadError"){ //upload error dialog
                this.text_1.text = "Error 500";
                this.text_2.text = "Please check your internet connection and try again.";
                this.text_1.y = this.box * 4;
                this.text_2.y = this.box * 6;
                this.button_1.setText('Cancel');
                this.button_2.setText('Try Again');
                this.dialog.addChild(this.bg, this.text_1, this.text_2, this.button_1, this.button_2); //exclude button_1
            }
            else if (state == "downloadOptions"){  //play code
                this.text_1.text = "Download";
                this.text_2.text = "Download your friend's level online or offline.";
                this.text_1.y = this.box * 5;
                this.text_2.y = this.box * 9;
                this.button_back = new Button("button_1", this.box*2, this.box*2, this.box*4, this.box*4, "#000000", "#000000", "#ffffff", "#ffffff"); //back button
                this.button_back.setText('_g');
                this.button_back.setFontSize(1.5);
                this.button_back.redraw();
                this.button_1.setText('Offline');
                this.button_2.setText('Online');
                this.button_1.y += this.box * 2;
                this.button_2.y += this.box * 2;
                this.dialog.addChild(this.bg, this.text_1, this.text_2, this.button_back, this.button_1, this.button_2);
            }
            else if (state == "uploadOptions"){  //play code
                this.text_1.text = "Upload";
                this.text_2.text = "Share your level with a friend online or offline.";
                this.text_1.y = this.box * 6;
                this.text_2.y = this.box * 9;
                this.button_back = new Button("button_1", this.box*2, this.box*2, this.box*4, this.box*4, "#000000", "#000000", "#ffffff", "#ffffff"); //back button
                this.button_back.setText('_g');
                this.button_back.setFontSize(1.5);
                this.button_back.redraw();
                this.button_1.setText('Offline');
                this.button_2.setText('Online');
                this.button_1.y += this.box * 2;
                this.button_2.y += this.box * 2;
                this.dialog.addChild(this.bg, this.text_1, this.text_2, this.button_back, this.button_1, this.button_2);
            }
            else if (state == "playCode"){  //play code
                this.text_2.text = "Ask your friend to share their level code.";
                this.text_2.y = this.box * 8;
                this.button_1 = new Button("button_1", this.box*2, this.box*2, this.box*4, this.box*4, "#000000", "#000000", "#ffffff", "#ffffff"); //back button
                this.button_1.setText('_g');
                this.button_1.setFontSize(1.5);
                this.button_1.redraw();
                this.createInputDialog();
                this.dialog.addChild(this.bg, this.text_2, this.button_1, this.input);
            }
            else if (state == "downloading"){ //downloading dialog
                this.text_1.text = "Downloading";
                this.text_2.text = "Please wait for the level to download. Server traffic may effect download speeds.";
                this.text_1.y = this.box * 6;
                this.text_2.y = this.box * 8;
                this.button_2.setText('Cancel');
                this.dialog.addChild(this.bg, this.text_1, this.text_2, this.button_2); //exclude button_1
            }
            else if (state == "errorLimit"){ //downloading dialog
                this.text_1.text = "";
                this.text_2.text = "Please try again in 24 hours or add more for free.";
                this.text_1.y = this.box * 2;
                this.text_2.y = this.box * 4;
                this.button_1.setText('Add More');
                this.button_2.setText('Continue');
                this.dialog.addChild(this.bg, this.text_1, this.text_2, this.button_1, this.button_2); //exclude button_1
            }
            else if (state == "errorLevelLimit"){ //downloading dialog
                this.text_1.text = "";
                this.text_2.text = "Max levels reached. Add more for free.";
                this.text_1.y = this.box * 2;
                this.text_2.y = this.box * 4;
                this.button_1.setText('Add More');
                this.button_2.setText('Continue');
                this.dialog.addChild(this.bg, this.text_1, this.text_2, this.button_1, this.button_2); //exclude button_1
            }
            else if (state == "downloadSuccess"){ //download success dialog
                this.text_1.text = "Success!";
                this.text_2.text = "You have received a new level. This code is not permanent.";
                this.text_1.y = this.box * 4;
                this.text_2.y = this.box * 6;
                this.button_1.setText('Save');
                this.button_2.setText('Play');
                this.dialog.addChild(this.bg, this.text_1, this.text_2, this.button_1, this.button_2); //exclude button_1
            }
            else if (state == "saveDownload"){ //save downloaded level dialog
                this.text_1.text = "Saved!";
                this.text_2.text = "You may now edit this level any time you want.";
                this.text_1.y = this.box * 4;
                this.text_2.y = this.box * 6;
                this.button_1.setText('Edit');
                this.button_2.setText('Play');
                this.dialog.addChild(this.bg, this.text_1, this.text_2, this.button_1, this.button_2); //exclude button_1
            }
            else if (state == "error500"){ //download error 500
                this.text_1.text = "Error 500";
                this.text_2.text = "Please check your internet connection and try again.";
                this.text_1.y = this.box * 4;
                this.text_2.y = this.box * 6;
                this.button_1.setText('Cancel');
                this.button_2.setText('Try Again');
                this.dialog.addChild(this.bg, this.text_1, this.text_2, this.button_1, this.button_2); //exclude button_1
            }
            else if (state == "error404"){ //download error 404
                this.text_1.text = "Error 404";
                this.text_2.text = "The code you have submitted does not exist. Please try again.";
                this.text_1.y = this.box * 4;
                this.text_2.y = this.box * 6;
                this.button_1.setText('Cancel');
                this.button_2.setText('Try Again');
                this.dialog.addChild(this.bg, this.text_1, this.text_2, this.button_1, this.button_2); //exclude button_1
            }
            this.addChild(this.dialog);
        };
        this.setDefaultDialogElements = function(){
            this.setPauseNav();

            this.bg = new createjs.Shape();
            this.bg.graphics.beginFill('rgba(0,0,0,0.9)').drawRect(0,0,this.width,this.height);

            this.main_color2 = window.Game.theme.main_color2;
            this.main_color3 = window.Game.theme.main_color3;

            this.text_1 = new createjs.Text();
            this.text_2 = new createjs.Text();
            this.text_1.set({ x: this.width * 0.5, y: this.box*2, font: (this.fontSize * 1.5)+"px prstart", color: this.fontColor, textAlign: "center", lineWidth: this.width });
            this.text_2.set({ x: this.width * 0.5, y: this.box*4, font: this.fontSize+"px prstart", color: this.fontColor, textAlign: "center", lineWidth: this.box*12 });

            this.button_1 = new Button("button_1", this.width/2, this.height/2, this.box*12, this.box*4, "#000000", this.main_color3, "#ffffff", "#ffffff");
            this.button_2 = new Button("button_2", this.width/2, (this.height/2)+this.box*5, this.box*12, this.box*4, this.main_color3, "#000000", "#ffffff", "#ffffff");
            this.button_1.setFontSize(0.9);
            this.button_2.setFontSize(0.9);
        };
        this.setPauseNav = function(){
            var bigBox = this.box*4;
            var topY = bigBox * 0.5;
            var leftX = bigBox * 0.5;
            var bottomY = this.screenHeight - (bigBox/2);

            this.retry_button = new Button("_i", leftX, topY, bigBox, bigBox);
            this.pause_header = new Button("Paused", leftX+(bigBox*1.5), topY, bigBox*2, bigBox);
            this.volume_button = new Button((window.Game.getVolume() == 1) ? "_r" : "_s", leftX+(bigBox*3), topY, bigBox, bigBox);
            this.pause_header.setFontSize(1);
            this.pause_header.disable();
        }
        this.removeDialogWindow = function(){
            this.state = null;
            this.removeAllChildren();
            window.Game.interface.mouseEnabled = true;
            window.Game.levelEditor.mouseEnabled = true;
            this.dialog = null;
        };
        this.openDialogWindow = function(state){
            //window.Game.pauseGame();
            window.Game.interface.mouseEnabled = false;
            window.Game.levelEditor.mouseEnabled = false;
            this.createDialogWindow(state);
        };
        this.toggleDialogWindow = function(){
            if (this.dialog == null) this.openDialogWindow("pause");
            //else window.Game.resumeGame
        };
        this.isOpen = function(){ return this.dialog != null; };
        this.isClosed = function(){ return !this.isOpen(); };
        this.quit = function(forceNextLevel){
            var prevView = window.Game.prevView;
            window.storageManager.tempName = ''; // reset name to prevent database completion
            window.Game.interface.removeInterface(); //clear the game interphase
            window.Game.setView(prevView); //change screen view back to previous view
            window.Game.player.respawn(); //reset player values
            window.Game.player.playerState = 0; //set player state
            if (prevView == 1){ window.Game.home.setUI(forceNextLevel); } //update homescreen UI
            else if (prevView == 3){
                if (window.Game.levelEditor.screen == 1) window.Game.levelEditor.updateUI(1);
                else window.Game.levelEditor.editCurrentLevel(true);
            }
            window.Game.resumeGame();
            this.removeDialogWindow();
        };
        this.resume = function(){ if (window.Game.gamePaused == true){ window.Game.resumeGame(); this.removeDialogWindow(); } };
        this.retry = function(retry){ 
            window.Game.retry(retry); 
            this.removeDialogWindow();
        };
        this.deleteLevel = function(){
            var levelID = parseInt(Number(
                window.Game.levelEditor.levelButtons.getChildAt(
                window.Game.levelEditor.selectedButtonIndex-1).name.replace(/[a-z, ]/gi,'')),10);
            window.storageManager.removeFromLocalStorage(levelID);
            window.storageManager.uploadLocalStorageToChromeStorage(true); //upload to chrome storage
            window.Game.levelEditor.deleteLevelButton();
            window.Game.levelEditor.updateUI();
            this.removeDialogWindow();
        };
        this.createInputDialog = function(){
            this.input = new createjs.Container();
            this.input.options = "ABCDEF1234567890";
            this.input.value = "#";
            var box = this.box;
            this.input.x = (box*2);
            this.input.y = this.height - (box*16);

            var _input = new Button("input", box*4, box*2, box*8, box*4, this.main_color3, this.main_color2, "#ffffff", "#ffffff");
            var _clear = new Button("_i", box*10, box*2, box*4, box*4, this.main_color3, this.main_color2, "#ffffff", "#ffffff");
            var _submit = new Button("_b", box*10, box*9, box*4, box*2, this.main_color2, this.main_color3, "#ffffff", "#ffffff");
            _input.setAlignment("left");
            //_input.disable();
            _input.setText(this.input.value);

            //add buttons to container
            var cols = 6; //predefined by design
            for (var i=0; i < this.input.options.length; i++){
                var char = this.input.options.charAt(i);
                var button = new Button(
                    char, box*(((i%cols)*2)+1), box*((Math.floor(i/cols)*2)+5), box*2, box*2,
                    (char.match(/[a-z]/i)) ? "#111111" : "#000000", this.main_color3, "#ffffff", "#ffffff");
                this.input.addChild(button);
            }
            this.input.addChild(_input,_clear);
            this.input.addChild(_submit);

            //resize all button fonts
            for (var i=0; i < this.input.children.length; i++){ this.input.getChildAt(i).setFontSize(1); }
        };
        this.addSkinOptions = function(){
            var options = 8;
            var skinId = window.storageManager.getSkinId();
            this.skins.removeAllChildren();

            //loop through each option and add a shape
            for (var i=0; i < options; i++) {
                var button = new Button(
                    "",
                    (this.box * 2 * (2.5 + (i%4))),
                    (this.box * (12 + Math.floor(i / 4) * 2)),
                    this.box*2,
                    this.box*2,
                    "#000000",
                    this.main_color3,
                    "#ffffff",
                    "#ffffff",
                    window.tiles.drawShape(
                        "#ffffff", 
                        this.box/48, 
                        this.box/48, 
                        (i + 50), 
                        false, 
                        this.box
                    )
                );
                if (i == skinId) button.toggleColor(true);
                if (window.storageManager.skinIsActive(i) == false) button.disable(0.1);
                this.skins.addChild(button);
            }
        };
        this.addToCode = function(newChar){
            var input = this.input.getChildByName("input");
            if (input.text.length < 7){ //include '#' as part of the code
                input.setText(input.text + newChar);
            }
        };
        this.clearCode = function(){
            var input = this.input.getChildByName("input");
            if (input.text.length > 1){ //include '#' as part of the code
                input.setText(input.text.slice(0,-1));
            }
        };
        this.copyCode = function(){
            //TODO copy text instead of window prompt
            var code = window.prompt("Copy & share the temporary level code below", this.input.value);
            if (code != null) { this.removeDialogWindow(); }
        }
        this.submitCode = function(){
            var input = this.input.getChildByName("input");
            //window.Game.gamePaused = false;
            window.storageManager.loadLevelFromPortal(input.text.substring(1));
        };
        this.saveDownload = function(){
            var maxLevels = window.storageManager.getMaxLevels();

            if (window.Game.levelEditor.levelButtons.children.length < maxLevels || window.storageManager.hasLicense()){
                window.storageManager.setLevelString(window.Game.levelMap.toString());
                window.Game.levelEditor.selectedButtonIndex = window.storageManager.saveToLocalStorage();
                window.Game.levelEditor.updateUI(1);
                window.storageManager.uploadLocalStorageToChromeStorage(); //upload to chrome storage
                this.openDialogWindow("saveDownload");
            }
            else {
                this.openDialogWindow("errorLevelLimit");
            }
        }
        this.editSaveDownload = function(){
            this.removeDialogWindow();
            window.Game.interface.removeInterface();
            window.Game.setView(3);
            window.Game.levelEditor.updateUI(2);
        }
        this.checkGameOverOptions = function(){
            if (window.Game.home.selectedLevel == 
                window.Game.home.levels.children.length &&
                window.Game.prevView == 1){
                this.openDialogWindow("gameover");
            }
            else this.quit(true);
        };

        //initiate prototype variables
        this.init();
	}
}(window));