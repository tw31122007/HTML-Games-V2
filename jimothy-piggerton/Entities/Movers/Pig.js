
class Pig extends Mover {
  constructor(x,y) {
    // x+=70;
    super(x,y);
    this.color = "pink";
    // this.w = 27;
    // this.h = 23;
    this.w=30;
    this.h=25;
    this.width = this.w;
    this.height = this.h;
    this.speed = 0;
    this.cloudParticlesOn=false;
    this.mx = -1;
    this.groundAccel=0;
    this.tx = x;
    this.ty = y;
    this.turnTime = 50;
    this.turnCounter = this.turnTime;
    this.bounceFrq = Math.PI/5;
    this.animationState = 0;
    this.isPig=true;
  }
  entityCollision(){}
  update(dt, frameCount) {
    // if(this.x > this.tx+50) this.mx = -1;
    // if(this.x < this.tx-50) this.mx = 1;
    // if(this.turnCounter<=0||this.wallcolliding) {
      // this.turnCounter = this.turnTime;
      // this.mx = -this.mx;
    // }
    // if(Math.random()>.95) this.speed=0;
    // if(Math.random()>.95) this.speed = 3;
    if(this.wallcolliding) {
      this.mx = -this.mx;
      this.wallcolliding=false;
      this.vx = 0;
    }
    this.width += Math.sin(frameCount*this.bounceFrq)*this.bounceFrq;
    this.height -= Math.sin(frameCount*this.bounceFrq)*this.bounceFrq;
    // this.width += Math.cos(this.angle*20) * 2;
    // this.height -= Math.cos(this.angle*20) * 2;
    super.update(dt, frameCount);
    if(rectangleCollision(this.getHitBox(), this.game.player.getHitBox()) == true) {
			this.playerCollision();
    }
    if(this.animationState == 0)
    this.flipped = this.game.player.x < this.x;
  }

  playerCollision()
  {
    this.game.levelComplete();
  }

  drawShape(canvas, w, h) {
    var tailSize = 15;
    var earSize = 5;    
    canvas.strokeStyle="#fff";
    canvas.fillStyle="#fff";    
    canvas.lineWidth = 5;
    // var feetSize = w/5;
    canvas.strokeRect(-w/2-1, -h-1, w+2, h+2); 
    this.drawTail(canvas,-w/2,-h*.8,7,tailSize); 
    canvas.strokeRect(w/2-h/4, -h*11/16, h/2, h/2);    
    canvas.beginPath();
    this.drawEar(canvas, 6, -h-earSize,earSize,earSize);
    canvas.stroke();
    canvas.beginPath();    
    this.drawEar(canvas, -6, -h-earSize,earSize,earSize);
    canvas.stroke();
    canvas.fillStyle = this.color;          
    canvas.fillRect(-w/2, -h, w, h);
    // canvas.fillRect(w/2-feetSize, 0, feetSize, feetSize/2);
    // canvas.fillRect(w/2-feetSize*2.2, 0, feetSize, feetSize/2);
    canvas.fillStyle = "#e8a";
    // canvas.fillRect(-w/2, 0, feetSize, feetSize/2);
    // canvas.fillRect(-w/2+feetSize*1.2, 0, feetSize, feetSize/2);
    canvas.fillRect(-w/2, -h, w/3, h);    
    // canvas.fillStyle = '#000';
    this.drawTail(canvas,-w/2,-h*.8,3,tailSize);
    canvas.fillStyle=this.color;
    canvas.beginPath();
    this.drawEar(canvas, 6, -h-earSize,earSize,earSize);
    this.drawEar(canvas, -6, -h-earSize,earSize,earSize);
    canvas.fill();
    this.drawSnout(canvas, w/2-h/4, -h*11/16, h/2, h/2);
    canvas.fillStyle='#000';
    var eyeH = 4+this.width/10;
    var eyeBrowAngle = Math.PI/5;
    var eyeY = -h+2;
    if(this.animationState==1) {
      eyeH = 2;
      eyeBrowAngle = 0;
      eyeY+=2;
    }
    if(this.animationState==2) {
      eyeBrowAngle = 0;
    }
    this.drawEye(canvas, 0,eyeY,5,eyeH, -eyeBrowAngle);
    this.drawEye(canvas, w/2-3,eyeY,5,eyeH, eyeBrowAngle);
  }
  drawEar(canvas, x,y,w,h) {
    canvas.rect(x,y,w,h);
  }
  drawSnout(canvas,x,y,w,h) {
    canvas.fillStyle = "#faa";
    canvas.fillRect(x,y,w,h);
    canvas.fillStyle = '#966';
    var ns = w/3;
    canvas.fillRect(x,y+h/2-ns,ns,ns);
    canvas.fillRect(x+w-ns,y+h/2-ns,ns,ns);    
  }
  drawTail(canvas,x,y,w,h) {
    canvas.save()
    canvas.strokeStyle = canvas.fillStyle;
    canvas.lineWidth = w;
    canvas.translate(x,y);
    canvas.rotate(Math.cos(this.x/this.speed/2)/2);
    // canvas.rotate(Math.cos(this.angle));
    // canvas.fillRect(-w,-h,w,h);
    canvas.beginPath();
    canvas.arc(-w/2,-h/4,h/4,Math.PI/2,Math.PI*3/2);
    canvas.arc(-w/2,-h/2+h/8,h/8,Math.PI/2,-Math.PI/2, true);
    canvas.stroke();
    canvas.restore();
  }
  drawEye(canvas, x,y,w,h,r) {
    if(this.animationState==2) {
      // canvas.fillRect(x,y,w,h);
      canvas.beginPath();
      canvas.moveTo(x,y+h/2);
      canvas.lineTo(x+w/2,y);
      canvas.lineTo(x+w,y+h/2);
      canvas.lineTo(x+w,y+h);
      canvas.lineTo(x+w/2,y+h/2);
      canvas.lineTo(x,y+h);
      canvas.fill();
      return;
    }
    canvas.save();
    canvas.translate(x+w/2,y+h/2);
    canvas.fillRect(-w/2,-h/2,w,h);
    // canvas.fillStyle = "#fff";
    // canvas.fillRect(-w*.5,-h*.5, w*.5,h*.5);
    if(this.animationState==0) {
      canvas.rotate(r);
    // w = w/2;
    // w=w*.8;
    // canvas.fillStyle="pink";
    // h = 4;
      canvas.fillRect(-w,-h,w*2,h/2);
    }
    canvas.restore();
  }
}
