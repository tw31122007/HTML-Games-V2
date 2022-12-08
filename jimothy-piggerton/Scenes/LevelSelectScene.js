//menustate constants
var SELECTWORLD = 0;
var SELECTLEVEL = 1;


class LevelSelectScene extends Scene{
    constructor(playIntro){
        super(playIntro);
        this.keyMap = {
          '32': { down: this.pressButton.bind(this), up: this.unpressButton.bind(this) }, //space
          '13': { down: this.pressButton.bind(this), up: this.unpressButton.bind(this) }, //enter
          '27': {down: this.safeButtonCall(this,this.handleEscape)},   //esc
    
          '87': { down: this.navigateLevelSelect.bind(this,0)},    //W
          '68': { down: this.navigateLevelSelect.bind(this,1)},    //D
          '83': { down: this.navigateLevelSelect.bind(this,2)},    //S
          '65': { down: this.navigateLevelSelect.bind(this,3)},   //A
    
          '38': { down: this.navigateLevelSelect.bind(this,0)},  //up
          '39': { down: this.navigateLevelSelect.bind(this,1)},  //right
          '40': { down: this.navigateLevelSelect.bind(this,2)},   //down
          '37': { down: this.navigateLevelSelect.bind(this,3)},   //left
        }
        this.levels = createLevels();    

        this.levelsInWorld = [0,0,0];     //numbers should match how many levels are in each world
        for(var i = 0; i < this.levels.length; i += 1) {
          var level = this.levels[i];
          var worldType = level.worldType || 0;
          this.levelsInWorld[worldType] += 1;
        }
        this.menuState = SELECTWORLD;
        this.worldSelected = 0;
        this.levelIndex = 0;    
        if(touchOn){
          this.buttonsInRow = 4;
        } else {
          this.buttonsInRow = 6;
        }
        this.buttonRow = [];

        this.worldButtons = [];
        this.worldLabels = [];
        this.allowUIInput = true;
        this.backWall = [];
        this.addLevelSelectGUI();
        this.backgroundList = [[],[],[]];  //list of lists
                                                                //top to bottom
                                                                //4 ScrollingBackgrounds each
        this.createBackgrounds();


    }


