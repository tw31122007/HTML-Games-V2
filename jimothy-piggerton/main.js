var paused = false;
try {
  if(performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    console.clear();
  }
} catch {

}
var FONT = "Handlee";
var movementKeys = [32,37,38,39,40];
var touchButtons = [];
var DISPLAY_FPS= true;
function setUpTouchBtns() {
  var moveBtnWidth = 0.15;
  var moveBtnHeight = 0.3;
  touchButtons = [
  {
    x: -1, y: 1-moveBtnHeight, w: 1+moveBtnWidth, h: moveBtnHeight,
    key: 65,
  },
  {
    x: .01+moveBtnWidth, y: 1-moveBtnHeight, w: moveBtnWidth, h: moveBtnHeight,
    key: 68,
  },
  {
    x: .75, y: .5, w: 1, h: .24,
    key: 32,
  },
  {
    x: .75, y: .76, w: .2, h: .24,
    key: 83,
  },
 
];
}
setUpTouchBtns();
function pressed(b) {
  return b && (b==1 || b.pressed);
}
function handleGamePad(driver) {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  // if(gamepads2.length>0)
  for(var i=0;i<gamepads.length;i++) {
    var gp = gamepads[i];
    if(!gp || gp.buttons.length <= 0)continue;
    if(gp.axes) {
      var x = gp.axes[0];
      var y = gp.axes[1];
      if(Math.abs(x)<.3)x=0;
      if(Math.abs(y)<.3)y=0;
      // if(x>0)x=1;
      // if(x<0)x=-1;
      // player.mx += x;
      if(x>0) {
        this.heldRight=true;
        driver.keydown({keyCode: 68});
      } else if(this.heldRight) {
        this.heldRight=false;        
        driver.keyup({keyCode: 68});        
      }
      if(x<0) {
        this.heldLeft=true;
        driver.keydown({keyCode: 65});
      } else if(this.heldLeft) {
        this.heldLeft = false;
        driver.keyup({keyCode: 65});        
      }
      if(y>.8) {
        driver.keydown({keyCode: 83});
        this.heldDown = true;
      } else if(this.heldDown){
        this.heldDown = false;
        driver.keyup({keyCode: 83});
      }
      if(y<-.8) {
        driver.keydown({keyCode: 87});
        this.heldUp = true;
      } else if(this.heldUp){
        this.heldUp = false;
        driver.keyup({keyCode: 87});
      }
    }
    if(gp.buttons) {
      
      if(pressed(gp.buttons[0])) {
        // if(!this.heldA) player.jump();
        driver.keydown({keyCode: 32});
        this.heldA = true;
      } else if(this.heldA) {
        // player.shortJump();
        driver.keyup({keyCode: 32});        
        this.heldA = false;
      }
      if(pressed(gp.buttons[1])) {
        this.heldB = true;
        driver.keydown({keyCode: 16});
      } else if(this.heldB) {
        this.heldB = false;
        driver.keyup({keyCode: 16});
      }
      if(pressed(gp.buttons[9])) {
        this.heldStart = true;
        driver.keydown({keyCode: 27});
      } else if(this.heldStart) {
        this.heldStart = false;
        driver.keyup({keyCode: 27});
      }
    }
  }
}

  
var touchButtonMap = {};
var touchOn = false;
if (typeof window.orientation !== 'undefined') {
  touchOn = true;
}
class MainDriver {
  constructor(canvas) {
    this.canvas=canvas;
    this.frameCount=0;
    this.keys = [];

    // this.scene = new VgdcSplashScreen(true);
    // this.scene = new MenuScene(true);
    
    // this.scene = new LevelEditorScene(0);
    // this.scene = new LevelsViewerScene();
    try {
      this.scene = loadLastScene();
    } catch(e) {
      console.error(e);
      this.scene = new MenuScene(true);
    }
    this.scene.driver = this;

    this.mouse = {x:0,y:0};
    this.soundsInitialized = false;
    this.timeoutes = [];
    this.gamepadOn=true;
  }
  setTimeout(callback, frames) {
    this.timeoutes.push({callback, frames});
  }
  userGesture() {
    if(!this.soundsInitialized) {
      initializeSound();
      this.soundsInitialized = true;
    }
    AUDIOCONTEXT.resume();    
  }
  update(dt) {
    if(paused)return;
    this.frameCount+=dt;
    // var time = Date.now();
    // var dt = time-this.lastTime;
    // this.lastTime=time;
    if(this.gamepadOn)
    handleGamePad(this);
    this.scene.keys = this.keys;
    this.scene.update(dt, this.frameCount);
    for(var i=0;i<this.timeoutes.length;i+=1) {
      var t = this.timeoutes[i];
      t.frames -= 1;
      if(t.frames<=0) {
        t.callback();
        this.timeoutes.splice(i--, 1);
      }
    }
    canvas.frameCount = this.frameCount;
  }
  draw(canvas) {
    if(paused)return;
    canvas.clearRect(0,0,canvas.width,canvas.height);
    this.scene.draw(canvas);
    if(touchOn && this.scene.touchButtonsActive) {
      var W = canvas.width;
      var H = canvas.height;
      canvas.save();    
      for(var i=0;i<touchButtons.length;i+=1) {
        var btn = touchButtons[i];
        var x = btn.x*W;
        var y = btn.y*H;
        var w = btn.w*W;
        var h = btn.h*H;
        canvas.fillStyle='rgba(0,0,0,.5)';
        if(btn.held) canvas.fillStyle='rgba(255,0,0,.6)';
        canvas.fillRect(x,y,w,h);
      }
      canvas.restore();
    }
  }
  jankyTouch(e) {
    var x = e.changedTouches[0].pageX;
    var y = e.changedTouches[0].pageY;
    // this.scene.mousedown(e, {x,y});
    // this.keydown({keyCode: 32});
    if(this.scene.startGame)this.scene.startGame();
    if(this.scene.time)this.scene.time=0;
    else {
      var player = this.scene.player;
      if(x>700) this.keydown({keyCode :68});
      else this.keyup({keyCode: 68});
      if(x<300) this.keydown({keyCode :65});
      else this.keyup({keyCode :65});        
      if(y<200)this.scene.keydown(32);
    }
    // this.scene.keydown(32);
    e.preventDefault();
  }
  enterTouchButton(btn, id) {
    btn.held = id;
    this.keydown({keyCode: btn.key});
    touchButtonMap[id] = btn;    
  }
  leaveTouchButton(btn, id) {
    btn.held = 0;
    this.keyup({keyCode: btn.key});
    touchButtonMap[id] = 0;    
  }
  getTouchPosition(touch, e) {
    var boundingClientRect = CE.getBoundingClientRect();    
    var x = touch.pageX-boundingClientRect.left;
    var y = touch.pageY-boundingClientRect.top;
    var W = this.canvas.canvas.offsetWidth;
    var H = this.canvas.canvas.offsetHeight;
    x = x/W;
    y = y/H;
    this.mouse.x=x * this.canvas.width;
    this.mouse.y=y * this.canvas.height;
    return{x,y};
  }
  touchstart(e) {
    this.userGesture();
    e.preventDefault();
    touchOn = true;
    // if(this.scene.startGame)this.scene.startGame();
    // if(this.scene.time)this.scene.time=0;
    var touches = e.changedTouches;
    e.preventDefault();    
    for(var i=0;i<touches.length;i++) {
      var touch = e.changedTouches[i];
      var {x, y} = this.getTouchPosition(touch, e);
      e.percentPoint = [x,y];
      this.scene.mousedown(e, this.mouse);    
      if(this.scene.touchButtonsActive){ 
        for(var j=0;j<touchButtons.length;j++) {
          var btn = touchButtons[j];
          if(pointInRect(x,y,btn)) {
            this.enterTouchButton(btn, touch.identifier);
          }
        }
      }
    }
  }
  touchmove(e) {
    e.preventDefault();
    for(var i=0;i<e.changedTouches.length;i+=1) {
      var touch = e.changedTouches[i];
      var {x, y} = this.getTouchPosition(touch, e);
      e.percentPoint = [x,y];      
      this.scene.mousemove(e, this.mouse);    
      if(this.scene.touchButtonsActive){
        var cbtn = touchButtonMap[touch.identifier];
        if(cbtn) {
          if(!pointInRect(x,y,cbtn)) {
            this.leaveTouchButton(cbtn, touch.identifier);
          }
        }
        for(var j=0;j<touchButtons.length;j++) {
          var btn = touchButtons[j];
          if(pointInRect(x,y,btn)) {
            this.enterTouchButton(btn, touch.identifier);
          }
        }
      }
    }
  }
  touchend(e) {
    e.preventDefault();
    for(var i=0;i<e.changedTouches.length;i+=1) {
      var touch = e.changedTouches[i];
      var {x, y} = this.getTouchPosition(touch, e);
      e.percentPoint = [x,y];      
      this.scene.mouseup(e, this.mouse);           
      
      var cbtn = touchButtonMap[touch.identifier];
      if(cbtn) {
        this.leaveTouchButton(cbtn, touch.identifier);
      }
      
      // for(var i=0;i<touchButtons.length;i++) {
      //   var btn = touchButtons[i];
      //   if(pointInRect(x,y,btn)) {
      //     this.leaveTouchButton(btn, touch.identifier);
      //   }
      // }
    }
  }
  keydown(e) {
    this.userGesture();
    var keys = this.keys;
    var k = e.keyCode;
    if(movementKeys.includes(k)&&e.preventDefault) {
      e.preventDefault();
    }
    if(keys[k])return;
    this.scene.keydown(k);
    keys[k] = true;
    if(keys[17]&&k==87) {
      //ctrl + w
    }
  }
  keyup(e) {
    var keys = this.keys;
    var k = e.keyCode;
    if(!keys[k])return;
    this.scene.keyup(k);
    keys[k] = false;
  }
  setMousePos(e) {
    var boundingClientRect = e.target.getBoundingClientRect();
    this.mouse.x = e.clientX-boundingClientRect.left;
    this.mouse.y = e.clientY-boundingClientRect.top;
    this.mouse.x *= canvas.width/e.target.offsetWidth;
    this.mouse.y *= canvas.height/e.target.offsetHeight;
  }
  mousedown(e) {
    this.userGesture();
    this.setMousePos(e);
    this.mouse.held = true;
    this.scene.mousedown(e, this.mouse);
  }
  mouseup(e) {
    this.setMousePos(e);
    this.mouse.held = false;
    this.scene.mouseup(e, this.mouse);
  }
  mousemove(e) {
    this.setMousePos(e);
    this.scene.mousemove(e, this.mouse);
  }
  wheelEvent(e) {
    var scroll = e.deltaY;
    this.mouse.scroll = scroll;
    if(this.scene.onWheel)
    this.scene.onWheel(scroll);
  }
  setScene(scene) {
    if(this.scene&&this.scene.unload)this.scene.unload();
    scene.driver = this;
    this.scene = scene;
    if(scene.reload)scene.reload();
  }
  makeGrd() {
    var gx = canvas.width/2;
    var gy = canvas.height*2;
    var r = canvas.height*2;
    var grd=canvas.createRadialGradient(gx, gy, 0, gx, gy, r);
    grd.addColorStop(0,"rgba(255,100,100,1)");
    grd.addColorStop(1,"rgba(20,20,20,1)");
    // grd.addColorStop(1,"rgba(20,50,100,1)");
    return grd;
  }
}

