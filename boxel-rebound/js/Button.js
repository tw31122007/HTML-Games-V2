(function (window) {

    //extend & promote createjs.Container functions to window
    createjs.extend(Button, createjs.Container);
    window.Button = createjs.promote(Button, "Container");

	//constructor
	function Button(text, x, y, width, height, bgColor1, bgColor2, fontColor1, fontColor2, shapeInner) {
        //prototype functions
		this.init = function(){
            //initiate object variables
            this.Container_constructor();
            this.box16 = window.Game.box16;
            this.x = Math.floor(x);
            this.y = Math.floor(y);
            this.regX = Math.floor(width/2);
            this.regY = Math.floor(height/2);
            this.shape = new createjs.Shape();
            this.shape.alpha = this.targetShapeAlpha = 1;
            this.shapeInner = shapeInner;
            this.width = width;
            this.height = height;
            this.text = this.name = text;
            this.fontSize = this.box16 * (1.5); //em = 16, 16x1.25 = ~20px
            this.fontFamily = "prstart";
            this.alignment = "center";
            this.alpha = this.targetAlpha = 1;
            this.setColors(bgColor1, bgColor2, fontColor1, fontColor2);
            this.redraw();
            this.addListeners();
		};

        //update
        this.tick = function (delta) {
            //tick functionality
        };
        this.addListeners = function(){
            this.mouseChildren = false; //prevent action on 'content'
            this.on("pressmove", function(evt){ this.pressMove(evt); });
            this.on("click", function(evt){ this.click(evt); });
            this.on("rollover", function(evt){ this.rollOver(evt); });
            this.on("rollout", function(evt){ this.rollOut(evt); });
        };
        this.pressMove = function(evt) { /*console.log("x:"+evt.stageX+", y:"+evt.stageY);*/ };
        this.click = function(evt) { this.toggle(); };
        this.rollOver = function(evt) {
            this.cursor="pointer";
            this.bgColor = this.bgColor2;
            this.fontColor = this.fontColor2;
            this.hovering = true;
            this.redraw();
        };
        this.rollOut = function(evt) {
            if (!this.toggled && !this.colorToggled) {
                this.bgColor = this.bgColor1;
                this.fontColor = this.fontColor1;
                this.redraw();
            }
            this.hovering = false;
        };

        //styling
        this.redraw = function(){
            this.removeAllChildren();
            //background
            this.shape = new createjs.Shape();
            this.shape.alpha = this.targetShapeAlpha;
            this.shape.graphics.beginFill(this.bgColor).drawRect(0,0,this.width,this.height);
            if (this.shapeInner == null) this.shapeInner = new createjs.Shape();
            //content
            this.isChar = true;
            if (this.text.charAt(0) == "_"){ //format for icon font-family
                this.isChar = false;
                this.fontFamily = "icons";
                this.text = this.text.substring(1);
            }
            else if (this.text.charAt(0) == "+"){ //format for tile shape option
                this.isChar = false;
                this.text = this.text.substring(1);
                this.tile = window.tiles.drawShape("#ffffff",1,1,parseInt(this.text),false);
                this.text = "";
            }
            this.content = new createjs.Text(this.text, this.fontSize +"px "+this.fontFamily, this.fontColor);
            this.content.textBaseline = "middle";
            //set alignment
            this.setAlignment(this.alignment);
            //check stroke
            if (this.sWidth != null) this.addStroke();
            //check text outline
            if (this.outline != null){
                this.contentOutline = this.content.clone();
                this.contentOutline.outline = this.outline;
                this.contentOutline.color = this.outlineColor;
                //console.log(this.content.x);
                this.addChild(this.shape, this.contentOutline, this.content, this.tile, this.shapeInner);
            }
            else {
                this.addChild(this.shape, this.content, this.tile, this.shapeInner);
            }
            //set alpha
            this.alpha = this.targetAlpha;
        };
        this.setFontSize = function(fontSize){ this.fontSize = this.box16 * fontSize; this.redraw(); };
        this.setFontColor = function(fontColor){ this.fontColor = fontColor; this.redraw(); };
        this.setFontFamily = function(fontFamily){ this.fontFamily = fontFamily; this.redraw(); };
        this.disable = function(alpha){ if (alpha == null) { alpha = 1; } this.mouseEnabled = false; this.content.alpha = alpha; this.shapeInner.alpha = alpha; };
        this.enable = function(alpha){ if (alpha == null) alpha = 1; this.mouseEnabled = true; this.content.alpha = alpha; this.shapeInner.alpha = alpha; };
        this.isEnabled = function(){ return this.mouseEnabled; };
        this.isDisabled = function(){ return this.mouseEnabled == true; };
        this.addStroke = function(sWidth, sColor, sStyle){
            if (sWidth != null) this.sWidth = sWidth;
            if (sColor != null) this.sColor = sColor;
            if (sStyle != null) this.sStyle = sStyle;
            this.sHalf = 0;
            if (this.sStyle == "outer") this.sHalf = (this.sWidth / 2);
            this.shape.graphics.setStrokeStyle(this.sWidth).beginStroke(this.sColor)
                .drawRect(0-this.sHalf,0-this.sHalf,this.width+(this.sHalf*2),this.height+(this.sHalf*2));
        };
        this.addOutline = function(oWidth, oColor){ 
            this.outline = oWidth; 
            this.outlineColor = oColor;
        };
        this.isClicked = function(){
            //reset toggle if clicked for instant feedback
            if (this.toggled){ this.toggled = false; this.rollOut(); return true; }
            else { return false; }
        };
        this.isToggled = function(){ return this.toggled; };
        this.isHovering = function(){ return this.hovering == true; };
        this.toggle = function(){
            if (this.toggled){ this.toggled = false; this.rollOut(); }
            else { this.toggled = true; this.rollOver(); }
        };
        this.toggleOff = function(){ if (this.toggled) { this.toggled = false; this.rollOut(); }};
        this.toggleColor = function(toggleColor){
            if (toggleColor) {
                if (this.colorToggled != true) {
                    this.colorToggled = true; //prevent redrawing
                    this.rollOver();
                }
            }
            else {
                if (this.colorToggled == true){
                    this.colorToggled = false; //prevent redrawing
                    this.rollOut();
                }
            }
        };
        this.setText = function(text){ this.content.text = this.text = text; };
        this.getText = function(){ return this.text; };
        this.transform = function(style){
            var text = this.content.text;
            if (this.isChar == true){ //only transform chars
                switch(style.toLowerCase()){
                    case("uppercase"): this.setText(text.toUpperCase()); break;
                    case("lowercase"): this.setText(text.toLowerCase()); break;
                    case("capitalize"): this.setText(window.lb.capitalize(text)); break;
                }
            }
        };
        this.setAlignment = function(alignment){
            switch(alignment){
                case("left"):
                    this.alignment = this.content.textAlign = alignment;
                    this.content.setTransform(this.box16/2,this.height/2);
                break;
                case("center"):
                    this.alignment = this.content.textAlign = alignment;
                    this.content.setTransform(this.width/2,this.height/2);
                break;
                case("right"):
                    this.alignment = this.content.textAlign = alignment;
                    this.content.setTransform(this.width-(this.box16/2),this.height/2);
                break;
            }
        }
        this.setColors = function(bgColor1, bgColor2, fontColor1, fontColor2, redraw){
            this.bgColor1 = this.bgColor = (bgColor1 == null) ? "#000000" : bgColor1;
            this.bgColor2 = (bgColor2 == null) ? "#FFFFFF" : bgColor2;
            this.fontColor1 = this.fontColor = (fontColor1 == null) ? this.bgColor2 : fontColor1;
            this.fontColor2 = fontColor2 != null ? fontColor2 : this.bgColor1;
            if (redraw == true) this.redraw();
        };
        this.setShapeAlpha = function(a){ this.shape.alpha = this.targetShapeAlpha = a; }

        //initiate prototype variables
        this.init();
	}
}(window));