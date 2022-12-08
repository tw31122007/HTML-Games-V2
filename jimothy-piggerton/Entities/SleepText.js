class SleepText extends MovingWorldText{
  constructor(x,y,w,dx,dy,text,fontSize,fontType,inactiveColor,activeColor,
    changeDuration,initialDelay,isVisible){
    super(x,y,w,dx,dy,text,""+fontSize + "px " + fontType,inactiveColor,activeColor,changeDuration,initialDelay,isVisible);
    this.fontSize = fontSize;
    this.fontType = fontType;
    this.fontTimer = this.changeDuration;
  }
  update(dt){

    super.update(dt);
    if(this.initialDelay > 0)
      return;
    this.fontTimer -= dt;
  }
  draw(canvas){
    canvas.save();
    canvas.textAlign = 'center';
    var fillColor = colorLerp(this.inactiveColor,this.activeColor,this.colorTimer*1.0/this.changeDuration);
    canvas.globalAlpha = this.colorTimer*1.0/this.changeDuration;
    fillColor[3] = 1;
    canvas.fillStyle = makeColorStr(fillColor);
    var size = constrain((this.fontTimer*1.0/this.changeDuration)*this.fontSize,0,this.fontSize);
    canvas.font = ""+size + "px " + this.fontType;
    canvas.fillText(this.text,this.x,this.y,this.w);
    canvas.restore();
  }
}