    update(dt){
      super.update(dt);
      this.updateBackgrounds(dt);
      if(this.menuState == SELECTLEVEL){
        this.levelIndex = this.selectedButton.value;
        var absoluteLevelIndex = this.levelIndex;
        for(var i = 0; i < this.worldSelected; i++){
          absoluteLevelIndex += this.levelsInWorld[i];
        }
        if(this.levels[absoluteLevelIndex])
          this.levelName.text = ""+this.levels[absoluteLevelIndex].name;
        else  
          this.levelName.text = "";
      }
    }
    draw(canvas){
      this.drawBackgrounds(canvas);
      canvas.strokeStyle = 'black';
      if(this.menuState == SELECTWORLD)
        canvas.lineWidth = 3;
      else if(this.menuState == SELECTLEVEL)
        canvas.lineWidth = 10;
      canvas.strokeRect(0,this.worldSelected*canvas.height/3,canvas.width,canvas.height/3);
      this.drawGrayScale();
      this.drawAllGUI(canvas);
      drawTransitionOverlay(this.overlayColor,canvas);
      if(this.debug)
        drawGrid(canvas);
    }
    drawGrayScale() {
      canvas.save();      
      canvas.globalCompositeOperation='hue';    
      canvas.fillStyle = 'white';        
      for(var i=0;i<3;i+=1) {
        var obj = this.backgroundList[i][0];
        canvas.globalAlpha = obj.colorTimer/obj.colorChangeDuration;
        canvas.fillRect(0,i*canvas.height/3,canvas.width,canvas.height/3);
      }
      canvas.restore();      
    }
    updateBackgrounds(dt){
      for(var i = 0; i < this.backWall.length; i++){
        this.backWall[i].update(dt);
      }
      for(var i = 0; i < this.backgroundList.length; i++){
        for(var j = 0; j < this.backgroundList[i].length; j++){
          this.backgroundList[i][j].update(dt);
        }
      }
    }
    drawBackgrounds(canvas){
      for(var i = 0; i < this.backWall.length; i++){
        this.backWall[i].draw(canvas);
      }
      for(var i = 0; i < this.backgroundList.length; i++){
        for(var j = 0; j < this.backgroundList[i].length; j++){
          this.backgroundList[i][j].draw(canvas);
        }
      }
    }
    createBackgrounds(){
      var slowSpeed = 3;
      var fastSpeed = 5;
      
      var xScale = 0.55;
      var bgSprite1 = createHillBackground(6000, "rgb(10,92,31)", false);
      var bg1 = new ScrollingBackgroundObject(bgSprite1,xScale,.35,slowSpeed,0,-80,false,true);
      var bg2 = new ScrollingBackgroundObject(bgSprite1,xScale,.35,slowSpeed,bgSprite1.width,-80,true,true);
      this.backgroundList[0].push(bg1);
      this.backgroundList[0].push(bg2);
      
      var bgSprite2 = createHillBackground(6000, "rgb(11,102,35)", false);
      bg1 = new ScrollingBackgroundObject(bgSprite2,xScale,.2,fastSpeed,0,37,false,true);
      bg2 = new ScrollingBackgroundObject(bgSprite2,xScale,0.2,fastSpeed,bgSprite2.width,37,true,true);
      this.backgroundList[0].push(bg1);
      this.backgroundList[0].push(bg2);

      xScale = 0.7;
      var bgSprite3 = createForrestBackground(60, "0b6623", false);
      var bg1 = new ScrollingBackgroundObject(bgSprite3,xScale,.35,slowSpeed,0,120,false,false);
      var bg2 = new ScrollingBackgroundObject(bgSprite3,xScale,.35,slowSpeed,bgSprite3.width,120,true,false);
      this.backgroundList[1].push(bg1);
      this.backgroundList[1].push(bg2);

      var bgSprite4 = createForrestBackground(100, "0b6623", false);
      bg1 = new ScrollingBackgroundObject(bgSprite4,xScale,.2,fastSpeed,0,237,false,false);
      bg2 = new ScrollingBackgroundObject(bgSprite4,xScale,0.2,fastSpeed,bgSprite4.width,237,true,false);
      this.backgroundList[1].push(bg1);
      this.backgroundList[1].push(bg2);

      var bgSprite5 = createSpikeBackground(60, "#222", false);
      var bg1 = new ScrollingBackgroundObject(bgSprite5,xScale,.35,slowSpeed,0,320,false,false);
      var bg2 = new ScrollingBackgroundObject(bgSprite5,xScale,.35,slowSpeed,bgSprite5.width,320,true,false);
      this.backgroundList[2].push(bg1);
      this.backgroundList[2].push(bg2);

      var bgSprite6 = createSpikeBackground(100, "#222", false);
      bg1 = new ScrollingBackgroundObject(bgSprite6,xScale,.2,fastSpeed,0,437,false,false);
      bg2 = new ScrollingBackgroundObject(bgSprite6,xScale,0.2,fastSpeed,bgSprite6.width,437,true,false);
      this.backgroundList[2].push(bg1);
      this.backgroundList[2].push(bg2);
    }
    addLevelSelectGUI(){
      var bigFont = '40px ' + FONT;
      var buttonFont = '30px ' + FONT;
      var textColor = 'white';
      //level select title
      var dim = rectDimFromCenter(.5,.06,.3,.1);
      var levelSelectTitle = new Label(dim[0],dim[1],dim[2],dim[3],3,
        "Select Level",'50px ' + FONT,textColor,'center');
      this.gui.push(levelSelectTitle);
      //Color lerp backgrounds
      var world1Back = new ColorLerpBox(0,0,1,.333,3,[135,206,235,255],[128,128,128,255],25,true );
      this.backWall.push(world1Back);

      var world2Back = new ColorLerpBox(0,.3333,1,.333,3,[135,206,235,255],[128,128,128,255],25,false );
      this.backWall.push(world2Back);

      var world3Back = new ColorLerpBox(0,.6666,1,.333,3,[130,56,48,255],[128,128,128,255],25,false );
      this.backWall.push(world3Back);

      //World labels
      dim = rectDimFromCenter(.1,.09,.2,.12);
      var world1Label = new Label(dim[0],dim[1],dim[2],dim[3],3,"World 1",bigFont,textColor,'center');
      world1Label.setVisibility(true);
      this.gui.push(world1Label);
      this.worldLabels.push(world1Label);

      dim = rectDimFromCenter(.1,.09+.333,.2,.12);
      var world2Label = new Label(dim[0],dim[1],dim[2],dim[3],3,"World 2",bigFont,textColor,'center');
      world2Label.setVisibility(false);
      this.gui.push(world2Label);
      this.worldLabels.push(world2Label);

      dim = rectDimFromCenter(.1,.09+.666,.2,.12);
      var world3Label = new Label(dim[0],dim[1],dim[2],dim[3],3,"World 3",bigFont,textColor,'center');
      world3Label.setVisibility(false);
      this.gui.push(world3Label);
      this.worldLabels.push(world3Label);

      //World buttons (invisible but functional)
      var world1Button = new Button(0,0,1,1/3,0,this.handleWorldClick.bind(this,0));
      this.gui.push(world1Button);
      this.worldButtons.push(world1Button);

      var world2Button = new Button(0,.333,1,1/3,1,this.handleWorldClick.bind(this,1));
      this.gui.push(world2Button);
      this.worldButtons.push(world2Button);

      var world3Button = new Button(0,.666,1,1/3,2,this.handleWorldClick.bind(this,2));
      this.gui.push(world3Button);
      this.worldButtons.push(world3Button);

      world1Button.setNeighbors([undefined,undefined,world2Button,undefined]);
      world2Button.setNeighbors([world1Button,undefined,world3Button,undefined]);
      world3Button.setNeighbors([world2Button,undefined,undefined,undefined]);

      
      this.buildButtonRow();
      dim = rectDimFromCenter(.8,.532,.05,.08);
      if(touchOn){
        dim[1] -= .012;
        dim[2] *= 1.3;
        dim[3] *= 1.3;
      }
      this.rightArrow = new ArrowSelector(dim[0],dim[1],dim[2],dim[3],5,this.incrementLevels.bind(this),.05,.4,'white','black',5,false);
      this.rightArrow.selectable = false;
      this.rightArrow.setVisibility(false);
      this.gui.push(this.rightArrow);

      dim = rectDimFromCenter(.2,.532,.05,.08);
      if(touchOn){
        dim[1] -= .012;
        dim[2] *= 1.3;
        dim[3] *= 1.3;
      }
      this.leftArrow = new ArrowSelector(dim[0],dim[1],dim[2],dim[3],5,this.decrementLevels.bind(this),.05,.4,'white','black',5,true);
      this.leftArrow.selectable = false;
      this.leftArrow.setVisibility(false);
      this.gui.push(this.leftArrow);

      dim = rectDimFromCenter(.5,.62,.4,.1);
      this.levelName = new Label(dim[0],dim[1],dim[2],dim[3],5,"",'30px ' + FONT,'white','center');
      this.gui.push(this.levelName);

      if(touchOn){
        dim = rectDimFromCenter(.85,.06,.25,.08);
        var mainMenuButton = new TextButton(dim[0],dim[1],dim[2],dim[3],10,this.goToMainMenu.bind(this),"Main Menu",buttonFont,'white','rgba(255,255,255,.5)','white',5);
        this.gui.push(mainMenuButton);
      }
      this.buttons = getButtons(this.gui);
      this.selectedButton = world1Button;
    }
    buildButtonRow(){
      var regionWidth = 0.5;
      var regionHeight = 0.12;
      var square = [1,16/9];
      var buttonWidth = .05*square[0];
      var buttonHeight = .05*square[1];
      
      var buttonGap = regionWidth/this.buttonsInRow;
      var origin = {x:0.5-buttonGap*(this.buttonsInRow-1)/2,y:.535};
      if(touchOn){
        buttonWidth *= 1.5;
        buttonHeight *= 1.25;
        origin.y = .52;
      }
      var dim = [];
      for(var i = 0; i < this.buttonsInRow; i++){
        dim = rectDimFromCenter(origin.x+buttonGap*i,origin.y,buttonWidth,buttonHeight);        
        if(!touchOn){
          var button = new TextButton(dim[0],dim[1],dim[2],dim[3],4,
            this.loadGameLevel.bind(this,i+1),""+(i+1),'40px Noteworthy','white',
            'transparent','white',5);
        } else {
          var button = new TextButton(dim[0],dim[1],dim[2],dim[3],4,
            this.loadGameLevel.bind(this,i+1),""+(i+1),'40px Noteworthy','white',
            'rgba(255,255,255,.5)','white',5);
        }
        /*
        var outline = new ColoredBox(dim[0],dim[1],dim[2],dim[3],4,'transparent','white',3);
        this.gui.push(outline);
        outline.setOptions(false,false,false);
        */
        button.setOptions(false,false,false);
        button.value = i;
        this.gui.push(button);
        this.buttonRow.push(button);
      }
      for(var i = 0; i < this.buttonRow.length; i++){
        var left = (i == 0) ? undefined : this.buttonRow[i-1];
        var right = (i == this.buttonRow.length-1) ? undefined : this.buttonRow[i+1];
        this.buttonRow[i].setNeighbors([undefined,right,undefined,left]);
      }
    }
    updateWorldSelection(worldNumber){
      this.worldSelected = worldNumber;
      for(var i = 0; i < this.backWall.length; i++){
        this.backWall[i].activated = false;
        this.worldLabels[i].setVisibility(false);
      }
      this.worldLabels[worldNumber].setVisibility(true);
      this.backWall[worldNumber].activated = true;
      for(var i = 0; i < this.backgroundList.length;i++){
        for(var j = 0; j < this.backgroundList[i].length;j++){
          if(i == worldNumber)
            this.backgroundList[i][j].activated = true;
          else 
            this.backgroundList[i][j].activated = false;
        }
      }
    }
    handleWorldClick(worldNumber){
      if(this.menuState == SELECTWORLD){
        this.updateWorldSelection(worldNumber);
        this.selectWorld(worldNumber);
      } else if(this.menuState == SELECTLEVEL){
        if(!touchOn){
          if(worldNumber != this.worldSelected){
            this.returnToWorldSelect();  
            this.updateWorldSelection(worldNumber);    
          }  
        } else {
          if(worldNumber != this.worldSelected){
            this.returnToWorldSelect();
            this.updateWorldSelection(worldNumber);
            this.handleWorldClick(worldNumber);
          }
        }   
      }
    }
    selectWorld(worldNumber){
      this.worldSelected = worldNumber;
      this.menuState = SELECTLEVEL;
      this.selectedButton = this.buttonRow[0];
      this.selectedButton.selected = true;
      for(var i = 0; i < this.buttonRow.length; i++){
        this.buttonRow[i].value = i;
      }
      for(var i = 0; i < this.worldButtons.length; i++){
        this.worldButtons[i].setOptions(true,false,false);
      }
      var offSet = (this.worldSelected-1)/3;
      var group4GUI = getGUIInGroup(4,this.gui);
      for(var i = 0; i < group4GUI.length; i++){
        group4GUI[i].setOptions(true,true,true);
        group4GUI[i].y += offSet;
      }
      var group5GUI = getGUIInGroup(5,this.gui);
      for(var i = 0; i < group5GUI.length; i++){
        group5GUI[i].setOptions(true,false,true);
        group5GUI[i].y += offSet;
      }
      
      this.leftArrow.setVisibility(true);
      this.rightArrow.setVisibility(true);
      this.levelIndex = 0;
      if(this.menuState == SELECTLEVEL){
        var absoluteLevelIndex = this.levelIndex;
        for(var i = 0; i < this.worldSelected; i++){
          absoluteLevelIndex += this.levelsInWorld[i];
        }
        if(this.levels[absoluteLevelIndex])
          this.levelName.text = ""+this.levels[absoluteLevelIndex].name;
        else  
          this.levelName.text = "";
      }
    }
    
