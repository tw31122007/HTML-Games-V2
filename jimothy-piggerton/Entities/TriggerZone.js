class TriggerZone{
  constructor(x,y,w,h,player,onEnter,onStay,onExit,drawDebug){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.drawDebug = drawDebug || false;
    this.player = player;
    this.previousOutputState = 0;
    this.outputState = 0;
    this.onEnter = onEnter;
    this.onStay = onStay;
    this.onExit = onExit;
  }
  update(dt){
    if(pointInRect(this.player.x,
      this.player.y,{x:this.x,y:this.y,w:this.w,h:this.h})){
      this.outputState = 1;
    } else {
      this.outputState = 0;
    }
    if(this.previousOutputState == 0 && this.outputState == 1){
      if(this.onEnter) this.onEnter();
    }
    else if(this.previousOutputState == 1 && this.outputState == 0){
      if(this.onExit) this.onExit();
    }
    else if(this.previousOutputState == 1 && this.outputState == 1){
      if(this.onStay) this.onStay();
    }
    this.previousOutputState = this.outputState;
  }
  draw(canvas){
    if(this.drawDebug){
      canvas.fillStyle = (this.outputState == 1) ? 'rgba(0,255,0,0.4)': 'rgba(255,0,0,.4)';
      canvas.fillRect(this.x,this.y,this.w,this.h);
    }
  }
}