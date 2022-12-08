class ColorLerpBox extends GUIElement{
  constructor(x,y,w,h,groupID,activeColor, inactiveColor, changeDuration,startActivated){
    super(x,y,w,h,groupID);
    //Color is in format [r,g,b,a]
    this.activeColor = activeColor;
    this.inactiveColor = inactiveColor;
    this.changeDuration = changeDuration;
    this.activated = startActivated;
    this.colorTimer = startActivated ? this.changeDuration : 0;
  }
  update(dt){
    if(this.activated){
      this.colorTimer += dt;
      if(this.colorTimer > this.changeDuration)
        this.colorTimer = this.changeDuration;
    } else {
      this.colorTimer -= dt;
      if(this.colorTimer < 0)
        this.colorTimer = 0;
    }  
  }
  draw(canvas){
    var fillColor = colorLerp(this.inactiveColor,this.activeColor,this.colorTimer/this.changeDuration);
    canvas.fillStyle = makeColorStr(fillColor);
    canvas.fillRect(this.x*canvas.width,this.y*canvas.height,this.w*canvas.width,this.h*canvas.height);
  }
  setOptions(interactable,selectable,visible){
    //Interactable and selectable should never be true
    //But calling setOptions with 3 parameters like buttons should be possible
    super.setOptions(false,false,visible);
  }
}