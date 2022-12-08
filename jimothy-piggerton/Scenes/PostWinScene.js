class PostWinScene extends Scene{
  constructor(prevScene) {
    super();
    this.prevScene = prevScene;
    this.keyMap = {
      '32': { down: this.pressButton.bind(this), up: this.unpressButton.bind(this) }, //space
      '13': { down: this.pressButton.bind(this), up: this.unpressButton.bind(this) }, //enter

      '87': { down: this.navigateUI.bind(this,0)},    //W
      '65': { down: this.navigateUI.bind(this,1)},   //D
      '83': { down: this.navigateUI.bind(this,2)},    //S
      '68': { down: this.navigateUI.bind(this,3)},    //A
      '38': { down: this.navigateUI.bind(this,0)},  //up
      '39': { down: this.navigateUI.bind(this,1)},  //right
      '40': { down: this.navigateUI.bind(this,2)},   //down
      '37': { down: this.navigateUI.bind(this,3)},   //left
    }
    this.allowUIInput = true;
    this.selectedButton = undefined;
    this.addAllGUI();
  }
  update(dt){
    super.update(dt);
  }
  draw(canvas){
    this.prevScene.draw(canvas);
    canvas.fillStyle="rgba(255,255,255,.7)"
    canvas.fillRect(0,0,canvas.width,canvas.height);
    this.deathCount.text = ""+this.prevScene.totalDeaths;
    this.drawAllGUI(canvas);
    if(this.debug)
      drawGrid(canvas);
    drawTransitionOverlay(this.overlayColor,canvas);
  }
  addAllGUI(){
    var bigFont = "60px " + FONT;
    var buttonFont = "30px noteworthy";
    var textColor = 'black';
    var buttonGap = 0.085;

    var dim = rectDimFromCenter(.5,.4,.2,.08);
    var winLabel = new Label(dim[0],dim[1],dim[2],dim[3],0,
      "You Win!",bigFont,textColor,'center');
    this.gui.push(winLabel);

    dim = rectDimFromCenter(.5,.55,.05,.08);
    this.deathCount = new Label(dim[0],dim[1],dim[2],dim[3],0,
      "X", bigFont, textColor,'center');
    this.gui.push(this.deathCount);

    dim = rectDimFromCenter(.48,.56,.3,.08);
    var deathLabel = new Label(dim[0],dim[1],dim[2],dim[3],0,
      "You died          times", buttonFont,textColor,'center');
    this.gui.push(deathLabel);


    dim = rectDimFromCenter(0.5,0.7,.15,.08);
    var mainMenuButton = new GrowthTextButton(dim[0],dim[1],dim[2],dim[3],0,
      this.goToMainMenu.bind(this),"Main Menu",buttonFont,textColor,'transparent',textColor,5,.08);
    this.gui.push(mainMenuButton);

    this.selectedButton = mainMenuButton;
    this.selectedButton.selected = true;

    this.buttons = getButtons(this.gui);
  }
  goToMainMenu(){
    this.allowUIInput = false;
    this.startTransition(25,1,sceneTransition(this,MenuScene,true));
  }
}