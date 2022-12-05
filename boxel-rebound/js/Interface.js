(function (window) {

    //extend & promote createjs.Container functions to window
    createjs.extend(Interface, createjs.Container);
    window.Interface = createjs.promote(Interface, "Container");

	//constructor
	function Interface() {

        this.init = function(){
            this.Container_constructor();
            this.screenWidth = window.Game.getWidth();
            this.screenHeight = window.Game.getHeight();
            this.box16 = window.Game.box16;
            this.fontSize = this.box16 * 0.75;
            this.fontColor = "#ffffff";
            //this.build();
        };

        this.build = function(){
            this.removeAllChildren();
            //positioning buttons
            var bigBox = this.box16*4;
            var topY = bigBox / 2;
            var leftX = topY;
            //set colors to theme
            this.main_color2 = window.Game.theme.main_color2;
            this.main_color3 = window.Game.theme.main_color3;
            //main game ui
            this.menu_button = new Button("_a", leftX, topY, bigBox/2, bigBox/2, this.main_color2, "#000000", "#ffffff", "#ffffff");
            this.menu_button.setFontSize(0.5);
            this.time_button = new Button(window.timer.toString(),(leftX*2.75), topY, Math.floor(bigBox*1.25), bigBox/2,"#000000",this.main_color2,"#ffffff","#ffffff");
            this.time_button.setFontSize(0.75);
            this.addChild(this.menu_button, this.time_button); //draw level container
        };

        this.removeInterface = function(){ this.removeAllChildren(); };

        //update
        this.tick = function (delta) {
            this.updateTimeButton();
            if (this.menu_button.isClicked() || this.time_button.isClicked()){ //open dialog
                window.Game.pauseGame();
            }
        };

        this.updateTimeButton = function(useGlobalScore){ 
            useGlobalScore = (useGlobalScore === undefined) ? false : true;
            this.time_button.setText(useGlobalScore == true ? window.Game.score : window.timer.toString()); 
        };

        //initiate prototype variables
        this.init();
	}
}(window));