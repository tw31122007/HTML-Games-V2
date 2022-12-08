class LevelIntroScene extends Scene{
  constructor(nextScene, playIntro){
    super(playIntro);
    this.nextScene = nextScene;

    this.player = this.nextScene.player;
    this.originalPlayer = {x:this.player.x,y:this.player.y};
    this.player.x = -50;
    this.player.uncrouch();
    this.player.width = this.player.w;
    this.player.height = this.player.h;
    this.player.y = this.originalPlayer.y;
    this.player.vx = this.player.speed/3;
    this.player.mx = 1;
    this.postMoveDuration = 15;
    this.postMoveTimer = 0;
    this.nextScene.behinds=[];
    this.touchButtonsActive = true;
  }
  update(dt, frameCount){
    super.update(dt);
    this.nextScene.updateTransition(dt);
    this.player.updateEye(dt, frameCount);
    this.player.y = this.originalPlayer.y;
    this.player.vx = this.player.speed/3;
    if(this.player.x < this.originalPlayer.x){
      this.player.x += dt*this.player.vx;
      this.player.angle = -Math.PI/40*this.player.vx/this.player.speed + Math.cos(frameCount*Math.PI/7)*Math.PI/20;
    } else {
      this.player.angle = 0;
      this.player.vx = 0;
      this.player.x = this.originalPlayer.x;
      if(this.postMoveTimer < this.postMoveDuration){
        this.postMoveTimer += dt;
      } else{
        this.loadNextScene();
      }
    }
  }
  draw(canvas){
    super.draw(canvas);
    this.nextScene.draw(canvas);
    drawTransitionOverlay(this.overlayColor, canvas)
  }
  loadNextScene(){
    this.player.angle = 0;
    this.player.vx = 0;
    this.player.x = this.originalPlayer.x;
    this.player.grounded = true;
    this.driver.setScene(this.nextScene);
  }
}