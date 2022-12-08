class KnifeTurret {
  constructor(x,y) {
    this.x=x;
    this.y=y;
    this.shootSpeed = 50;
    this.shootTimer = this.shootSpeed;
    this.projectileSpeed = 6;
    this.restrictDirection = false;
    this.butcher = new ButcherTurret(x,y+30);
    this.dx = 1;
    this.dy = 0;
  }
  update(dt,frameCount) {
    var player = this.game.player;
    var dx = player.x - this.x;
    var dy = player.y - this.y - player.h/2;
    var r = Math.sqrt(dx*dx+dy*dy);
    if(this.shootTimer > this.shootSpeed/10 && this.shootTimer < this.shootSpeed/5) {      
      this.butcher.flipped = dx<0;
      if(this.restrictDirection) {
        if(Math.abs(dx)>Math.abs(dy)) dy = 0; else dx = 0;
        this.angle = Math.atan2(dy,dx);
      }
      this.dx = dx/r;
      this.dy=dy/r;
    }
    if(r>700) {
      this.shootTimer = this.shootSpeed;
      // this.shootTimer = 0;
      return;
    }
    this.shootTimer += 1;
    if(this.shootTimer>this.shootSpeed) {
      this.shootTimer=0;
      this.shoot();
    }
    var t = this.shootTimer/this.shootSpeed;
    t = t<.5 ? 2*t*t : -1+(4-2*t)*t;
    // t=t*2;
    // if(t>1)t=1;
    this.butcher.knifeAngle = 0 + t*Math.PI/2;
    this.butcher.angle = 0-Math.PI/10*t;
    if(this.butcher.flipped)this.butcher.angle *= -1;
    // if(this.shootTimer>=0 && this.game.collidesWithPlayer(this)) {
    //   var player = this.game.player;
    //   if(player.vy>0&&player.y<this.y) {
    //     this.shootTimer = -100;
    //     player.bounceOffEntity(this);
    //   }
    // }
  }
  draw(canvas) {
    var t = this.shootTimer/this.shootSpeed;
    // var s = 10+t*10;    
    // canvas.fillStyle = 'rgba(255,0,0,'+t+')';
    // canvas.fillRect(this.x-s,this.y-s,s*2,s*2);
    // canvas.save();
    // canvas.translate(this.x,this.y);
    // canvas.rotate(this.angle);
    // var h = s/2;
    // canvas.fillRect(-s/2,-h,s*2,h*2);
    // canvas.restore();
    this.butcher.draw(canvas);
  }
  shoot() {
    SOUNDMAP.throw.play();
    
    var player = this.game.player;
    var speed = this.projectileSpeed
    var vx = this.dx*speed;
    var vy = this.dy*speed;
    var knife = new Knife(this.x,this.y, vx, vy);
    this.game.addEntity(knife);
  }
}