// function makeGrd() {
//   var gx = canvas.width/2;
//   var gy = canvas.height*2;
//   var r = canvas.height*2;
//   var grd=canvas.createRadialGradient(gx, gy, 0, gx, gy, r);
//   grd.addColorStop(0,"rgba(255,100,100,1)");
//   grd.addColorStop(1,"rgba(20,20,20,1)");
//   // grd.addColorStop(1,"rgba(20,50,100,1)");
//   return grd;
// }

function makeGrdRad(c1,c2) {
  var gx = canvas.width/2;
  var gy = canvas.height*2;
  var r = canvas.height*2;
  var grd=canvas.createRadialGradient(gx, gy, 0, gx, gy, r);
  grd.addColorStop(0,c1);
  grd.addColorStop(1,c2);
  return grd;
}
var CE = document.getElementById('gc');
var canvas = CE.getContext('2d');
canvas.frameCount = 0;
canvas.drawCount = 0;
function superify(funcName) {
  var temp = canvas[funcName].bind(canvas);
  // canvas[funcName+'super'] = canvas[funcName];
  canvas[funcName] = function(x,y,w,h,...args) {
    var t = this.frameCount + (this.drawCount++)-this.drawCount*this.drawCount;
    var a = Math.cos(t/10)*5;
    x += Math.cos(t*Math.PI/20)*a;
    y += Math.sin(t*Math.PI/20)*a;
    // var t = this.getTransform();
    // x += t.e-CE.width/2;
    // y += t.f-CE.height/2;
    // w*=2;
    temp(x,y,w,h,...args);
  }
}
// superify('fillRect');
// superify('strokeRect');
// superify('rect');
// superify('moveTo');
// superify('lineTo');
// canvas.fillRectSuper = canvas.fillRect;
// canvas.fillRect = function(x,y,w,h) {
//   var t = this.frameCount + this.drawCount++;
//   x += Math.cos(t*Math.PI/20);
//   y += Math.sin(t*Math.PI/20);
//   this.fillRectSuper(x,y,w,h);
// }
// canvas.moveToSuper = canvas.moveTo;
// canvas.moveTo = function(x,y) {
//   var t = this.frameCount + this.drawCount++;
//   x += Math.cos(t*Math.PI/20);
//   y += Math.sin(t*Math.PI/20);
//   this.moveToSuper(x,y);
// }
// canvas.fillRect = function(x,y,w,h) {
//   this.fillRectSuper(Math.floor(x),Math.floor(y),Math.floor(w),Math.floor(h));
// }
canvas.fillStyle='black';
canvas.fillRect(0, 0, CE.width, CE.height);
canvas.fillStyle='white';
canvas.font = '10px Arial';
canvas.textAlign = 'center';
canvas.fillText("LOADING", CE.width/2,CE.height/2);

