class ArrowSelector extends Button{
  constructor(x,y,w,h,groupID,onRelease,moveDistance,moveSpeed,fillColor,outlineColor,lineWidth,flipped){
    super(x,y,w,h,groupID,undefined);
    
    this.fillColor = fillColor;
    this.outlineColor = outlineColor;
    this.lineWidth = lineWidth;
    this.moveSpeed = moveSpeed;
    this.flipped = flipped;
    this.moveDistance = moveDistance;
    this.onRelease = function(){
      if(this.flipped)
        this.x = this.originalDimension[0]-this.moveDistance;
      else  
        this.x = this.originalDimension[0]+this.moveDistance;
      onRelease();
    }.bind(this);
  }
  update(dt){
    this.moveToPosition(dt,this.originalDimension[0]);
  }
  draw(canvas){
    canvas.fillStyle = this.fillColor;
    canvas.strokeStyle = this.outlineColor;
    canvas.lineWidth = this.lineWidth;
    var drawPoints = [undefined,undefined,undefined];
    if(this.flipped){
      drawPoints[0] = [this.x+this.w,this.y];
      drawPoints[1] = [this.x+this.w,this.y+this.h];
      drawPoints[2] = [this.x,this.y+this.h/2];
    } else {
      drawPoints[0] = [this.x,this.y]
      drawPoints[1] = [this.x,this.y+this.h];
      drawPoints[2] = [this.x+this.w,this.y+this.h/2];
    }
    
    canvas.beginPath();
    canvas.moveTo(drawPoints[0][0]*canvas.width,drawPoints[0][1]*canvas.height);
    canvas.lineTo(drawPoints[1][0]*canvas.width,drawPoints[1][1]*canvas.height);
    canvas.lineTo(drawPoints[2][0]*canvas.width,drawPoints[2][1]*canvas.height);
    canvas.lineTo(drawPoints[0][0]*canvas.width,drawPoints[0][1]*canvas.height);
    
    canvas.fill();
    canvas.stroke();
  }
  
  getBounds(points){
    var left = points[0][0];
    var right = points[0][0];
    var top = points[0][1];
    var bottom = points[0][1];
    for(var i = 0; i < points.length; i++){
      left = Math.min(left,points[i][0]);
      right = Math.max(right,points[i][0]);
      top = Math.min(top,points[i][1]);
      bottom = Math.max(bottom,points[i][1]);
    }
    return [right-left,bottom-top];
  }
  moveToPosition(dt,destX){
    var toMove = dt * (destX-this.x)*this.moveSpeed;
    this.x += toMove;
  }
  displaceArrow(){
    if(this.flipped)
        this.x = this.originalDimension[0]-this.moveDistance;
      else  
        this.x = this.originalDimension[0]+this.moveDistance;
  }
}