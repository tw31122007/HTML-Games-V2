class Butcher extends Mover {
  constructor(x,y) {
    super(x,y);
    this.w = 35;
    this.h = 50;
    this.width = this.w;
    this.height = this.h;
    this.eyeMovement = {x:0,y:0, blink: 0, blinkTime: 10, tx: 0, ty: 0, px: 8, py:15, dx: 20, w:8, w2:7};
    this.eyeColor = "#fff";
    this.outlineColor = "#000";
    this.color1 = "#aaa";
    this.color2 = "#888";
    this.mx=-1;
    this.speed = 4;
    this.state = 0;
    this.knifeAngle = 0;
    this.wielding=true;
  }
  update(dt, frameCount) {
    super.update(dt, frameCount);
    // if(Math.floor(frameCount/dt)%30==0) {
      // this.game.addEntity(new Knife(this.x,this.y, -3, -3));
    // }
    switch(this.state) {
      case 0:
        this.moveToPig();
        break;
      case 1:
        this.waitForJump();
        break;
      case 2:
        this.waitForFall();
        break;
      case 3:
        this.moveOffScreen();
      default:
        break;
    }
  }
  attachPig() {
    this.game.pig.x = this.x-this.w/4*(1-2*this.flipped);
    this.game.pig.y = this.y-this.h/4;
    this.game.pig.flipped = !this.flipped;
    this.game.pig.vy = 0;
    this.game.pig._angle = this.angle;
    this.game.pig.animationState = 0;    
    this.game.pig.bounceFrq = Math.PI/10;
  }
  waitForJump() {
    this.mx = 0;
    if(this.grounded==false) this.state = 2;
    this.attachPig();
  }
  waitForFall() {
    this.mx = 0;
    if(this.grounded) {
      this.state = 3;
    }
    this.attachPig();
  }
  moveToPig() {
    this.mx = -1;
    if(this.x<this.game.pig.x) {
      this.state=1;
      this.jump(7);
      this.mx = 0;
    }
  }
  moveOffScreen() {
    this.mx = 1;
    this.attachPig();
  }
  drawShape(canvas,w,h) {
    canvas.save();
    canvas.strokeStyle = this.outlineColor;
    canvas.lineWidth=5;
    canvas.strokeRect(-w/2-1,-h-1,w+2,h+2);
    // canvas.fillStyle = "#73d";
    canvas.fillStyle = this.color1;    
    
    // canvas.fillStyle = "#999";
    canvas.fillRect(-w/2,-h,w,h);
    // canvas.fillStyle = "#74e";
    // canvas.fillStyle = "#ddd";
    canvas.fillStyle = this.color2;
    
    var shadeX = w*.2+this.eyeMovement.x/2;
    if(this.dead)shadeX-=5;
    canvas.fillRect(-w/2,-h,shadeX,h);
    var pantsHeight = h*.4;
    canvas.fillStyle = "#fff";
    var apronx = w/4;
    var stringHeight = h/10;
    canvas.fillRect(-w/2+apronx,-pantsHeight,w-apronx,pantsHeight);    
    canvas.fillRect(-w/2,-pantsHeight,apronx,stringHeight);  
    canvas.fillStyle="#a88";  
    canvas.fillRect(-w/2+apronx+7,-pantsHeight+5,w-apronx-10,7);        
    // canvas.fillStyle = "#44e";
    // canvas.fillRect(0,-pantsHeight,w/2,pantsHeight);        
    
    
    canvas.fillStyle=this.eyeColor;
    var squint = 1-.6*Math.abs(this.vy)/this.terminalVelocity;
    var eyey = -h+this.eyeMovement.py + this.eyeMovement.y;
    var eyex = this.eyeMovement.px + this.eyeMovement.x;
    var eyed = this.eyeMovement.dx - this.eyeMovement.x/3;
    
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
    var eyh = 8*squint;
    var eyh2 = eyh;
    if(this.crouching) {
      // eyed += 2;
      eyex += 2;
    }
    this.drawEye(canvas, eyex-eyed,eyey,this.eyeMovement.w,eyh,0, Math.PI/20, this.eyeMovement.w*2, 6,"#000");
    this.drawEye(canvas, eyex,eyey,this.eyeMovement.w2,eyh2,3, -Math.PI/20, this.eyeMovement.w*2, 6, "#000");
    w=this.w;
    
    canvas.translate(0,-h);
    var hatAngle = Math.abs(this.angle);
    if(hatAngle>Math.PI/4)hatAngle=Math.PI/4;
    canvas.rotate(-hatAngle);
    this.drawHat(canvas,w);
    canvas.translate(0,h);
    if(this.wielding) {
      this.drawKnife(canvas, w,h);
    }
    canvas.restore();    
  }
  drawEye(canvas, x,y,w,h, dx, browangle, broww, browh, browcolor) {
    canvas.fillRect(x,y,w,h);
    canvas.save();
    canvas.fillStyle=browcolor;
    canvas.translate(x+w/2+dx,y-browh/4);
    canvas.rotate(browangle);
    canvas.fillRect(-broww/2, -browh/2, broww, browh);
    canvas.restore();
  }
  drawHat(canvas,w) {
    canvas.fillStyle = "#fff";
    // canvas.fillStyle = "#444";
    canvas.beginPath();
    canvas.rect(-w/2-1,-6,w,12);
    canvas.stroke();
    canvas.fill();

    canvas.fillStyle = "#ddd";
    // canvas.fillStyle = "#111";
    canvas.beginPath();
    canvas.rect(-w/2-1,-6,(w)/4,12);
    canvas.fill();
  }
  drawKnife(canvas,w,h) {
    var bladew = 18;
    var bladeh = 23;
    var handlew = 5;
    var handleh = 10;
    var holer = 3;
    canvas.save();
    canvas.translate(w/2-this.knifeAngle*10,-h/3-this.knifeAngle*10);
    canvas.scale(-1,1);
    canvas.rotate(-Math.PI/5+this.knifeAngle);
    canvas.lineWidth = 3;    
    canvas.beginPath();
    canvas.fillStyle = "#a33";
    canvas.rect(-handlew, 0, handlew, handleh);
    canvas.stroke();
    canvas.fill();
    canvas.fillStyle = "#822";
    canvas.fillRect(-handlew, 0, handlew/2, handleh);    
    canvas.fillStyle = "#eee";
    canvas.beginPath();
    canvas.rect(-bladew,-bladeh,bladew,bladeh);
    canvas.stroke();    
    canvas.fill();
    canvas.fillStyle="#fff";
    canvas.fillRect(-bladew,-bladeh,bladew/4,bladeh);
    canvas.beginPath();
    canvas.fillStyle="#000";
    canvas.arc(-holer*1.5, -bladeh+holer*1.5, holer, 0, Math.PI*2);
    canvas.fill();
    canvas.restore();
  }
}