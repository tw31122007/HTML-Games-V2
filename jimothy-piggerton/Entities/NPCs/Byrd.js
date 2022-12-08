var TheByrd;
class Byrd extends Enemy {
  constructor(x,y) {
    super(x,y);
    this.w = 60;
    this.h = 50;
    this.width = this.w;
    this.height = this.h;
    this.color="black";
    this.jumpPower = 10;
    this.killPlayer = false;
    this.startY= y;
    this.isByrd = true;
    // this.color1 = "#612a99";
    // this.color2 = "#1e045b";
    this.color1 = "#200089";
    this.color2 = "#000";
    this.color3 = '#ca87fd';
    this.eyeColor = "#fff";
    this.beakColor = "#f7ff8c";
    // this.beakColor = "#000";
    
    TheByrd = this;
    this.wingAngleOffset = 0;
    this.wingAngle = 0;
    this.terminalVelocity = 10;
    this.jumpCooldownTime=0;
    this.airTilt = false;
  }
  playJumpSound() {
    
  }
  die() {

  }
  getHitBox() {
    var w = this.width;
    var h = this.height;
    if(!this.grounded) {
      //add wingspan to hitbox
      w *= 1.6;
    }
    return {x:this.x-.5*w, y:this.y-h, w:w, h:h};
  }
  entityCollision(other, processedSecond,dx,dy) {
    this.mx = this.mx*-1;
    super.entityCollision(other,processedSecond,dx,dy);
  }
  onCeilingCollide() {
    this.jumpCooldownTimer = 20;
  }
  getHitByEntity(player) {
    player.bounceOffEntity(this);
    this.height/=4;
    this.width*=.8;
    // this.jumpCooldownTimer = 20;
		// this.h=this.h/2;
		// this.die();
	}
  update(dt, frameCount) {
    if(this.y>this.startY&&this.vy>=0) {
      this.jumpCount = 0;
      this.jump();
    }
    super.update(dt, frameCount);
    // this.angle =0;
    // this._angle = -this.angle;
    if(this.grounded) {
      this.wingAngle += (-Math.PI/2-this.wingAngle)/2;
      this.wingAngleOffset += (Math.PI/8-this.wingAngleOffset)/2;
    } else {
      this.wingAngle = this.vy/15;
      this.wingAngleOffset = 0;
    }
  }
  drawShape(canvas, w,h) {
    // canvas.strokeStyle="#000";
    // canvas.lineWidth = 5;
    // canvas.strokeRect(-w/2,-h,w,h); 
    canvas.fillStyle = "#000"; 
    canvas.fillRect(-w/2-2.5,-h-2.5,w+5,h+5);  
    this.drawWings(canvas,w,h,1);        
    canvas.fillStyle=this.color1;
    canvas.fillRect(-w/2,-h,w,h);
    canvas.fillStyle=this.color2;    
    canvas.fillRect(-w/2,-h,w/4,h);
    canvas.fillStyle=this.color3;
    canvas.fillRect(-w/10,-h*.9,w/8,h/10);
    this.drawWings(canvas,w,h);    
    this.drawFace(canvas,w,h);
  }
  drawFace(canvas,w,h) {
    canvas.fillStyle = this.eyeColor;
    canvas.fillRect(25,-h*.95,7,5);
    // canvas.fillText('^', 25,-h*.95+h*.4);

    canvas.fillStyle = this.beakColor;
    // canvas.fillRect(12,-h*.7,30,15);
    canvas.beginPath();
    canvas.moveTo(22,-h*.9);
    canvas.lineTo(22+30,-h*.9+15/2);
    canvas.lineTo(22,-h*.9+15);
    canvas.fill();
    canvas.fillStyle = this.eyeColor;
    // canvas.fillText('^', 10,-h*.95+h*.4);
    canvas.fillRect(10,-h*.95,7,5);
    // canvas.lineWidth=4;
    // canvas.lineCap = 'round';
    // canvas.moveTo(3,-h*.8);
    // canvas.lineTo(3+2,-h*.8+2);
    // canvas.moveTo(20,-h*.8);
    // canvas.lineTo(20-2,-h*.8+2);
    // canvas.stroke();
  }
  drawWings(canvas, w,h,s) {
    var ww = w*.6;
    var hh = h/4;
    var d = s?3:0;
    canvas.fillStyle = s?"#000":this.color1;
    canvas.beginPath();
    // canvas.rect(-w/2-ww/2,-h/2, ww,hh);
    // canvas.rect(w/2,-h/2, ww,hh);
    var angle = this.wingAngle;
    var y = -h*.8-angle*10;
    var wx = 0;
    var wy = -this.wingAngleOffset*50;
    if(this.wingAngle<0)wx=this.wingAngle*10;
    this.pathWingAtAngle(canvas, -w/2-ww/2-d-wx,y-d+wy, ww+d*2,hh+d*2, ww*.8, hh/2, angle+this.wingAngleOffset);
    this.pathWingAtAngle(canvas,w*.4-d+wx,y-d+wy, ww+d*2,hh+d*2, ww*.2, hh/2, -angle+this.wingAngleOffset);
    // if(s)
      // canvas.stroke();
    // else
      canvas.fill();
  }
  pathWingAtAngle(canvas, x,y,w,h, px,py, angle) {
    canvas.save();
    canvas.translate(x+px, y+py);
    canvas.rotate(angle);
    canvas.rect(-px,-py-10,w,h);
    canvas.rect(-px*.8,-py,w*.8,h);
    canvas.rect(-px*.5,-py+5,w*.5,h);
    canvas.restore();
  }
}