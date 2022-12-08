class Button extends GUIElement {
  constructor(x,y,w,h,groupID,onRelease){
    super(x,y,w,h,groupID);
    this.onRelease = onRelease;
    this.onPress = undefined;
    this.onHold = undefined;
    this.held = false;
    this.selected = false;
    //buttonlinks can be filled in later 
    //(buttons to be linked to may not exist at this time)
    //buttonLinks[0] = UP
    //buttonLinks[1] = RIGHT
    //buttonLinks[2] = DOWN
    //buttonLinks[3] = LEFT
    this.requireMouseInRegionOnRelease = true;
    this.buttonLinks = Array(4).fill(undefined);
    this.value = undefined;   //value has no set type.
                              //it is simply some variable that you want associated with the button
  }
  setNeighbors(buttonList){
    this.buttonLinks = buttonList;
  }
  getNeighbor(direction){
    switch(direction){
      case "up":
        return this.buttonLinks[0];
      case "right":
        return this.buttonLinks[1];
      case "down":
        return this.buttonLinks[2];
      case "left":
        return this.buttonLinks[3];
      default:
        console.log("getNeighbor()->Expected: [up,right,down,left]");
        console.log("               Received: " + direction);
        return undefined;
    }
  }
  
  
  
  update(dt){}
  draw(canvas){}
}