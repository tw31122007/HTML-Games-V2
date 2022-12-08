class KingByrd extends Byrd{
  constructor(x,y) {
    super(x,y);
    this.shootSpeed = 50;
    this.shootTimer = 0;
    this.projectileSpeed = 6;
    this.restrictDirection = false;
    //this.kingByrd = new Byrd(x,y+30);
    this.inRange = false;
    this.range = 300;
    this.targetX = x;
    this.targetY = y;
    this.kingByrd = this;
  }
  update(dt,frameCount) {
    this.speed = this.game.player.speed;
    if(this.shootTimer>-5) {
      // this.x += (this.targetX - this.x) /20;
      // this.y += (this.targetY - this.y) /20;
      this.x = linearMove(this.x,this.targetX,this.speed);
      this.y = linearMove(this.y,this.targetY,this.speed);
    }
    var player = this.game.player;
    var dx = player.x - this.x;
    var dy = player.y - this.y - player.h/2;
    if(this.shootTimer>=0) {
    this.kingByrd.flipped = dx<0;
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
    this.shootTimer += 1;
    if(this.shootTimer>this.shootSpeed) {
      this.shootTimer=0;
      this.shoot();
      // if(r>this.range) {
      //   this.inRange=false;
      // }
    }
    var t = this.shootTimer/this.shootSpeed;
    t = t<.5 ? 2*t*t : -1+(4-2*t)*t;
    // t=t*2;
    // if(t>1)t=1;
   // this.butcher.knifeAngle = 0 + t*Math.PI/2;
    //this.butcher.angle = 0-Math.PI/20*t;
    if(this.shootTimer>=0 && this.game.collidesWithPlayer(this)) {
      var player = this.game.player;
      if(player.vy>0&&player.y<this.y) {
        //this.shootTimer = -100;
        player.bounceOffEntity(this);
      }
    }
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
    /*
    var player = this.game.player;
    var dx = player.x - this.x;
    var dy = player.y - this.y - player.h/2 + this.h/2;
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
    */
  }
}