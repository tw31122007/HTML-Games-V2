class ExpandingMobileButton extends TextButton{

  constructor(x,y,w,h,groupID,onRelease,text,font,fontSize,largerFontSize, 
    textColor,rectBackFillColor,rectOutlineColor, strokeWidth, 
    expandFactor){
      super(x,y,w,h,groupID,onRelease,text,font, 
        textColor,rectBackFillColor,rectOutlineColor, strokeWidth);
      this.expandFactor = expandFactor;
      this.expandValue = (this.selected) ? this.expandFactor: 0;
      this.speedFactor = .55;
      this.originalDim = [x,y,w,h];
      this.center = {x:x+w/2,y:y+h/2};
      this.fontSize = fontSize;
      this.largerFontSize = largerFontSize;
      
  }  
  update(dt){
    if(this.selected){
      this.expandValue += this.speedFactor*dt*(this.expandFactor-this.expandValue);
    } else {
      this.expandValue -= this.speedFactor*dt*(this.expandValue);
    }
    this.expandValue = constrain(this.expandValue,0,this.expandFactor);
  }
  draw(canvas){

    var dim = [0,0,0,0];
    dim[2] = this.originalDim[2]*(1+this.expandValue);
    //dim[3] = this.originalDim[3]*(1+this.expandValue);
    dim[3] = this.originalDim[3]
    dim[0] = (this.center.x-dim[2]/2);
    //dim[1] = (this.center.y-dim[3]/2);
    dim[1] = this.originalDim[1];

    dim[0]*=canvas.width;
    dim[1]*=canvas.height;
    dim[2]*=canvas.width;
    dim[3]*=canvas.height;
    this.drawRectangle(canvas,dim);
    this.drawOutline(canvas,dim);
    
    this.drawText(canvas,dim);
    
  }
 
  drawText(canvas,dim){
    canvas.fillStyle = this.textColor;

    if(this.selected){
      canvas.font = this.largerFontSize + " " + this.font;
    }
    else{
      canvas.font = this.fontSize + " " + this.font;
    }
    canvas.textAlign = 'center';
    canvas.textBaseline='middle';
    canvas.fillText(this.text,dim[0]+dim[2]/2,dim[1]+dim[3]/2,this.w*canvas.width*.8);
  }
}