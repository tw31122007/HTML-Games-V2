class Knife {
  constructor(x,y,vx,vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.w = 30;
    this.h = 30;
    this.angle = 0;
    this.killPlayer = true;
    this.da = -Math.PI/20;
    this.bouncable = false;    
    this.flipped = this.vx>0;
  }
  die() {
    this.shouldDelete = true;
  }
  update(dt,frameCount) {
    dt = dt/0.8;
    this.x += this.vx*dt;
    this.y += this.vy*dt;
    this.angle += this.da*dt;
    var world = this.game.world;
    var h = this.getHitBox();
    if(world.rectCollides(h.x, h.y, h.w, h.h, this, 0,0)) {
      // this.die();
      this.killPlayer = false;
      this.vx=0;
      this.vy=0;
      this.da = 0;
      setTimeout(() => this.die(), 1000);
    }
    if(this.game.collidesWithPlayer(this)) {
      this.onCollision(this.game.player);
    }
  }
  onCollision(player) {
    if(this.bouncable&&(player.y<this.y||player.vy>0)) {
      this.die();
      player.bounceOffEntity(this);
      // player.vy = -10;
    } else {
      this.game.player.getHitByEntity(this);
    }
  }
  draw(canvas) {
    canvas.save();
    canvas.translate(this.x,this.y);
    // canvas.fillStyle = 'red';
    // canvas.fillRect(-this.w/2,-this.h/2,this.w,this.h);
    if(this.flipped)canvas.scale(-1,1);
    canvas.rotate(this.angle);
    this.drawKnife(canvas, this.w,this.h);
    canvas.restore();
  }
  getHitBox() {
    return {
      x: this.x - this.w/2,
      y: this.y - this.h/2,
      w: this.w,
      h: this.h,
    };
  }
  drawKnife(canvas,w,h) {
    var bladew = 18;
    var bladeh = 23;
    var handlew = 5;
    var handleh = 10;
    var holer = 3;
    canvas.strokeStyle = "#000";
    canvas.lineWidth = 7;
    canvas.save();
    canvas.translate(w/8,h/8);
    // if(this.vx>0)
    // canvas.scale(-1,1);
    // canvas.rotate(-Math.PI/5);
    canvas.lineWidth = 3;    
    canvas.beginPath();
    canvas.fillStyle = "#a33";
    canvas.rect(-handlew, 0, handlew, handleh);
    canvas.stroke();
    canvas.fill();
    canvas.fillStyle = "#822";
    canvas.fillRect(-handlew, 0, handlew/2, handleh);    
    canvas.fillStyle = "#eee";
    canvas.beginPath();
    canvas.rect(-bladew,-bladeh,bladew,bladeh);
    canvas.stroke();    
    canvas.fill();
    canvas.fillStyle="#fff";
    canvas.fillRect(-bladew,-bladeh,bladew/4,bladeh);
    canvas.beginPath();
    canvas.fillStyle="#000";
    canvas.arc(-holer*1.5, -bladeh+holer*1.5, holer, 0, Math.PI*2);
    canvas.fill();
    canvas.restore();
  }
}