class WorldText{
  constructor(x,y,w,text,font,inactiveColor,activeColor,
    changeDuration,isVisible,textAlign){
    this.x = x;
    this.y = y;
    this.w = w;
    this.text = text;
    this.font = font;
    this.inactiveColor = inactiveColor;
    this.activeColor = activeColor;
    this.changeDuration = changeDuration;
    this.colorTimer = (isVisible) ? this.changeDuration : 0;
    this.visible = isVisible || false;
    this.textAlign = textAlign || "center";
    this.dim = rectDimFromCenter(this.x,this.y,this.w,0);

    var fillColor = colorLerp(this.inactiveColor,this.activeColor,this.colorTimer*1.0/this.changeDuration);
    fillColor[3] = 1;
    this.color = makeColorStr(fillColor);
  }
  update(dt){
    if(this.visible){
      this.colorTimer += dt;
      if(this.colorTimer > this.changeDuration)
        this.colorTimer = this.changeDuration;
    } else {
      this.colorTimer -= dt;
      if(this.colorTimer < 0)
        this.colorTimer = 0;
    } 
    // this.dim = rectDimFromCenter(this.x,this.y,this.w,0);
  }
  setVisible(x){
    this.visible = x;
  }
  appear(){
    this.visible = true;
  }
  disappear(){
    this.visible = false;
  }
  draw(canvas){
    canvas.save();
    // var fillColor = colorLerp(this.inactiveColor,this.activeColor,this.colorTimer*1.0/this.changeDuration);
    canvas.globalAlpha = this.colorTimer*1.0/this.changeDuration;
    canvas.fillStyle = this.color;
    canvas.font = this.font;
    canvas.textAlign = this.textAlign;
    canvas.textBaseline='middle';
    var dim = this.dim;
    switch(this.textAlign){
      case 'left':
        canvas.fillText(this.text,dim[0],dim[1]+dim[3]/2,this.w);  
        break;
      case 'right':
        canvas.fillText(this.text,dim[0]+dim[2],dim[1]+dim[3]/2,this.w);  
        break;
      case 'center':
        canvas.fillText(this.text,dim[0]+dim[2]/2,dim[1]+dim[3]/2,this.w);  
        break;
    }
    canvas.restore();
  }

}