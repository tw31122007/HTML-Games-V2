class ButcherTurretPoint {
  constructor(x,y) {
    this.x=x;
    this.y=y;
    this.w = 20;
    this.h=20;
    this.update = this.update1;
    this.range = 300;
  }
  update1() {
    var butcher = this.game.butcher;
    if(!butcher) {
      butcher = new ButcherTurret(this.x,this.y);
      this.game.addEntity(butcher);
      this.game.butcher= butcher;
    }
    this.butcher = butcher;
    this.update=this.update2;
  }
  update2(dt,frameCount) {
    return this.butcher.processPoint(this);
    var player = this.game.player;
    var dx = player.x - this.x;
    var dy = player.y - this.y - player.h/2;
    var r = Math.sqrt(dx*dx+dy*dy);
    if(r<this.range) {
      this.inRange=true;
      this.butcher.setTarget(this.x,this.y);
    }
    // if(!this.inRange)return;
    // if(this.shootTimer>this.shootSpeed) {
    //   this.shootTimer=0;
    //   this.shoot();
    //   if(r>this.range) {
    //     this.inRange=false;
    //   }
    // }
    // var t = this.shootTimer/this.shootSpeed;
    // t = t<.5 ? 2*t*t : -1+(4-2*t)*t;
    // // t=t*2;
    // // if(t>1)t=1;
    // this.butcher.knifeAngle = 0 + t*Math.PI/2;
    // this.butcher.angle = 0-Math.PI/20*t;
  }
  draw(canvas) {
    canvas.fillStyle = '#000';
    canvas.fillRect(this.x-this.w/2,this.y-this.h/2,this.w,this.h);
  }
}