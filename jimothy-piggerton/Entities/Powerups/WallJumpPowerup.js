class wallJump extends Powerup {
  constructor(x,y) {
    var h = 30;
    super(x,y+h);
    this.w = 30;
    this.h = h;
    this.color="black";
    this.jumpPower = 0;
    this.killPlayer = false;
    this.mx = 0;
    this.my = 0;
    this.power = 1;
    this.color1 = "#741";
    this.color2 = "#520";
    this.color3 = "#411";
  }
  givePlayerAbility(player, fake) {
    if(!fake&&!player.wallJumps) {
      player.powerUps.push(this.givePlayerAbility);
    }
    player.wallJumps = true;
  }
  drawShape(canvas,w,h) {
    // canvas.translate(0,-h/2);
    // canvas.rotate(this.angle);
    // canvas.translate(0,h/2);    
    canvas.strokeStyle = "#fff";
    canvas.lineWidth = 7;
    this.drawAcorn(canvas,w,h,1);
    this.drawAcorn(canvas,w,h);
  }
  drawAcorn(canvas, w,h,s) {
    h=h*1;
    var w2 = w*.8;
    var h2 = h*1.2;
    canvas.doRect = s? canvas.strokeRect : canvas.fillRect;
    canvas.fillStyle = this.color1;
    canvas.doRect(-w/2,-h,w,h);
    // canvas.fillRect(-w2/2,-h,w2,h2);
    canvas.fillStyle = this.color2;   
    canvas.doRect(-w/2,-h,w/2,h);   
    // canvas.fillRect(-w2/2,-h,w2/2,h2);   
    canvas.fillStyle = this.color3;   
    var d = w/10; 
    var dh = h/3;
    var sd = w/8;
    canvas.doRect(-w/2-d,-h,w+d*2,dh);            
    canvas.doRect(-sd,-h-dh,sd*2,dh);      
    canvas.fillStyle = "#fff";
    canvas.doRect(-w*0.1,-h*0.6,w*0.5,h*0.15);    
  }
  die() {
    this.shouldDelete = true;
  }
}