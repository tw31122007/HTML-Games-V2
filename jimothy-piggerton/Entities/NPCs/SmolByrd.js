class SmolByrd extends Byrd {
  constructor(x,y) {
    super(x,y);
    this.moveTimer=0;
    this.moveTime = 20;
    this.speed = 10;
    this.mx=0;
    this.d = 1;

    this.color1 = "#600000";
    this.color2 = "#000";
    this.color3 = '#ca87fd';
    this.eyeColor = "#fff";
    this.beakColor = "#f7ff8c";
    
    this.w = 40;
    this.h = 30;
    this.width = this.w;
    this.height = this.h;
    this.grav = .4;
    this.jumpPower = 4;
    this.turnsAroundAtWall = false;
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
    if(this.moveTimer>0) {
      this.mx = this.d;
      this.moveTimer-=dt;
    } else {
      this.mx=0;
    }
    if(this.y>this.startY&&this.vy>=0) {
      this.jumpCount = 0;
      this.jump();
    }
    if(this.wallcolliding == true) {
			this.d = this.d*-1;
      this.mx = this.d;
		}
    super.update(dt, frameCount);
    
    this._angle = -this.angle;
  }
}