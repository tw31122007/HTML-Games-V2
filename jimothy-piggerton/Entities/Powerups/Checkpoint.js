class Checkpoint extends Powerup {
  constructor(x,y) {
    super(x,y);
    this.w = 40;
    this.h = 40;
    this.color="red";
    this.flagOffset= 1;
  }
  canBeCollected() {
    return !this.isInCollision;
  }
  givePlayerAbility(player) {
    if(player.checkpoint)player.checkpoint.reset();
    player.setCheckpoint(this);
  }
  die() {
    this.on = false;
    // this.color = 'rgba(150,150,150,.5)';
    // this.game.driver.setTimeout(this.reset, 60);
  }
  reset() {
    this.on = true;
  }
  drawShape(canvas,w,h) {
    canvas.strokeStyle = "#000";
    canvas.lineWidth = 3;
    var poleWidth = w*.2;
    canvas.strokeRect(-poleWidth/2,-h,poleWidth,h);
    canvas.fillStyle = "#520";
    canvas.fillRect(-poleWidth/2,-h,poleWidth/2,h);
    canvas.fillStyle = "#731";
    canvas.fillRect(0,-h,poleWidth/2,h);
    canvas.beginPath();
    var flagHeight = h/2;
    canvas.fillStyle = this.color;
    canvas.moveTo(poleWidth/2, -h);
    canvas.lineTo(w/2*this.flagOffset, -h+flagHeight/2);
    canvas.lineTo(poleWidth/2, -h+flagHeight);
    canvas.stroke();
    canvas.fill();
  }
  update(dt, frameCount) {
    if(!this.on)return;
    var myBox = this.getHitBox();	// Perforamnce effeciency issue
    var player = this.game.player;
		var playerBox = player.getHitBox();
		if(rectangleCollision(myBox, playerBox)) {
      if(this.canBeCollected()) {
        this.die();
        this.onHitPlayer(player);
      }
      this.isInCollision = true;
    } else {
      this.isInCollision = false;
    }
    this.flagOffset= 1+Math.cos(frameCount*Math.PI/40)/4;
  }
}