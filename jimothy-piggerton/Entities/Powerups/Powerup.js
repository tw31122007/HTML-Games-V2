class Powerup {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.w = 70;
    this.h = 70;
    this.color="black";
    this.jumpPower = 10;
    this.killPlayer = false;
    this.mx = 0;
    this.my = 0;
    this.power = 0;
    this.startY = this.y;
    this.reset = this.reset.bind(this);
    this.on = true;
    this.offset=0;
    this.hitBoxScalar = 1.5;
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
    if(this.on) {
      this.offset = Math.cos(frameCount*Math.PI/20)*2;
    } else {
      this.offset=0;
    }
  }
  canBeCollected() {
    return true;
  }
  draw(canvas) {
    canvas.save();
    if(!this.on)canvas.globalAlpha = 0.5;
    canvas.translate(this.x,this.y);
    // canvas.translate(-this.w/2,-this.h/2);
    canvas.translate(0,this.offset);
    this.drawShape(canvas,this.w,this.h);
    canvas.restore();
    if(drawHitbox) {
      var box = this.getHitBox();
      canvas.strokeStyle = "rgba(200,100,100,0.5)";
      canvas.strokeRect(box.x,box.y,box.w,box.h);
    }
  }
  drawShape(canvas,w,h) {
    canvas.fillStyle = this.color;
    canvas.fillRect(-w/2, -h, w, h);
  }
  givePlayerAbility(player) {
    // PLAYER_ABILITIES[this.power](player);
  }
  onHitPlayer(player) {
    this.givePlayerAbility(player);
    SOUNDMAP.powerup.play();
    player.game.screenShakeLevel = 0.4;
    player.game.frameStop = 2;
    if(particles.powerup.enabled)
    for(var i=0;i<10;i++) {
      var x = this.x;// + (Math.random()*this.w-this.w/2)/2;
      var y = this.y;// - (Math.random()*this.h)/4;
      var w = 10;
      var h = 10;
      var vx = Math.random()*5-2;
      var vy = Math.random()*5-2-10;
      var color = this.color1;
      // if(i>=num-8) color = "#222";
      // if(i>=num-4) color = "#33d"
      // if(i>=num-2) color = "#fff"; 
      this.game.addEntity(new FallingParticle(x,y,w,h,vx,vy,30,color));
    }
  }

  getHitBox() {
    var s = this.hitBoxScalar;
    return {x:this.x-.5*this.w*s, y:this.y-this.h*(1+s)/2, w:this.w*s, h:this.h*s};
  }
  reset() {
    this.on = true;
    this.color = 'black';
  }

  die() {
    this.on = false;
    this.color = 'rgba(150,150,150,.5)';
    this.game.driver.setTimeout(this.reset, 60);
  }
}