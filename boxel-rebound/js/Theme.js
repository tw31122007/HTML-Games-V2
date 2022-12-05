(function (window) {

    //extend & promote createjs.Container functions to window
    createjs.extend(Theme, createjs.Container);
    window.Theme = createjs.promote(Theme, "Container");

	//constructor
	function Theme() {
        //prototype functions
		this.init = function(){
            //initiate object variables
            this.Container_constructor();
            this.box16 = window.Game.box16; //multiplier to maintain size for lower rez screens
            this.screenWidth = window.Game.getWidth();
            this.screenHeight = window.Game.getHeight();
            this.bgWidth = this.screenWidth * 2;
            this.setTheme("pinkLand");
		};

        this.tick = function (delta, forceY) {
            //loop layer positions
            this.getChildAt(1).x = -((window.Game.player.xPos/5) % this.bgWidth);
            this.getChildAt(2).x = -((window.Game.player.xPos/3.25) % this.bgWidth);
            this.getChildAt(3).x = -((window.Game.player.xPos/2.75) % this.bgWidth);
            this.getChildAt(4).x = -((window.Game.player.xPos/2) % this.bgWidth);
            this.getChildAt(5).x = -((window.Game.player.xPos/1.75) % this.bgWidth);
            //adjust height to player position
            window.Game.player.setXY(null, forceY ? 0 : null, forceY);
            this.y = -(window.Game.player.y-(this.screenHeight/2))/2;
        };

        this.setTheme = function(theme){
            var newTheme = false;
            if (theme != this.theme){ //only redraw if the theme is different
                newTheme = true;
                this.theme = theme;
                this.removeAllChildren();
                var layer1 = new createjs.Container(); //bg color
                var layer2 = new createjs.Container(); //floating particles
                var layer3 = new createjs.Container(); //foreground
                var layer4 = new createjs.Container(); //middleground
                var layer5 = new createjs.Container(); //background
                var layer6 = new createjs.Container(); //more floating particles

                if (theme == "pinkLand"){
                    //colors
                    this.layer1_color = "#ffffff";
                    this.layer2_color = "#fff1f5";
                    this.layer3_color = "#f8d4de";
                    this.layer4_color = "#f2b1c4";
                    this.layer5_color = "#ee95af";
                    this.layer6_color = "#fff1f5";
                    this.main_color1 = "#dc265a"; //player
                    this.main_color2 = "#dc265a"; //selector
                    this.main_color3 = "#620460"; //selector
                    this.main_color4 = "#620460"; //map tile
                    //layer 1
                    var bgColor = new createjs.Shape();
                    bgColor.graphics.beginFill(this.layer1_color).drawRect(0, -this.screenWidth, this.screenWidth*1.5, this.screenHeight*2);
                    layer1.addChild(bgColor);
                    //layer 2
                    var particles = this.createClouds(this.layer2_color, 5);
                    layer2.addChild(particles, this.replicate(particles));
                    //layer 3
                    var a = this.createCityLandscape(this.layer3_color, this.screenHeight/2);
                    layer3.addChild(a, this.replicate(a));
                    //layer 4
                    var b = this.createCityLandscape(this.layer4_color, (this.screenHeight/2)+(this.box16*4));
                    layer4.addChild(b, this.replicate(b));
                    //layer 5
                    var c = this.createCityLandscape(this.layer5_color, (this.screenHeight/2)+(this.box16*8));
                    layer5.addChild(c, this.replicate(c));
                    //layer 6
                    var particles2 = this.createClouds(this.layer6_color, 5);
                    layer6.addChild(particles2, this.replicate(particles2));
                }
                else if (theme == "darkLand"){
                    //colors
                    this.layer1_color = "#583666"; //sky
                    this.layer2_color = "#6e4480"; //clouds
                    this.layer3_color = "#4d2f59"; //landscape-1
                    this.layer4_color = "#42294d"; //landscape-2
                    this.layer5_color = "#36213e"; //landscape-3
                    this.layer6_color = "#6e4480"; //clouds
                    this.main_color1 = "#ffffff"; //player
                    this.main_color2 = "#c37ae5"; //selector 1
                    this.main_color3 = "#995fb3"; //selector 2
                    this.main_color4 = "#995fb3"; //map tile
                    //layer 1
                    var bgColor = new createjs.Shape();
                    bgColor.graphics.beginFill(this.layer1_color).drawRect(0, -this.screenWidth, this.screenWidth*1.5, this.screenHeight*2);
                    layer1.addChild(bgColor);
                    //layer 2
                    var particles = this.createClouds(this.layer2_color, 5);
                    layer2.addChild(particles, this.replicate(particles));
                    //layer 3
                    var a = this.createCityLandscape(this.layer3_color, this.screenHeight/2);
                    layer3.addChild(a, this.replicate(a));
                    //layer 4
                    var b = this.createCityLandscape(this.layer4_color, (this.screenHeight/2)+(this.box16*4));
                    layer4.addChild(b, this.replicate(b));
                    //layer 5
                    var c = this.createCityLandscape(this.layer5_color, (this.screenHeight/2)+(this.box16*8));
                    layer5.addChild(c, this.replicate(c));
                    //layer 6
                    var particles2 = this.createClouds(this.layer6_color, 5);
                    layer6.addChild(particles2, this.replicate(particles2));
                }
                else if (theme == "blueLand"){
                    //colors
                    this.layer1_color = "#004992"; //sky
                    this.layer2_color = "#0273d2"; //clouds
                    this.layer3_color = "#0273d2"; //landscape-1
                    this.layer4_color = "#01bfe2"; //landscape-2
                    this.layer5_color = "#76f3de"; //landscape-3
                    this.layer6_color = "#0273d2"; //clouds
                    this.main_color1 = "#ffffff"; //player
                    this.main_color2 = "#0273d2"; //selector 1
                    this.main_color3 = "#004992"; //selector 2
                    this.main_color4 = "#ffffff"; //map tile
                    //layer 1
                    var bgColor = new createjs.Shape();
                    bgColor.graphics.beginFill(this.layer1_color).drawRect(0, -this.screenWidth, this.screenWidth*1.5, this.screenHeight*2);
                    layer1.addChild(bgColor);
                    //layer 2
                    var particles = this.createClouds(this.layer2_color, 5);
                    layer2.addChild(particles, this.replicate(particles));
                    //layer 3
                    var a = this.createWaves(this.layer3_color, this.screenHeight/2);
                    layer3.addChild(a, this.replicate(a));
                    //layer 4
                    var b = this.createWaves(this.layer4_color, (this.screenHeight/2)+(this.box16*4));
                    layer4.addChild(b, this.replicate(b));
                    //layer 5
                    var c = this.createWaves(this.layer5_color, (this.screenHeight/2)+(this.box16*8));
                    layer5.addChild(c, this.replicate(c));
                    //layer 6
                    var particles2 = this.createClouds(this.layer6_color, 5);
                    layer6.addChild(particles2, this.replicate(particles2));
                }
                else if (theme == "hellLand"){
                    //colors
                    this.layer1_color = "#ffd33b"; //sky
                    this.layer2_color = "#ffffff"; //clouds
                    this.layer3_color = "#fbaf1c"; //landscape-1
                    this.layer4_color = "#fb651c"; //landscape-2
                    this.layer5_color = "#fb1c1c"; //landscape-3
                    this.layer6_color = "#ffffff"; //clouds
                    this.main_color1 = "#000000"; //player
                    this.main_color2 = "#fb651c"; //selector 1
                    this.main_color3 = "#fb1c1c"; //selector 2
                    this.main_color4 = "#000000"; //map tile
                    //layer 1
                    var bgColor = new createjs.Shape();
                    bgColor.graphics.beginFill(this.layer1_color).drawRect(0, -this.screenWidth, this.screenWidth*1.5, this.screenHeight*2);
                    layer1.addChild(bgColor);
                    //layer 2
                    var particles = this.createClouds(this.layer2_color, 5);
                    layer2.addChild(particles, this.replicate(particles));
                    //layer 3
                    var a = this.createWaves(this.layer3_color, this.screenHeight/2);
                    layer3.addChild(a, this.replicate(a));
                    //layer 4
                    var b = this.createWaves(this.layer4_color, (this.screenHeight/2)+(this.box16*4));
                    layer4.addChild(b, this.replicate(b));
                    //layer 5
                    var c = this.createWaves(this.layer5_color, (this.screenHeight/2)+(this.box16*8));
                    layer5.addChild(c, this.replicate(c));
                    //layer 6
                    var particles2 = this.createClouds(this.layer6_color, 5);
                    layer6.addChild(particles2, this.replicate(particles2));
                }
                else if (theme == "snesLand"){
                    //colors
                    this.layer1_color = "#ced4d4"; //sky
                    this.layer2_color = "#e6eded"; //clouds
                    this.layer3_color = "#c0c1c1"; //landscape-1
                    this.layer4_color = "#969797"; //landscape-2
                    this.layer5_color = "#555656"; //landscape-3
                    this.layer6_color = "#e6eded"; //clouds
                    this.main_color1 = "#d44747"; //player
                    this.main_color2 = "#292e40"; //selector 1
                    this.main_color3 = "#555656"; //selector 2
                    this.main_color4 = "#292e40"; //map tile
                    //layer 1
                    var bgColor = new createjs.Shape();
                    bgColor.graphics.beginFill(this.layer1_color).drawRect(0, -this.screenWidth, this.screenWidth*1.5, this.screenHeight*2);
                    layer1.addChild(bgColor);
                    //layer 2
                    var particles = this.createClouds(this.layer2_color, 5);
                    layer2.addChild(particles, this.replicate(particles));
                    //layer 3
                    var a = this.createCityLandscape(this.layer3_color, this.screenHeight/2);
                    layer3.addChild(a, this.replicate(a));
                    //layer 4
                    var b = this.createCityLandscape(this.layer4_color, (this.screenHeight/2)+(this.box16*4));
                    layer4.addChild(b, this.replicate(b));
                    //layer 5
                    var c = this.createCityLandscape(this.layer5_color, (this.screenHeight/2)+(this.box16*8));
                    layer5.addChild(c, this.replicate(c));
                    //layer 6
                    var particles2 = this.createClouds(this.layer6_color, 5);
                    layer6.addChild(particles2, this.replicate(particles2));
                }
                else if (theme == "editLand"){
                    //colors
                    this.layer1_color = "#ffffff"; //sky
                    this.layer2_color = "#f1f1f1"; //clouds
                    this.layer3_color = "#f1f1f1"; //landscape-1
                    this.layer4_color = "#e6e6e6"; //landscape-2
                    this.layer5_color = "#dddddd"; //landscape-3
                    this.layer6_color = "#f1f1f1"; //clouds
                    this.main_color1 = "#de5ced"; //player
                    this.main_color2 = "#de5ced"; //selector 1
                    this.main_color3 = "#de5ced"; //selector 2
                    this.main_color4 = "#000000"; //map tile
                    //layer 1
                    var bgColor = new createjs.Shape();
                    bgColor.graphics.beginFill(this.layer1_color).drawRect(0, -this.screenWidth, this.screenWidth*1.5, this.screenHeight*2);
                    layer1.addChild(bgColor);
                    //layer 2
                    var particles = this.createClouds(this.layer2_color, 5);
                    layer2.addChild(particles, this.replicate(particles));
                    //layer 3
                    var a = this.createCityLandscape(this.layer3_color, this.screenHeight/2);
                    layer3.addChild(a, this.replicate(a));
                    //layer 4
                    var b = this.createCityLandscape(this.layer4_color, (this.screenHeight/2)+(this.box16*4));
                    layer4.addChild(b, this.replicate(b));
                    //layer 5
                    var c = this.createCityLandscape(this.layer5_color, (this.screenHeight/2)+(this.box16*8));
                    layer5.addChild(c, this.replicate(c));
                    //layer 6
                    var particles2 = this.createClouds(this.layer6_color, 5);
                    layer6.addChild(particles2, this.replicate(particles2));
                }
                else if (theme == "jungleLand"){
                    //colors
                    this.layer1_color = "#ade84a"; //sky
                    this.layer2_color = "#ffffff"; //clouds
                    this.layer3_color = "#91d81c"; //landscape-1
                    this.layer4_color = "#72c100"; //landscape-2
                    this.layer5_color = "#50a700"; //landscape-3
                    this.layer6_color = "#ffffff"; //clouds
                    this.main_color1 = "#000000"; //player
                    this.main_color2 = "#72c100"; //selector 1
                    this.main_color3 = "#50a700"; //selector 2
                    this.main_color4 = "#000000"; //map tile
                    //layer 1
                    var bgColor = new createjs.Shape();
                    bgColor.graphics.beginFill(this.layer1_color).drawRect(0, -this.screenWidth, this.screenWidth*1.5, this.screenHeight*2);
                    layer1.addChild(bgColor);
                    //layer 2
                    var particles = this.createClouds(this.layer2_color, 5);
                    layer2.addChild(particles, this.replicate(particles));
                    //layer 3
                    var a = this.createCityLandscape(this.layer3_color, this.screenHeight/2);
                    layer3.addChild(a, this.replicate(a));
                    //layer 4
                    var b = this.createCityLandscape(this.layer4_color, (this.screenHeight/2)+(this.box16*4));
                    layer4.addChild(b, this.replicate(b));
                    //layer 5
                    var c = this.createCityLandscape(this.layer5_color, (this.screenHeight/2)+(this.box16*8));
                    layer5.addChild(c, this.replicate(c));
                    //layer 6
                    var particles2 = this.createClouds(this.layer6_color, 5);
                    layer6.addChild(particles2, this.replicate(particles2));
                }

                //add everything to the main container
                this.addChild(layer1,layer2,layer3,layer4,layer5,layer6);
            }
            return newTheme;
        };

        //creates a randomized building landscape
        this.createCityLandscape = function(color, startY){
            var shape = new createjs.Shape();
            shape.snapToPixel = true;
            shape.graphics.beginFill(color).drawRect(0, startY, this.bgWidth, this.screenHeight);
            for (var x=0; x < this.bgWidth; x+= this.box16*(window.lb.getRandomInt(0,10))/4){
                shape.graphics.beginFill(color).drawRect(
                    x, //start x
                    startY, //start y
                    this.box16*(window.lb.getRandomInt(1,10)/2), //width
                    -(this.box16*(window.lb.getRandomInt(1,20))/4) //height
                );
            }
            shape.cache(0,0,this.bgWidth,this.screenHeight*2); //flatten & trim
            return shape;
        };

        //create waves landscape
        this.createWaves = function(color, startY){
            var shape = new createjs.Shape();
            shape.snapToPixel = true;

            shape.graphics.beginFill(color).drawRect(0, startY, this.bgWidth, this.screenHeight);
            for (var x=0; x < this.bgWidth; x+= this.box16 * 0.5){
                var y = Math.sin(this.box16 * 0.25 * x) * this.box16;
                shape.graphics.beginFill(color).drawRect(
                    x, //start x
                    startY - y - this.box16, //start y
                    Math.floor(this.box16)+1, //width
                    this.box16 * 2 //height
                );
            }
            shape.cache(0,0,this.bgWidth,this.screenHeight*2); //flatten & trim
            return shape;
        }

        this.createClouds = function(color, amount, drawStroke) {
            var shape = new createjs.Shape();
            shape.snapToPixel = true;
            var cloudX;
            var cloudY;
            var puffX;
            var puffY;
            var puffSize;
            for (var x=0; x < this.bgWidth; x+= this.bgWidth / amount){
                cloudY = window.lb.getRandomInt(this.box16, (this.screenHeight / 2)+this.box16*2);
                for (var i=0; i < 5; i++){
                    puffX = window.lb.getRandomInt(-this.box16,this.box16);
                    puffY = window.lb.getRandomInt(-this.box16/4,this.box16/4);
                    puffSize = this.box16 * (window.lb.getRandomInt(5,25) / 10);
                    cloudX = x - (puffSize / 2) + puffX;
                    if (drawStroke != true) shape.graphics.beginFill(color).drawRect(cloudX, cloudY-(puffSize/2)+puffY, puffSize/2, puffSize/2);
                    else shape.graphics.setStrokeStyle(this.box16/8).beginStroke(color).drawRect(cloudX, cloudY-(puffSize/2)+puffY, puffSize/2, puffSize/2);
                }
            }
            shape.cache(0,0,this.bgWidth,this.screenHeight*2); //flatten & trim
            return shape;
        };

        //replicates shape to create a seamless looping effect
        this.replicate = function(shape){
            var shape_clone = shape.clone();
            shape_clone.x += this.bgWidth - 1; //remove 1 px gap on some resolutions
            return shape_clone;
        };

        //initiate prototype variables
		this.init();
	}
}(window));
