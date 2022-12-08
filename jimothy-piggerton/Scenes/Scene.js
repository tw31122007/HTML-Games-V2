function sceneTransition(driver, scene) {
  var func = function() {
    this.driver.setScene(new scene());
  };
  return func.bind(driver);
}
function sceneTransition(driver, scene, playIntro){
  var func = function() {
    this.driver.setScene(new scene(playIntro));
  };
  return func.bind(driver);
}
function loadTransitionScene(driver, nextScene, TransitionType, duration, direction) {
  //direction is 1 or -1.  1 is fade to black, -1 is fade from black
  var func = function () {
    this.driver.setScene(new TransitionType(driver, nextScene, duration, direction));
  };
  return func.bind(driver);
}
function drawTransitionOverlay(color, canvas){
  canvas.fillStyle=color;
  canvas.fillRect(0,0,canvas.width,canvas.height);
}
function drawGrid(canvas){
  canvas.lineWidth = 1;
  canvas.strokeStyle = 'black';
  for(var i = 0; i < 10; i++){
    canvas.beginPath();
    canvas.moveTo(i/10.0*canvas.width,0);
    canvas.lineTo(i/10.0*canvas.width,canvas.height);
    canvas.stroke();
  }
  for(var j = 0; j < 10; j++){
    canvas.beginPath();
    canvas.moveTo(0,j/10.0*canvas.height);
    canvas.lineTo(canvas.width,j/10.0*canvas.height);
    canvas.stroke();
  }
}

class Scene {
  constructor(playIntro) {
    //playIntro is a boolean and does not need to be provided.  It defaults to false
    this.keyMap = [];
    this.gui = [];
    this.selectedButton = undefined;
    this.buttons = [];
    this.debug = false;

    this.inTransition = false;
    this.overlayColor = "rgba(0,0,0,0)";
    this.transitionTimer = 0;
    this.transitionDuration = 25;
    this.postTransitionCallback = undefined;
    this.transitionDirection = 1;
    this.allowUIInput = true;
    if(playIntro != undefined && playIntro){
      this.startTransition(25,-1,undefined);
    }
    this.touchButtonsActive = false;
    this.mouse = {x:-1,y:-1};
  }
  update(dt){
    this.handleHeldKeys(dt);
    this.updateTransition(dt);
    this.updateAllGUI(dt);
  }
  updateTransitionColor() {
    this.overlayColor = 'rgba(0,0,0,' + 
          (this.transitionTimer*1.0/this.transitionDuration) + ')';
  }
  updateTransition(dt){
    if(this.inTransition){
      if(this.transitionTimer > this.transitionDuration
        || this.transitionTimer < 0) {
        this.transitionTimer = (this.direction == 1) ? 0 : this.transitionDuration;
        this.inTransition = false;
        this.overlayColor = 'transparent';
        if(this.postTransitionCallback != undefined) {
          this.postTransitionCallback();
        }
      } else {
        this.transitionTimer += this.transitionDirection*dt;
        this.updateTransitionColor();
      }
    }
  }
  
  draw(canvas){}
  unload() {
    for(var i in this.keyMap) {
      this.keyMap[i].keyHeld = false;
    }
  }
  keydown(k) {
    var keyMap = this.keyMap;   
    var map = this.keyMap[k];
    if(!map)return;
    // map.keyHeld = (map.keyHeld||0)+1;
    map.keyHeld = true;
    if(map.down) {
      map.down();
    }
  }
  keyup(k) {
    var keyMap = this.keyMap;
    var map = this.keyMap[k];
    if(!map)return;
    // map.keyHeld -= 1;
    map.keyHeld = false;
    if(map.up) {
      map.up();
    }
  }
  handleHeldKeys(dt) {
    var keys = this.keys;
    var keyMap = this.keyMap;
    for(var k in keyMap) {
      var map = keyMap[k];
      if(keys[k]&&map.held) {
        map.held(dt);
      }
      if(keys[k]==false&&map.unheld) {
        map.unheld(dt);
      }
      if(map.noneheld&&!map.keyHeld) {
        map.noneheld(dt);
      }
    }
  }
  drawAllGUI(canvas){
    for(var i = 0; i < this.gui.length; i++){
      if(this.gui[i].visible){
        this.gui[i].draw(canvas);
      }
    }
  }
  updateAllGUI(dt){
    for(var i = 0; i < this.gui.length; i++){
      this.gui[i].update(dt,this.mouse);
    }
  }
  startTransition(duration,direction,callback){
    //callback is optional and is undefined if not provided
    this.inTransition = true;
    this.transitionDuration = duration;
    this.transitionTimer = (direction == 1) ? 0 : duration;
    this.transitionDirection = direction;
    this.postTransitionCallback = callback;
    this.updateTransitionColor();
  }
  pressButton(){
    //called by keys, not mouse
    if(!this.allowUIInput)
      return;
    this.selectedButton.held = true;
    this.allowUIInput = false;
    SOUNDMAP.uiselect.play();    
  }
  unpressButton(){
    //called by keystrokes, not mouse
    if(this.selectedButton.held){
      this.selectedButton.held = false;
      this.selectedButton.onRelease();
    }
    if(!this.inTransition){
      //If this button called a fade to black transition, do not allow UI inputs
      this.allowUIInput = true;
    }
  }
  safeButtonCall(){
    //This is confusing, yes
    //This function takes in any number of arguments
    //safeButtonCall(this,function object,arg,arg,arg,arg...)
    //This returns a new function that terminates if ui input is not allowed
    //This should be used when binding a button call directly to a keypress
    if(arguments.length < 2){
      console.log("safeButtonCall() with less than 2 arguments");
      return;
    }
    var self = arguments[0];
    var callback = arguments[1];
    var args = [];
    for(var i = 2; i < arguments.length; i++){
      args.push(arguments[i]);
    }
    var f = function(){
      if(!this.allowUIInput)
        return;
      callback.apply(this,args);
    };
    return f.bind(this);
  }
  navigateUI(direction){
    if(this.selectedButton == undefined || this.selectedButton.buttonLinks[direction] == undefined 
      || !this.allowUIInput || !this.selectedButton.buttonLinks[direction].selectable)
      return;
    this.selectedButton.selected = false;
    this.selectedButton.buttonLinks[direction].selected = true;
    this.selectedButton = this.selectedButton.buttonLinks[direction];
    SOUNDMAP.uimove.play();
  }
  toggleDebug(){
    this.debug = !this.debug;
  }
  mousedown(e, mouse) {
    this.updateMousePosition(e);
    if(!this.allowUIInput)
      return;
    GUIMouseDown(e,this.buttons);
  }
  mouseup(e, mouse) {
    this.updateMousePosition(e);
    if(!this.allowUIInput)
      return;
    GUIMouseUp(e,this.buttons);
  }
  mousemove(e, mouse) {
    this.updateMousePosition(e);
    if(!this.allowUIInput)
      return;
    GUIMouseMove(this,e,this.buttons);
  }
  updateMousePosition(e){
    var percentPoint = getPercentPoint(e);
    if(isNaN(percentPoint[0]) || isNaN(percentPoint[1])) return;
    this.mouse = {x:percentPoint[0],y:percentPoint[1]};
    this.mouse.x = constrain(this.mouse.x,0,1); 
    this.mouse.y = constrain(this.mouse.y,0,1)
  }
  onPause() {

  }
  onResume() {
    
  }
}
