class IntroScene extends GameScene{
  constructor() {
    var w = 18;
    var l = 19;
    super({
      grid: [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [0,0,0,0,0,0,0,0,0,0,0,19,19,19,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [0,0,0,0,0,0,0,0,0,19,19,19,19,19,19,19,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [0,0,0,0,0,0,0,0,19,19,19,19,19,19,19,19,19,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [0,0,0,0,0,0,0,0,19,19,19,19,19,19,19,19,19,19,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [0,0,0,0,0,0,0,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [0,0,0,0,0,0,0,0,19,19,19,19,19,19,19,19,19,19,19,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [0,0,0,0,0,0,0,0,19,19,19,19,19,19,19,19,19,19,19,19,0,19,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [0,0,0,0,0,0,0,0,19,19,19,18,19,19,18,19,18,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [4,0,0,0,0,0,0,0,19,0,19,18,18,19,18,18,18,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [0,0,0,0,0,0,0,0,0,0,0,19,18,18,18,18,19,19,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [0,0,0,0,0,0,0,0,0,0,0,19,0,18,18,18,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,18,18,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [1,1,1,0,0,0,0,0,0,0,0,0,0,18,18,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [1,1,1,1,1,1,1,1,0,0,0,0,4,18,18,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
        
        ]
    },true);
    this.touchButtonsActive = false;
    this.gui = [];
    this.keyMap = {
      '27': {down: sceneTransition(this, GameScene)},
    }
    this.gamePadOn = false;
    // this.player.x = 500;
    this.player.flipped = true;
    this.pig = new Pig(this.player.x+100, this.player.y);
    this.pig.speed=0;
    this.butcher = new Butcher(this.player.x+600, this.player.y);
    this.addEntity(this.butcher);
    this.butcher.speed=0;    
    this.addEntity(this.pig);
    this.player.updateEye = function() {};
    this.pig.mx = 0;
    this.pig.bounceFrq = Math.PI/30;
    this.totalTime = 400;
    this.time = this.totalTime+1000;
    this.player.resetControls = function() {};
    this.player.speed = 4;
    this.player._angle = Math.PI/10;
    this.player.eyeMovement.blink = 1;
    this.pig.animationState = 1;
    this.startTransition(100, -1, function() {
      this.time=this.totalTime;
      this.butcher.speed = 3.9;
    });
    this.makeLetterBox();
    this.timeToWait=0;
    this.emitZ = true;
    this.emissionDelay = 35;

    this.allowUIInput = true;
    this.selectedButton = undefined;
    this.touchCount = 0;
    this.addIntroGUI();
  }
  makeLetterBox(){
    var upperBoxHeight = 0.2;
    var lowerBoxHeight = 0.2;

    this.upperLetterBox = new ColoredBox(0,0,1,upperBoxHeight,0,'black','transparent',1);
    this.lowerLetterBox = new ColoredBox(0,1-lowerBoxHeight,1,lowerBoxHeight,0,'black','transparent',1);
    this.gui.push(this.upperLetterBox);
    this.gui.push(this.lowerLetterBox);
  }
  moveCamera(){
    var camera = this.camera;
    var player = this.player;
    var canvas = this.canvas;
    // if(player.mx) {
      var cdx = (player.x-camera.x+camera.dx)/10;
      if(Math.abs(cdx)>3)camera.x += cdx;
      // camera.x += (player.x-camera.x+camera.dx)/10;
    // }
    // camera.x = linearMove(camera.x, (player.x + camera.dx), 5);    

    // var cdy = (player.y-camera.x+camera.dy-30)/10;
    // if(Math.abs(cdy)>3)camera.y += cdy;
    camera.y += (player.y-camera.y-30)/30;
    if(player.grounded) camera.y += (player.y-camera.y-30)/20;
    var d = 0;
    if(player.vy>0 && camera.y < player.y - 30) camera.y += (player.y-camera.y-30)/10;
    if(player.crouching&&player.grounded) camera.dy += 1; else camera.dy=0;
    if(camera.dy>60)camera.dy=60;
    if(camera.dy>10) camera.y+=(camera.dy-10)/3;
    //make the camera point more towards the direction
    //that the player is moving in so they can see ahead
    if(player.mx!=0) {
      // camera.dx = linearMove(camera.dx, (player.mx * 100), 5);
    }
    if(!canvas)return;
    var world1 = this.world;
    if(camera.x<canvas.width/2)camera.x = canvas.width/2;
    if(camera.x>world1.w*world1.s-canvas.width/2) camera.x = world1.w*world1.s-canvas.width/2;
    if(camera.y>world1.h*world1.s-canvas.height/2+canvas.height*this.lowerLetterBox.h)camera.y = world1.h*world1.s-canvas.height/2+canvas.height*this.lowerLetterBox.h;
    if(camera.y<canvas.height/2-canvas.height*this.upperLetterBox.h)camera.y = canvas.height/2-canvas.height*this.upperLetterBox.h;  
  }
  followPlayer(){
    this.moveCamera();
  }
  constrainCamera(x,y,w,h){
    
  }
  addIntroGUI(){
    var buttonFont = "25px noteworthy";
    var textColor = 'black';
    if(touchOn){
      var entireScreenButton = new TextButton(0,0,1,1,0,
        this.increaseTouchCount.bind(this),"",buttonFont,'transparent','transparent','transparent',0);
      this.gui.push(entireScreenButton);
      
      var dim = rectDimFromCenter(.83,.08,.5,.1);
      this.skipMessage = new Label(dim[0],dim[1],dim[2],dim[3],0,
        "",buttonFont, 'rgba(255,255,255,.9)', 'center');
      this.gui.push(this.skipMessage);
    }
    this.buttons = getButtons(this.gui);


    
  }
  increaseTouchCount(){
    this.touchCount += 1;
  }
  update(dt, frameCount) {
    super.update(dt,frameCount);

    if(touchOn){
      if(this.touchCount >= 1){
        this.skipMessage.text = "Tap again to skip";
      }
      if(this.touchCount >= 2){
        this.time = 0;
      }
    }

    this.timeToWait--;
    this.time--;
    if(this.time<=0) {
      this.driver.setScene(new LevelIntroScene(new GameScene(),true));
    }
    if(this.time > this.totalTime-200){
      if(this.time % this.emissionDelay == 0){
        this.addEntity(new SleepText(this.player.x+this.player.w,this.player.y-this.player.h,20,2,-2,"Z",
          "30", FONT,[255,255,255,1],[255,255,255,0],25,25,true));
      }
      
    }
    if(this.time > this.totalTime-150){
      if(this.time % this.emissionDelay == 9){
        this.addEntity(new SleepText(this.pig.x+this.pig.w,this.pig.y-this.pig.h,20,2,-2,"Z",
          "30", FONT,[255,255,255,1],[255,255,255,0],25,25,true));
      }
    }
    if(this.time == this.totalTime-160){
      this.addEntity(new SleepText(this.pig.x+this.pig.w/2,this.pig.y-this.pig.h-70,80,0,0,"!?",
          "65", FONT,[255,255,255,1],[255,255,255,0],20,30,true));
    }
    if(this.time == this.totalTime - 200) {
      this.player.flipped = false;
      this.player.jump(7);
      this.player._angle = 0;      
      this.player.eyeMovement.blink = 0;      
    }
    if(this.time < this.totalTime - 230) {
      this.player.mx = 1;
      this.moveCamera = function() {};
    }
    
  }
  draw(canvas){
    super.draw(canvas);
    this.drawAllGUI(canvas);
  }
}