class Brazier {
  constructor(x,y) {
    this.x=x;
    this.y=y;
    this.w = 40;
    this.h = 40;
    this.flameSpeed = 15;
    this.secondFlameSpeed = 10;
    this.flameTimer = this.flameSpeed;
    this.secondFlameTimer = this.secondFlameSpeed;
    this.fireTime = 0;
    this.fireChangeSpeed = 15;
    this.fireSeed = 0;
    this.killPlayer = true;
    this.color2 = "#f00";
    this.color3 = "#fa0";
  }
  update(dt,frameCount) {
    this.flameTimer += 1;
    if(this.flameTimer>this.flameSpeed) {
      this.flameTimer=Math.floor(5 * Math.random());
      this.makeFlame();
    }
    this.secondFlameTimer += 1;
    if(this.secondFlameTimer>this.secondFlameSpeed) {
      this.secondFlameTimer=Math.floor(5 * Math.random());
      this.makeFlame();
    }

    this.fireTime++;
    if (this.fireTime >= this.fireChangeSpeed)
    {
      this.fireTime = 0;
      this.fireSeed++;
      var val = Math.floor(255 * Math.random());
    // var val = *this.life/this.maxlife;
    this.color2 = "rgb(255,"+val+",0)";

    val = Math.floor(255 * Math.random());
    // var val = *this.life/this.maxlife;
    this.color3 = "rgb(255,"+val+",0)";

    }
  
    var enemyBox = this.getHitBox();	// Perforamnce effeciency issue
		var playerBox = this.game.player.getHitBox();
		if(rectangleCollision(enemyBox, playerBox) == true) {
      this.game.player.getHitByEntity(this);
    }
  }

  getHitBox() {
    var scalar = 0.8;
    var w = this.w*scalar;
    var h = this.h*scalar/2;
    return {x:this.x-.5*w, y:this.y-h, w:w, h:h};
  }

  draw(canvas) {
    var w = this.w;
    var h = this.h;
    var x = this.x - this.w/2;
    var y = this.y - this.h;
    

    var s = Math.max(w,h);
    var ww = s/3;
    var hh = ww;
    var spacing = 3;
    

    canvas.fillStyle=this.color2;
    for(var ii=0;ii<10;ii++) {
        var r1 = psuedoRandom(x,y,ii,this.fireSeed+1);
        var r2 = psuedoRandom(x,y,ii,this.fireSeed+2);
        var xx = Math.floor(r1*(w-ww)/spacing) * spacing;
        var yy = Math.floor(r2*(h-hh)/spacing) * spacing;
        canvas.fillRect(xx+x,yy+y,ww,hh);
    }

    canvas.fillStyle=this.color3;
    for(var ii=0;ii<10;ii++) {
        var r1 = psuedoRandom(x,y,ii,this.fireSeed+3);
        var r2 = psuedoRandom(x,y,ii,this.fireSeed+4);
        var xx = Math.floor(r1*(w-ww)/spacing) * spacing;
        var yy = Math.floor(r2*(h-hh)/spacing) * spacing;
        canvas.fillRect(xx+x,yy+y,ww,hh);
    }
    if(drawHitbox) {
      var box = this.getHitBox();
      canvas.strokeStyle = "rgba(200,100,100,0.5)";
      canvas.strokeRect(box.x,box.y,box.w,box.h);
    }
  }
  makeFlame() {
    var spawnX = (this.x - this.w /2) + Math.random() * this.w;
    var spawnY = (this.y) - Math.random() * this.h;
    var flame = new Flame(spawnX, spawnY, 30, 30, 0, -1, 75);
    this.game.addEntity(flame);
  }
}