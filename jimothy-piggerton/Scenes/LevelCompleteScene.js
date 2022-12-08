class LevelCompleteScene extends Scene{
  constructor(prevScene, callback, win){
    super(false);
    this.prevScene = prevScene;
    this.callback = callback;
    this.win = win;
    this.player = prevScene.player;
    this.pig = prevScene.pig;
    this.prevLevelAlpha = 1;
    this.camera = this.prevScene.camera;
    this.entities = [this.player, this.pig];
    this.time = 0;
    this.maxTime = 100;
    this.midPoint = {
      x: (this.player.x+this.pig.x)/2,
      y: (this.player.y+this.pig.y)/2
    };
    this.pig.animationState = 2;
    var player = this.player;
    player.angle = 0;
    player.uncrouch();
    this.r = 20;
    this.update = this.update0;
    prevScene.screenShakeLevel = 0;
    this.keyMap = {
      27: {down: this.startExitTransition.bind(this) },
      78: {down: function() {
        if(this.keys[67] && DEBUG) {
          this.loadNextScene();
        }
      }.bind(this)},
    };
    this.butcher = new Butcher(0,0);
    this.butcher.ghostOn = true;
    this.butcher.state = -1;
    SOUNDMAP.levelComplete.play();
    this.addAllGUI();
    this.touchCount = 0;
  }
  update0(dt,frameCount) {
    super.update(dt,frameCount);
    this.checkTapToSkip();
    if(this.player.grounded||true) {
      this.update = this.update1;
      this.player.ghostOn = true;
      this.pig.ghostOn = true;
      this.time = 0;
      return;
    }
    this.entities.forEach(e => {
      e.update(dt,frameCount)
    });
  }
  update1(dt, frameCount){
    super.update(dt,frameCount);
    this.checkTapToSkip();
    var t = this.time/this.maxTime;
    this.prevLevelAlpha = 1 - t;
    if(this.time>=this.maxTime) {
      this.prevLevelAlpha = 0;
      // this.startExitTransition();
      this.time = 0;
      this.update = this.update2;
      return;
    }
    this.entities.forEach(e => {
      e.vy = 0;
      e.update(dt,frameCount)
    });
    this.time += 1;
    this.midPoint.x += (this.camera.x - this.midPoint.x)*t*t;
    this.midPoint.y += (this.camera.y - this.midPoint.y)*t*t;
    // this.midPoint.x += ;
    var angle = t*t * Math.PI*4 + Math.PI;
    // var rw = 20+t*100 - (2-t*t)*100;
    if(t<.75) this.r += (100-this.r)/10;
    else if(t<.9) this.r += (10-this.r)/10;
    else this.r += (10-this.r)/10;
    var rw = this.r;
    var rh = rw/2;
    this.player.angle = Math.cos(angle)*Math.PI/20;
    this.player.x = this.midPoint.x + Math.cos(angle)*rw;
    this.player.y = this.midPoint.y + Math.sin(angle)*rh;
    angle += Math.PI;
    this.pig.x = this.midPoint.x + Math.cos(angle)*rw;
    this.pig.y = this.midPoint.y + Math.sin(angle)*rh;
    this.player.flipped = this.player.x > this.pig.x;
    this.pig.flipped = !this.player.flipped;
    if(t>.75) {
      this.player.eyeMovement.blink = 7*t*t;          
    }
  }
  update2(dt,frameCount) {
    super.update(dt,frameCount);
    this.checkTapToSkip();
    this.time += 1;
    this.maxTime = 40;
    var t = this.time/this.maxTime;
    this.player.y += Math.sin(t*t*Math.PI*2) *1;
    this.pig.y += Math.sin(t*t*Math.PI*2) *1;
    if(this.time>this.maxTime) {
      if(this.win) {
        return this.startExitTransition();
      }
      this.prevScene.screenShakeLevel = 1; 
      SOUNDMAP.pigrip.play();
      this.player.maxJumps = 1;
      this.player.wallJumps=false;
      this.time = 0;
      this.maxTime = 100;     
      this.update = this.update3;
      this.entities.splice(1,0,this.butcher);
      return;
    }
    this.player.eyeMovement.blink = 7;    
  }
  update3(dt,frameCount) {
    super.update(dt,frameCount);
    this.checkTapToSkip();
    if(!this.prevScene.isFinalInWorld) {
      this.prevScene.musicFadeOnPig();
    }
    this.time += 1;    
    var t = this.time/this.maxTime;
    var player = this.player;
    var pig = this.pig;
    pig.animationState = 0;
    this.prevScene.updateScreenShakeLevel();
    pig.x += (t*t)*20;
    if(this.time >= this.maxTime) {
      this.startExitTransition();
    }
    player.eyeMovement.blink = -2 + 2*t;
    player.angle = t*Math.PI/5-Math.PI/5;
    player.eyeMovement.x = 5*t;
    player.eyeMovement.y = -3;
    // player.updateEye(dt,frameCount);
    pig.angle = t*t*Math.PI*2;
    this.butcher.x = pig.x+40;
    this.butcher.y = pig.y - 20;
    this.butcher.flipped = true;
    this.butcher.mx = -1;
    this.butcher.update(dt,frameCount);
  }
  draw(canvas){
    canvas.save();
    canvas.globalAlpha = this.prevLevelAlpha;
    this.prevScene.draw(canvas);
    canvas.restore();
    this.drawWithCamera(canvas);
    this.drawAllGUI(canvas);
    drawTransitionOverlay(this.overlayColor,canvas);    
  }
  drawWithCamera(canvas) {
    var camera = this.prevScene.camera;
    canvas.save();
    canvas.translate(canvas.width/2,canvas.height/2);  
    canvas.rotate(camera.r);
    canvas.translate(-Math.floor(camera.x), -Math.floor(camera.y));    
    for(var i=0;i<this.entities.length;i+=1) {
      var entity = this.entities[i];
      entity.draw(canvas);
    }
    canvas.restore();
  }
  startExitTransition(){
    this.prevScene.screenShakeLevel = 0;
    this.update = super.update;
    setTimeout(() => {
      this.startTransition(20, 1, this.loadNextScene);
    }, 300)
  }
  loadNextScene() {
    this.player.ghostOn = false;
    this.pig.ghostOn = false;
    this.player.flipped = false;
    this.driver.setScene(this.prevScene);
    this.callback();
  }
  addAllGUI(){
    var bigFont = "60px " + FONT;
    var buttonFont = "30px noteworthy";
    var textColor = 'black';
    var dim = rectDimFromCenter(.96,.95,.05,.08);
    if(this.prevScene.levelDeaths > 0) {
      this.deathCount = new Label(dim[0],dim[1],dim[2],dim[3],0,
        ""+this.prevScene.levelDeaths, bigFont, textColor,'left');
      this.gui.push(this.deathCount);

      dim = rectDimFromCenter(.82,.96,.2,.08);
      this.deathLabel = new Label(dim[0],dim[1],dim[2],dim[3],0,
        "Fails in level:", buttonFont,textColor,'right');
      this.gui.push(this.deathLabel);
    } else {
      dim = rectDimFromCenter(.82,.96,.2,.08);
      this.perfectLabel = new Label(dim[0],dim[1],dim[2],dim[3],0,
        "Perfect Clear!", buttonFont,textColor,'right');
      this.gui.push(this.perfectLabel);
    }
    if(touchOn){
      var entireScreenButton = new TextButton(0,0,1,1,0,
        this.increaseTouchCount.bind(this),"",buttonFont,'transparent','transparent','transparent',0);
      this.gui.push(entireScreenButton);
      
      var dim = rectDimFromCenter(.83,.08,.5,.1);
      this.skipMessage = new Label(dim[0],dim[1],dim[2],dim[3],0,
        "",buttonFont, 'black', 'center');
      this.gui.push(this.skipMessage);
    }
    this.buttons = getButtons(this.gui);

  }
  increaseTouchCount(){
    this.touchCount += 1;
  }
  checkTapToSkip(){
    if(touchOn){
      if(this.touchCount >= 1){
        this.skipMessage.text = "Tap again to skip";
      }
      if(this.touchCount >= 2){
        this.startExitTransition()
      }
    }
  }
}