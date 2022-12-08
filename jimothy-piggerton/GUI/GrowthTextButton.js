class GrowthTextButton extends TextButton{
  constructor(x,y,w,h,groupID,onRelease,text,font, 
    textColor,rectBackFillColor,rectOutlineColor, strokeWidth,growthAmount){
      super(x,y,w,h,groupID,onRelease,text,font,textColor,rectBackFillColor,rectOutlineColor,strokeWidth);
      this.growthMax = growthAmount;
      this.maxWidth = this.w+this.growthMax;
      this.growthSpeed = 0.2;
      this.extraWidth = 0;
  }
  update(dt){
    if(this.selected){
      this.extraWidth += this.growthSpeed*dt*(this.growthMax-this.extraWidth);
      if(this.extraWidth>this.growthMax)
        this.extraWidth = this.growthMax;
    } else {
      this.extraWidth -= this.growthSpeed*dt*(this.extraWidth);
      if(this.extraWidth < 0)
        this.extraWidth = 0;
    }
  } 
  draw(canvas){

    var dim = this.getPixelDimensions(canvas);
    dim[2] += this.extraWidth*canvas.width;   //modify width
    dim[0] -= this.extraWidth*canvas.width/2; //move top left point to the left to account for increased width
    this.drawRectangle(canvas,dim);
    if(this.selected && !this.held)
      this.drawOutline(canvas,dim);
    dim = this.getPixelDimensions(canvas);
    this.drawText(canvas,dim);
  }
}