var CELLMAP;
var MAIN;

window.onload = function() {
  CELLMAP = createBlocks();  
  // initializeSound();
  // CE.width = window.innerWidth;
  // CE.height = window.innerHeight;


  canvas.width = CE.width;
  canvas.height = CE.height;

  // CE.width /= 2;
  // CE.height /= 2;
  // canvas.scale(1/2,1/2);

  // window.addEventListener('resize', function(e) {
  //   CE.width = window.innerWidth;
  //   CE.height = window.innerHeight;
  //   canvas.width = CE.width;
  //   canvas.height = CE.height;
  // })
  canvas.font = "30px " + FONT;
  var driver = new MainDriver(canvas);
  MAIN = driver;
  var lastTime = Date.now();
  var FPScounter = 0;
  var currentFPS = 0;
  var lastFPSupdate = lastTime;
  function step() {
    var currentTime = Date.now();
    var dt = currentTime-lastTime;
    lastTime = currentTime;
    dt = dt * 60 / 1000;
    FPScounter ++;
    if(currentTime>lastFPSupdate+100) {
      // currentFPS = FPScounter;
      // FPScounter=0;
      currentFPS = Math.floor(60/dt);
      lastFPSupdate = currentTime;
    }
    // dt = 1.2;
    dt = 1;
    dt *= .8;   
    // dt = .6;   
    // dt = 1;
    driver.update(dt);
    // window.requestAnimationFrame(step);
  }
  // window.addEventListener('keydown', function() {
  //   driver.update(.8);
  // });
  var lastDraw = Date.now();
  var fpsInterval = 1000/100;
  function draw() {
    window.requestAnimationFrame(draw);    
    var time = Date.now();
    var dt = time-lastDraw;
    if(dt >=  fpsInterval) {
      lastDraw = time - (dt % fpsInterval);
      driver.draw(canvas);
      // canvas.fillStyle = "white";
      // canvas.textAlign = 'left';
    }
    canvas.fillStyle = "white";
    canvas.textAlign = "left";
    if(DISPLAY_FPS)
    canvas.fillText(currentFPS, 10,50);
    canvas.drawCount = 0;
  }
  function start() {
    draw();
    // step();
    setInterval(step, 1000/60);
    // window.addEventListener('keydown', function(){
      // step();
    // })
  }
  var iters = 1000;

  updateTest = function() {
    var t1 = Date.now();
    for(var i=0;i<iters;i++) {
      step();
    }
    var t2 = Date.now();
    console.log("pizza", t2-t1);
  }
  drawTest = function() {
    t1 = Date.now();
    for(var i=0;i<iters;i++) {
      driver.draw(canvas);
    }
    t2 = Date.now();
    console.log("balogne", t2-t1);
  }
  updateAndDrawTest = function() {
    updateTest();
    drawTest();
  }

  start();
  // test();


  function onresize(e){
    var rw = window.innerWidth/window.innerHeight;
    var rc = canvas.width/canvas.height;
    if(rw > rc) {
      CE.style.height = "100%";
      CE.style.width = "";
    } else {
      CE.style.width = "100%";
      CE.style.height = "";
    }

    // canvas.imageSmoothingEnabled = false;
    // canvas.mozImageSmoothingEnabled=false;
    // canvas.msImageSmoothingEnabled = false;
    // canvas.oImageSmoothingEnabled=false;
    // canvas.webkitImageSmoothingEnabled=false;
  }
  window.addEventListener('keydown', driver.keydown.bind(driver));
  window.addEventListener('keyup', driver.keyup.bind(driver));
  CE.addEventListener('mousemove', driver.mousemove.bind(driver));
  CE.addEventListener('mouseup', driver.mouseup.bind(driver));
  CE.addEventListener('mousedown', driver.mousedown.bind(driver));
  window.addEventListener('wheel', driver.wheelEvent.bind(driver));
  window.addEventListener('touchstart', driver.touchstart.bind(driver), { passive: false });
  window.addEventListener('touchmove', driver.touchmove.bind(driver), { passive: false });
  window.addEventListener('touchend', driver.touchend.bind(driver), { passive: false });
  window.addEventListener('touchcancel', driver.touchend.bind(driver));
  window.addEventListener('resize', onresize);
  onresize();
}

