class Label extends GUIElement{
  constructor(x,y,width,height,groupID
    ,text,font,textColor,textAlign){
    super(x,y,width,height,groupID);
    super.setOptions(false,false,true);
    this.text = text;
    this.font = font;
    this.textColor = textColor;
    this.textAlign = textAlign;
    this.visible = true;
  }
  update(dt){}
  draw(canvas){
    var dim = this.getPixelDimensions(canvas);
    this.drawText(canvas,dim);
  }
  drawText(canvas,dim){
    canvas.font=this.font;
    canvas.fillStyle = this.textColor;
    canvas.textAlign = this.textAlign;
    canvas.textBaseline='middle';
    switch(this.textAlign){
      case 'left':
        canvas.fillText(this.text,dim[0],dim[1]+dim[3]/2,this.w*canvas.width*.9);  
        break;
      case 'right':
        canvas.fillText(this.text,dim[0]+dim[2],dim[1]+dim[3]/2,this.w*canvas.width*.9);  
        break;
      case 'center':
        canvas.fillText(this.text,dim[0]+dim[2]/2,dim[1]+dim[3]/2,this.w*canvas.width*.9);  
        break;
    }
  }
  setOptions(interactable,selectable,visible){
    //Interactable and selectable should never be true
    //But calling setOptions with 3 parameters like buttons should be possible
    super.setOptions(false,false,visible);
  }
}