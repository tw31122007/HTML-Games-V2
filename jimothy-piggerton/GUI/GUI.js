class GUIElement{
  constructor(x,y,w,h,groupID){
    this.originalDimension = [x,y,w,h];
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.interactable = true; //Can this element be moused over/used/clicked?     
    this.selectable = true;  
    this.groupID = groupID;   //for ease of grouping UI elements (eg: 0 is main menu UI elements, 1 is level select elements etc)
    this.visible = true;      //should this be drawn? 

  }
  move(vx,vy){
    this.x += vx;
    this.y += vy;
  }
  contains(x,y){
    //x,y are in SCREEN PERCENT
    return x>= this.x && x<=this.x+this.w && y>=this.y && y<=this.y+this.h;
  }
  setVisibility(x){
    this.visible = x;
  }
  setOptions(interactable, selectable, visible){
    this.interactable = interactable;
    this.visible = visible;
    this.selectable = selectable;
  }
  getPixelDimensions(canvas){
    //returns pixel [x,y,width,height] for this button
    return [this.x*canvas.width, this.y*canvas.height, this.w*canvas.width, this.h*canvas.height];
  }
  reset(){
    this.x = this.originalDimension[0];
    this.y = this.originalDimension[1];
    this.w = this.originalDimension[2];
    this.h = this.originalDimension[3];
  }
  update(dt){}
  draw(canvas){}
}
function colorLerp(color1,color2,percent){
  //colors must be passed as [r,g,b,a]
  var result = color1.slice();
  for(var i = 0; i < 4; i++){
    result[i] = Math.round(result[i] + (color2[i]-color1[i])*percent);
  }
  return result;
}
function makeColorStr(colorArray){
  return 'rgba('+Math.floor(colorArray[0])+','+Math.floor(colorArray[1])+','
    +Math.floor(colorArray[2])+','+colorArray[3]+')';
}
function rectDimFromCenter(x,y,width,height){
  var result = [];
  result.push(x-width/2);
  result.push(y-height/2);
  result.push(width);
  result.push(height);
  return result;
}
function getPercentPoint(e){
  //Will return percentPoint relative to object clicked in
  //eg: if there was a smaller canvas in the game, clicking on that
  //would yield the percent point within that smaller canvas.
  //Currently this should never happen.
  if(e.percentPoint) return e.percentPoint; 
  var point = [];
  point.push(e.offsetX/e.target.offsetWidth);
  point.push(e.offsetY/e.target.offsetHeight);
  point[0] = constrain(point[0],0,1);
  point[1] = constrain(point[1],0,1);
  return point;
}
function moveAllGUI(vx,vy,guiList){
  for(var i = 0; i < guiList.length; i++){
    guiList[i].move(vx,vy);
  }
}
function getButtons(guiList){
  var result = [];
  for(var i = 0; i < guiList.length; i++){
    if(guiList[i] instanceof Button){
      result.push(guiList[i]);
    }
  }
  return result;
}
function pointContainsGUI(percentPoint,guiList){
  //returns UI at point or undefined if none
  for(var i = 0; i < guiList.length; i++){
    if(guiList[i].contains(percentPoint[0],percentPoint[1]) 
        && guiList[i].interactable){
      return true;
    }
  }
  return false;
}
function getGUIInGroup(n,guiList){
  var result = [];
  for(var i = 0; i < guiList.length; i++){
    if(guiList[i].groupID == n){
      result.push(guiList[i]);
    }
  }
  return result;
}
function GUIMouseDown(e,buttonList){
  
  var percentPoint = getPercentPoint(e);  
  switch(touchOn){
    case false:
      for(var i = 0; i < buttonList.length; i++){
        if(buttonList[i].contains(percentPoint[0],percentPoint[1]) 
            && buttonList[i].interactable){
          buttonList[i].held = true;
          if(buttonList[i].onClick) buttonList[i].onClick();
        }
      }
      break;

    case true:
      for(var i = 0; i < buttonList.length; i++){
        buttonList[i].selected = false;
        if(buttonList[i].contains(percentPoint[0],percentPoint[1]) 
          && buttonList[i].interactable){
        buttonList[i].selected = true;
        buttonList[i].held = true;
        if(buttonList[i].onClick) buttonList[i].onClick();
      }
      }
      break;
  }
}
function GUIMouseUp(e,buttonList){
  var percentPoint = getPercentPoint(e);  
  for(var i = 0; i < buttonList.length; i++){
    if(buttonList[i].interactable && buttonList[i].held && !buttonList[i].requireMouseInRegionOnRelease){
      buttonList[i].held = false;
      if(buttonList[i].onRelease) buttonList[i].onRelease();
      break;
    }
    if(buttonList[i].contains(percentPoint[0],percentPoint[1])
        && buttonList[i].interactable && buttonList[i].held){
      buttonList[i].held = false;
      if(buttonList[i].onRelease) {
        buttonList[i].onRelease();
        SOUNDMAP.uiselect.play();
      }
    } else {
      buttonList[i].held = false;
    }
  }
}
function GUIMouseMove(self, e, buttonList){
  if(buttonList == undefined)
    return;

  if(!touchOn){
    for(var j = 0; j < buttonList.length; j++){
      if(buttonList[j].held)
        return; //If a button is currently being held (meaning this is a mouse drag
                //that was initiated on a valid button), bail out
    }
  }
  var percentPoint = getPercentPoint(e);  
  for(var i = 0; i < buttonList.length; i++){
    buttonList[i].selected = false;
    if(buttonList[i].contains(percentPoint[0],percentPoint[1]) && buttonList[i].selectable){
      if(self.selectedButton != undefined)
        self.selectedButton.selected = false;
      buttonList[i].selected = true;
      if(self.selectedButton != buttonList[i]) SOUNDMAP.uimove.play();
      self.selectedButton = buttonList[i];
      break;    //In case of overlapping buttons, exit loop after first contains
    } 
  }
}



