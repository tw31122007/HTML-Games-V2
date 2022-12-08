class LevelEditorSelectScene extends LevelSelectScene{
  constructor(playIntro){
    super(playIntro);
    this.isLevelEditorSelectScene = true;
    
    this.keyMap['78'] = {down: this.loadNewLevel.bind(this)};
    this.keyMap['69'] = {down: this.loadLocalLevel.bind(this)};
    this.keyMap['82'] = {down: this.loadPigLevel.bind(this)};
    this.addExtraGUI();
  }
  update(dt,frameCount){
    super.update(dt,frameCount);
  }
  draw(canvas){
    super.draw(canvas);
  }
  
  loadNewLevel(){
    this.loadGameLevel(-2);
  }

  loadLocalLevel(){
    this.loadGameLevel(0);
  }
  loadPigLevel(){
    this.loadGameLevel(-1);
  }
  addExtraGUI(){
    var dim = rectDimFromCenter(.5,.33,.7,.1);
    var levelEditorLabel = new Label(dim[0],dim[1],dim[2],dim[3],7,"Level Editor    [N] - New Level    [E] - Local Level    [R] - PigFunScene",'30px ' + FONT,'white','center');
    this.gui.push(levelEditorLabel);
  }
  loadGameLevel(index){
    if(index == undefined){
      super.loadGameLevel();
      return;
    }
    var absoluteLevelIndex = index;
    for(var i = 0; i < this.worldSelected; i++){
      absoluteLevelIndex += this.levelsInWorld[i];
    } 
    
    var scene = new LevelEditorScene(absoluteLevelIndex);
    this.driver.setScene(scene);
  }
}