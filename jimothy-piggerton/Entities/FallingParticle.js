class FallingParticle {
  constructor(x,y,w,h,vx,vy,life,color,da) {
    this.x=x;this.y=y;this.w=w;this.h=h;this.vx=vx;this.vy=vy;
    this.life = life||10;
    this.maxlife = this.life;
    this.color = color||"rgba(200,200,200,.4)";
    this.da = Math.PI/20;
    this.angle = 0;
  }
  update(dt) {
    dt = 1 + (dt/0.8-1) / 2;
    this.life--;
    if(this.life<=0) {
      this.shouldDelete = true;
      return;
    }
    this.x+=this.vx*dt;
    this.y+=this.vy*dt;
    this.angle += this.da;
    this.vy += .5*dt;
  }
  draw(canvas) {
    canvas.save();
    canvas.fillStyle = this.color;
    var w = this.w;// + (this.maxlife-this.life);
    var h = w;
    canvas.translate(this.x,this.y);
    canvas.rotate(this.angle);
    canvas.fillRect(-w/2,-h/2,w,h);
    canvas.restore();
  }
}