    returnToWorldSelect(){
      this.menuState = SELECTWORLD;
      this.selectedButton.selected = false;
      this.selectedButton = getGUIInGroup(this.worldSelected,this.gui)[0];
      for(var i = 0; i < this.worldButtons.length; i++){
        this.worldButtons[i].setOptions(true,true,true);
      }
      var group4GUI = getGUIInGroup(4,this.gui);
      for(var i = 0; i < group4GUI.length; i++){
        group4GUI[i].setOptions(false,false,false);
        group4GUI[i].reset();
      }
      var group5GUI = getGUIInGroup(5,this.gui);
      for(var i = 0; i < group5GUI.length; i++){
        group5GUI[i].setOptions(false,false,false);
        group5GUI[i].reset();
      }
      this.levelIndex = 0;
      for(var i = 0; i < this.buttonRow.length; i++){
        this.buttonRow[i].text = ''+(i+1);
      }
    }
    
    loadGameLevel(){
      //This calls a fade to black transition and then loads the level at the end of the transition
      this.allowUIInput = false;
      var levelToLoad = 0;
      for(var i = 0; i < this.worldSelected; i++){
        levelToLoad += this.levelsInWorld[i];       //sums # of levels in previous worlds
      }
      levelToLoad += this.levelIndex;     
      this.startTransition(25,1,function() {
        var newScene = new GameScene();
        if(levelToLoad < newScene.levels.length){
          newScene.loadNewLevel(levelToLoad);
          this.driver.setScene(new LevelIntroScene(newScene,true));
        } else {
          this.allowUIInput = true;
        }
      });
      
    }
    handleEscape(){
      if(this.menuState == SELECTWORLD){
        this.driver.setScene(new MenuScene(false));
      } else if(this.menuState == SELECTLEVEL){
        this.returnToWorldSelect();
      }
    }
    goToMainMenu(){
      this.driver.setScene(new MenuScene(false));
    }
    mousemove(e, mouse) {
      //Overload
      if(!this.allowUIInput)
        return;
      if(this.menuState == SELECTWORLD){
        var percentPoint = getPercentPoint(e);
        var worldNumber = Math.floor(percentPoint[1]*3);        //spreads values 0 to .999 -> 0 to 2.999
        if(!worldNumber&&worldNumber!=0)return;
        var worldNumber = (worldNumber >= 3) ? 2 : worldNumber; //cap to 2 if too large
        var worldNumber = (worldNumber < 0) ? 0 : worldNumber;  //cap to 0 if too small
        this.updateWorldSelection(worldNumber);   
      } 
      GUIMouseMove(this,e,this.buttons);
    }
    navigateLevelSelect(direction){
      //Overload
      if(!this.allowUIInput)
        return;
      if(this.menuState == SELECTWORLD){
        this.navigateUI(direction);
        this.updateWorldSelection(this.selectedButton.groupID);
      } else if(this.menuState == SELECTLEVEL){
        
        switch(direction){
          case 1: //right
            this.rightArrow.displaceArrow();
            break;
          case 3: //left
            this.leftArrow.displaceArrow();
            break;
        }

        if(direction == 1 && this.selectedButton == this.buttonRow[this.buttonsInRow-1]){
          this.incrementLevels();
        }
        else if(direction == 3 && this.selectedButton == this.buttonRow[0]){
          this.decrementLevels();
        }
        this.navigateUI(direction);
        this.levelIndex = this.selectedButton.value;

      }
    }
    
