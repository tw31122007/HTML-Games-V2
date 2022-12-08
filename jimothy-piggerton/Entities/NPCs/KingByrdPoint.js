class KingByrdPoint {
  constructor(x,y) {
    this.x=x;
    this.y=y;
    this.w = 20;
    this.h=20;
    this.update = this.update1;
    this.range = 200;
  }
  update1() {
    var kingByrd = this.game.kingByrd;
    if(!kingByrd) {
      kingByrd = new KingByrd(this.x,this.y);
      this.game.addEntity(kingByrd);
      this.game.kingByrd= kingByrd;
    }
    this.kingByrd = kingByrd;
    this.update=this.update2;
  }
  update2(dt,frameCount) {
    var kingByrd = this.game.kingByrd;
    if(!kingByrd) {
      kingByrd = new KingByrd(this.x,this.y);
      this.game.addEntity(kingByrd);
      this.game.kingByrd= kingByrd;
    }
    this.kingByrd = kingByrd;
    var player = this.game.player;
    var dx = player.x - this.x;
    var dy = player.y - this.y - player.h/2;
    var r = Math.sqrt(dx*dx+dy*dy);
    if(r<this.range) {
      this.inRange=true;
      this.kingByrd.targetX = this.x;
      this.kingByrd.targetY = this.y+30;
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