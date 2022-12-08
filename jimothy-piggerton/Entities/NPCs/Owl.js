class Owl extends Byrd {
  constructor(x,y) {
    super(x,y);
    this.moveTimer=0;
    this.moveTime = 20;
    this.speed = 5;
    this.mx=0;
    this.d = 1;

    // this.color1 = "#743";
    // this.color2 = "#000";
    // this.color3 = '#632';
    this.color1 = "#333";
    this.color2 = "#000";
    this.color3 = '#222';
    this.eyeColor = "#fff";
    this.beakColor = "#f7ff8c";
    
    this.w = 30;
    this.h = 25;
    this.width = this.w;
    this.height = this.h;
    this.grav = .5;
    this.jumpPower = 10;
    this.turnsAroundAtWall = false;
    this.flyAway = false;
    this.startY = 100000;
    this.terminalVelocity = 4;
    this.airAccel = 1;
    this.offset = Math.random()*10;
  }
  getHitByEntity(player) {
    player.bounceOffEntity(this);
    this.vy = -player.vy;
    this.height/=4;
    this.width*=.8;
    this.jumpCooldownTimer = 20;
    // if(this.wallcolliding == true && this.moveTimer<=0) {
		// 	this.d = this.d*-1;
		// }
    this.moveTimer=this.moveTime;
    
	}
  update(dt, frameCount) {
    var dx = this.game.player.x-this.x;
    var dy = this.game.player.y-this.y;
    // if(dx>0) this.d = 1;
    // if(dx<0)this.d=-1;
    var turnAroundArea = 20;
    if(Math.abs(dx)>turnAroundArea&&!this.flyAway) {
      this.d = dx>0?1:-1;
    }
    this.flipped = this.d==-1;
    if(this.flyAway) {
      if(this.wallcolliding == true){// && Math.abs(dx)<turnAroundArea) {
        this.d = this.d*-1;
        this.mx = -this.d;
      }
      this.mx = -this.d;
      if(this.vy >= -4) {
        this.jumpCount = 0;
        this.jump();
      }
    } else {
      if(this.grounded) {
        this.mx = 0;
        this.flipped = this.d==-1;
      } else if(this.wallcolliding == true) {
        this.d = this.d*-1;
        this.mx = -this.mx;
      }
    }
    var fleeDistance = 100+this.offset;
    var stopDistance = 400+this.offset;
    if(Math.abs(dx)<fleeDistance&&Math.abs(dy)<fleeDistance) {
      this.flyAway = true;
      this.mx = -this.d;
    }
    if(Math.abs(dx)>stopDistance||Math.abs(dy)>stopDistance) {
      this.flyAway = false;
      if(this.groudned)this.mx=0;
    }

    super.update(dt, frameCount);
    
    this._angle = -this.angle;
    if(this.grounded) this.wingAngle += (-Math.PI/2-this.wingAngle)/2;
    // this.wingAngle = Math.sin(frameCount*Math.PI/20)*Math.PI/2;
  }
  drawFace(canvas,w,h) {
    canvas.save();
    canvas.translate(0,this.vy);
    var eyepad = 1;
    var eyeSize = 8;
    canvas.fillStyle = this.eyeColor;
    canvas.fillRect(0,-h*.95,eyeSize,eyeSize);
    // canvas.fillStyle = "#000";
    // canvas.fillRect(0+eyepad,-h*.95+eyepad,eyeSize-eyepad*2,eyeSize-eyepad*2);
    // canvas.fillText('^', 25,-h*.95+h*.4);

    canvas.fillStyle = this.beakColor;
    // canvas.fillRect(12,-h*.7,30,15);
    var beakw = 10;
    var beakh = 10;
    var beakx = 5;
    var beaky = -h*.7;
    canvas.beginPath();
    canvas.moveTo(beakx,beaky);
    canvas.lineTo(beakx+beakw/2,beaky+beakh);
    canvas.lineTo(beakx+beakw,beaky);
    canvas.fill();
    canvas.fillStyle = this.eyeColor;
    // canvas.fillText('^', 10,-h*.95+h*.4);
    canvas.fillRect(12,-h*.95,eyeSize,eyeSize);
    // canvas.fillStyle = "#000";
    // canvas.fillRect(12+eyepad,-h*.95+eyepad,eyeSize-eyepad*2,eyeSize-eyepad*2);
    // canvas.lineWidth=4;
    // canvas.lineCap = 'round';
    // canvas.moveTo(3,-h*.8);
    // canvas.lineTo(3+2,-h*.8+2);
    // canvas.moveTo(20,-h*.8);
    // canvas.lineTo(20-2,-h*.8+2);
    // canvas.stroke();
    canvas.restore();
  }
}