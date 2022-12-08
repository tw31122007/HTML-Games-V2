class OwlStriker extends Byrd {
  constructor(x,y) {
    super(x,y);
    this.moveTimer=0;
    this.moveTime = 20;
    this.speed = 10;
    this.mx=0;
    this.d = 1;
    
    // this.color1 = "#743";
    // this.color2 = "#000";
    // this.color3 = '#632';

    this.colorsNeutral=["#743", "#000", "#632"]
    this.colorsCharge=["#dc0", "#ba0", "#980"]
    this.color1=this.colorsNeutral[0];
    this.color2=this.colorsNeutral[1];
    this.color3=this.colorsNeutral[2];
    
    this.eyeColor = "#fff";
    this.beakColor = "#f7ff8c";
    
    this.w = 40;
    this.h = 30;
    this.width = this.w;
    this.height = this.h;
    this.grav = this._grav = .3;
    this.jumpPower = 8;
    this.turnsAroundAtWall = false;
    this.attack = false;
    this.startY = 100000;
    this.attackDelayTimer = 0;
    this.groundAccel = 2;
    this.airAccel = 0.1;
    this.cloudTimer = 0;
  }
  getHitByEntity(player) {
    player.bounceOffEntity(this);
    this.height/=4;
    this.width*=.8;
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
    var turnAroundArea = 10;
    if(Math.abs(dx)>turnAroundArea) {
      this.d = dx>0?1:-1;
    }
    this.flipped = this.d==-1;
    
    var attackDistance = 400;
    var strikeSpeed = 25;
    var strikeTime = 20;
    this.spinning = this.stunned;
    if(this.stunned) {
      if(this.grounded) {
        this.stunned = false;
      }
    }
    else if(this.attack2) {
      this.attackDelayTimer -= dt;
      if(this.attackDelayTimer<=0||this.grounded) {
        this.attack2 = false;
        this.killPlayer = false;
        this.attackDelayTimer = 0;
        this.grav = this._grav;
        this.mx = 0;
        this.ignoresPlatforms = false;
        if(this.grounded) {
          this.stunned = true;
          this.grounded = false;
          this.vy = -this.jumpPower;
        }
      }
    }
    else if(this.attackDelayTimer>0) {
      this.attackDelayTimer -= dt;
      if(this.attackDelayTimer<=0) {
        this.attack = false;
        var r = Math.sqrt(dx*dx+dy*dy);
        this.vx = dx*strikeSpeed/r;
        this.vy = dy*strikeSpeed/r;
        // this.grav = 0;
        // this.mx = this.d;
      
        this.attack2 = true;
        this.ignoresPlatforms = true;
        this.killPlayer = true;
        this.attackDelayTimer = strikeTime;
        // this.grav = this._grav;
      }
    }
    else if(this.attack && this.vy >0 ) {
      // this.grav = 0;
      this.vy = 0;
      if(this.attackDelayTimer<=0)this.attackDelayTimer = 20;
    }
    else if(!this.attack&&Math.abs(dx)<attackDistance&&Math.abs(dy)<attackDistance) {
      this.vy = -1;
      this.jumpCount = 0;
      this.jump();
      // if(!this.attack) {
      //   this.startY = this.y-this.h;
      // }
      this.attack = true;
    }

    this.cloudTimer -= dt;
   
    if(this.killPlayer&&this.cloudTimer<0) {
      this.cloudTimer = 3;
      var x = this.x + (Math.random()*this.w-this.w/2);
      var y = this.y - (Math.random()*this.h);
      var w = 10;
      var h = 10;
      // var vx = Math.random()*5-2+this.vx/5;
      // var vy = Math.random()*5-2-10;
      var vx = -this.vx/10;
      var vy = -this.vy/10;
      var color = "rgba(200,200,100,1)";
      // if(i>=num-8) color = "#222";
      // if(i>=num-4) color = "#33d"
      // if(i>=num-2) color = "#fff"; 
      this.game.addEntity(new Cloud(x,y,w,h,vx,vy,20,color));
    }
    if(this.killPlayer) {
      this.color1=this.colorsCharge[0];
      this.color2=this.colorsCharge[1];
      this.color3=this.colorsCharge[2];
    } else {
      this.color1=this.colorsNeutral[0];
      this.color2=this.colorsNeutral[1];
      this.color3=this.colorsNeutral[2];
    }
    
    super.update(dt, frameCount);

    if(this.attack) {
      this.angle = Math.atan2(dy,dx);
      this._angle = 0;
      if(dx<0)this.angle += Math.PI;
      this.attackAngle = this.angle;
    }
    if(this.attack2) {
      this.angle = this.attackAngle;
      this._angle = 0;
    }
    
    
    // this._angle = -this.angle;
    if(this.grounded) this.wingAngle += (-Math.PI/2-this.wingAngle)/2;
    // this.wingAngle = Math.sin(frameCount*Math.PI/20)*Math.PI/2;
  }
  drawFeathers(canvas,w,h) {
    var featherHeight = -h/2;
    var sx = 8;
    var tx = -Math.abs(this.vx)+sx; //since the whole sprite gets flipped
    var fw = w*.5;
    canvas.fillStyle = this.color1;
    canvas.strokeStyle = this.color3;
    canvas.lineWidth = 3;
    canvas.beginPath();
    canvas.moveTo(sx,-h*.8);
    canvas.quadraticCurveTo(sx,-h+featherHeight, tx-fw/2,-h+featherHeight-this.vy);
    canvas.quadraticCurveTo(tx-fw/4,-h+featherHeight*.9, sx,-h);
    canvas.moveTo(sx,-h*.8);
    canvas.quadraticCurveTo(sx,-h+featherHeight, tx+fw/2,-h+featherHeight-this.vy);
    canvas.quadraticCurveTo(tx+fw/4,-h+featherHeight*.9, sx,-h);
    canvas.fill();
    canvas.stroke();
  }
  drawClaws(canvas,w,h) {

  }
  drawFace(canvas,w,h) {
    canvas.save();
    if(!this.attack2)
    canvas.translate(0,this.vy);
    var eyepad = 1;
    var eyeSize = 8;
    canvas.fillStyle = this.eyeColor;
    canvas.fillRect(0,-h*.95,eyeSize,eyeSize);
    canvas.fillStyle = "#000";
    canvas.fillRect(0+eyepad,-h*.95+eyepad,eyeSize-eyepad*2,eyeSize-eyepad*2);
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
    canvas.fillStyle = "#000";
    canvas.fillRect(12+eyepad,-h*.95+eyepad,eyeSize-eyepad*2,eyeSize-eyepad*2);
    // canvas.lineWidth=4;
    // canvas.lineCap = 'round';
    // canvas.moveTo(3,-h*.8);
    // canvas.lineTo(3+2,-h*.8+2);
    // canvas.moveTo(20,-h*.8);
    // canvas.lineTo(20-2,-h*.8+2);
    // canvas.stroke();
    this.drawFeathers(canvas,w,h);
    canvas.restore();
  }
  getHitByEntity(player) {
		player.bounceOffEntity(this);
    // player.y -= 20;
    // this.width+=20;
    // this.height-=10;
    this.height/=4;
    this.width*=.8;
    this.killPlayer = false;
    this.stunned = true;
    this.attack2 = false;
    this.attack = false;
    this.vx *= 0.3;
    this.vy *= 0.3;
    this.attackDelayTimer = 0;
    this.width = 100;
		//this.h=this.h/2;
		//this.die();
	}
  entityCollision(other, processedSecond,dx,dy) {
    if(this.attack||this.attackDelayTimer)return;
    this.vx += dx;
    this.vy += dy;
  }
}