    incrementLevels(){
      this.selectedButton = this.selectedButton.getNeighbor('right') || this.selectedButton;
      if(this.buttonRow[this.buttonsInRow-1].value
        < this.levelsInWorld[this.worldSelected]-1){
        for(var i = 0; i < this.buttonRow.length; i++){
          this.buttonRow[i].value+= 1;
          this.buttonRow[i].text = ""+(this.buttonRow[i].value+1);
        }
        this.levelIndex = this.selectedButton.value;
        if(this.selectedButton != this.buttonRow[0]){
          this.selectedButton.selected = false;
          this.selectedButton = this.selectedButton.getNeighbor('left');
          this.selectedButton.selected = true;
        } else {
          this.selectedButton.selected = true;
        }
      } else {
        this.selectedButton.selected = true;
      }
    }
    decrementLevels(){
      this.selectedButton = this.selectedButton.getNeighbor('left') || this.selectedButton;
      if(this.buttonRow[0].value > 0){
        for(var i = 0; i < this.buttonRow.length; i++){
          this.buttonRow[i].value-= 1;
          this.buttonRow[i].text = ""+(this.buttonRow[i].value+1);
        }
        this.levelIndex = this.selectedButton.value;
        if(this.selectedButton != this.buttonRow[this.buttonsInRow-1]){
          this.selectedButton.selected = false;
          this.selectedButton = this.selectedButton.getNeighbor('right');
          this.selectedButton.selected = true;
        } else {
          this.selectedButton.selected = true;
        }
      } else {
        this.selectedButton.selected = true;
      }
    }
}