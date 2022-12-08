class OptionScene extends Scene{
  constructor(playLevelIntro, previousScene){
    super(playLevelIntro);
    this.isOptionScene = true;
    this.previousScene = previousScene;
    this.keyMap = {
      '27': {down: this.safeButtonCall(this,this.goBack)},   //esc
      '32': { down: this.pressButton.bind(this), up: this.unpressButton.bind(this) }, //space
      '13': { down: this.pressButton.bind(this), up: this.unpressButton.bind(this) }, //enter
      '87': { down: this.navigateUI.bind(this,0)},    //W
        '68': { down: this.navigateUI.bind(this,1)},    //D
        '83': { down: this.navigateUI.bind(this,2)},    //S
        '65': { down: this.navigateUI.bind(this,3)},   //A
  
        '38': { down: this.navigateUI.bind(this,0)},  //up
        '39': { down: this.navigateUI.bind(this,1)},  //right
        '40': { down: this.navigateUI.bind(this,2)},   //down
        '37': { down: this.navigateUI.bind(this,3)},   //left


    
    }
    this.background = new InfiniteBackground();
   
    this.camera = {x:0,y:0,dx:0,dy:0};
    this.loadOptionGUI();
    this.FREE = 0;
    this.VOLUME = 1;
    this.state = 0;
  }
  update(dt){
    this.camera.x += 3;
    super.update(dt);
    // this.volumeLabel.text = "Volume: "+Math.floor(this.volumeSlider.value*100);
  }
  draw(canvas){
    this.background.drawLayers(canvas, this.camera);
    this.drawAllGUI(canvas);
  }
  changeVolumeBy(toAdd){
    this.volumeSlider.setValue(Math.round((this.volumeSlider.value+toAdd)*100)/100);
    this.volumeSlider.onRelease();
  }
  addSlider(dim, name, volumeFunc, startValue) {
    var sliderLabel = new Label(
      dim[0],dim[1]-0.05,dim[2]+0.05,dim[3],
      // dim[0]-0.25,dim[1],dim[2]+0.05,dim[3],
      0,
      name+": " + Math.floor(100*startValue),'35px ' + FONT,'white','left');

    var volumeSlider = new Slider(dim[0],dim[1],dim[2],dim[3],
      0,undefined,0.03,startValue,'white','white','gray','black');
    volumeSlider.onRelease = this.playSliderSound.bind(this,volumeSlider); 
    // volumeSlider.onHold = this.setVolume.bind(this,volumeSlider);
    volumeSlider.label = sliderLabel;
    volumeSlider.name = name;
    volumeSlider.onHold = function(value) {
      this.label.text = this.name + ": " + Math.floor(this.value*100);
      volumeFunc(this.value);
    }
    volumeSlider.selectable = true;
    this.gui.push(volumeSlider);
    this.gui.push(sliderLabel);


    

    return volumeSlider;
  }
  loadOptionGUI(){
    // var dim = rectDimFromCenter(.5,.5,.2,.1);
    // this.volumeSlider = new Slider(dim[0],dim[1],dim[2],dim[3],
    //   0,undefined,0.03,DESTINATION.gain.value,'white','white','gray','black');
    // this.volumeSlider.onRelease = this.playSliderSound.bind(this,this.volumeSlider); 
    // this.volumeSlider.onHold = this.setVolume.bind(this,this.volumeSlider);
    // this.volumeSlider.selectable = true;
    // this.gui.push(this.volumeSlider);
    var dim = rectDimFromCenter(.5,.35,.2,.05);
    this.volumeSlider = this.addSlider(dim, "Master", setVolume, VOLUME);
    dim = rectDimFromCenter(.5,.48,.2,.05);
    this.musicSlider = this.addSlider(dim, "Music", setMusicVolume, MUSIC_VOLUME);
    dim = rectDimFromCenter(.5,.61,.2,.05);
    this.effectsSlider = this.addSlider(dim, "Effects", setEffectsVolume, EFFECTS_VOLUME);
    // dim = rectDimFromCenter(.5,.5,.2,.1);


    // dim = rectDimFromCenter(0,.4,.25,.1);
    // this.volumeLabel = new Label(.4,dim[1],dim[2],dim[3],0,
    //   this.volumeSlider.value,'35px ' + FONT,'white','left');
    // this.gui.push(this.volumeLabel);

    var ButtonType = GrowthTextButton;
    var backColor = 'transparent';
    if(touchOn) {
      ButtonType = TextButton;
      backColor = 'rgba(255,255,255,0.5)';
    }

    dim = rectDimFromCenter(.8,.9,.2,.1);
    var backButton = new ButtonType(dim[0],dim[1],dim[2],dim[3],0,this.goBack.bind(this),"Back",'30px Noteworthy', 
    'white',backColor,'white', 5, 0.05);
    this.gui.push(backButton);
    this.selectedButton = backButton;
    backButton.selected = true;

    dim = rectDimFromCenter(.5,.82,.2,.1);
    var gamepadBtn = new ButtonType(dim[0],dim[1],dim[2],dim[3],0,() => {
      MAIN.gamepadOn = !MAIN.gamepadOn;
      gamepadBtn.text = "Gamepad " + (MAIN.gamepadOn ? 'On' : 'Off');
    },"Gamepad On",'30px Noteworthy', 
    'white',backColor,'white', 5, 0.05);
    this.gui.push(gamepadBtn);

    dim = rectDimFromCenter(.5,.7,.2,.1);
    var musicBtn = new ButtonType(dim[0],dim[1],dim[2],dim[3],0,() => {
      SOUNDMAP.music.toggle();
      musicBtn.text = "Music " + (SOUNDMAP.music.on ? 'On' : 'Off');
      localStorage.setItem("musicMute", !SOUNDMAP.music.on);
    },"Music " + (SOUNDMAP.music.on ? 'On' : 'Off'),'30px Noteworthy', 
    'white',backColor,'white', 5, 0.05);
    this.gui.push(musicBtn);
    

    dim = rectDimFromCenter(.5,.15,.4,.2);
    var optionsLabel = new Label(dim[0],dim[1],dim[2],dim[3],0,"Options",'60px ' + FONT,'white','center');
    this.gui.push(optionsLabel);
    
    this.volumeSlider.setNeighbors([undefined,undefined,this.musicSlider,undefined]);
    this.musicSlider.setNeighbors([this.volumeSlider,undefined,this.effectsSlider,undefined]);
    this.effectsSlider.setNeighbors([this.musicSlider,undefined,musicBtn,undefined]);
    musicBtn.setNeighbors([this.effectsSlider,undefined,gamepadBtn,undefined]);
    gamepadBtn.setNeighbors([musicBtn,backButton,backButton,undefined]);
    backButton.setNeighbors([gamepadBtn,undefined,undefined,gamepadBtn]);
    this.buttons = getButtons(this.gui);
  }
  goBack(){
    // this.driver.setScene(new MenuScene(false));
    this.driver.setScene(this.previousScene);
  }
  setVolume(slider){
    slider.label.text = slider.name + ": " + Math.floor(slider.value*100);
    setVolume(slider.value);
  }
  playSliderSound(slider){
    SOUNDMAP.bounce.play();
  }
  navigateUI(direction){
    if(this.selectedButton&&this.selectedButton.isSlider) {
      if(direction == 1)
        this.selectedButton.changeBy(0.05);
      else if(direction == 3)
        this.selectedButton.changeBy(-0.05);
    }
    super.navigateUI(direction);
  }
}