
class LevelEditorScene extends Scene{
  constructor(index, actuallevel) {
    super(false);
    this.isLevelEditorScene = true;
    this.editLevel = index;
    this.zoom = 1;
    var grid;
    this.levelName = "currentLevel";
    if(SOUNDMAP.music.on) SOUNDMAP.music.toggle();
    if(actuallevel) {
      this.world = new WorldFromLevel(actuallevel);
      this.levelName = actuallevel.name;
    }
    else
    switch (this.editLevel)
    {
      case -2:
        this.world = new WorldDefault(48,24);
        break;
      case -1:
        var level = new PigFunScene();
        this.world = new WorldFromLevel(level.levels[0]);
        break;
      case 0:
        this.world = new WorldDefault(48, 24);      
        // grid = this.load();
        this.load();
        // this.world.h = this.grid.length;
        // this.world.w = this.grid[0].length;
        break;
      default:
        var levels = createLevels();
        this.world = new WorldFromLevel(levels[this.editLevel-1]);
    }
      
    if(grid) {
      this.world.world = grid;
    }
    this.grid = this.world.world;
    this.camera = {x:0,y:0, offset: {x: 0, y: 0}};
    this.keyMap = {
      '32': {down: this.startDragging.bind(this), held: this.drag.bind(this)},
      '75': {down: this.runTest.bind(this)},    //K
      '80': {down: this.printLevel.bind(this)},       //P
      '83': {down: this.onS.bind(this)},//S
      '87': {down: this.cycleBlock.bind(this)},         //W
      '69': {down: this.cycleAbility.bind(this)},       //E
      '84': {down: this.zoomIn.bind(this)},             //T
      '71': {down: this.zoomOut.bind(this)},            //G
      '73': {down: this.growi.bind(this)},              //I
      '74': {down: this.growj.bind(this)},              //J
      //'27': {down: this.backToSelect.bind(this)},       //Escape
      '27': {down: this.pause.bind(this)},       //Escape
      '66': {down: this.resetCameraPosition.bind(this)},//B
      '65': {down: this.pickBlockFromLevel.bind(this)}, //A

      '82': {down: this.gridScrollUp.bind(this)},     //R
      '70': {down: this.gridScrollDown.bind(this)},   //F
      '68': {down: this.selectAir.bind(this)},        //D
      '72': {down: this.toggleCommandList.bind(this)},//H
      '89': {down: this.cycleWorldType.bind(this)},//Y
      '77': {up: this.saveLocal.bind(this)},//M
      '76': {up: this.loadLocal.bind(this)},//L

      '90': {down: this.onZ.bind(this)},   //Z
      '88': {down: this.onX.bind(this)},   //X
      '67': {down: this.onC.bind(this)},   //C
      '86': {down: this.onV.bind(this)},   //V
      
      '49': {down: this.selectFromBar.bind(this,0)},            //1
      '50': {down: this.selectFromBar.bind(this,1)},            //2
      '51': {down: this.selectFromBar.bind(this,2)},            //3
      '52': {down: this.selectFromBar.bind(this,3)},            //4
      '53': {down: this.selectFromBar.bind(this,4)},            //5
      '54': {down: this.selectFromBar.bind(this,5)},            //6
      '55': {down: this.selectFromBar.bind(this,6)},            //7
      '79': {down: this.loadFromStringPrompt.bind(this)},            //O
      
    }
    this.bottomBarHeight = 0.2;
    this.showCommands = false;
    this.dragPivot = {x: 0, y: 0};
    this.clickDragPivot = {x: 0, y: 0};
    this.mousePoint = {x: 0, y: 0};
    this.currentBlock = 1;
    this.playerAbility = [0,0];
    this.rowLength = 7;
    this.rowCount = 2;
    this.buttonGrid = Array(this.rowLength);
    this.quickSelect = [];
    this.resetCameraPosition();
    this.addLevelEditorGUI();
    this.inputElement = document.getElementById("level-editor-level-name");
    this.fileInputElement = document.getElementById("level-editor-file-selector");
    this.levelEditorEditor = document.getElementById("level-editor-editor");
    this.optionIndex = 0;
    (this.fileInputElement.onchange = e=> {
      console.log(e.target.files);
      var files = e.target.files;
      if(!files||files.length<1)return;
      var file = files[0];
      if(!file)return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.versionload(e.target.result);
        this.levelEditorEditor.classList.add("hidden");
        // this.cancelInputWait();
        this.inputWaiting = false;
      };
      reader.readAsText(file);
    });
    (this.inputElement.onkeydown = e=> {
      if (e.key === 'Enter' || e.keyCode === 13) {
          // this.cancelInputWait();
          this.inputElement.blur();
          if(this.promptCallback)
            this.promptCallback(e.target.value);
          this.levelEditorEditor.classList.add("hidden");
          this.cancelInputWait();
      } else if (e.key == "Escape" || e.keyCode == 27) {
        this.inputElement.blur();
        this.levelEditorEditor.classList.add("hidden");
        this.cancelInputWait();
        // setTimeout(e=>{this.cancelInputWait()},10);
      } else if (e.key == "Tab" || e.keyCode == 9 || e.key=="ArrowDown" || e.keyCode==40) {
        if(this.promptOptions.length<1)return;
        this.optionIndex = (this.optionIndex + 1) % this.promptOptions.length;
        this.inputElement.value = this.promptOptions[this.optionIndex];
        e.preventDefault();
        return;
      } else if(e.key == "ArrowUp" || e.keyCode == 38) {
        if(this.promptOptions.length<1)return;
        this.optionIndex = (this.optionIndex - 1 + this.promptOptions.length) % this.promptOptions.length;
        this.inputElement.value = this.promptOptions[this.optionIndex];
        e.preventDefault();
        return;
      }
    });
    (this.inputElement.onfocus = e=> {
      this.inputWaiting = true;
      console.log("inputwaiting true");
    })
    // (this.inputElement.onblur= e=> {
    //   this.cancelInputWait();
    //   // this.inputWaiting = false;
    //   // console.log("inputwaiting false");
    // })
    this.promptLabel = document.getElementById("level-editor-prompt-label");
    // document.getElementById("level-editor-editor").classList.remove("hidden");
    this.inputWaiting = false;
    this.dragging = false;
    this.maxUndoSize = 32;
    this.clearsRedoStackOnChange = false;
    this.undoStack = [];
    this.redoStack = [];
    this.selecting = false;
    this.cutting = false;
    this.copying = false;
    this.pasting = false;
    this.clipBoard = null;
    this.clipBoardImage = document.createElement('canvas');
    this.clipBoardCanvas = this.clipBoardImage.getContext('2d');
    this.pasteIgnoreAir = false;
  }//consend
  // reload() {
    // this.levelEditorEditor.classList.remove("hidden");
  // }
  unload() {
    super.unload();
    this.levelEditorEditor.classList.add("hidden");
  }
  cancelInputWait() {
    this.shouldCancelInputWait = true;
    // this.inputWaiting = false;
    console.log("inputwaiting false");
  }
  keydown(e) {
    if(this.inputWaiting)return;
    super.keydown(e);
  }
  keyup(e) {
    if(this.shouldCancelInputWait) return this.shouldCancelInputWait = this.inputWaiting = false;
    if(this.inputWaiting)return;
    super.keyup(e);
  }
  handleHeldKeys(dt) {
    if(this.inputWaiting)return;
    super.handleHeldKeys(dt);
  }
  pause() {
    this.driver.setScene(new PauseScene(this, true));
  }
  onS() {
    if(this.keys[17]) {
      this.saveLocal();
      // if(this.keys[16]) {
      //   this.redo();
      // } else {
      //   this.undo();
      // }
    } else {
      this.cycleBlockBackwards();
    }
  }
  onZ() {
    if(this.keys[17]) {
      if(this.keys[16]) {
        this.redo();
      } else {
        this.undo();
      }
    } else {
      this.selectFromQuickSelect(0);
    }
  }
  onX() {
    if(this.keys[17]) {
      this.beginCut();
    } else {
      this.selectFromQuickSelect(1);
    }
  }
  onC() {
    if(this.keys[17]) {
      this.beginCopy();
    } else {
      this.selectFromQuickSelect(2);
    }
  }
  onV() {
    if(this.keys[17]) {
      this.beginPaste();
    } else {
      this.selectFromQuickSelect(3);
    }
  }
  beginCopy() {
    this.copying = true;
    this.cutting = false;
    this.pasting = false;
  }
  beginCut() {
    this.cutting = true;
    this.copying = true;
    this.pasting = false;
  }
  beginPaste() {
    this.pasting = true;
    this.copying = false;
    this.cutting = false;
  }
  cancelCutPaste() {
    this.pasting = false;
    this.copying = false;
    this.cutting = false;
  }
  cycleWorldType() {
    if(!this.world.worldtype)this.world.worldtype = 0;
    this.world.worldtype = (this.world.worldtype +1) %6;
    this.world.forceRedraw();
    this.save();
  }
  resetCameraPosition() {
    this.camera.x=this.world.w*this.world.s/2*this.zoom;
    this.camera.y=this.world.h*this.world.s/2*this.zoom;
  }
  mouseRelative() {
    return {
      x: (this.mousePoint.x-this.camera.offset.x)/this.zoom,
      y: (this.mousePoint.y-this.camera.offset.y)/this.zoom,
      // x: (this.mousePoint.x-this.camera.offset.x)/this.zoom,
      // y: (this.mousePoint.y-this.camera.offset.y)/this.zoom,
    }
  }
  changeZoom(amount) {
    var startMouse = this.mouseRelative();
    this.zoom *= amount;
    var endMouse = this.mouseRelative();
    // this.camera.x -= endMouse.x-startMouse.x;
    // this.camera.y -= endMouse.y-startMouse.y;
  }
  zoomIn() {
    var dz = this.zoom * .25;
    this.changeZoom(1.25);
    this.camera.x += this.world.w*this.world.s*dz/2;
    this.camera.y += this.world.h*this.world.s*dz/2;
  }
  zoomOut() {
    var dz = this.zoom*0.2;
    this.changeZoom(0.8); 
    //wtf is this
    this.camera.x -= this.world.w*this.world.s*dz/2;
    this.camera.y -= this.world.h*this.world.s*dz/2;
  }
  // zoomIn() {
  //   this.zoom += .1;
  //   if(this.zoom>2) {
  //     this.zoom=2;
  //     return;
  //   }
    // this.camera.x += this.world.w*this.world.s*.1/2;
    // this.camera.y += this.world.h*this.world.s*.1/2;
  // }
  // zoomOut() {
  //   this.zoom -= .1;
  //   if(this.zoom<.1) {
  //     this.zoom=.1;
  //     return;
  //   }
  //   this.camera.x -= this.world.w*this.world.s*.1/2;    
  //   this.camera.y -= this.world.h*this.world.s*.1/2;    
  // }
  onWheel(amount) {
    if(amount>0)this.zoomOut();
    if(amount<0)this.zoomIn();
  }
  growi()
  {
    if(this.keys[16]&&this.keys[18])return this.shrinkLeft();
    if(this.keys[16]) return this.extendLeft();
    if(this.keys[18]) return this.shrinkRight();
    this.pushUndoStack();
    for (var j = 0; j < this.grid.length; j++)
    {
      this.grid[j].push(0);
    }
    this.world.w++;
  }
  shrinkRight()
  {
    this.pushUndoStack();
    for (var j = 0; j < this.grid.length; j++)
    {
      this.grid[j].pop();
    }
    this.world.w--;
    this.world.forceRedraw();
  }
  shrinkLeft()
  {
    this.pushUndoStack();
    for (var j = 0; j < this.grid.length; j++)
    {
      this.grid[j].shift();
    }
    this.world.w--;
    this.world.forceRedraw();
  }
  growj()
  {

    if(this.keys[16]&&this.keys[18]) return this.shrinkTop();
    if(this.keys[16]) return this.extendTop();
    if(this.keys[18]) return this.shrinkBottom();
    this.pushUndoStack();
    var newrow = [];
    for (var j = 0; j < this.grid[0].length; j++)
    {
      newrow.push(0);
    }
    this.grid.push(newrow);
    this.world.h++;
  }
  extendTop() {
    this.pushUndoStack();
    var newrow = [];
    for (var j = 0; j < this.grid[0].length; j++) {
      newrow.push(0);
    }
    this.grid.unshift(newrow);
    this.world.h++;
    this.world.forceRedraw();
  }
  shrinkBottom() {
    this.pushUndoStack();
    this.grid.pop();
    this.world.h--;
    this.world.forceRedraw();
  }
  shrinkTop() {
    this.pushUndoStack();
    this.grid.shift();
    this.world.h--;
    this.world.forceRedraw();
  }
  extendLeft() {
    this.pushUndoStack();
    for (var j = 0; j < this.grid.length; j++)
    {
      this.grid[j].unshift(0);
    }
    this.world.w++;
    this.world.forceRedraw();
    
  }
  shrinkj() {
    this.pushUndoStack();
    this.grid.splice(this.grid.length-1,1);
    this.world.h--;    
  }
  backToSelect()
  {
    var newScene = new LevelEditorSelectScene();
    this.driver.setScene(newScene);
  }
  cycleBlockBackwards() {
    var l = CELLMAP.length;
    this.currentBlock = (this.currentBlock - 1 + l) % l;
  }
  cycleBlock() {
    this.currentBlock = (this.currentBlock + 1) % CELLMAP.length;
  }
  cycleAbility() {
    if (this.playerAbility[1] == 0)
      this.playerAbility[1] = 1;
    else
    {
      if (this.playerAbility[0] == 0)
      {
        this.playerAbility = [1,0];
      }
      else
        this.playerAbility = [0,0];
    }
  }
  versionload(string) {
    if(string[0] == '[') {
      //previous version
      var grid = this.loadString(string);
      this.grid = grid;
      this.world.world = grid;
      this.world.h = grid.length;
      this.world.w = grid[0].length;
      this.world.forceRedraw();
    } else {
      this.loadLevelJsonString(string);
    }
  }
  getLevelJsonString() {
    var level = {};
    level.version = "0.1";
    level.grid = this.grid;
    level.name = this.levelName;
    level.worldtype = this.world.worldtype;
    // console.log(level);
    return JSON.stringify(level);
  }
  loadLevelJsonString(jsonString) {
    var level = jsonToLevel(jsonString);
    this.loadLevelObj(level);
  }
  loadLevelObj(level) {
    this.grid = level.grid;
    this.levelName = level.name;
    this.world.worldtype = parseInt(level.worldtype);
    this.world.world = this.grid;
    this.world.h = this.grid.length;
    this.world.w = this.grid[0].length;
    this.world.forceRedraw();
  }
  getLevelString() {
    var string = '[\n';
    for(var i = 0;i < this.grid.length;i++) {
      string += '[';
      for(var j=0;j<this.grid[i].length;j++) {
        var s = this.grid[i][j];
        if(s<10) s=' '+s;
        string += s + ',';
      }
      string += '],\n'
    }
    string += ']';
    // string += ';';
    // string += this.world.worldType;
    return string;
  }
  save() {

    //if (this.editLevel)
    //  return;
    var string = this.getLevelJsonString();
    if(!localStorage||!localStorage.setItem)return;
    localStorage.setItem("currentLevel", string);
  }
  alert(string) {
    this.promptLabel.innerHTML = string;
  }
  prompt(text, callback,defaultValue="") {
    var result;
    // try {
    //   result = prompt(text);
    //   return callback(result);
    //   } catch(e) {
    //     // console.error(e);
    //   }
    if(!result || result == "" || result == null) {
      this.promptCallback = callback;
      // this.fileInputElement.click();
      // return;
      this.promptLabel.innerHTML = text;
      this.inputElement.value = defaultValue;
      // result = this.inputElement.value;
      // if(!result || result == "" || result == null) {
        this.levelEditorEditor.classList.remove("hidden");
        this.inputElement.focus();
      // }
    }
    // return callback(result);
  }
  loadFromStringPrompt() {
    this.prompt("Level string", string => {
      if(!string||string.length < 10) return;
      var grid = this.loadString(string);
      this.grid = grid;
      this.world.world = grid;
      this.world.h = grid.length;
      this.world.w = grid[0].length;
      this.world.forceRedraw();
    });
    
  }
  saveLocal() {
    if(!localStorage||!localStorage.setItem) {
      alert("localStorage saves not supported by this web browser");
    }
    this.fileInputElement.classList.add("hidden");
    this.prompt("save as", name=> {
      name = name||this.levelName;
      this.levelName = name;
      if(!this.levelName)return console.log("canceling save: no name");
      var string = this.getLevelJsonString();
      window.electronApi.send("save", this.levelName, string);
      localStorage.setItem(name, string);
      var names = localStorage.getItem("Names") || ';';
      names = names.replace(";;", ";");
      if(!names.includes(';'+name+';')) {
        localStorage.setItem("Names", names + name + ';');
      }
    }, this.levelName);
  }
  loadLocal() {
    if(!localStorage||!localStorage.setItem) {
      alert("localStorage saves not supported by this web browser");
    }
    var names = localStorage.getItem("Names") || 'No saves found';
    console.log(names);
    var defaultValue = "";
    this.promptOptions=names.split(';');
    if(names.includes(this.levelName))
      defaultValue = this.levelName;
    else if(this.promptOptions.length>1)
      defaultValue = this.promptOptions[1];
    this.fileInputElement.classList.remove("hidden");
    this.prompt("load:["+names+"]", name => {
      console.log("loading",name);
      var string = localStorage.getItem(name);
      if(!string) return this.alert("save not found");
      this.levelName = name;
      this.versionload(string);
    },this.levelName);
  }
  load() {
    if(!localStorage || !localStorage.getItem)return null;
    var string = localStorage.getItem("currentLevel");
    this.versionload(string);
    return;
    this.grid = this.loadString(string);
  }
  loadString(string) {
    if(!string)return false;
    var grid = [];
    var currentRow;
    var currentDigit = '';
    var x = 0;
    var y = 0;
    // var params = string.split(';');
    // var levelString = params[0];
    var levelString = string;
    for(var i = 1; i < levelString.length-1; i++) {
      var char = levelString[i];
      switch(char) {
        case '[':
          currentRow = [];
          break;
        case ']':
          grid.push(currentRow);
          break;
        case ',':
          if(currentDigit != '') {
            var type = parseInt(currentDigit, 10);
            if(!CELLMAP[type]) type = 0;
            currentRow.push(type);
            currentDigit = '';
          }
          break;
        default:
          currentDigit += char;
      }
    }
    return grid;
  }
  printLevel() {
    var string = this.getLevelJsonString();
    console.log(string);
  }
  getLevel() {
    return {
      name: this.levelName,
      abilities: this.playerAbility,
      worldType: this.world.worldtype,
      modifyPlayer: function(player) {
        for (var i = 0; i < this.abilities.length; i++)
        {
          if (this.abilities[i] == 1)
          {
            PLAYER_ABILITIES[i+1](player);
          }
        }
      },
      grid: this.grid,
    }
  }
  runTest() {
    var testerScene = new LevelTesterScene(this.getLevel(), this);
    this.driver.setScene(testerScene);
  }
  startDragging() {
    this.dragPivot.x = this.driver.mouse.x;
    this.dragPivot.y = this.driver.mouse.y;
  }
  drag() {
    var dx = this.driver.mouse.x - this.dragPivot.x;
    var dy = this.driver.mouse.y - this.dragPivot.y;
    this.camera.x-=dx;
    this.camera.y-=dy;
    this.dragPivot.x += dx;
    this.dragPivot.y += dy; 
  }
  mousedown(e, mouse) {
    var camera = this.camera;
    // var wx = mouse.x + camera.x - camera.offset.x;
    // var wy = mouse.y + camera.y - camera.offset.y;
    // var x = Math.floor(wx/this.world.s);
    // var y = Math.floor(wy/this.world.s);
    // if(this.world.oob(x,y))return;
    // var t = this.grid[y][x];
    // this.grid[y][x] = (t+1)%3;
    // this.grid[y][x] = this.currentBlock;
    // this.world.forceRedraw(); 
    var wx = mouse.x/this.zoom + (camera.x - camera.offset.x)/this.zoom;
    var wy = mouse.y/this.zoom + (camera.y - camera.offset.y)/this.zoom;
    var x1 = Math.floor(wx/this.world.s);
    var y1 = Math.floor(wy/this.world.s);
    this.downPoint = {x:x1, y:y1};
    
    if(e.button!=0) {
      this.startDragging();
      this.dragging = true;
      this.clickDragPivot = undefined;
      super.mousedown(e,mouse);
      return;
    }
    var onGUI = pointContainsGUI(getPercentPoint(e),this.gui);
    if(!onGUI&&canvas.height-mouse.y> this.bottomBarHeight*canvas.height){
      this.clickDragPivot = {x:0,y:0};
      this.clickDragPivot.x = mouse.x/this.zoom;
      this.clickDragPivot.y = mouse.y/this.zoom;
    } else {
      this.clickDragPivot = undefined;
    }
    super.mousedown(e,mouse);
    if(this.pasting) {
      this.pushUndoStack();
      this.dragging = false;
      this.mouseup(e, mouse);
    }
  }
  mouseup(e, mouse, dontSave) {
    if(e.button!=0) {
      this.dragging = false;
      super.mouseup(e,mouse);
      return;
    }
    if(canvas.height-mouse.y> this.bottomBarHeight*canvas.height && this.clickDragPivot != undefined){
      var camera = this.camera;    
      var wx = mouse.x/this.zoom + (camera.x - camera.offset.x)/this.zoom;
      var wy = mouse.y/this.zoom + (camera.y - camera.offset.y)/this.zoom;
      var x1 = Math.floor(wx/this.world.s);
      var y1 = Math.floor(wy/this.world.s);

      wx = this.clickDragPivot.x + (camera.x - camera.offset.x)/this.zoom;
      wy = this.clickDragPivot.y + (camera.y - camera.offset.y)/this.zoom;
      var x2 = Math.floor(wx/this.world.s);
      var y2 = Math.floor(wy/this.world.s);

      var dx = (1 - 2 * (x2<x1));
      var dy = (1 - 2 * (y2<y1));
      
      var sx = Math.min(x1,x2);
      var sy = Math.min(y1,y2);
      var ex = Math.max(x1,x2);
      var ey = Math.max(y1,y2);
      var iw = ex - sx;
      var jh = ey - sy;
      if(this.copying) {
        this.clipBoard = [];
        if(this.cutting)this.pushUndoStack();
        this.clipBoardImage.width = (iw+1) * this.world.s;
        this.clipBoardImage.height = (jh+1) * this.world.s;
        this.clipBoardCanvas.save();
        this.clipBoardCanvas.translate(-sx*this.world.s,-sy*this.world.s);
        this.world.draw(this.clipBoardCanvas,true);
        this.clipBoardCanvas.restore();
        for(var j=sy; j<=ey; j+=1) {
          var row = [];
          for(var i = sx; i<= ex; i+=1) {
            if(this.world.oob(i, j))continue;
            row.push(this.grid[j][i]);
            if(this.cutting)
              this.grid[j][i] = 0;
          }
          this.clipBoard.push(row);
        }
        this.beginPaste();
      } else if(this.pasting) {
        // if(!dontSave)
        //   this.pushUndoStack();
        var ignoreAir = this.keys[17];
        var onlyReplaceAir = this.keys[16];
        for(var j=0;j<this.clipBoard.length;j++) {
          for(var i=0;i<this.clipBoard[j].length;i++) {
            var x= x1 + i;
            var y = y1 + j;
            if(this.world.oob(x, y))continue;
            if(onlyReplaceAir&&this.grid[y][x])continue;
            if(ignoreAir&&this.clipBoard[j][i]==0)continue;
            this.grid[y][x] = this.clipBoard[j][i];
          }
        }
      } else {
        if(!dontSave)
          this.pushUndoStack();
        for(var j=sy; j<=ey; j+=1) {
          for(var i = sx; i<= ex; i+=1) {
            if(this.world.oob(i, j))continue;
            this.grid[j][i] = this.currentBlock;
          }
        }
      }

      if(!dontSave)
        this.save();
      this.world.forceRedraw();
    }
    super.mouseup(e,mouse);
  }
  pushUndoStack() {
    this.undoStack.push(copyGrid(this.grid));
    if(this.clearsRedoStackOnChange) this.redoStack = [];
    if(this.undoStack.length>this.maxUndoSize) this.undoStack.shift();
  }
  updateWorld() {
    this.world.world = this.grid;
    this.world.h = this.grid.length;
    this.world.w = this.grid[0].length;
    this.world.forceRedraw();
  }
  undo() {
    if(this.undoStack.length==0)return;
    this.redoStack.push(this.grid); //no need to copy since its being overwridden;
    this.grid = this.undoStack.pop();
    this.updateWorld();
    this.save();
  }
  redo() {
    if(this.redoStack.length==0)return;
    this.undoStack.push(this.grid);
    this.grid = this.redoStack.pop();
    this.updateWorld();
    if(this.redoStack.length>this.maxUndoSize) this.redoStack.shift();
    this.save();
  }
  mousemove(e,mouse){
    super.mousemove(e);
    this.mousePoint.x = mouse.x;
    this.mousePoint.y = mouse.y;
    var s = this.world.s;
    var wx = Math.floor((this.mousePoint.x + this.camera.x - this.camera.offset.x)/this.zoom/s);
    var wy = Math.floor((this.mousePoint.y + this.camera.y - this.camera.offset.y)/this.zoom/s);
    if(this.pasting&&this.driver.mouse.held) {
      if(wx!=this.wx||wy!=this.wy) {
        this.mouseup(e,mouse,true);
      }
    }
    this.wx = wx;
    this.wy = wy;
  }
  // mouseheld(mouse) {

  // }
  // update(dt) {
  //   super.update(dt);
  //   var mouse = this.driver.mouse;
  //   if(mouse.held) {
  //     this.mouseheld(mouse);
  //   }
  // }
  update(dt){
    if(this.dragging)this.drag();
    super.update(dt);
  }
  addLevelEditorGUI(){
    this.buildButtonGrid();
    this.buildQuickSelect();
    var buttonFont = "30px " + FONT;

    var dim = rectDimFromCenter(0.945,.75,.07,.08);
    var saveButton = new TextButton(dim[0],dim[1],dim[2],dim[3],0,this.save.bind(this),'Save','30px ' + FONT,'black','rgba(255,255,255,0.75)','black',5);
    this.gui.push(saveButton);


    this.buttons = getButtons(this.gui);
  }
  buildButtonGrid(){
    
    var dim = [];
    var buttonGridRegionWidth = 0.7;
    var buttonGridRegionHeight = 0.2
    var origin = [.05,.85];
    var labelOffset = {x:0.043,y:0.036};
    var labelFont = '20px ' + FONT;
    var labelColor = 'black';
    for(var i = 0; i < this.rowCount; i++){
      this.buttonGrid[i] = [];
      for(var j = 0; j < this.rowLength; j++){
        dim = rectDimFromCenter(origin[0]+j/this.rowLength*buttonGridRegionWidth,
          origin[1]+i/this.rowCount*buttonGridRegionHeight,1/this.rowLength*buttonGridRegionWidth-.02,1/this.rowCount*buttonGridRegionHeight-.02);
        var button = new BlockButton(dim[0],dim[1],dim[2],dim[3],0,
          undefined,i*this.rowLength+j);
        button.onRelease = this.selectBlock.bind(this,button);
        this.buttonGrid[i].push(button);
        this.gui.push(button);

        if(i==0 && j < this.rowLength){
          var label = new Label(dim[0]+labelOffset.x,dim[1]+labelOffset.y,.05,.05,0,""+(j+1),labelFont,labelColor,'center');
          this.gui.push(label);
        }
      }
    }
  }
  buildQuickSelect(){
    var dim = [];
    var regionWidth = 0.2;
    var regionHeight = 0.2;
    var origin = {x:0.78,y:.85};
    var buttonWidth = 0.08;
    var buttonHeight = 0.09;

    var labelOffset = {x:0.043,y:0.045};
    var labelFont = '20px ' + FONT;
    var labelColor = 'black';
    dim = rectDimFromCenter(origin.x,origin.y,buttonWidth,buttonHeight);
    var button1 = new BlockButton(dim[0],dim[1],dim[2],dim[3],0,
      undefined,0);
    button1.onRelease = this.quickSelectClick.bind(this,button1); 
    this.quickSelect.push(button1); 
    this.gui.push(button1);
    var label = new Label(dim[0]+labelOffset.x,dim[1]+labelOffset.y,0.05,0.05,0,'Z',labelFont,labelColor,'center');
    this.gui.push(label);    

    dim = rectDimFromCenter(origin.x+buttonWidth,origin.y,buttonWidth,buttonHeight);
    var button2 = new BlockButton(dim[0],dim[1],dim[2],dim[3],0,
      undefined,0);
    button2.onRelease = this.quickSelectClick.bind(this,button2);  
    this.quickSelect.push(button2); 
    this.gui.push(button2);
    var label = new Label(dim[0]+labelOffset.x,dim[1]+labelOffset.y,0.05,0.05,0,'X',labelFont,labelColor,'center');
    this.gui.push(label);

    dim = rectDimFromCenter(origin.x,origin.y+buttonHeight,buttonWidth,buttonHeight);
    var button3 = new BlockButton(dim[0],dim[1],dim[2],dim[3],0,
      undefined,0);
    button3.onRelease = this.quickSelectClick.bind(this,button3); 
    this.quickSelect.push(button3);  
    this.gui.push(button3);
    var label = new Label(dim[0]+labelOffset.x,dim[1]+labelOffset.y,0.05,0.05,0,'C',labelFont,labelColor,'center');
    this.gui.push(label);

    dim = rectDimFromCenter(origin.x+buttonWidth,origin.y+buttonHeight,buttonWidth,buttonHeight);
    var button4 = new BlockButton(dim[0],dim[1],dim[2],dim[3],0,
      undefined,0);
    button4.onRelease = this.quickSelectClick.bind(this,button4); 
    this.quickSelect.push(button4);  
    this.gui.push(button4);
    var label = new Label(dim[0]+labelOffset.x,dim[1]+labelOffset.y,0.05,0.05,0,'V',labelFont,labelColor,'center');
    this.gui.push(label);

    dim = rectDimFromCenter(0.945,0.94,.06,.08);
    var resetBackWall = new ColoredBox(dim[0],dim[1],dim[2],dim[3],0,'white','black',5);
    this.gui.push(resetBackWall);
    var resetQuickSelectButton = new TextButton(dim[0],dim[1],dim[2],dim[3],0,this.resetQuickSelect.bind(this),'X','30px ' + FONT,'red','transparent','transparent','3');
    this.gui.push(resetQuickSelectButton);
    
  }
  quickSelectClick(button){
    if(button.blockID == 0){
      button.blockID = this.currentBlock;
    } else {
      this.selectBlock(button);
    }
    this.cancelCutPaste();
  }
  selectFromQuickSelect(quickSlotIndex){
    this.currentBlock = this.quickSelect[quickSlotIndex].blockID;
    this.cancelCutPaste();
  }
  selectFromBar(index){
    this.currentBlock = this.buttonGrid[0][index].blockID;
    this.cancelCutPaste();
  }
  selectBlock(button){
    this.currentBlock = button.blockID;
    if(this.currentBlock >= CELLMAP.length-1)
      this.currentBlock = CELLMAP.length-1;
    if(this.currentBlock < 0){      
      this.currentBlock = 0;
    }
    this.cancelCutPaste();
  }
  resetQuickSelect(){
    for(var i = 0; i < this.quickSelect.length; i++){
      this.quickSelect[i].blockID = 0;
    }
  }
  gridScrollUp(){
    if(this.buttonGrid[0][0].blockID >= this.rowLength){
      for(var i = 0; i < this.rowCount; i++){
        for(var j = 0; j < this.rowLength; j++){
          this.buttonGrid[i][j].blockID -= this.rowLength;
        }
      }
    }
  }
  gridScrollDown(){
    if(this.buttonGrid[0][0].blockID <= CELLMAP.length-7){
      for(var i = 0; i < this.rowCount; i++){
        for(var j = 0; j < this.rowLength; j++){
          this.buttonGrid[i][j].blockID += this.rowLength;
        }
      }
    }
  }
  drawBlockAtCursor(canvas){
    var offset = {x: 20, y: 20};
    var width = 30;
    var height = 30;
    var world = {
      getCell: function() {return true}
    };
    canvas.textAlign = 'left';
    canvas.textBaseline = 'top';
    if(this.pasting) {
      canvas.fillText("📋",this.mousePoint.x+offset.x,this.mousePoint.y+offset.y);
    } else if(this.cutting) {
      canvas.fillText("✂️",this.mousePoint.x+offset.x,this.mousePoint.y+offset.y);

    } else if(this.copying) {
      canvas.fillText("📝",this.mousePoint.x+offset.x,this.mousePoint.y+offset.y);
      canvas.fillText("📝",this.mousePoint.x+offset.x+10,this.mousePoint.y+offset.y+10);
    }
    else {
      if(this.currentBlock < CELLMAP.length && this.currentBlock > 0 && CELLMAP[this.currentBlock].draw)
        CELLMAP[this.currentBlock].draw(canvas,this.mousePoint.x+offset.x,this.mousePoint.y+offset.y,width,height,world,0,0);
      canvas.strokeStyle = 'black';
      canvas.lineWidth = 3;
      canvas.strokeRect(this.mousePoint.x+offset.x,this.mousePoint.y+offset.y,width,height);
    }
    if(this.driver.mouse.held && this.clickDragPivot) {
      var w = Math.floor((this.clickDragPivot.x - this.driver.mouse.x/this.zoom)/this.world.s);
      var h = Math.floor((this.clickDragPivot.y - this.driver.mouse.y/this.zoom)/this.world.s);
      w = Math.abs(w);
      h = Math.abs(h);
      canvas.fillText(w+','+h, this.mousePoint.x + offset.x*3, this.mousePoint.y+offset.y*3);
    }
    canvas.fillText(this.wx+","+this.wy, 0,0);
    
  }
  selectAir(){
    this.currentBlock = 0;
  }
  toggleCommandList(){
    this.showCommands = !this.showCommands;
  }
  pickBlockFromLevel(){

    var camera = this.camera;    
    var wx = this.mousePoint.x/this.zoom + (camera.x - camera.offset.x)/this.zoom;
    var wy = this.mousePoint.y/this.zoom + (camera.y - camera.offset.y)/this.zoom;
    var x = Math.floor(wx/this.world.s);
    var y = Math.floor(wy/this.world.s);
    if(x > this.world.w || x < 0 || y > this.world.h || y < 0) return;  //bail if out of bounds
    this.currentBlock = this.grid[y][x];
    this.cancelCutPaste();
  }
  drawTileHighlight(canvas) {
    canvas.lineWidth = 1;
    canvas.strokeStyle = "rgba(50,200,50,0.5)"
    var s = this.world.s;
    canvas.strokeRect(this.wx*s,this.wy*s,s,s);
    if(this.pasting) {
      var w = this.clipBoard[0].length * s;
      var h = this.clipBoard.length * s;
      canvas.strokeRect(this.wx*s,this.wy*s,w,h);
      canvas.globalAlpha = 0.5;
      if(!this.keys[16]&&!this.keys[17]) {
        canvas.fillStyle = "white";
        canvas.fillRect(this.wx*s,this.wy*s,w,h);
      }
      canvas.drawImage(this.clipBoardImage,this.wx*s,this.wy*s);
      canvas.globalAlpha = 1;
    }
  }
  drawHelp(canvas) {
    canvas.font = "18px " + FONT;
    canvas.textAlign = 'left';
    var origin = {x:0.02,y:0.05};
    if(this.showCommands){
      var gap = 0.04;
      var text = [
        "============= General =============",
        "[H] - Toggle Command List",
        "[K] - Test Level",
        "[Space] - Pan Camera",
        "[T/G] - Zoom In/Out",
        "[B] - Reset Camera",
        "============= Block Selection =============",
        "[W/S] - Cycle block backward/forward",
        "[R/F] - Scroll Block Select Up/Down",
        "[D] - Select Erase (Air)",
        "[1/2/3/4] - Quick select",
        "[A] - Block Picker",
        "============= Level Settings =============",
        "[I] - Grow horizontal; [Shift] reverse; [Alt] Delete",
        "[J] - Grow vertical; [Shift] reverse; [Alt] Delete",
        "[Y/E] - Cycle World Type/abilities",
        "============= Save / Load =============",
        "[P/O] - Print as String / Load from String",
        "[M/L] - Save localy with name / Load localy from name",
        "============= Ctrl =============",
        "[Ctrl+Z/Ctrl+Shift+Z] - Undo / Redo",
        "[Ctrl+C/Ctrl+V/Ctrl+X] - Begin Copy /Paste / Cut",
        "[Shift+Paste] - Ignore air blocks",
      ];
      for(var i = 0; i < text.length; i++){
        canvas.fillStyle = 'rgba(200,200,200,0.9)';
        canvas.fillRect(origin.x*canvas.width,
          (origin.y+i*gap-gap/2)*canvas.height,420,gap*canvas.height);
        canvas.fillStyle = 'black';
        canvas.fillText(text[i],origin.x*canvas.width,
          (origin.y+i*gap)*canvas.height,1600);
      }
    } else {
      canvas.fillText("[H] - Help",canvas.width*origin.x,canvas.height*origin.y,1600);
    }
  }
  draw(canvas) {
    var camera = this.camera;
    var world1 = this.world;
    camera.offset = {x: canvas.width/2, y: canvas.height/2};
    var xmin = -canvas.width/2 + world1.s*this.zoom;
    var xmax = canvas.width/2 + (world1.w-1)*world1.s*this.zoom;
    var ymin = -canvas.height/2 + world1.s*this.zoom;
    var ymax = canvas.height/2 + (world1.h-1)*world1.s*this.zoom;
    if(camera.x<xmin) camera.x = xmin;
    if(camera.x>xmax) camera.x = xmax;
    if(camera.y>ymax)camera.y = ymax;
    if(camera.y<ymin)camera.y = ymin;  
    var camera = this.camera;
    canvas.save();
    canvas.translate(canvas.width/2,canvas.height/2);
    canvas.translate(-Math.floor(camera.x), -Math.floor(camera.y));
    canvas.scale(this.zoom,this.zoom);
    canvas.strokeStyle = 'black';
    canvas.lineWidth = 10;
    canvas.strokeRect(0,0,world1.w*world1.s,world1.h*world1.s);
    this.world.draw(canvas,true);

    this.drawTileHighlight(canvas);

    canvas.restore();
    var mouse = this.driver.mouse;

    //canvas.fillStyle='#fff';
    canvas.fillStyle = 'rgba(255,255,255,0.85)';

    canvas.beginPath();
    canvas.rect(0, canvas.height - canvas.height/5, canvas.width, canvas.height/5);
    canvas.fill();
    canvas.stroke();
    
    canvas.fillStyle='#000';
    canvas.fillText("[" + CELLMAP[this.currentBlock].name + "]", canvas.width/10, canvas.height/1.1-100);
    canvas.fillText("[Wall Jump: " + this.playerAbility[0] + "   Double Jump: " + this.playerAbility[1]+ "]", canvas.width/2, canvas.height/1.1-100);
    
  /*
'32': {down: this.startDragging.bind(this), held: this.drag.bind(this)},
      '75': {down: this.runTest.bind(this)},    //K
      //'80': {down: this.printLevel.bind(this)},
      '65': {down: this.cycleBlockBackwards.bind(this)},//S
      '68': {down: this.cycleBlock.bind(this)},         //W
      '69': {down: this.cycleAbility.bind(this)},       //E
      '84': {down: this.zoomIn.bind(this)},             //T
      '71': {down: this.zoomOut.bind(this)},            //G
      '73': {down: this.growi.bind(this)},              //I
      '74': {down: this.growj.bind(this)},              //J
      '27': {down: this.backToSelect.bind(this)},       //Escape
      '88': {down: this.openBlockSelect.bind(this)},    //X
      '66': {down: this.resetCameraPosition.bind(this)},//B

      '82': {down: this.gridScrollUp.bind(this)},     //R
      '70': {down: this.gridScrollDown.bind(this)},   //F
      '69': {down: this.selectAir.bind(this)},        //D
      '72': {down: this.toggleCommandList.bind(this)},//H
  */
    
    canvas.textAlign = 'center';
    this.drawAllGUI(canvas);
    this.drawHelp(canvas);
    this.drawBlockAtCursor(canvas);
    if(!this.pasting && mouse.held && this.clickDragPivot != undefined) {
      canvas.strokeStyle = "rgba(0,100,0,1)";
      canvas.fillStyle = "rgba(0,255,0,.5)";
      canvas.beginPath();
      var tx = this.clickDragPivot.x*this.zoom;
      var ty = this.clickDragPivot.y*this.zoom;
      canvas.rect(tx, ty, -tx+mouse.x, -ty+mouse.y);
      canvas.fill();
      canvas.stroke();
    }
    if(this.pasting) {
      canvas.fillStyle = "black";
      if(this.keys[16])canvas.fillStyle = "green";
      canvas.fillText("[Shift]: only replace air", CE.width/4, CE.height*.7);
      if(this.keys[17])canvas.fillStyle = "green";
      else canvas.fillStyle = "black";
      canvas.fillText("[Ctrl]: do not paste air", CE.width/4, CE.height*.75);
    }
  }
}