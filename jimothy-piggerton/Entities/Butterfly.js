class Butterfly {
	constructor(x,y,i,j,type) {
    this.x = x;
    this.y = y;
		this.w = 2;
		this.h = 15;
		this.height = this.h;
		this.width = this.w; 
    this.color = "#000";
    this.color2 = "#17d";
    this.color3 = "#17d";
    this.color4 = "#17d";
    if(type==3) {
      this.color2 = "#e99";
      this.color3 = "#fff";
      this.color4 = "#eee";
    }
    this.angle = 0;
    this.timeFromCollision = 0;
    this._angle = Math.PI/3;
    this.i=i;
    this.j=j-1;
    this.vx = 0;
    this.vy = 0;
    this.startX = x;
    this.startY = y;
    this.flapTime = 0;
    this.flipped = Math.random()>.5;
	}

	update(dt, frameCount) {
    this.x += this.vx;
    this.y += this.vy;
    // var tvx = (Math.random()*2-1) * 4;
    // var tvy = (Math.random()*2-1) * 4;
    // this.vx += (tvx - this.vx)/10;
    // this.vy += (tvy - this.vy)/10;
    this.vx += (Math.random()-0.5)/10;
    this.vy += (Math.random()-0.5)/10;
    var max = 0.5;
    if(this.vx>max)this.vx=max;
    if(this.vx<-max)this.vx=-max;
    if(this.vy>max)this.vy=max;
    if(this.vy<-max)this.vy=-max;

    // this.flapTime += this.vy*5;//Math.abs(this.vx) + Math.abs(this.vy);
    this.flapTime += (this.startY-this.y)/40;
    this.flap = Math.abs(Math.sin(this.flapTime/10));
    this.angle += (this.vx/10 - this.angle)/10;
    if(this.y>this.startY) {
      this.y=this.startY;
      this.vy = 0;
    }
    if(this.y<this.startY-60) {
      this.y=this.startY-60;
      this.vy*=0.8;
    }
    var bxr = this.startX + 15;
    if(this.x>bxr) {
      this.x = bxr;
      this.vx = 0;
    }
    var bxl = this.startX - 15;
    if(this.x<bxl) {
      this.x = bxl;
      this.vx = 0;
    }

    this.angle = this.vy;
	}
  draw(canvas) {
    var h = this.height;
    var w = this.width;
    canvas.save();
    canvas.translate(this.x,this.y);
    if(this.flipped) {
      canvas.scale(-1,1);
    }
    canvas.rotate(this.angle+this._angle);
    this.drawShape(canvas,w,h);
    canvas.restore();
  }
  drawShape(canvas,w,h) {
    canvas.fillStyle = this.color;    
    // canvas.strokeStyle = 'black';
    // canvas.lineWidth = 1;    
    // canvas.strokeRect(-w/2,-h, w,h);
    canvas.fillRect(0,-h, w,h);

    var w2 = this.w * 10 * this.flap;
    canvas.fillStyle = this.color3;  
    canvas.strokeStyle = this.color4;  
    canvas.lineWidth = 2;
    canvas.fillRect(-w2/2,-h, w2/4,h*.6);
    canvas.strokeRect(-w2/2,-h, w2/4,h*.6);
    w2*=.8;
    canvas.fillRect(-w2/2,-h*.9, w2/2,h*.8);
    canvas.strokeRect(-w2/2,-h*.9, w2/2,h*.8);
    canvas.fillStyle = this.color2;  
    canvas.strokeStyle = this.color2;  
    w2*=.8;
    canvas.fillRect(-w2/2,-h*.8, w2/2*.6,h*.3);
    canvas.fillRect(-w2/2*.7,-h*.38, w2/2*.4,h*.2);
    // canvas.strokeRect(-w2/2,-h*.9, w2/2*.5,h*.4);

  }
}