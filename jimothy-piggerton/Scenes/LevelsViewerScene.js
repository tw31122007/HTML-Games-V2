function getOrCreate(className, params) {
  if(className.instance)return className.instance;
  else if(params) return new className(...params);
  else return new className();
}
class LevelsViewerScene extends Scene{
  constructor() {
    super(false);
    this.isLevelsViewerScene = true;
    this.camera = {x:0,y:0, offset: {x: 0, y: 0}};
    this.zoom = 1;
    this.keyMap = {
      '32': {down: this.startDragging.bind(this), held: this.drag.bind(this)},
      '84': {down: this.zoomIn.bind(this)},             //T
      '71': {down: this.zoomOut.bind(this)},            //G
      '27': {down: ()=>this.driver.setScene(getOrCreate(MenuScene))},
      '78': {down: ()=>this.driver.setScene(new LevelEditorScene(-2))}, //N
      '69': {down: ()=>this.driver.setScene(new LevelEditorScene(0))}, //E
      '82': {down: ()=>this.createLevelsEntities()},//r
    }
    this.dragPivot = {x: 0, y: 0};
    this.clickDragPivot = {x: 0, y: 0};
    this.mousePoint = {x: 0, y: 0};
    this.worldCursorPoint = {x: 0, y: 0};
    this.resetCameraPosition();
    this.entities = [];
    this.createLevelsEntities();
    LevelsViewerScene.instance = this;
  }
  createLevelEntity(x,y,width,height,image,level) {
    return {
      x: x, y: y,
      w: width, h: height,
      image: image,
      highlight: false,
      level: level,
      update(dt,mx,my) {
        if(mx>=this.x&&mx<this.x+this.w&&my>=this.y&&my<this.y+this.h) {
          this.highlight = true;
        } else {
          this.highlight = false
        }
      },
      draw: function(canvas) {
        if(this.highlight) {
          canvas.fillStyle = "rgba(200,100,100,0.5)";
          canvas.fillRect(this.x,this.y,this.w,this.h);
        }
        canvas.strokeStyle = "rgba(200,100,100,0.5)";
        canvas.strokeRect(this.x,this.y,this.w,this.h);
        canvas.drawImage(this.image, this.x,this.y);
        canvas.font = "300px " + FONT;
        canvas.textAlign = 'left';
        canvas.textBaseline = 'top';
        canvas.strokeStyle = "white";
        canvas.fillStyle = "black";
        canvas.lineWidth = 20;
        var name = this.level.name;
        canvas.strokeText(name, this.x+30,this.y+30, this.w,this.h);
        canvas.fillText(name, this.x+30,this.y+30, this.w,this.h);
      }
    };
  }
  createLevelsEntities() {
    this.entities = [];
    var levels = createLevels();
    var x=0;
    var y = 0;
    var worldType = 0;
    var maxHeight = 0;
    var maxWidth = 0;
    var maxRowHeight = 0;
    for(var i=0;i<levels.length;i++){
      var level = levels[i];
      var w = level.grid[0].length;
      var h = level.grid.length;
      var gameScene = new GameScene(level, false, false);
      var s = gameScene.world.s; //40
      var width = w*s;
      var height = h*s;
      if(height>maxRowHeight)maxRowHeight=height;
      var image = document.createElement('canvas');
      image.width = width;
      image.height = height;
      var imageCanvas = image.getContext('2d');
      gameScene.camera.x = 0;//width/2;
      gameScene.camera.y = 0;//height/2;
      gameScene.draw(imageCanvas);
      if(worldType!=level.worldType) {
        worldType = level.worldType;
        y += maxRowHeight;
        maxHeight += maxRowHeight;
        maxRowHeight = 0;
        if(x>maxWidth)maxWidth = x;
        x =0;
      }
      this.entities.push(this.createLevelEntity(x,y,width,height,image,level))
      x+=width;
    }
    if(x>maxWidth)maxWidth = x;
    y+=maxRowHeight;
    maxHeight += maxRowHeight;
    maxRowHeight=0;
    x=0;

    this.camera.x = maxWidth/2;
    this.camera.y = maxHeight/2;
    this.zoom = 0.06;

    var names = localStorage.getItem("Names");
    if(!names)return [];
    var namesList = names.split(";");
    namesList.push('currentLevel');
    for(var i=0;i<namesList.length;i++) {
      var name = namesList[i];
      if(!name || name == "") continue;
      var string = localStorage.getItem(name);
      if(!string)continue;
      var level = versionLoadLevel(string, name);
      var w = level.grid[0].length;
      var h = level.grid.length;
      var gameScene = new GameScene(level, false, false);
      var s = gameScene.world.s; //40
      var width = w*s;
      var height = h*s;
      if(height>maxRowHeight)maxRowHeight=height;
      var image = document.createElement('canvas');
      image.width = width;
      image.height = height;
      var imageCanvas = image.getContext('2d');
      gameScene.camera.x = 0;//width/2;
      gameScene.camera.y = 0;//height/2;
      gameScene.draw(imageCanvas);
      // imageCanvas.font = "300px " + FONT;
      // // imageCanvas.textAlign = 'center';
      // // imageCanvas.textBaseline = 'middle';
      // // imageCanvas.fillText(name, width/2,height/2);
      // imageCanvas.textAlign = 'left';
      // imageCanvas.textBaseline = 'top';
      // imageCanvas.strokeStyle = "white";
      // imageCanvas.fillStyle = "black";
      // imageCanvas.lineWidth = 20;
      // imageCanvas.strokeText(name, 30,30);
      // imageCanvas.fillText(name, 30,30);
      this.entities.push(this.createLevelEntity(x,y,width,height,image,level));
      x+=width;
    }

    this.camera.x = maxWidth/2;
    this.camera.y = maxHeight/2;
  }
  pause() {
    this.driver.setScene(new PauseScene(this, true));
  }
  resetCameraPosition() {
    this.camera.x=0;
    this.camera.y=0;
  }
  mouseRelative() {
    return {
      x: (this.mousePoint.x-this.camera.offset.x)/this.zoom,
      y: (this.mousePoint.y-this.camera.offset.y)/this.zoom,
      // x: (this.mousePoint.x+this.camera.x-this.camera.offset.x)/this.zoom,
      // y: (this.mousePoint.y+this.camera.y-this.camera.offset.y)/this.zoom,
    }
  }
  changeZoom(amount) {
    var startMouse = this.mouseRelative();
    this.zoom *= amount;
    var endMouse = this.mouseRelative();
    this.camera.x -= endMouse.x-startMouse.x;
    this.camera.y -= endMouse.y-startMouse.y;
  }
  zoomIn() {
    this.changeZoom(1.25);
  }
  zoomOut() {
    this.changeZoom(0.8); 
  }
  onWheel(amount) {
    if(amount>0)this.zoomOut();
    if(amount<0)this.zoomIn();
  }
  startDragging() {
    this.dragPivot.x = this.driver.mouse.x;
    this.dragPivot.y = this.driver.mouse.y;
  }
  drag() {
    var dx = this.driver.mouse.x - this.dragPivot.x;
    var dy = this.driver.mouse.y - this.dragPivot.y;
    // dx = dx/this.zoom;
    // dy = dy/this.zoom;
    this.camera.x-=dx/this.zoom;
    this.camera.y-=dy/this.zoom;
    this.dragPivot.x += dx;
    this.dragPivot.y += dy; 
  }
  mousedown(e, mouse) {
    if(e.button==0) {
      var onGUI = pointContainsGUI(getPercentPoint(e),this.gui);
      if(!onGUI&&canvas.height-mouse.y> this.bottomBarHeight*canvas.height){
        this.clickDragPivot = {x:0,y:0};
        this.clickDragPivot.x = mouse.x/this.zoom;
        this.clickDragPivot.y = mouse.y/this.zoom;
      } else {
        this.clickDragPivot = undefined;
      }
    } else {
      this.startDragging();
      this.dragging = true;
    }
    super.mousedown(e,mouse);
  }
  mouseup(e, mouse) {
    if(e.button!=0) {
      this.dragging = false;
    } else {
      for(var i=0;i<this.entities.length;i++) {
        var entity = this.entities[i];
        if(entity.highlight) {
          this.driver.setScene(new LevelEditorScene(0, entity.level));
          break;
        }
      }
    }
    super.mouseup(e,mouse);
  }
  mousemove(e,mouse){
    super.mousemove(e);
    this.mousePoint.x = mouse.x;
    this.mousePoint.y = mouse.y;
  }
  update(dt){
    if(this.dragging)this.drag();
    super.update(dt);
    this.worldCursorPoint.x = this.camera.x+(this.mousePoint.x-this.camera.offset.x)/this.zoom;
    this.worldCursorPoint.y = this.camera.y+(this.mousePoint.y-this.camera.offset.y)/this.zoom;
    for(var i=0;i<this.entities.length;i++) {
      this.entities[i].update(dt,this.worldCursorPoint.x,this.worldCursorPoint.y);
    }
  }
  draw(canvas) {
    var camera = this.camera;
    camera.offset = {x: canvas.width/2, y: canvas.height/2};
    // var xmin = -canvas.width/2 + world1.s*this.zoom;
    // var xmax = canvas.width/2 + (world1.w-1)*world1.s*this.zoom;
    // var ymin = -canvas.height/2 + world1.s*this.zoom;
    // var ymax = canvas.height/2 + (world1.h-1)*world1.s*this.zoom;
    // if(camera.x<xmin) camera.x = xmin;
    // if(camera.x>xmax) camera.x = xmax;
    // if(camera.y>ymax)camera.y = ymax;
    // if(camera.y<ymin)camera.y = ymin;  
    var camera = this.camera;
    canvas.save();
    canvas.translate(canvas.width/2,canvas.height/2);
    canvas.scale(this.zoom,this.zoom);

    canvas.translate(-Math.floor(camera.x), -Math.floor(camera.y));
    canvas.fillStyle='red';
    canvas.fillRect(this.worldCursorPoint.x-10,this.worldCursorPoint.y-10,20,20);
    this.entities.forEach(e=>e.draw(canvas));
    // this.world.draw(canvas,true);
    canvas.restore();

    this.drawAllGUI(canvas);
  }
}