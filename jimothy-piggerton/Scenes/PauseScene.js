class PauseScene extends Scene {
  constructor(prevScene, levelEditor) {
    super();
    this.prevScene = prevScene;
    if(prevScene.onPause)prevScene.onPause();
    this.keyMap = {
      '32': { down: this.pressButton.bind(this), up: this.unpressButton.bind(this) }, //space
      '13': { down: this.pressButton.bind(this), up: this.unpressButton.bind(this) }, //enter

      '27': {down: this.safeButtonCall(this,this.unpause)}, //esc
      '87': { down: this.navigateUI.bind(this,0)},    //W
      '65': { down: this.navigateUI.bind(this,1)},   //D
      '83': { down: this.navigateUI.bind(this,2)},    //S
      '68': { down: this.navigateUI.bind(this,3)},    //A
      '38': { down: this.navigateUI.bind(this,0)},  //up
      '39': { down: this.navigateUI.bind(this,1)},  //right
      '40': { down: this.navigateUI.bind(this,2)},   //down
      '37': { down: this.navigateUI.bind(this,3)},   //left

      '78': {down: function() {
        if(this.keys[67] && DEBUG) { //c+n
          this.goToLevelEditor(prevScene.levelIndex+1);
        }
      }.bind(this)},
    }
    this.allowUIInput = true;
    this.selectedButton = undefined;
    this.levelEditor = levelEditor;
    this.addPauseMenuGUI();
  }
  update(dt){
    super.update(dt);
    // SOUNDMAP.music.lerpVolume(0.2, 0.05);
  }
  unpause() {
    if(this.prevScene.onResume)this.prevScene.onResume();
    this.driver.setScene(this.prevScene);
  }
  goToMainMenu(){
    this.allowUIInput = false;
    this.startTransition(25,1,sceneTransition(this,MenuScene,true));
  }
  goToLevelSelect(){
    this.allowUIInput = false;
    this.startTransition(25,1,sceneTransition(this,LevelSelectScene,true));
  }
  goToOptions(){
    this.allowUIInput = false;
    this.driver.setScene(new OptionScene(false, this));
  }
  goToLevelEditorSelect() {
    this.allowUIInput = false;
    this.driver.setScene(getOrCreate(LevelsViewerScene));
  }
  reload() {
    this.allowUIInput = true;
  }
  restartLevel(){
    this.allowUIInput = false;
    this.prevScene.loadNewLevel();
    if(this.prevScene instanceof PigFunScene)
      this.prevScene.spawnPig();
    this.unpause();
  }
  goToLevelEditor(index){
    if (index == 24)
      index = -1;
    var scene = new LevelEditorScene(index);
    this.driver.setScene(scene);
  }
  draw(canvas) {
    this.prevScene.draw(canvas);
    canvas.fillStyle="rgba(255,255,255,.7)"
    canvas.fillRect(0,0,canvas.width,canvas.height);
    this.deathCount.text = ""+this.prevScene.levelDeaths;
    this.drawAllGUI(canvas);
    if(this.debug)
      drawGrid(canvas);
    drawTransitionOverlay(this.overlayColor,canvas);
  }
  addPauseMenuGUI(){
    var bigFont = "60px " + FONT;
    var buttonFont = "30px " + FONT;
    var textColor = 'black';
    var buttonGap = 0.085;

    

    dim = rectDimFromCenter(.96,.95,.05,.08);
    this.deathCount = new Label(dim[0],dim[1],dim[2],dim[3],0,
      "X", bigFont, textColor,'left');
    this.gui.push(this.deathCount);

    dim = rectDimFromCenter(.82,.96,.2,.08);
    var deathLabel = new Label(dim[0],dim[1],dim[2],dim[3],0,
      "Fails:", buttonFont,textColor,'right');
    this.gui.push(deathLabel);

    switch(touchOn){
      case false:
        var dim = rectDimFromCenter(.5,.4,.2,.08);
        var pauseLabel = new Label(dim[0],dim[1],dim[2],dim[3],0,
          "Paused",bigFont,textColor,'center');
        this.gui.push(pauseLabel);
        dim = rectDimFromCenter(0.5,.55,0.2,.08);
        var resumeButton = new GrowthTextButton(dim[0],dim[1],dim[2],dim[3],0,
          this.unpause.bind(this),"Resume",buttonFont,textColor,'transparent',textColor,5,.08);
        this.gui.push(resumeButton);
        
        dim = rectDimFromCenter(0.5,0.55+buttonGap*2,.2,.08);
        var levelSelectButton = new GrowthTextButton(dim[0],dim[1],dim[2],dim[3],0,
          this.goToOptions.bind(this),"Options",buttonFont,textColor,'transparent',textColor,5,.08);
        this.gui.push(levelSelectButton);

        if(!this.levelEditor) {
          // dim = rectDimFromCenter(.5,.55+buttonGap,.2,.08);
          // var levelSelectButton = new GrowthTextButton(dim[0],dim[1],dim[2],dim[3],0,
          //   this.goToLevelSelect.bind(this),"Level Select",buttonFont,textColor,'transparent',textColor,5,.08);
          // this.gui.push(levelSelectButton);
      
        dim = rectDimFromCenter(.5,.55+buttonGap,.2,.08);
          var restartButton = new GrowthTextButton(dim[0],dim[1],dim[2],dim[3],0,
            this.restartLevel.bind(this),"Restart",buttonFont,textColor,'transparent',textColor,5,.08);
          this.gui.push(restartButton);
        } else {
          dim = rectDimFromCenter(.5,.55+buttonGap,.2,.08);
          var levelSelectButton = new GrowthTextButton(dim[0],dim[1],dim[2],dim[3],0,
            this.goToLevelEditorSelect.bind(this),"Level Select",buttonFont,textColor,'transparent',textColor,5,.08);
          this.gui.push(levelSelectButton);
        }
        
        dim = rectDimFromCenter(0.5,0.55+buttonGap*3,.2,.08);
        var mainMenuButton = new GrowthTextButton(dim[0],dim[1],dim[2],dim[3],0,
          this.goToMainMenu.bind(this),"Main Menu",buttonFont,textColor,'transparent',textColor,5,.08);
        this.gui.push(mainMenuButton);
    
        this.selectedButton = resumeButton;
        this.selectedButton.selected = true;
  
        break;
      case true:
        var touchScreenFont = FONT;
        var fontSize = '35px';
        var largerFontSize = '45px';
        var backFill = 'rgba(0,0,0,.2)';
        var expandFactor = .3;        
        var dim = rectDimFromCenter(.5,.28,.2,.08);
        var pauseLabel = new Label(dim[0],dim[1],dim[2],dim[3],0,
          "Paused",bigFont,textColor,'center');
        this.gui.push(pauseLabel);
        dim = rectDimFromCenter(.31,.52,.27,.24);
          var resumeButton = new ExpandingMobileButton(dim[0],dim[1],dim[2],dim[3],0,
          this.unpause.bind(this),"Resume",touchScreenFont,fontSize,largerFontSize,textColor,'rgba(128,128,128,0.5)',textColor,5,expandFactor);
        this.gui.push(resumeButton);
    
        dim = rectDimFromCenter(.69,.52,.27,.24);
        var levelSelectButton = new ExpandingMobileButton(dim[0],dim[1],dim[2],dim[3],0,
          this.goToLevelSelect.bind(this),"Level Select",touchScreenFont,fontSize,largerFontSize,textColor,'rgba(128,128,128,0.5)',textColor,5,expandFactor);
        this.gui.push(levelSelectButton);
    
        dim = rectDimFromCenter(.31,.8,.27,.24);
        var restartButton = new ExpandingMobileButton(dim[0],dim[1],dim[2],dim[3],0,
          this.restartLevel.bind(this),"Restart",touchScreenFont,fontSize,largerFontSize,textColor,'rgba(128,128,128,0.5)',textColor,5,expandFactor);
        this.gui.push(restartButton);

        dim = rectDimFromCenter(.69,.8,.27,.24);
        var mainMenuButton = new ExpandingMobileButton(dim[0],dim[1],dim[2],dim[3],0,
          this.goToMainMenu.bind(this),"Main Menu",touchScreenFont,fontSize,largerFontSize,textColor,'rgba(128,128,128,0.5)',textColor,5,expandFactor);
        this.gui.push(mainMenuButton);

        var dim = rectDimFromCenter(.88,.1,.095,.12);
        var pauseButton = new TextButton(dim[0],dim[1],dim[2],dim[3],0,
          this.unpause.bind(this),"",touchScreenFont,'transparent','rgba(64,64,64,.5)','transparent',0);
        this.gui.push(pauseButton);
        dim = rectDimFromCenter(.895,.1,.02,.08);
        var box1 = new ColoredBox(dim[0],dim[1],dim[2],dim[3],0,'white','transparent',0);
        this.gui.push(box1);
        dim = rectDimFromCenter(.865,.1,.02,.08);
        var box2 = new ColoredBox(dim[0],dim[1],dim[2],dim[3],0,'white','transparent',0);
        this.gui.push(box2);
        
        break;
    }
    
    resumeButton.setNeighbors([undefined,undefined,restartButton,undefined]);
    if(!this.levelEditor) {
      restartButton.setNeighbors([resumeButton,undefined,levelSelectButton,undefined]);
      levelSelectButton.setNeighbors([restartButton,undefined,mainMenuButton,undefined]);
    }
    mainMenuButton.setNeighbors([levelSelectButton,undefined,undefined,undefined]);

    this.buttons = getButtons(this.gui);

  }
} 