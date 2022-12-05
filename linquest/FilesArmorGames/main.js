(function(){
    Game.SINGLE_CONTROL = true;

    Engine.Assets.root = "Package/";
    //Engine.Renderer.autoscale = false;

    //Game.TEXT_DESKTOP_CONTINUE_EXIT = "ESC OR CLICK HERE";

    //Game.PLAYSTORE_BUTTON_POSITION = "top right";
    
    var PATH_INTRO = "../FilesArmorGames/intro.m4v";
    var PATH_RESOURCES = "../FilesArmorGames/resources.png";

    var textureResources = null;

    var Intro = /** @class */ (function (_super) {
        __extends(Intro, _super);

        var video = null;
        var introEnded = false;
        var gameCanvas = null;

        var removeBodyElement = function(id){
            var elem = document.getElementById(id);
            return elem.parentNode.removeChild(elem);
        }

        function Intro(){
            var _this = _super.call(this) || this;
            //_this.createMap("None", "Sky None");
            //var x = Game.Scene.xSizeLevel * 0.5;
            //var y = Game.Scene.ySizeLevel * 0.5;
            //Engine.Renderer.camera(x, y);
            Game.SceneFade.speed = 0;
            gameCanvas = document.getElementById("gameCanvas");
            
            Engine.Renderer.clearColor(0 / 255, 0 / 255, 0 / 255);
            document.getElementById("gameDiv").style.backgroundColor = "black";

            if(window.location.href.indexOf("armorgames.com") >= 0){
                setTimeout(function(){
                    
                    var source = document.createElement("source");
                    source.setAttribute("src", Engine.Assets.root + PATH_INTRO);
                    video = document.getElementById("introVideo");
                    video.style.display = "block";
                    video.style.top = "0px";
                    video.style.left = "0px";
                    //video.style.position = "absolute";
                    video.style.width = "100%";
                    video.style.height = "100%";
                    video.style.cursor = "pointer";
                    video.onclick = function(){
                        if(video.paused || video.currentTime == 0){
                            video.play();
                        }
                        else{
                            window.open(Game.URL_MORE_GAMES, '_blank');
                        }
                    };
    
                    video.onended = function() {
                        document.body.appendChild(gameCanvas);
                        removeBodyElement("introVideo");
                        introEnded = 1;
                        setTimeout(function(){
                            Game.SceneFade.speed = 0.0166666666666667 * 1000;
                            Game.Scene.instance.nextSceneClass = Game.MainMenu;
                        }, 1000);
                    };
    
                    removeBodyElement("gameCanvas");
                    document.getElementById("gameDiv").style.backgroundColor = "black";
                    
                    video.appendChild(source);
                    video.play();
    
                }, 800);
            }
            return _this;
        }
        Intro.prototype.onStepUpdate = function(){
            _super.prototype.onStepUpdate.call(this);
        };
        return Intro;
    }(Game.Scene));

    (function(){
        var video = document.createElement('video');
        if(video.canPlayType('video/webm').length > 0){
            PATH_INTRO = "../FilesArmorGames/intro.webm";
        }
        else if(video.canPlayType('video/ogg').length > 0){
            PATH_INTRO = "../FilesArmorGames/intro.ogv";
        }
        //console.log(PATH_INTRO);
    })();

    Game.addAction("preloadchangecolor", function(){
        Engine.Renderer.clearColor(0 / 255, 0 / 255, 0 / 255);
        document.getElementById("gameDiv").style.backgroundColor = "black";
    });

    Game.addPath("load", PATH_INTRO);
    Game.addPath("load", PATH_RESOURCES);
    Game.addAction("postinit", function(){
        //Game.Scene.fade.red = 0;
        //Game.Scene.fade.green = 0;
        //Game.Scene.fade.blue = 0;
        Game.URL_MORE_GAMES = "http://armor.ag/MoreGames";
        Game.startingSceneClass = Intro;
    });

    Game.addAction("configure", function(){
        textureResources = new Engine.Texture(PATH_RESOURCES, false, true);
        textureResources.preserved = true;
    });

    var ARMOR_FRAMES = [];
    Game.addAction("prepare", function(){
        ARMOR_FRAMES[0] = new Utils.AnimationFrame(textureResources, 14, 14, 397, 123);
        ARMOR_FRAMES[1] = new Utils.AnimationFrame(textureResources, 14, 156, 397, 123);
        ARMOR_FRAMES[2] = new Utils.AnimationFrame(textureResources, 14, 299, 347, 71);
        ARMOR_FRAMES[3] = new Utils.AnimationFrame(textureResources, 14, 389, 347, 71);
        //14, 14, 397, 123
        //14, 156, 397, 123
        //14, 299, 347, 71
        //14, 389, 347, 71
    });

    var buttonScale = 1.5;

    Game.USE_LOGO_BUTTON_FRAME_LEFT = true;
    Game.USE_LOGO_BUTTON_FRAME_RIGHT = true;

    function createArmorButton(actual){
        var button = new Game.Button();
        
        button.bounds.enabled = true;
        button.bounds.pinned = true;
        button.arrows.enabled = false;
        ARMOR_FRAMES[actual ? 1 : 0].applyToSprite(button.bounds);
        button.bounds.xSize *= 0.085 * buttonScale;
        button.bounds.ySize *= 0.085 * buttonScale;
        button.anchor.xAlignBounds = Utils.AnchorAlignment.END;
        button.anchor.xAlignView = Utils.AnchorAlignment.END;
        button.anchor.yAlignBounds = Utils.AnchorAlignment.END;
        button.anchor.yAlignView = Utils.AnchorAlignment.END;
        button.anchor.xAligned = actual ? -3 : -10;
        button.anchor.yAligned = actual ? -4 : -1;
        
        button.control.url = "http://armor.ag/MoreGames";
        button.control.onSelectionStayDelegate = ()=>{
            Engine.Renderer.useHandPointer = true;
        }
        
    }

    function createArmorButtonTitle(){
        var button = new Game.Button();
        
        button.bounds.enabled = true;
        button.bounds.pinned = true;
        button.arrows.enabled = false;
        ARMOR_FRAMES[1].applyToSprite(button.bounds);
        button.bounds.xSize *= 0.085 * buttonScale;
        button.bounds.ySize *= 0.085 * buttonScale;
        button.anchor.xAlignBounds = Utils.AnchorAlignment.END;
        button.anchor.xAlignView = Utils.AnchorAlignment.END;
        button.anchor.yAlignBounds = Utils.AnchorAlignment.END;
        button.anchor.yAlignView = Utils.AnchorAlignment.END;
        button.anchor.xAligned = -11 + 8;
        button.anchor.yAligned = -0.5;
        
        button.control.url = "http://armor.ag/MoreGames";
        button.control.onSelectionStayDelegate = ()=>{
            Engine.Renderer.useHandPointer = true;
        }
    }

    function createArmorButtonNormal(){
        createArmorButton(true);
    }

    function createArmorButtonOld(){
        createArmorButton(false);
    }

    function createFacebookButton(normal){
        var button = new Game.Button();
        
        button.bounds.enabled = true;
        button.bounds.pinned = true;
        button.arrows.enabled = false;
        ARMOR_FRAMES[normal ? 2 : 3].applyToSprite(button.bounds);
        button.bounds.xSize *= 0.097 * buttonScale;
        button.bounds.ySize *= 0.097 * buttonScale;
        button.anchor.xAlignBounds = Utils.AnchorAlignment.START;
        button.anchor.xAlignView = Utils.AnchorAlignment.START;
        button.anchor.yAlignBounds = Utils.AnchorAlignment.END;
        button.anchor.yAlignView = Utils.AnchorAlignment.END;
        button.anchor.xAligned = normal ? 3 : 10;
        button.anchor.yAligned = normal ? -5.5 : -2.5 - 2;
        
        button.control.url = "http://www.facebook.com/ArmorGames";
        button.control.onSelectionStayDelegate = ()=>{
            Engine.Renderer.useHandPointer = true;
        }
    }

    function createFacebookButtonTitle(){
        var button = new Game.Button();
        
        button.bounds.enabled = true;
        button.bounds.pinned = true;
        button.arrows.enabled = false;
        ARMOR_FRAMES[2].applyToSprite(button.bounds);
        button.bounds.xSize *= 0.097 * buttonScale;
        button.bounds.ySize *= 0.097 * buttonScale;
        button.anchor.xAlignBounds = Utils.AnchorAlignment.START;
        button.anchor.xAlignView = Utils.AnchorAlignment.START;
        button.anchor.yAlignBounds = Utils.AnchorAlignment.END;
        button.anchor.yAlignView = Utils.AnchorAlignment.END;
        button.anchor.xAligned = 11 - 8;
        button.anchor.yAligned = -2.0 - 2;
        
        button.control.url = "http://www.facebook.com/ArmorGames";
        button.control.onSelectionStayDelegate = ()=>{
            Engine.Renderer.useHandPointer = true;
        }
    }

    function createFacebookButtonNormal(){
        createFacebookButton(true);
    }

    function createFacebookButtonWhite(){
        createFacebookButton(false);
    }

    function createArmorButtonLevel(){
        var button = new Game.Button();
        
        button.bounds.enabled = true;
        button.bounds.pinned = true;
        button.arrows.enabled = false;
        ARMOR_FRAMES[1].applyToSprite(button.bounds);
        button.bounds.xSize *= 0.085 * buttonScale;
        button.bounds.ySize *= 0.085 * buttonScale;
        button.anchor.xAlignBounds = Utils.AnchorAlignment.END;
        button.anchor.xAlignView = Utils.AnchorAlignment.END;
        button.anchor.yAlignBounds = Utils.AnchorAlignment.END;
        button.anchor.yAlignView = Utils.AnchorAlignment.END;
        button.anchor.xAligned = -11 + 8;//-15;
        button.anchor.yAligned = -0.5;
        
        button.control.url = "http://armor.ag/MoreGames";
        button.control.onSelectionStayDelegate = ()=>{
            Engine.Renderer.useHandPointer = true;
        }
    }

    function createFacebookButtonLevel(){
        var button = new Game.Button();
        
        button.bounds.enabled = true;
        button.bounds.pinned = true;
        button.arrows.enabled = false;
        ARMOR_FRAMES[2].applyToSprite(button.bounds);
        button.bounds.xSize *= 0.097 * buttonScale;
        button.bounds.ySize *= 0.097 * buttonScale;
        button.anchor.xAlignBounds = Utils.AnchorAlignment.START;
        button.anchor.xAlignView = Utils.AnchorAlignment.START;
        button.anchor.yAlignBounds = Utils.AnchorAlignment.END;
        button.anchor.yAlignView = Utils.AnchorAlignment.END;
        button.anchor.xAligned = 11 - 8;//15;
        button.anchor.yAligned = -2.0 - 2;
        
        button.control.url = "http://www.facebook.com/ArmorGames";
        button.control.onSelectionStayDelegate = ()=>{
            Engine.Renderer.useHandPointer = true;
        }
    }
    
    Game.addAction("mainmenu", createArmorButtonTitle);
    Game.addAction("mainmenu", createFacebookButtonTitle);
    

    //Game.addAction("credits", createArmorButtonTitle);
    //Game.addAction("credits", createFacebookButtonTitle);

    Game.addAction("levelselectionmenu", createArmorButtonTitle);
    Game.addAction("levelselectionmenu", createFacebookButtonTitle);

    Game.addAction("level", createArmorButtonTitle);
    //Game.addAction("level", createFacebookButtonTitle);

    //Game.addAction("endscreen", createArmorButtonOld);
    //Game.addAction("endscreen", createFacebookButtonWhite);

    var EXTRA_FRAMES = null;

    function createButtonOtherGame(){
        var button = new Game.Button();
        
        button.bounds.setFull(true, true, textureResources, 47 * 4, 40 * 4, 0, 0, 434, 8, 47 * 4, 40 * 4);
        
        button.arrows.enabled = false;
        button.bounds.xSize *= 0.25 * 0.5;
        button.bounds.ySize *= 0.25 * 0.5;
        button.anchor.xAlignBounds = Utils.AnchorAlignment.END;
        button.anchor.xAlignView = Utils.AnchorAlignment.END;
        button.anchor.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
        button.anchor.yAlignView = Utils.AnchorAlignment.MIDDLE;
        button.anchor.xAligned = -16.25 + 8;
        button.anchor.yAligned = 0;
        
        button.control.url = "https://armorgames.com/mini-switcher-extended-game/18591";
        button.control.onSelectionStayDelegate = ()=>{
            Engine.Renderer.useHandPointer = true;
        }
    }

    //Game.addAction("mainmenu", createButtonOtherGame);

    Game.addAction("postinit", function(){
        Game.SceneFade.setColor(0, 0, 0);
    });

    

    //Game.addAction("mainmenu", createButtonMiniSwitcher);

    //Game.addAction("endscreen", createArmorButtonOld);
    //Game.addAction("endscreen", createFacebookButtonWhite);
    /*
    Game.addAction("mainmenu", createFacebookButton);
    
    Game.addAction("credits", createFacebookButton);
    Game.addAction("level", createArmorButtonCenter);
    Game.addAction("levelselection", createArmorButtonNormal);
    Game.addAction("levelselection", createFacebookButton);
    Game.addAction("endscreen", createArmorButtonNormal);
    Game.addAction("endscreen", createFacebookButton);
    */
})();