particles = {
  enabled: true,
  player: {enabled: true},
  cloud: {enabled: true, low: false},
  powerup: {enabled: true},
  collectable: {enabled: true},
  enemy: {enabled: false},
  grass: {enabled: true},
}

function setQuality(v) {
  CE.width *= v;
  CE.height *= v;
  canvas.width = CE.width;
  canvas.height = CE.height;
}


window.addEventListener('beforeunload', function() {
  var scene = MAIN.scene;
  var saveScene = {};
  if(scene.isLevelTesterScene) {
    saveScene.isLevelTesterScene = true;
  }
  else if(scene.isGameScene) {
    saveScene.isGameScene = true;
    saveScene.levelIndex = scene.levelIndex;
  }
  if(scene.isLevelEditorScene) {
    saveScene.isLevelEditorScene = true;
    saveScene.camera = scene.camera;
    saveScene.zoom = scene.zoom;
  }
  if(scene.isLevelsViewerScene) {
    saveScene.isLevelsViewerScene = true;
  }
  if(scene.isOptionScene) {
    saveScene.isOptionScene = true;
  }
  this.localStorage.setItem("scene", JSON.stringify(saveScene));
}, false)


function loadLastScene() {
  if(!localStorage||!localStorage.getItem) {
    console.log("localStorage saves not supported by this web browser");
  }
  var string = localStorage.getItem("scene");
  if(!string) {
    console.log("scene not found");
    return new MenuScene(true);
  }
  var lastScene = JSON.parse(string);
  if(lastScene.isOptionScene) {
    return new OptionScene(false, new MenuScene(true));
  }
  if(lastScene.isLevelsViewerScene) {
    return new LevelsViewerScene();
  }
  if(lastScene.isLevelEditorScene||lastScene.isLevelTesterScene) {
    var scene = new LevelEditorScene(0);
    if(lastScene.camera) {
      scene.camera.x = parseFloat(lastScene.camera.x||0);
      scene.camera.y = parseFloat(lastScene.camera.y||0);
    }
    scene.zoom = lastScene.zoom||1;
    return scene;
  }
  if(lastScene.isGameScene) {
    var scene = new GameScene();
    scene.loadNewLevel(parseInt(lastScene.levelIndex));
    return scene;
  }
  return new MenuScene(true);

}