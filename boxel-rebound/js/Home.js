(function (window) {

    //extend & promote createjs.Container functions to window
    createjs.extend(Home, createjs.Container);
    window.Home = createjs.promote(Home, "Container");

    //main prototype
	function Home() {
        //prototype functions
		this.init = function(){
            //initiate object variables
            this.Container_constructor();
            this.screenWidth = window.Game.getWidth();
            this.screenHeight = window.Game.getHeight();
            this.box16 = window.Game.box16;
            this.rows = 10;
            this.cols = 5; //change this every time 10 levels are added

            this.setUI(true);
		};

        //update
        this.tick = function (delta) {
            //adjust height to player position
            if (this.editor_button.isClicked()){ 
                this.openEditor();
            }
            else if (this.play_button.isClicked()){
                window.Game.interface.build();
                window.storageManager.trimLocalLevel("level "+this.selectedLevel, true);
                window.Game.levelMap.createMapFromString(window.storageManager.levelString);
                window.Game.levelMap.renderMap(); //render 2d array and cache it
                window.Game.player.respawn(true); //force a full respawn
                window.Game.setView(2,1); //switch to gameplay view, 2=continue playing
                window.Game.gamePaused = false;
            }
            else {
                //check to see if only ONE level has been selected
                var selectedCount = 0;
                var selectedLevel = -1;
                var length = this.levels.children.length;
                var selectedList = [];
                for (var i=0; i < length; i++){
                    if (this.levels.getChildAt(i).isToggled()){
                        selectedLevel = i;
                        selectedCount++;
                        selectedList.push(i);
                    }
                }
                //enable edit button
                if (selectedCount < 2){ //if selected level has been changed
                    if (selectedLevel == -1){ //if no level IS selected
                        this.play_button.disable(0.1); //change alpha to 25%
                        this.play_button.toggleColor(false);
                    }
                    else{ //if a level IS selected, make it clickable
                        this.levelIndex = selectedLevel;
                        this.setTheme(selectedLevel);
                        this.play_button.enable();
                        this.play_button.toggleColor(true); //highlight edit button
                    }
                    if (this.updateNewScore == true || this.selectedLevel != selectedLevel+1){ //set selected level & update score
                        this.updateNewScore = false;
                        this.selectedLevel = selectedLevel+1;
                        this.time_button.text = window.storageManager.getLevelScore(this.selectedLevel);
                        this.time_button.redraw();
                        this.total_time_button.text = window.storageManager.getTotalScoreString()+" Points";
                        this.total_time_button.redraw();
                    }
                }
                else{
                    if (this.levels.getChildAt(this.selectedLevel-1).isToggled()){
                        if (selectedLevel >= this.selectedLevel) selectedList.shift();
                        else selectedList.pop();
                        this.levelIndex = selectedList[0];
                        this.setTheme(this.levelIndex); //send newly selected index
                    }
                    this.levels.getChildAt(this.selectedLevel-1).toggleOff();
                }
            }
        };
        this.setTheme = function(selectedLevel){
            var updateUI = false;
            switch(Math.floor((selectedLevel)/this.rows)){
                case(0): updateUI = window.Game.theme.setTheme("pinkLand"); break;
                case(1): updateUI = window.Game.theme.setTheme("darkLand"); break;
                case(2): updateUI = window.Game.theme.setTheme("blueLand"); break;
                case(3): updateUI = window.Game.theme.setTheme("hellLand"); break;
                case(4): updateUI = window.Game.theme.setTheme("jungleLand"); break;
            }
            if (updateUI == true) this.updateUIColor();
            return updateUI;
        };
        this.setUI = function(forceNextLevel){
            this.removeAllChildren();
            //positioning buttons
            var bigBox = this.box16*4;
            var topY = bigBox / 2;
            var leftX = topY;
            var bottomY = this.screenHeight - (bigBox/2);
            //set colors to theme
            this.main_color2 = window.Game.theme.main_color2;
            this.main_color3 = window.Game.theme.main_color3;
            //screen1 buttons
            this.editor_button = new Button("_c", leftX, bottomY, bigBox, bigBox, "#000000", this.main_color2, "#ffffff", "#ffffff");
            this.time_button = new Button("00:00", leftX+(bigBox*1.5), bottomY, bigBox*2, bigBox);
            this.time_button.setFontSize(0.75);
            this.time_button.disable();
            this.total_time_button = new Button("0 Points", leftX+(bigBox*1.5), topY*0.5, bigBox*4, bigBox*0.5, "transparent", "transparent", "#ffffff", "#ffffff");
            this.total_time_button.setFontSize(0.75);
            this.total_time_button.disable();
            this.total_time_button.addOutline(7, "#000000");
            this.play_button = new Button("_b", leftX+(bigBox*3), bottomY, bigBox, bigBox, "#000000", this.main_color2, "#ffffff", "#ffffff");
            //draw 50 level buttons
            var mBox = this.box16*2;
            var topY = mBox*2.1, leftX = mBox*1.5;
            var c1 = this.main_color2;
            var c2 = "#ffffff";
            var c3 = "#ffffff";
            var c4 = this.main_color2;
            var selectedLevel = (this.rows * this.cols); //assume no level selected
            this.levels = new createjs.Container();

            //create level buttons with record properties
            for (var col = 0; col < this.cols; col++){
                for (var row = 0; row < this.rows; row++){
                    var i = row+(col*10);
                    var score = parseInt(window.storageManager.getLevelScore(i+1).replace(":",""));
                    if (score == 0){
                        c1 = "#000000";
                        c4 = "#000000";
                        selectedLevel--;
                    }
                    this.level = new Button(""+(i+1),leftX+(col*mBox*1.25), topY+(row*mBox),mBox,mBox,c1,c2,c3,c4);;
                    this.level.setFontSize(0.75);
                    if (score == 0) this.level.disable();
                    this.levels.addChild(this.level);
                }
            }
            if (this.selectedLevel == null){ this.selectedLevel = selectedLevel; }
            //adjust wich level should be automatically be selected
            if (selectedLevel < this.levels.children.length){ 
                if (selectedLevel < 0) selectedLevel = 1; //if no records exist start at level 1
                this.levels.getChildAt(selectedLevel).bgColor1 = this.main_color3;
                this.levels.getChildAt(selectedLevel).fontColor1 = "#ffffff";
                this.levels.getChildAt(selectedLevel).rollOut(); //update new colors
                this.levels.getChildAt(selectedLevel).enable();
            }
            else if (this.selectedLevel >= this.levels.children.length){ 
                if (forceNextLevel != true) this.selectedLevel = this.levels.children.length;
                else this.selectedLevel = 0; 
            }
            if (forceNextLevel != true && this.selectedLevel > 0) this.selectedLevel--; //if user quits active level
            this.levels.getChildAt(this.selectedLevel).toggle();
            this.levels.x = window.Game.getWidth() / 2;
            this.levels.regX = Math.floor(((((this.cols-1)*(mBox*1.25))+mBox)/2)+mBox);
            this.updateScore();
            this.addChild(this.total_time_button, this.levels); //draw level container
            this.addChild(this.editor_button, this.time_button, this.play_button); //draw screen buttons
        };
        this.updateScore = function(){ this.updateNewScore = true; };
        this.updateUIColor = function(){//set colors to theme
            this.main_color2 = window.Game.theme.main_color2;
            this.main_color3 = window.Game.theme.main_color3;
            var c1 = this.main_color2;
            var c2 = "#ffffff";
            var c3 = "#ffffff";
            var c4 = this.main_color2;

            var selectedLevel = (this.rows * this.cols); //assume no level selected
            for (var col = 0; col < this.cols; col++){
                for (var row = 0; row < this.rows; row++){
                    var i = row+(col*10);
                    var score = parseInt(window.storageManager.getLevelScore(i+1).replace(":",""));
                    if (score == 0){
                        c1 = "#000000";
                        c4 = "#000000";
                        selectedLevel--;
                    }
                    this.levels.getChildAt(i).setColors(c1,c2,c3,c4,true);
                }
            }
            if (selectedLevel < this.levels.children.length){ //next level color
                this.levels.getChildAt(selectedLevel).bgColor1 = this.main_color3;
                this.levels.getChildAt(selectedLevel).rollOut();
            }
            this.levels.getChildAt(this.levelIndex).rollOver();
            this.editor_button.setColors("#000000",this.main_color2,"#ffffff","#ffffff",true);
            this.play_button.setColors("#000000",this.main_color2,"#ffffff","#ffffff",true);
            this.play_button.rollOver();
            this.play_button.rollOut();
        }
        this.getDefaultSelectedLevel = function(){
            //create level buttons with record properties
            var selectedLevel = (this.rows * this.cols); //assume no level selected
            for (var col = 0; col < this.cols; col++){
                for (var row = 0; row < this.rows; row++){
                    var i = row+(col*10);
                    var score = parseInt(window.storageManager.getLevelScore(i+1).replace(":",""));
                    if (score == 0) selectedLevel--;
                }
            }
            return selectedLevel;
        }
        this.openEditor = function() {
            window.Game.theme.setTheme("editLand");
            window.Game.levelEditor.updateUI(1);
            window.Game.setView(3); 
            window.Game.player.respawn(true); //force a full respawn
        }

        //initiate prototype variables
        this.init();
	}
}(window));