
class SimpleDialogue {
  constructor() {
    this.text= "";
    this.person = "";
    this.index= 0;
    this.impatience = 0;
  }
  setText(obj) {
    this.text = obj.text;
    this.person = obj.person;
    this.index = 0;//this.text.length;
    this.impatience = 0;
    this.done = false;
    if(obj.person) {
      this.talkSound = obj.person.talkSound;
      this.every = obj.person.every;
    } else {
      this.talkSound = null;
    }
  }
  reset() {
    this.index = 0;
  }
  update(dt, frameCount) {
    if(this.index<this.text.length&&frameCount%2==0) {
      this.index += 1;
      if(this.talkSound) {
        if(this.every) {
          if((frameCount>>1)%this.every==0) {
            this.talkSound.play();
          }
        } else {
          this.talkSound.play();
        }
      }
    }
    if(this.index>=this.text.length) {
      this.impatience ++;
      if(this.impatience>30&&this.scene.player.mx!=0) {
        this.done = true;
      }
    }
  }
  progress() {
    if(this.index>=this.text.length) {
      this.done = true;
    } else {
      if(this.talkSound) {
        this.talkSound.play();
      }
      this.index = this.text.length;
    }
  }
  draw(canvas) {
    if(this.text=='')return;
    canvas.fillStyle = "#000000aa";
    canvas.fillRect(0,CE.height*.8,CE.width,CE.height*.2);
    if(this.person) {
      canvas.fillRect(0,CE.height*.75,CE.width*.3,CE.height*.05);
    }
    canvas.fillStyle = "white";
    canvas.textBaseline = "top";
    canvas.font = "30px Arial";
    canvas.textAlign = "left";
    if(this.person) {
      canvas.fillText(this.person.name, CE.width/50,CE.height*.77);
    }
    canvas.font = "25px Arial";
    var text = this.text.substring(0,this.index);
    var words = text.split(" ");
    var text1 = '';
    var text2 = '';
    for(var i=0;i<words.length;i++) {
      if(i<10)
        text1 += words[i]+' ';
      else
        text2 += words[i]+' ';
    }
    canvas.fillText(text1, CE.width/30,CE.height*.85);
    canvas.fillText(text2, CE.width/30,CE.height*.9);
    if(this.impatience>60) {
      var t = ' (press space)';//.substring(0,this.impatience-60);
      canvas.textAlign = 'right';
      canvas.fillText(t, CE.width*.99,CE.height*.95);
    }
  }
}

class WaitForEnemyClear {
  constructor(scene) {
    this.scene = scene;
  }
  progress() {}
  update() {
    if(this.scene.enemyCount <=0)this.done=true;
  }
}

class WaitForFrames {
  constructor(frames) {
    this.frames = frames;
  }
  progress() {}
  update() {
    this.frames--;
    if(this.frames<0) {
      this.done = true;
    }
  }
}

class WaitForProximity {
  constructor(e1,e2,r) {
    this.e1=e1;
    this.e2=e2;
    this.r=r;
    this.done = false;
  }
  progress() {}
  update() {
    var dx = this.e1.x-this.e2.x;
    var dy = this.e1.y-this.e2.y;
    var r = Math.sqrt(dx*dx+dy*dy) 
    if(r<=this.r) {
      this.done = true;
    }
  }
}

