class LevelTesterScene extends GameScene {
  constructor(level, prevScene) {
    super(level, undefined, false);
    this.isLevelTesterScene = true;
    this.prevScene = prevScene;
    this.keyMap[27] = {down: this.back.bind(this)};
    this.transitionDuration = 1;
    this.updateTransition();
  }
  back() {
    this.driver.setScene(this.prevScene);
  }
  win() {
    this.back();
  }
}