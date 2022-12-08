class doubleJump extends Powerup {
  constructor(x,y) {
    super(x,y);
    this.w = 40;
    this.h = 40;
    this.color="black";
    this.jumpPower = 0;
    this.killPlayer = false;
    this.mx = 0;
    this.my = 0;
    this.power = 2;
    this.color1= "#000";
    this.angle = Math.PI/4;
  }
  givePlayerAbility(player, fake) {
    if(!fake&&player.maxJumps!=2) {
      player.powerUps.push(this.givePlayerAbility);
    }
    player.maxJumps = 2;
    player.jumpCount = 1;
  }
  canBeCollected() {
    var player = this.game.player;
    return player.maxJumps == 1 || player.jumpCount > 1;
  }
  drawShape(canvas,w,h) {
    canvas.strokeStyle = '#fff';
    canvas.lineWidth = 7;
    w=w*2;
    this.drawWings(canvas,w,h,1);
    this.drawWings(canvas,w,h);
  }
  pathWingAtAngle(canvas, x,y,w,h, px,py, angle) {
    var d = w/3;
    canvas.save();
    canvas.translate(x+px, y+py);
    canvas.rotate(angle);
    canvas.rect(-px,-py-10,w,h);
    canvas.rect(-px*.8-d,-py,w*.8+d,h);
    canvas.rect(-px*.5,-py+5,w*.5,h);
    canvas.restore();
  }
  drawWings(canvas, w,h,s) {
    var ww = w*.6;
    var hh = h/4;
    canvas.fillStyle = this.color1;
    canvas.beginPath();
    // canvas.rect(-w/2-ww/2,-h/2, ww,hh);
    // canvas.rect(w/2,-h/2, ww,hh);
    var angle = this.angle;
    var y = -h*.4-angle*10;
    // this.pathWingAtAngle(canvas, -w/2-ww/2,y, ww,hh, ww*.8, hh/2, angle);
    this.pathWingAtAngle(canvas,-w/2+ww/2,y, ww,hh, ww*.2, hh/2, -angle);
    if(s)canvas.stroke();
    else canvas.fill();
  }
}