(function (window) {

    //extend & promote createjs.Container functions to window
    createjs.extend(LevelEditor, createjs.Container);
    window.LevelEditor = createjs.promote(LevelEditor, "Container");

	//constructor
	function LevelEditor() {
        //prototype functions
		this.init = function(){
            //initiate object variables
            this.Container_constructor();
            this.screenWidth = window.Game.getWidth();
            this.screenHeight = window.Game.getHeight();
            this.xPos = 0; //map will render relative to this
            this.yPos = 0;
            this.box16 = window.Game.box16;
            this.box12 = window.Game.box12;
            this.tileType = 1;
            this.updateUI(1);
        };

        //update
        this.tick = function (delta) {
            //listen to screen actions
            if (this.screen == 1){
                if (this.back_button.isClicked()){
                    this.updateUI(1);
                    window.Game.home.setUI();
                    window.Game.player.respawn();
                    window.Game.setView(1);
                }
                else if (this.null_button.isClicked()){ /*temporarily no use*/ }
                else if (this.share_button_1.isClicked()){ window.Game.dialog.openDialogWindow("downloadOptions"); }
                else if (this.remove_button_1.isClicked()){ this.deleteKey(); }
                else if (this.add_button_1.isClicked()){
                    var maxLevels = window.storageManager.getMaxLevels();

                    // Create level if less than max
                    if (this.levelButtons.children.length < maxLevels || window.storageManager.hasLicense()){
                        window.Game.levelMap.createEmptyMap(12,14);
                        window.storageManager.setLevelString(window.Game.levelMap.toString());
                        window.storageManager.tipString = ""; //empty string
                        this.selectedButtonIndex = window.storageManager.saveToLocalStorage(); //returns index of latest save id
                        this.updateUI(1);
                        window.storageManager.uploadLocalStorageToChromeStorage(); //upload to chrome storage
                    }
                    else {
                        window.Game.dialog.openDialogWindow("errorLevelLimit");
                    }
                }
                else if (this.edit_button.isClicked()){
                    this.tileType = 1; //reset tile to default
                    this.showTileOptions = false;
                    this.editCurrentLevel();
                }
                else {
                    //check to see if only ONE level has been selected
                    var selectedCount = 0;
                    var selectedLevel = -1;
                    var length = this.levelButtons.children.length;
                    for (var i=0; i < length; i++){
                        if (this.levelButtons.getChildAt(i).isToggled()){
                            selectedLevel = i;
                            selectedCount++;
                        }
                    }
                    //enable edit button
                    if (selectedCount < 2){ //if selected level has been changed
                        if (selectedLevel == -1){ //if no level IS selected
                            this.remove_button_1.disable(0.1);
                            this.edit_button.disable(0.1); //change alpha to 25%
                            this.edit_button.toggleColor(false);
                        }
                        else{ //if a level IS selected, make it clickable
                            this.remove_button_1.enable();
                            this.edit_button.enable();
                            this.edit_button.toggleColor(true); //highlight edit button
                        }
                        this.selectedButtonIndex = selectedLevel+1; //set selected level
                    }
                    else this.levelButtons.getChildAt(this.selectedButtonIndex-1).toggleOff();
                }
            }
            else if (this.screen == 2){
                if (this.menu_button.isClicked()){
                    window.Game.player.newSpawn = false;
                    this.saveCurrentLevel();
                    this.updateUI(1);
                    window.Game.levelMap.clearMapHistory(); //clear map history
                }
                else if (this.share_button_2.isClicked()){ window.Game.dialog.openDialogWindow("uploadOptions"); }
                else if (this.undo_button.isClicked()){ this.undo(); }
                else if (this.redo_button.isClicked()){ this.redo(); }
                else if (this.add_button_2.isClicked()){
                    this.showTileOptions = !this.showTileOptions;
                    this.updateUI(2);
                }
                else if (this.left_button.isClicked()){
                    this.hideTileOptions();
                    this.setScrollSpeed();
                    this.xPos += this.box12 * this.scrollSpeed;
                    createjs.Tween.get(window.Game.levelMap,{override:true})
                        .to({ x:this.xPos }, 500, createjs.Ease.cubicOut)
                        .call(function(tween){ tween._target.parent.scrollSpeed = 0; });
                }
                else if (this.right_button.isClicked()){
                    this.hideTileOptions();
                    this.setScrollSpeed();
                    this.xPos -= this.box12 * this.scrollSpeed;
                    createjs.Tween.get(window.Game.levelMap,{override:true})
                        .to({ x:this.xPos }, 500, createjs.Ease.cubicOut)
                        .call(function(tween){ tween._target.parent.scrollSpeed = 0; });
                }

                else if (this.play_button.isClicked()){
                    this.saveCurrentLevel();
                    window.Game.interface.build();
                    window.Game.setView(2,3);
                    window.Game.resumeGame();
                    window.Game.player.respawn();
                }
                else {
                    //check tile
                    if (this.showTileOptions){
                        if (this.remove_column_button.isClicked()){ 
                            window.Game.levelMap.removeColumn(); 
                            window.Game.levelMap.renderMap();
                            window.Game.levelMap.saveMapHistory();
                            //this.showTileOptions = false;
                            this.updateUI(2);
                        }
                        else if (this.insert_column_button.isClicked()){ 
                            window.Game.levelMap.insertColumn();
                            window.Game.levelMap.renderMap();
                            window.Game.levelMap.saveMapHistory();
                            //this.showTileOptions = false;
                            this.updateUI(2); 
                        }
                        else if (this.tile0.isClicked()) this.setTileType(0);
                        else if (this.tile1.isClicked()) this.setTileType(1);
                        else if (this.tile2.isClicked()) this.setTileType(2);
                        else if (this.tile3.isClicked()) this.setTileType(3);
                        else if (this.tile4.isClicked()) this.setTileType(4);
                        else if (this.tile5.isClicked()) this.setTileType(5);
                        else if (this.tile6.isClicked()) this.setTileType(6);
                        else if (this.tile7.isClicked()) this.setTileType(7);
                        else if (this.tile8.isClicked()) this.setTileType(8);
                        else if (this.tile9.isClicked()) this.setTileType(9);
                        else if (this.tile10.isClicked()) this.setTileType(10);
                        else if (this.tile11.isClicked()) this.setTileType(11);
                        else if (this.tile12.isClicked()) this.setTileType(12);
                        else if (this.tile13.isClicked()) this.setTileType(13);
                        else if (this.tile14.isClicked()) this.setTileType(14);
                        else if (this.tile15.isClicked()) this.setTileType(15);
                    }
                    //scrollwheel request
                    if (this.scroll == true){
                        createjs.Tween.get(window.Game.levelMap,{override:true}).to({ x:this.xPos }, 500, createjs.Ease.cubicOut);
                        this.scroll = false;
                    }
                }
            }
        };
        this.updateUI = function(screen){
            //add children to container
            this.screen = (screen != null) ? screen : this.screen;
            if (this.screen == 1) this.renderSelectorScreen();
            else if (this.screen == 2) this.renderEditorScreen();
        };
        this.renderSelectorScreen = function(){
            this.removeAllChildren();
            this.UI = new createjs.Container();
            //positioning buttons
            var bigBox = this.box16*4;
            var topY = bigBox / 2;
            var leftX = topY;
            var bottomY = this.screenHeight - (bigBox/2);

            this.main_color2 = window.Game.theme.main_color2;
            this.main_color3 = window.Game.theme.main_color3;

            //background
            this.bgColor = new createjs.Shape();
            this.bgColor.graphics.beginFill("#ffffff").drawRect(0, 0, this.screenWidth, this.screenHeight);

            //buttons
            this.back_button = new Button("_g", leftX, topY, bigBox, bigBox, "#000000", this.main_color2, "#ffffff", "#ffffff");
            this.text_1 = new Button("Editor", leftX+(bigBox*1.5), topY, bigBox*2, bigBox);
            this.text_1.setFontSize(1);
            this.text_1.disable();
            this.null_button = new Button("", leftX+(bigBox*3), topY, bigBox, bigBox);
            this.null_button.disable();
            this.share_button_1 = new Button("_v", leftX, bottomY, bigBox, bigBox, "#000000", this.main_color2, "#ffffff", "#ffffff");
            this.remove_button_1 = new Button("_n", leftX+(bigBox), bottomY, bigBox, bigBox, "#000000", this.main_color2, "#ffffff", "#ffffff");
            this.add_button_1 = new Button("_m", leftX+(bigBox*2), bottomY, bigBox, bigBox, "#000000", this.main_color2, "#ffffff", "#ffffff");
            this.edit_button = new Button("_c", leftX+(bigBox*3), bottomY, bigBox, bigBox, "#000000", this.main_color2, "#ffffff", "#ffffff");

            //custom levels
            this.levelButtons = new createjs.Container();
            for (var i=0; i < window.storageManager.getLocalStorageLength(); i++) this.addLevelButton(i);
            this.sortLevelButtons();
            //select appropriate level
            var length = this.levelButtons.children.length;
            if (length > 0){
                if (this.selectedButtonIndex == null) this.selectedButtonIndex = length;
                else {
                    if (this.selectedButtonIndex > length) this.selectedButtonIndex = length;
                    else if (this.selectedButtonIndex < 1) this.selectedButtonIndex = 1;
                }
                this.levelButtons.getChildAt(this.selectedButtonIndex-1).toggle();
            }
            if (this.selectedButtonIndex > 5){ //adjust placement of new selected button
                this.levelButtons.y = length <= 6 ? 0 :
                (this.box16*2*3.5 + (5*(this.box16*4*.75))) - this.levelButtons.getChildAt(this.selectedButtonIndex-1).y;
            }

            //add to container
            this.UI.addChild(this.levelButtons);
            this.UI.addChild(this.back_button, this.text_1, this.null_button);
            this.UI.addChild(this.share_button_1,this.remove_button_1, this.add_button_1, this.edit_button);
            this.addChild(this.bgColor, this.UI);
        };
        this.renderEditorScreen = function(){
            this.removeAllChildren();
            //positioning buttons
            var bigBox = this.box16*4;
            var topY = bigBox / 2;
            var leftX = topY;
            var bottomY = this.screenHeight - (bigBox/2);

            this.main_color2 = window.Game.theme.main_color2;
            this.main_color3 = window.Game.theme.main_color3;

            //reset position
            this.resetEditorScreen(true); //revert position

            //background
            this.bgColor = new createjs.Shape();
            this.bgColor.graphics.beginFill("#ffffff").drawRect(0, 0, this.screenWidth, this.screenHeight);

            //buttons
            this.menu_button = new Button("_a", leftX, topY, bigBox, bigBox, "#000000", this.main_color2, "#ffffff", "#ffffff");
            this.share_button_2 = new Button("_w", leftX+(bigBox), topY, bigBox, bigBox, "#000000", this.main_color2, "#ffffff", "#ffffff");
            this.undo_button = new Button("_i", leftX+(bigBox*2), topY, bigBox, bigBox, "#000000", this.main_color2, "#ffffff", "#ffffff");
            this.redo_button = new Button("_j", leftX+(bigBox*3), topY, bigBox, bigBox, "#000000", this.main_color2, "#ffffff", "#ffffff");
            this.add_button_2 = new Button("+"+this.tileType, leftX, bottomY, bigBox, bigBox, this.main_color3, this.main_color3, "#ffffff", "#ffffff");
            this.left_button = new Button("_k", leftX+(bigBox), bottomY, bigBox, bigBox, "#000000", this.main_color2, "#ffffff", "#ffffff");
            this.right_button = new Button("_l", leftX+(bigBox*2), bottomY, bigBox, bigBox, "#000000", this.main_color2, "#ffffff", "#ffffff");
            this.play_button = new Button("_b", leftX+(bigBox*3), bottomY, bigBox, bigBox, this.main_color2, this.main_color2, "#ffffff", "#ffffff");

            //toggle tile buttons
            if (this.showTileOptions){
                var a = 0.9;
                this.remove_column_button = new Button("_t", leftX+(bigBox), bottomY, bigBox, bigBox, "#000000", this.main_color2, "#ffffff", "#ffffff");
                this.insert_column_button = new Button("_u", leftX+(bigBox*2), bottomY, bigBox, bigBox, "#000000", this.main_color2, "#ffffff", "#ffffff");
                this.tile0 = new Button("+0", leftX, bottomY-(bigBox), bigBox, bigBox, this.main_color2, this.main_color3, "#ffffff", "#ffffff"); this.tile0.setShapeAlpha(a); //remove
                this.tile1 = new Button("+1", leftX+(bigBox), bottomY-(bigBox), bigBox, bigBox, this.main_color2, this.main_color3, "#ffffff", "#ffffff"); this.tile1.setShapeAlpha(a); //normal
                this.tile2 = new Button("+2", leftX+(bigBox*2), bottomY-(bigBox), bigBox, bigBox, this.main_color2, this.main_color3, "#ffffff", "#ffffff"); this.tile2.setShapeAlpha(a); //tip
                this.tile3 = new Button("+3", leftX+(bigBox*3), bottomY-(bigBox), bigBox, bigBox, this.main_color2, this.main_color3, "#ffffff", "#ffffff"); this.tile3.setShapeAlpha(a); //spawn
                this.tile4 = new Button("+4", leftX, bottomY-(bigBox*2), bigBox, bigBox, this.main_color2, this.main_color3, "#ffffff", "#ffffff"); this.tile4.setShapeAlpha(a); //upSpike
                this.tile5 = new Button("+5", leftX+(bigBox), bottomY-(bigBox*2), bigBox, bigBox, this.main_color2, this.main_color3, "#ffffff", "#ffffff"); this.tile5.setShapeAlpha(a); //rightSpike
                this.tile6 = new Button("+6", leftX+(bigBox*2), bottomY-(bigBox*2), bigBox, bigBox, this.main_color2, this.main_color3, "#ffffff", "#ffffff"); this.tile6.setShapeAlpha(a); //downSpike
                this.tile7 = new Button("+7", leftX+(bigBox*3), bottomY-(bigBox*2), bigBox, bigBox, this.main_color2, this.main_color3, "#ffffff", "#ffffff"); this.tile7.setShapeAlpha(a); //leftSpike
                this.tile8 = new Button("+8", leftX, bottomY-(bigBox*3), bigBox, bigBox, this.main_color2, this.main_color3, "#ffffff", "#ffffff"); this.tile8.setShapeAlpha(a); //expandBox
                this.tile9 = new Button("+9", leftX+(bigBox), bottomY-(bigBox*3), bigBox, bigBox, this.main_color2, this.main_color3, "#ffffff", "#ffffff"); this.tile9.setShapeAlpha(a); //shrinkBox
                this.tile10 = new Button("+10", leftX+(bigBox*2), bottomY-(bigBox*3), bigBox, bigBox, this.main_color2, this.main_color3, "#ffffff", "#ffffff"); this.tile10.setShapeAlpha(a); //bounceUp
                this.tile11 = new Button("+11", leftX+(bigBox*3), bottomY-(bigBox*3), bigBox, bigBox, this.main_color2, this.main_color3, "#ffffff", "#ffffff"); this.tile11.setShapeAlpha(a); //finish
                this.tile12 = new Button("+12", leftX, bottomY-(bigBox*4), bigBox, bigBox, this.main_color2, this.main_color3, "#ffffff", "#ffffff"); this.tile12.setShapeAlpha(a); //up block
                this.tile13 = new Button("+13", leftX+(bigBox), bottomY-(bigBox*4), bigBox, bigBox, this.main_color2, this.main_color3, "#ffffff", "#ffffff"); this.tile13.setShapeAlpha(a); //right block
                this.tile14 = new Button("+14", leftX+(bigBox*2), bottomY-(bigBox*4), bigBox, bigBox, this.main_color2, this.main_color3, "#ffffff", "#ffffff"); this.tile14.setShapeAlpha(a); //bottom block
                this.tile15 = new Button("+15", leftX+(bigBox*3), bottomY-(bigBox*4), bigBox, bigBox, this.main_color2, this.main_color3, "#ffffff", "#ffffff"); this.tile15.setShapeAlpha(a); //left block
                this.checkSelectedTile();
            }

            this.grid = this.createGrid(12,14);
            this.marker = new createjs.Container(); //overlay to mark future tiles (for performance reasons)
            this.marker.y = this.grid.y;
            this.marker.regY = this.grid.regY;

            //add to container
            this.addChild(this.bgColor, this.grid, window.Game.levelMap, this.marker);
            this.addChild(this.menu_button, this.share_button_2, this.undo_button, this.redo_button);
            this.addChild(this.left_button, this.right_button, this.add_button_2, this.play_button);
            if (this.showTileOptions){
                this.addChild(this.remove_column_button, this.insert_column_button,
                    this.tile0, this.tile1, this.tile2, this.tile3,
                    this.tile4, this.tile5, this.tile6, this.tile7,
                    this.tile8, this.tile9, this.tile10, this.tile11,
                    this.tile12, this.tile13, this.tile14, this.tile15);
            }
        };
        this.setTile = function(event, preventRender){
            if (event.nativeEvent.button == 2) this.erase = true; //enable erase if button = right click
            var col = Math.floor((event.stageX - window.Game.levelMap.x)/this.box12);
            var row = Math.floor((event.stageY - window.Game.levelMap.y)/this.box12);
            var success = false;
            if (!this.showTileOptions && window.Game.dialog.isClosed()){ 
                //sets a new tile and declares if successful
                success = window.Game.levelMap.setTile(col,row,this.erase==false?this.tileType:0);
            }
            this.main_color2 = window.Game.theme.main_color2;
            this.main_color3 = window.Game.theme.main_color3;

            if (success == true){ //if the levelMap has been altered
                createjs.Tween.removeTweens(window.Game.levelMap);
                this.xPos = window.Game.levelMap.x = Math.floor(window.Game.levelMap.x / this.box12) * (this.box12);

                if (preventRender == true){ //draws temporary overlay tiles (useful for optimization)
                    var shape = new createjs.Shape();
                    shape.graphics.beginFill(this.main_color2).drawRect(
                        Math.floor((event.stageX)/this.box12)*this.box12+(this.box12 * 0.25),
                        Math.floor((event.stageY - window.Game.levelMap.y)/this.box12)*this.box12+(this.box12 * 0.25),
                        this.box12 / 2,this.box12 / 2);
                    this.marker.addChild(shape);
                }
                else { //render and cache all tiles (heavy processing)
                    this.marker.removeAllChildren();
                    window.Game.levelMap.renderMap();
                }

                if (col < 0) { //handle new left columns
                    this.xPos += (col) * this.box12;
                    window.Game.levelMap.x = this.xPos;
                    window.Game.levelMap.shiftChildren(-col*this.box12,0);
                }
            }
            else {
                //check if it is outside the tile range
                if (this.marker.children.length){
                    this.marker.removeAllChildren();
                    window.Game.levelMap.renderMap();
                }
            }
            return success;
        };
        this.setTileType = function(type){
            this.tileType = (type != null) ? type : this.tileType;
            this.showTileOptions = false;
            this.updateUI(2);
        };
        this.stageMouseDown = function(event){
            this.levelDrag = true;
            if (this.screen == 1){
                this.stageY = event.stageY;
                this.offsetY = this.stageY - this.levelButtons.y;
            }
            else if (this.screen == 2){
                if(this.setTile(event, true)){ this.mapDrag = true; }
            }
        };
        this.stageMouseMove = function(event){
            if (this.screen == 1){
                if (this.levelDrag == true) {
                    //helpful for preventing touchy scrolling
                    if (Math.abs(this.stageY-event.stageY) >= this.box16/2){
                        this.levelButtons.mouseEnabled = false;
                        this.stageY = event.stageY + (this.box16); //reset touchy stageY
                        this.levelButtons.y = event.stageY - this.offsetY;
                    }
                }
                if (this.levelButtons.y > 0){ this.levelButtons.y = 0; }
            }
            else if (this.screen = 2){
                if (this.mapDrag){ this.setTile(event, true); }
            }
        };
        this.stageMouseUp = function(event){
            if (this.screen == 1){ }
            else if (this.screen = 2){
                this.setTile(event);
                if (this.mapDrag == true){ 
                    if (this.tileType == 2){ //edit the level tip
                        var tip = window.prompt("Level tip", window.storageManager.tipString);
                        if (tip != null) window.storageManager.tipString = tip;
                    }
                    window.Game.levelMap.saveMapHistory(); 
                }
            }

            //reset values
            this.levelDrag = this.mapDrag = this.erase = false;
            this.levelButtons.mouseEnabled = true;
        };
        this.scrollWheel = function (e){
            if (this.screen == 1){ //changes the y position of the level chooser
                this.levelButtons.y += e.wheelDelta;
                if (this.levelButtons.y > 0) this.levelButtons.y = 0;
            }
            else if (this.screen = 2){ //changes the y position of the level editor
                this.hideTileOptions();
                this.xPos += this.box12 * 3 * (e.wheelDelta < 0 ? -1 : 1);
                this.scroll = true;
            }
        };
        this.setScrollSpeed = function(){
            if (this.scrollSpeed == null || this.scrollSpeed == 0) this.scrollSpeed = 3;
            else if (this.scrollSpeed == 3) this.scrollSpeed = 6;
        }
        this.addLevelButton = function(i){
            var bigBox = this.box16*4;
            var key = window.storageManager.getLocalStorageKey(i);
            var prefix = window.storageManager.prefix;
            var stringIndex = key.indexOf(prefix);
            if (stringIndex >= 0) {
                key = key.substring(prefix.length);
                var level = new Button("Level "+key,
                    this.screenWidth/2, (this.box16*2*3.5)+(i*(bigBox * 0.75)),
                    bigBox*3, bigBox/2);
                level.setFontSize(0.9);
                level.addStroke(this.box12 / 5,"#000000", "inner"); //6 point stroke
                //this.levelButtons.addChildAt(level,i);
                this.levelButtons.addChildAt(level);
            }
        };
        this.sortLevelButtons = function(){
            this.levelButtons.children.sort(sortNumbers);
            function sortNumbers(a,b){
                var keyA = parseInt(Number(a.name.replace(/[a-z, ]/gi,'')),10);
                var keyB = parseInt(Number(b.name.replace(/[a-z, ]/gi,'')),10);
                return keyA-keyB;
            }
            for (var i=0; i<this.levelButtons.children.length; i++){
                this.levelButtons.getChildAt(i).y = (this.box16*2*3.5)+(i*(this.box16*4*.75));
            }
        };
        this.deleteLevelButton = function(){
            var index = this.selectedButtonIndex-1;
            if (index >= 0 && index < this.levelButtons.children.length){
                this.levelButtons.removeChildAt(index);
                if (this.levelButtons.children.length > 0){ this.selectedButtonIndex--; }
            }
        };
        this.getLevelButtonText = function(i){ return this.levelButtons.getChildAt(i).getText(); };
        this.createGrid = function(cols, rows){
            //draw grid
            var shape = new createjs.Shape();
            var shapeContainer = new createjs.Container();
            shapeContainer.rows = rows;
            shapeContainer.cols = cols;
            for (var row=0; row < rows; row++){
                for (var col=0; col < cols; col++){
                    shape.graphics.setStrokeStyle(1).beginStroke("#ededed").drawRect(col*this.box12,row*this.box12,this.box12,this.box12);
                }
            }
            shapeContainer.addChild(shape);
            shapeContainer.cache(0,0,cols*this.box12,rows*this.box12);
            shapeContainer.y = window.Game.getHeight() / 2;
            shapeContainer.regY = (rows * this.box12) / 2;
            return shapeContainer;
        };
        this.saveCurrentLevel = function(){
            var levelKey = parseInt(this.getLevelButtonText(this.selectedButtonIndex-1).replace ( /[^\d.]/g, '' ));
            window.storageManager.setLevelString(window.Game.levelMap.toString());
            window.storageManager.saveToLocalStorage(levelKey);
            window.storageManager.uploadLocalStorageToChromeStorage(); //upload to chrome storage
        };
        this.editCurrentLevel = function(resumeEditing){
            var levelKey = parseInt(this.getLevelButtonText(this.selectedButtonIndex-1).replace ( /[^\d.]/g, '' ));
            window.storageManager.trimLocalLevel(levelKey, false);
            window.Game.levelMap.createMapFromString(window.storageManager.levelString);
            window.Game.levelMap.saveMapHistory(resumeEditing); //save first history point
            window.Game.levelMap.renderMap();
            this.resetEditorScreen(resumeEditing); //resets position
            this.updateUI(2);
        };
        this.shareCurrentLevel = function(){
            if (this.screen == 2) this.saveCurrentLevel();
            var code = Math.random().toString(16).slice(2, 8).toUpperCase(); //database index
            var levelKey = parseInt(this.getLevelButtonText(this.selectedButtonIndex-1).replace ( /[^\d.]/g, '' ));
            window.storageManager.trimLocalLevel(levelKey, false);
            window.Game.levelMap.createMapFromString(window.storageManager.levelString);
            window.storageManager.setLevelString(window.Game.levelMap.toString());
            window.storageManager.saveLevelToPortal(code, window.storageManager.expandLevel());
        };
        this.resetEditorScreen = function(resumeEditing){
            if (resumeEditing == true){ window.Game.levelMap.x = this.xPos; }
            else { this.xPos = window.Game.levelMap.x = 0; }
        };
        this.escapeKey = function(){
            if (this.screen == 1){ //return to home screen
                if (window.Game.dialog.isClosed()){
                    this.updateUI(1);
                    window.Game.player.respawn();
                    window.Game.setView(1);
                }
                else window.Game.dialog.removeDialogWindow();
            }
            else if (this.screen == 2){ //return to level selector screen
                window.Game.player.newSpawn = false;
                this.saveCurrentLevel();
                this.updateUI(1);
            }
        };
        this.deleteKey = function(){
            if (this.selectedButtonIndex != 0){ //level must be selected
                window.Game.dialog.openDialogWindow("delete");
            }

        };
        this.leftKey = function(){ this.xPos += this.box12 * 6; this.scroll = true; };
        this.rightKey = function(){ this.xPos -= this.box12 * 6; this.scroll = true; };
        this.checkSelectedTile = function(){
            switch(this.tileType){
                case(0): this.tile0.toggleColor(true); break;
                case(1): this.tile1.toggleColor(true); break;
                case(2): this.tile2.toggleColor(true); break;
                case(3): this.tile3.toggleColor(true); break;
                case(4): this.tile4.toggleColor(true); break;
                case(5): this.tile5.toggleColor(true); break;
                case(6): this.tile6.toggleColor(true); break;
                case(7): this.tile7.toggleColor(true); break;
                case(8): this.tile8.toggleColor(true); break;
                case(9): this.tile9.toggleColor(true); break;
                case(10): this.tile10.toggleColor(true); break;
                case(11): this.tile11.toggleColor(true); break;
                case(12): this.tile12.toggleColor(true); break;
                case(13): this.tile13.toggleColor(true); break;
                case(14): this.tile14.toggleColor(true); break;
                case(15): this.tile15.toggleColor(true); break;
            }
        };
        this.hideTileOptions = function(){
            if (this.showTileOptions) {
                this.showTileOptions = false;
                this.setTileType(this.tileType);
                this.updateUI(2);
            }
        };
        this.generateRandomTip = function(){
            var list = ["Good luck!", "Hi friend!", "Howdy!", "What goes down must come back up.", "Listen to me! Or don't.", "Tip #309: Don't put twinkies on you pizza."];
            var i = window.lb.getRandomInt(0,list.length - 1);
            return list[i];
        }
        this.undo = function(){ this.hideTileOptions(); window.Game.levelMap.undoMapHistory(); };
        this.redo = function(){ this.hideTileOptions(); window.Game.levelMap.redoMapHistory(); };

        //initiate prototype variables
        this.init();
	}
}(window));