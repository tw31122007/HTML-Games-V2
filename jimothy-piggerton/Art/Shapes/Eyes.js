class Eyes {
  constructor(mover) {
    this.mover = mover;
    this.x=6;
    this.y = 0.8;
    this.eyeDistance = 10;
    this.w1 = 8;
    this.w2 = 6;
    this.h = 8;
    this.color = "#fff";
    this.eyeMovement = {x:0,y:0, blink: 0, blinkTime: 10, tx: 0, ty: 0};
    this.randomXMin = -3;
    this.randomXRange = 6;
    this.randomYMin=-4;
    this.randomYRange=5;
    this.blinkTimer = 0;
  }
  update(dt, frameCount) {
    frameCount = Math.floor(frameCount);
    this.blinkTimer -= dt;
    if(this.blinkTimer<0) {
      this.blinkTimer = 50+Math.random()*100;
    // if(frameCount%60==0&&Math.random()>.5) {
      this.eyeMovement.blink = this.eyeMovement.blinkTime;
    }
    if(this.eyeMovement.blink>0) {
      this.eyeMovement.blink--;
    }
    if(this.mover.mx==0) {
      if(Math.random()>.99) {
        this.eyeMovement.tx = Math.random()*this.randomXRange+this.randomXMin;
        this.eyeMovement.ty = Math.random()*this.randomYRange+this.randomYMin;
      }
    }else {
      this.eyeMovement.tx= 0;
      this.eyeMovement.ty= 0;
    }
    this.eyeMovement.x += (this.eyeMovement.tx-this.eyeMovement.x)/10;
    this.eyeMovement.y += (this.eyeMovement.ty-this.eyeMovement.y)/10;
  }
  drawShape(canvas,w,h) {
    
    
    canvas.fillStyle=this.color;
    var squint = 1-.6*Math.abs(this.mover.vy)/this.mover.terminalVelocity;
    var eyey = -h*this.y + this.eyeMovement.y;
    var eyex = this.x + this.eyeMovement.x;
    var eyed = this.eyeDistance - this.eyeMovement.x/3;
    
    if(this.crouching) {
    // squint *= .2;
    }
    var blink = 0;
    if(this.eyeMovement.blink>0) {
    var t = this.eyeMovement.blinkTime - this.eyeMovement.blink+1;
    blink = (1+Math.cos(t*Math.PI/20))/2;
    }
    squint*= (1-blink);
    eyey += blink*4;
    // eyey -= this.width/this.w * 5;
    var eyh = this.h*squint;
    var eyh2 = eyh;
    if(this.mover.crouching) {
    // eyed += 2;
    eyex += 2;
    }
    this.drawEyeShape(canvas,eyex-eyed,eyey,this.w1,eyh);
    this.drawEyeShape(canvas,eyex,eyey,this.w2,eyh2);
  }
  drawEyeShape(canvas,x,y,w,h) {
    canvas.fillRect(x,y,w,h);
  }
}