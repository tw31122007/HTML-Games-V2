class Slider extends Button{
  constructor(x,y,w,h,groupID,onRelease,handleWidth,defaultValue,
    barColor,handleColor,handleHeldColor,handleOutlineColor,handleOutlineWeight){
    super(x,y,w,h,groupID,onRelease);
    this.barColor = barColor;
    this.handleWidth = handleWidth;
    this.handleColor = handleColor;
    this.handleHeldColor = handleHeldColor;
    this.handleOutlineColor = handleOutlineColor;
    this.handleOutlineWeight = handleOutlineWeight || 1;
    this.value = defaultValue;
    this.selectable = false;
    this.requireMouseInRegionOnRelease = false;
    this.isSlider = true;
  }
  update(dt,percentPoint){
    if(this.held){
      this.setValue((percentPoint.x-this.x)/this.w);
    }    
  }
  draw(canvas){
    var dim = this.getPixelDimensions(canvas);
    dim[1] += dim[3]/2;
    dim[3] *= 0.5;
    dim[1] -= dim[3]/2;
    canvas.fillStyle = this.barColor;
    canvas.fillRect(dim[0],dim[1],this.value *dim[2],dim[3]);
    canvas.fillStyle = this.handleHeldColor;
    canvas.fillRect(dim[0]+this.value *dim[2],dim[1],(1-this.value) *dim[2],dim[3]);

    canvas.fillStyle = (this.held) ? this.handleHeldColor : this.handleColor;
    canvas.strokeStyle = this.handleOutlineColor;
    canvas.lineWidth = this.handleOutlineWeight;
    dim = {x:0,y:0,w:0,h:0};
    dim.x = ((this.value * this.w)+this.x-this.handleWidth/2)*canvas.width;
    dim.y = this.y*canvas.height;
    dim.w = this.handleWidth*canvas.width;
    dim.h = this.h*canvas.height;
    canvas.lineWidth = 8;
    if(this.selected){
      canvas.lineWidth = 10;

    }
    canvas.fillRect(dim.x,dim.y,dim.w,dim.h);
    canvas.strokeRect(dim.x,dim.y,dim.w,dim.h);
  }
  setValue(x){
    this.value = x;
    this.value = (this.value > 1) ? 1 : this.value;
    this.value = (this.value < 0) ? 0 : this.value;
    if(this.onHold) this.onHold(this.value);
  }
  changeBy(toAdd){
    this.setValue(Math.round((this.value+toAdd)*100)/100);
    this.onRelease();
  }
  // contains(x,y){
  //   return x>= this.x+this.value*this.w-this.handleWidth/2 && x<=this.x+this.value*this.w+this.handleWidth/2 && y>=this.y && y<=this.y+this.h;
  // }
}