class DialogueController {
  constructor(sequence, gameScene) {
    this.gameScene = gameScene;
    this.sequence = sequence;
    this.index = 0;
    this.done = false;
    this.current = null;
    this.simpleDialogue = new SimpleDialogue();
    this.simpleDialogue.scene = this.gameScene;
    if(sequence)
    this.processData(this.sequence[0]);
    this.lastSpeaker = null;
    this.conditions = [];
    this.alwaysDraw=true;
  }
  add(sequence) {
    this.setSequence(sequence);
  }
  setSequence(sequence) {
    this.conditions = [];
    this.persist = false;
    this.simpleDialogue.text = '';
    this.done = false;
    this.current = null;
    this.sequence = sequence;
    this.index = 0;
    this.processData(this.sequence[0]);
  }
  processData(event) {
    if(event.setCondition) {
      this.conditions.push([event.setCondition, event.conditionTarget]);
    }
    if(event.text) {
      this.simpleDialogue.setText(event)
      this.current = this.simpleDialogue;
      if(event.person&&event.person.obj&&!event.doNotTarget) {
        this.gameScene.camera.target = event.person.obj;
        event.person.obj.isTalking = true;
        this.lastSpeaker = event.person.obj;
      }
      if(event.doNotWait) {
        this.simpleDialogue.progress();
        this.next();
      }
    }
    if(event.persist) {
      this.persist = true;
    }
    if(event.sceneTransition) {
      MainDriver.setScene(new event.scene());
    }
    if(event.screenShake) {
      this.gameScene.screenShake = event.screenShake;
    }
    if(event.sound) {
      event.sound.play();
    }
    if(event.spawn) {
      var x = (event.tx+0.5) * this.gameScene.level.cellWidth;
      var y = (event.ty+0.5) * this.gameScene.level.cellHeight;
      var e = this.gameScene.addEntity(new event.spawn(x,y));
      if(event.target) {
        this.gameScene.camera.target = e;
      }
    } else if(event.target) {
      this.gameScene.camera.target = event.target;
    }
    if(event.waitForProximity) {
      var e1 = this.gameScene.specialActors[event.e1];
      var e2 = this.gameScene.specialActors[event.e2];
      this.current = new WaitForProximity(e1,e2,event.r);
    }
    if(event.set) {
      var e = (event.person && event.person.obj)||this.gameScene.specialActors[event.entity];
      Object.assign(e, event.set);
    }
    if(event.waitFor) {
      this.current = new WaitForFrames(event.waitFor);
    }
    if(event.nextLevel) {
      this.gameScene.loadNextLevel();
    }
    if(event.music) {
      MusicHandler.playMusic(event.music);
    }
    if(event.musicStop) {
      MusicHandler.stop();
    }
    if(event.fadeToBlack) {
      this.current = {update(){},draw(){},progress(){}};
      MainDriver.fadeToBlack(event.fadeToBlack, e=>{
        if(this.current)
          this.current.done = true;
        this.next()
      });
    }
    if(event.fadeIn) {
      this.current = {update(){},draw(){},progress(){}};
      MainDriver.fadeIn(event.fadeIn, e=>{
        if(this.current)
          this.current.done = true;
        this.next()
      });
    }
    if(event.waitForEnemyClear) {
      this.current = new WaitForEnemyClear(this.gameScene);
    }
    if(this.current == null) {
      this.next();
    }
  }
  processCondition(con) {
    if(con.pxG) {
      if(this.gameScene.player.x>con.pxG)return true;
    }
    return false;
  }
  update() {
    for(var i=0;i<this.conditions.length;i++) {
      var con = this.conditions[i];
      if(this.processCondition(con[0])) {
        this.setSequence(GetDialogueData(this.gameScene, con[1]));
      }
    }
    if(this.current) {
      this.current.update();
      // if(getButtonDown(Buttons.A)) {
      //   this.current.progress();
      // }
      if(this.current.done) {
        this.next()
      }
    }
    // if(this.index >= this.sequence.length) {
    //   this.done = true;
    //   return;
    // }
    // var current = this.sequence[this.index];
    // this.current = current;
    // current.update();
    // if(getButtonDown(Buttons.A)) {
    //   current.progress();
    // }
    // if(current.done) {
    //   this.next();
    // }
  }
  next() {
    if(this.lastSpeaker) {
      this.lastSpeaker.isTalking = false;
    }
    this.index += 1;
    if(this.index >= this.sequence.length) {
      this.done = true;
    } else {
      this.processData(this.sequence[this.index]);
    }
  }
  draw(canvas) {
    if(this.done&&!this.persist)return;
    // if(this.current&&this.current.draw)
      // this.current.draw();
    this.simpleDialogue.draw(canvas);
  }
}
