class Cloud {
  constructor(x,y,w,h,vx,vy,life,color) {
    this.x=x;this.y=y;this.w=w;this.h=h;this.vx=vx;this.vy=vy;
    this.life = life||10;
    this.maxlife = this.life;
    this.color = color||"rgba(200,200,200,1)";
    this.behind = true;
  }
  update() {
    this.life--;
    if(this.life<=0) {
      this.shouldDelete = true;
      return;
    }
    this.x+=this.vx;
    this.y+=this.vy;
    var val = Math.floor(100+155 * this.life/this.maxlife);
    // var val = *this.life/this.maxlife;
    this.color = "rgb("+val+","+val+","+val+")";
  }
  draw(canvas) {
    canvas.save();
    canvas.fillStyle = this.color;
    // canvas.globalAlpha = this.life/this.maxlife;
    var w = this.w + (this.maxlife-this.life);
    var h = w;
    canvas.translate(this.x,this.y);
    var d = w/5;
    if(this.life<5) {
      canvas.fillRect(-w/2+d,-h,w-d*2,h/4);
      canvas.fillRect(-w/2+d,-h/4,w-d*2,h/4);
      canvas.fillRect(-w/2,-h+d,w/4,h-d*2);
      canvas.fillRect(w/4,-h+d,w/4,h-d*2);
    } else {
      canvas.fillRect(-w/2+d,-h,w-d*2,h);
      canvas.fillRect(-w/2,-h+d,w,h-d*2);      
    }
    canvas.restore();
  }
}