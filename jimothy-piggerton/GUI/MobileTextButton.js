class MobileTextButton extends TextButton{

  constructor(x,y,w,h,groupID,onRelease,text,font, 
    textColor,rectBackFillColor,rectOutlineColor, strokeWidth, 
    selectedTextColor,selectedBackFillColor,selectedOutlineColor){
      super(x,y,w,h,groupID,onRelease,text,font, 
        textColor,rectBackFillColor,rectOutlineColor, strokeWidth);
      this.selectedTextColor = selectedTextColor;
      this.selectedBackFillColor = selectedBackFillColor;
      this.selectedOutlineColor = selectedOutlineColor;
    }

  update(dt){}

  draw(canvas){

    var dim = this.getPixelDimensions(canvas);
    this.drawRectangle(canvas,dim);
    this.drawOutline(canvas,dim);
    
    this.drawText(canvas,dim);
    
  }
  drawOutline(canvas,dim){
    canvas.lineWidth = this.strokeWidth;
    if(this.selected)
      canvas.strokeStyle = this.selectedOutlineColor;
    else
      canvas.strokeStyle = this.rectOutlineColor;
    canvas.strokeRect(dim[0],dim[1],dim[2],dim[3]);
  }
  drawRectangle(canvas,dim){
    if(this.selected)
      canvas.fillStyle = this.selectedBackFillColor;
    else
      canvas.fillStyle = this.rectBackFillColor;
    canvas.fillRect(dim[0],dim[1],dim[2],dim[3]);
  }
  drawText(canvas,dim){
    canvas.font=this.font;
    if(this.selected)
      canvas.fillStyle = this.selectedTextColor;
    else
      canvas.fillStyle = this.textColor;
    canvas.textAlign = 'center';
    canvas.textBaseline='middle';
    canvas.fillText(this.text,dim[0]+dim[2]/2,dim[1]+dim[3]/2,this.w*canvas.width*.8);
  }

}