
class Player extends Mover{
  constructor() {
    super();
    this.x = 100;
    this.y = 100;
    // this.speed = 10;
    this.mx = 0;
    this.eyeMovement = {x:0,y:0, blink: 0, blinkTime: 10, tx: 0, ty: 0};
    // this.eyes = this.addShape(new Eyes(this));
    this.dead=false;
    this.player=true;
    this.isPlayer=true;
    this.color1 = "#666";
    this.color2 = "#222";
    this.jumpSoundType = SOUNDMAP.jump;
    this.bouncedOffEntity = false;
    this.holdingJump = false;
    this.bounceTimer = 0;
  }
  entityCollision(other, processedSecond, dx,dy) {
    // this.vx += dx;
    // if(this.vy<=0) {
    //   //dont modify if the player is moving downwards
    //   //otherwise it might mess up jumping off of detection
    //   this.vy += dy;
    // }
  }
  die() {
    if(this.dead)return;
    SOUNDMAP.playerDeath.play(this);
    this.dead=true;
    this.eyeMovement.x = -5;
    this.eyeMovement.y = 0;
      this.game.screenShakeLevel += 1;   
      this.game.frameStop = 10;         
      this.eyeMovement.blink = 0;
    this.animation = new Animation2(4, function(dt, frameCount) {
      this.mx = 0;
      this.angle = 0;
      this.width = this.w;
      this.height = this.h;
    }.bind(this), function() {
      var num = 20;
      if(particles.player.enabled)
      for(var i=0;i<20;i++) {
        var x = this.x + (Math.random()*this.w-this.w/2)/2;
        var y = this.y - (Math.random()*this.h)/2;
        var w = 10;
        var h = 10;
        var vx = Math.random()*5-2+this.vx/5;
        var vy = Math.random()*5-2-10;
        var color = "#666";
        if(i>=num-8) color = "#222";
        if(i>=num-4) color = "#33d"
        if(i>=num-2) color = "#fff"; 
        this.game.addEntity(new FallingParticle(x,y,w,h,vx,vy,100,color));
      }
      this.vy=-20;   
      this.invisible = true;  
      this.animation = new Animation2(60, function(dt, frameCount) {
        // this.y+=this.vy;
        // this.vy++;
      }.bind(this), function() {
        this.game.respawn(this.checkpoint);
      }.bind(this))
    }.bind(this))
    // this.game.respawn();
  }
  setCheckpoint(checkpoint) {
    // this.checkpoint = {
    //   x: checkpoint.x,
    //   y: checkpoint.y,
    //   powerUps: [],
    // };
    this.checkpoint = checkpoint;
    checkpoint.powerUps = [];
    this.powerUps.forEach(powerUp => checkpoint.powerUps.push(powerUp));
  }
  loadCheckpoint(checkpoint) {
    this.x = checkpoint.x;
    this.y = checkpoint.y;
    checkpoint.powerUps.forEach(powerUp => {
      powerUp(this, true);
    });
  }
  resetControls() {
    this.mx = 0;
  }
  update(dt, frameCount){
    if(this.bounceTimer>0)this.bounceTimer -= 1;
    if(this.animation) {
      this.animation.update(dt, frameCount);
      return;
    }
    this.updateEye(dt, frameCount);
    super.update(dt, frameCount);
    if(this.grounded && !this.wallcolliding && this.vx && this.mx && Math.floor(frameCount) % 10 == 0) {
      SOUNDMAP.footstep.play();
    }
  }
  // draw(canvas){
  //   super.draw(canvas);
  //   var box = this.getHitBox();
	// 	canvas.strokeRect(box.x, box.y, box.w, box.h);
  // }
  reset() {
    this.x=60;
    this.y=100;
    this.vx=0;
    this.vy=0;
    this.maxJumps=1;
    this.wallJumps=false;
    this.canDash=false;
    this.animation=null;
    this.invisible=false;
    this.dead=false;
    this.powerUps = [];
  }
  updateEye(dt, frameCount) {
    frameCount = Math.floor(frameCount);
    var t = frameCount%120;
    // if(t<10) {
    //   this.eyeMovement.blink = (1+Math.cos(t*Math.PI/20))/2;
    // } else {
    //   this.eyeMovement.blink = 0;
    // }
    // if(frameCount%120==0) {
    if(frameCount%60==0&&Math.random()>.5) {
      this.eyeMovement.blink = this.eyeMovement.blinkTime;
    }
    if(this.eyeMovement.blink>0) {
      this.eyeMovement.blink--;
    }
    if(this.mx==0) {
      if(Math.random()>.99) {
        this.eyeMovement.tx = Math.random()*6-3;
        this.eyeMovement.ty = Math.random()*5-4;
      }
      if(!this.crouching) {
        // if(frameCount%80<30) {
        //   this.width += 1;
        //   this.height -= 1;
        // } else {
        //   this.width -= 1;
        //   this.height += 1;
        // }
      }
    }else {
      this.eyeMovement.tx= 0;
      this.eyeMovement.ty= 0;
    }
    // this.eyeMovement.x = this.eyeMovement.tx;
    this.eyeMovement.x += (this.eyeMovement.tx-this.eyeMovement.x)/10;
    this.eyeMovement.y += (this.eyeMovement.ty-this.eyeMovement.y)/10;
  }
  drawTail(canvas, w,h) {
    canvas.fillStyle = 'brown';
    var width = 30;
    // canvas.fillRect(-w/2-width,-10,width,10);
    var dx = Math.cos(Date.now()/500)*10;
    var dy = 0;
    if(this.canWallJump) {
      dy = 10;
      canvas.fillStyle="#c60";
      canvas.lineWidth = 7;
      // canvas.fillStyle="#fff";
      width += 5;
    }
    var a = Math.cos(Date.now()/300)*Math.PI/30+Math.PI/20+this.vy/30;
    canvas.save();
    canvas.rotate(a);
    canvas.beginPath();
    canvas.moveTo(-w/2, -1);
    canvas.quadraticCurveTo(-w/2-width/2, -1, -w/2-width/2+dx/2,-width/2-dx/2);
    canvas.quadraticCurveTo(-w/2, -width, -w/2-width,-width-dx-dy);
    canvas.quadraticCurveTo(-w/2-width, -1, -w/2-10,-1);
    // canvas.closePath();
    if(this.canWallJump) {
      canvas.strokeStyle = "white";
      canvas.stroke();
    }  
    canvas.fill();    
    canvas.fillStyle = '#a42';    
    canvas.beginPath();
    canvas.moveTo(-w/2, -1);
    canvas.quadraticCurveTo(-w/2-width, -width/2, -w/2-width,-width-dx);
    canvas.quadraticCurveTo(-w/2-width, -1, -w/2-10,-1);
    // if(this.canWallJump) {
      // canvas.strokeStyle = "white";
      // canvas.stroke();
    // }    
    canvas.fill();    
    canvas.restore();
    
  }
  drawWings(canvas, w,h,s) {
    if(this.maxJumps<2)return;
    var d = s?7:3;
    var angle = 0;
    var ww = 40;
    var hh = 7;
    if(this.jumpCount==0) {
      ww=20;
      hh=5;
    }
    if(this.wallCollideTimer>0) {
      ww=20;
      hh=5;
    }
    var color1 = "#000";
    if(this.jumpCount<this.maxJumps) {
      angle = Math.PI/10+this.vy/10;
      // if(this.jumpCount>0)
      //   color1 = "#fff";
    } else {
      angle = -Math.PI/4+this.vy/10;
      ww=5;
    }
    canvas.fillStyle = s?color1:this.color2;
    canvas.beginPath();
    // canvas.rect(-w/2-ww/2,-h/2, ww,hh);
    // canvas.rect(w/2,-h/2, ww,hh);
    var y = -h-angle*10;
    this.pathWingAtAngle(canvas, -w/2-ww*.8-d/2,y-d/2, ww+d,hh+d, ww*.8, hh/2, angle);
    this.pathWingAtAngle(canvas,w*.3-d/2,y-d/2, ww+d,hh+d, ww*.2+d, hh/2, -angle);
    if(s)canvas.stroke(); 
    canvas.fill();
  }
  pathWingAtAngle(canvas, x,y,w,h, px,py, angle) {
    canvas.save();
    canvas.translate(x+px, y+py);
    canvas.rotate(angle);
    canvas.rect(-px,-py-10,w,h);
    canvas.rect(-px*.8,-py,w*.8,h);
    canvas.rect(-px*.5,-py+5,w*.5,h);
    canvas.restore();
  }
  drawShape(canvas,w,h) {
    if(this.wallJumps) this.drawTail(canvas, w,h);
    canvas.save();
    // canvas.strokeStyle = "#000";
    // canvas.lineWidth=7;
    // if(this.jumpCount<this.maxJumps&&this.jumpCount>0&&!(this.wallJumps&&this.wallCollideTimer>0)) {
    canvas.lineWidth = 6;
    if(this.jumpCount<this.maxJumps&&this.jumpCount>0) {
      canvas.strokeStyle="white";
    }
    this.drawWings(canvas,w,h,1);    
    this.drawWings(canvas,w,h);  
    canvas.fillStyle = "#000";      
    canvas.fillRect(-w/2-1-3,-h-1-3,w+2+6,h+2+6);
    // canvas.fillStyle = "#73d";
    canvas.fillStyle = "#666";    
    
    // canvas.fillStyle = "#999";
    canvas.fillRect(-w/2,-h,w,h);
    // canvas.fillStyle = "#74e";
    // canvas.fillStyle = "#ddd";
    canvas.fillStyle = "#222";
    
    var shadeX = w*.4+this.eyeMovement.x/2;
    if(this.dead)shadeX-=5;
    canvas.fillRect(-w/2,-h,shadeX,h);
    var pantsHeight = h/8;
    canvas.fillStyle = "#33d";
    canvas.fillRect(-w/2,-pantsHeight,w,pantsHeight);    
    canvas.fillStyle = "#44e";
    canvas.fillRect(0,-pantsHeight,w/2,pantsHeight);        
    
    
    canvas.fillStyle="#fff";
    var squint = 1-.6*Math.abs(this.vy)/this.terminalVelocity;
    var eyey = -h*.8 + this.eyeMovement.y;
    var eyex = 6 + this.eyeMovement.x;
    var eyed = 10 - this.eyeMovement.x/3;
    
    if(this.crouching) {
      // squint *= .2;
    }
    var blink = 0;
    if(this.eyeMovement.blink>0) {
      var t = this.eyeMovement.blinkTime - this.eyeMovement.blink+1;
      blink = (1+Math.cos(t*Math.PI/20))/2;
    }
    squint*= (1-blink);
    eyey += blink*4;
    // eyey -= this.width/this.w * 5;
    var eyh = 8*squint;
    var eyh2 = eyh;
    if(this.crouching) {
      // eyed += 2;
      eyex += 2;
    }
    canvas.fillRect(eyex-eyed,eyey,8,eyh);
    canvas.fillRect(eyex,eyey,6,eyh2);

    if(this.canDash) {
      // this.drawWoofMouth(canvas, eyex-w*.1,eyey+h*.2,w*.5,h*.4);
      this.drawWoofMouth(canvas, eyex-w*.1,eyey+10,w*.5,-h*.1);
    }

    w=this.w;
    canvas.translate(0,-h);
    var hatAngle = Math.abs(this.angle);
    if(hatAngle>Math.PI/4)hatAngle=Math.PI/4;
    canvas.rotate(-hatAngle);
    canvas.rotate(0);

    if(this.canDash) {
      canvas.strokeStyle = "#000";
      canvas.lineWidth = 5;
      if(this.crouching&&this.dashCount==0) {
        canvas.strokeStyle = "#fff";
        canvas.lineWidth = 8;
      }
      canvas.beginPath();
      canvas.rect(w*.1, -20, 4,4);
      canvas.rect(-w*.5, -20, 4,4);
      canvas.fillStyle = "#888";  
      canvas.stroke();  
      canvas.fill();
    } 

    canvas.fillStyle = "#000";
    // canvas.fillStyle = "#444";
    canvas.beginPath();
    canvas.rect(-w/2-1-3,-4-3,w+9+6,4+6);
    canvas.rect(-w/2-1-3,-12-3,w-3+6,12+6);
    canvas.fill();

    canvas.fillStyle = "#f4d";
    // canvas.fillStyle = "#444";
    canvas.beginPath();
    canvas.rect(-w/2-1,-4,w+9,4);
    canvas.rect(-w/2-1,-12,w-3,12);
    canvas.fill();

    canvas.fillStyle = "#c2d";
    // canvas.fillStyle = "#111";
    canvas.beginPath();
    canvas.rect(-w/2-1,-4,(w+9)/4,4);
    canvas.rect(-w/2-1,-12,(w-3)/2,12);
    canvas.fill();
    
    canvas.restore();    

    this.shapes.forEach(s=>s.drawShape(canvas,w,h));

  }
  drawWoofMouth(canvas, x,y,w,h) {
    canvas.save();
    canvas.translate(x,y);
    canvas.strokeStyle = "#fff";
    canvas.lineWidth = 1;
    if(this.crouching&&this.dashCount==0)canvas.lineWidth=3;
    canvas.linecap="round";
    canvas.beginPath();
    // canvas.moveTo(-w/2,2);
    canvas.moveTo(-w/2,h/4);
    canvas.lineTo(-w/7,2);
    canvas.lineTo(0,h/4);
    canvas.lineTo(w/7,2);    
    canvas.lineTo(w/2,h/4);    
    // canvas.lineTo(w/2,2);  
    canvas.stroke();
    canvas.restore();
  }
  bounceOffEntity(enemy, amt) {
    this.groundCollide(this.y, true);
    this.bounceTimer = 10;
    // var jr = this.jumpRelease;
    var d = (amt || amt==0) ? amt : 20;
    this.jump(d, true);
    // if(!this.bouncedOffEntity)
    SOUNDMAP.bounce.play();
    this.bouncedOffEntity = true;
    // if(this.vy<=0)
    // this.jumpRelease=jr;
  }
  groundCollide(y, animationless) {
    super.groundCollide(y,animationless);
    this.bouncedOffEntity = false;
  }  
  getHitByEntity(enemy) {
    if (enemy.killPlayer)
      this.die();
  }
  
  
}
Player.controls = {
  right: {down: function() {if (this.crouching) this.dash(1);}, held: function() { this.mx += 1; }},
  left: {down: function() {if (this.crouching) this.dash(-1);}, held: function() { this.mx -= 1; }},
  up: {
    down: function() { this.holdingJump = true; if(!this.dead)this.jump(); },
    up: function() { this.holdingJump = false; if(!this.dead && !this.bouncedOffEntity){this.shortJump(); this.eyeMovement.ty = 0;} },
    held: function() { this.holdingJump = true; this.eyeMovement.ty = - 6; this.height += .5; this.width -= .5},
  },
  down: {down: function() { this.crouch(); }, noneheld: function() { this.uncrouch(); }},
  dash: { down: function() { this.dash(); }},
};
