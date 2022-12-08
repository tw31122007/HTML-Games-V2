class ButcherTurret extends Butcher{
  constructor(x,y) {
    super(x,y);
    this.shootSpeed = 60;
    this.shootTimer = 0;
    this.projectileSpeed = 6;
    this.restrictDirection = false;
    // this.butcher = new Butcher(x,y+30);
    this.inRange = false;
    this.range = 300;
    this.targetX = x;
    this.targetY = y;
    this.butcher = this;
    this.speed = 9;
    this.moveTimer = 0;
    this.min = null;
    this.wielding = true;
  }
  update(dt,frameCount) {
    dt = dt/0.8;
    if(this.shootTimer>-20&&this.shootTimer<30) {
      var mx = this.targetX-this.x;
      var my = this.targetY-this.y;
      this.x += mx /10*dt;
      this.y += my /10*dt;
      // this.x = linearMove(this.x,this.targetX,this.speed);
      // this.y = linearMove(this.y,this.targetY,this.speed);
      
      if(Math.abs(mx) + Math.abs(my) > 30) {
        if(this.shootTimer<0)this.shootTimer+=dt;
        return;
      }
    }
    var player = this.game.player;
    var dx = player.x - this.x;
    var dy = player.y - this.y - player.h/2;
    // if(this.shootTimer<20) 
    {
      this.dx = dx;
      this.dy = dy;
    }
    if(this.shootTimer>=0) {
    this.butcher.flipped = dx<0;
    }
    
    var r = Math.sqrt(dx*dx+dy*dy);
    if(this.restrictDirection) {
      if(Math.abs(dx)>Math.abs(dy)) dy = 0; else dx = 0;
      this.angle = Math.atan2(dy,dx);
    }
    // if(r<this.range) {
    //   this.inRange=true;
    // }
    // if(!this.inRange)return;
    this.shootTimer += dt;
    if(this.shootTimer>this.shootSpeed) {
      if(r>200||dy>-30) {
        this.shootTimer=0;
        this.shoot();
      } else {
        this.shootTimer = this.shootSpeed;
      }
      // if(r>this.range) {
      //   this.inRange=false;
      // }
    }
    var t = this.shootTimer/this.shootSpeed;
    t = t<.5 ? 2*t*t : -1+(4-2*t)*t;
    // t=t*2;
    // if(t>1)t=1;
    this.butcher.knifeAngle = 0 + t*Math.PI/2;
    this.butcher.angle = 0-Math.PI/20*t;
    if(this.shootTimer>=0 && this.game.collidesWithPlayer(this)) {
      var player = this.game.player;
      if(player.vy>0&&player.y<this.y) {
        this.shootTimer = -100;
        player.bounceOffEntity(this);
      }
    }
  }
  processPoint(point) {
    var x = point.x;
    var y = point.y;
    var player = this.game.player;
    var dx = player.x - x;
    var dy = player.y - y - player.h/2;
    var r = Math.sqrt(dx*dx+dy*dy);
    point.r = r;
    if(!this.min || r < this.min.r-30) {
      this.setTarget(x,y);
      this.min = point;
    }
  }
  setTarget(x,y) {
    y=y+30;
    this.targetX = x;
    this.targetY = y;
  }
  draw(canvas) {
    var t = this.shootTimer/this.shootSpeed;
    var s = 10+t*10;    
    // canvas.fillStyle = 'rgba(255,0,0,'+t+')';
    // canvas.fillRect(this.x-s,this.y-s,s*2,s*2);
    // this.butcher.draw(canvas);
    super.draw(canvas);
  }
  shoot() {
    SOUNDMAP.throw.play();
    var player = this.game.player;
    // var dx = player.x - this.x;
    // var dy = player.y - this.y - player.h/2 + this.h/2;
    var dx = this.dx;
    var dy = this.dy;
    if(this.restrictDirection) {
      if(Math.abs(dx)>Math.abs(dy)) dy = 0; else dx = 0;
      var r= Math.abs(dx+dy);
    } else {
      var r = Math.sqrt(dx*dx+dy*dy);
    }
    var speed = this.projectileSpeed
    var vx = dx/r*speed;
    var vy = dy/r*speed;
    var knife = new Knife(this.x,this.y-this.h/2, vx, vy);
    this.game.addEntity(knife);
  }
}