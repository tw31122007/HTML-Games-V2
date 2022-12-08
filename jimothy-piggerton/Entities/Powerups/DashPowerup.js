class DashPowerup extends Powerup {
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
    this.power = 3;
    this.color1 = "#aaa";
    this.color2 = "#888";
    this.color3 = "#666";
    this.hitBoxScalar *= 1.2;
  }
  givePlayerAbility(player, fake) {
    if(!player.canDash&&!fake) {
      player.powerUps.push(this.givePlayerAbility);
    }
    player.canDash = true;
    player.dashCount = 0;
  }
  canBeCollected() {
    var player = this.game.player;
    return !player.canDash || player.dashCount > 0;
  }
  drawShape(canvas,w,h) {
    // canvas.translate(0,-h/2);
    // canvas.rotate(this.angle);
    // canvas.translate(0,h/2);    
    canvas.strokeStyle = "#fff";
    canvas.lineWidth = 7;
    this.drawTag(canvas,w,h,1);
    this.drawTag(canvas,w,h);
  }
  drawTag(canvas, w,h,s) {
    h=h*1;
    var w = w*.6;
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
    var dh = h/6;
    var sd = w/8;
    // canvas.doRect(-w/2-d,-h,w+d*2,dh);            
    canvas.doRect(-sd,-h+dh/2,sd*2,dh);      
    canvas.fillStyle = "#fff";
    canvas.doRect(w*0.2,-h*0.8,w*0.15,h*0.35);    
  }
}