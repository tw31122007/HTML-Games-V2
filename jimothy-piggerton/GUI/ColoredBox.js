class ColoredBox extends GUIElement{
  constructor(x,y,w,h,groupID,fillColor,outlineColor,lineWidth){
    super(x,y,w,h,groupID);
    this.fillColor = fillColor || 'transparent';
    this.outlineColor = outlineColor || 'transparent';
    this.lineWidth = lineWidth
  }
  update(dt){}
  draw(canvas){
    canvas.fillStyle = this.fillColor;
    canvas.strokeStyle = this.outlineColor;
    canvas.lineWidth = this.lineWidth;
    var dim = this.getPixelDimensions(canvas);
    canvas.fillRect(dim[0],dim[1],dim[2],dim[3]);
    canvas.strokeRect(dim[0],dim[1],dim[2],dim[3]);
  }
  setOptions(interactable,selectable,visible){
    //Interactable and selectable should never be true
    //But calling setOptions with 3 parameters like buttons should be possible
    super.setOptions(false,false,visible);
  }
}