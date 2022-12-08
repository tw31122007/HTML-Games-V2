class TextButton extends Button{
  constructor(x,y,w,h,groupID,onRelease,text,font, 
    textColor,rectBackFillColor,rectOutlineColor, strokeWidth){
    super(x,y,w,h,groupID,onRelease);
    this.text = text;
    this.font = font;
    //optional values below (transparent if not given)
    this.textColor = textColor || "rgba(0,0,0,0)";
    this.rectBackFillColor = rectBackFillColor || "rgba(0,0,0,0)";
    this.rectOutlineColor = rectOutlineColor || "rgba(0,0,0,0)";
    this.strokeWidth = strokeWidth || 1;
  }
  update(dt){}

  draw(canvas){

    var dim = this.getPixelDimensions(canvas);
    this.drawRectangle(canvas,dim);
    if(!touchOn){
      if(this.selected && !this.held)
        this.drawOutline(canvas,dim);
    } else {
      if(this.selected)
        this.drawOutline(canvas,dim);
    }
    
    this.drawText(canvas,dim);
    
  }
  drawOutline(canvas,dim){
    canvas.lineWidth = this.strokeWidth;
    canvas.strokeStyle = this.rectOutlineColor;
    canvas.strokeRect(dim[0],dim[1],dim[2],dim[3]);
  }
  drawRectangle(canvas,dim){
    canvas.fillStyle = this.rectBackFillColor;
    canvas.fillRect(dim[0],dim[1],dim[2],dim[3]);
  }
  drawText(canvas,dim){
    canvas.font=this.font;
    canvas.fillStyle = this.textColor;
    canvas.textAlign = 'center';
    canvas.textBaseline='middle';
    canvas.fillText(this.text,dim[0]+dim[2]/2,dim[1]+dim[3]/2,this.w*canvas.width*.8);
  }
  
}