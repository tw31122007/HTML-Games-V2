class MovingWorldText extends WorldText{
  constructor(x,y,w,dx,dy,text,font,inactiveColor,activeColor,
    changeDuration,initialDelay,isVisible){
    super(x,y,w,text,font,inactiveColor,activeColor,changeDuration,isVisible);
    this.dx = dx;
    this.dy = dy;
    this.initialDelay = initialDelay;
    this.lifeTime = this.initialDelay + changeDuration;
  }
  update(dt){
    this.lifeTime -= dt;
    if(this.lifeTime <0){
      this.die();
    }
    this.x += this.dx*dt;
    this.y += this.dy*dt;
    if(this.initialDelay > 0){
      this.initialDelay -= dt;
      return;
    } 
    this.disappear();
    super.update(dt);

  }
  draw(canvas){
    super.draw(canvas);
  }
  die(){
    this.shouldDelete = true;
  }
}