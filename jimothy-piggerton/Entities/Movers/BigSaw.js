class BigSaw extends Mover{
  constructor(x,y){
    super(x,y);
    //BigSaw reverses directions when it detects a solid block or specified non-solid blocks
    this.nonSolidCollisions = ["Byrd"]
    this.w = 70;
    this.h = 70;
    this.rotAngle = 0;
    this.rotSpeed = .25;
    this.mx = 1;
    this.killPlayer = true;
    this.grav = 0;
    this.speed = 6;
    this.isBigSaw = true;
  }   
  getHitByEntity(player) {
  }
  update(dt,frameCount){
    this.rotAngle = (frameCount*this.rotSpeed)%(Math.PI*2);
    if(this.wallcolliding == true) {
			this.mx = this.mx*-1;
		}
		super.update(dt, frameCount);       
		var enemyBox = this.getHitBox();	// Perforamnce effeciency issue
		var playerBox = this.game.player.getHitBox();
		if(rectangleCollision(enemyBox, playerBox) == true) {
      this.game.player.getHitByEntity(this);
		} 
  }

  draw(canvas){
    
    var w = this.w;
    var h = this.h;
    canvas.save();
    canvas.translate(this.x,this.y);
    canvas.rotate(this.rotAngle);
    canvas.lineWidth = 2;
    w=w*.9;
    h=h*.9;
    
    canvas.fillStyle="white";
    canvas.strokeStyle = "#000";
    for(var i=0;i<3;i++){
    canvas.rotate(Math.PI/8);
    canvas.fillRect(-w/2,-h/2,w,h);           
    canvas.strokeRect(-w/2,-h/2,w,h);
    }
    w=w*.8;
    h=h*.8;
    canvas.rotate(-3*Math.PI/8);
    canvas.fillStyle="grey";
    canvas.fillRect(-w/2,-h/2,w,h);   
    canvas.fillStyle='black';
    canvas.fillRect(-w/8,-h/8,w/4,h/4);   
    canvas.restore();
    
  }
  
  interactWithBlock(gridX,gridY){
    if(this.x < 0 || this.x >= this.game.world.w*this.game.world.s) 
      return true;
    if(gridX < 0 || gridX > CELLMAP.length)
      return true;
    var block = CELLMAP[this.game.world.world[gridY][gridX]];
    if(block.solid)
      return true;
    for(var i = 0; i < this.nonSolidCollisions.length; i++){
      if(block.name === this.nonSolidCollisions[i])
        return true;
    }
    return false;
  }
  getHitBox() {
    return {x:this.x-.5*this.w, y:this.y-.5*this.h, w:this.w, h:this.h};
  }
  
}