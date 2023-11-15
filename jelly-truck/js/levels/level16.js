window.JellyTruck.state.level16 = {
    preload: function(){       
          this.game.world.removeAll();
          //background
          this.bg;
          this.light;
          this.scene;
          this.ground_art;
          this.map = this.game.add.tilemap("level_16_map");
          this.phyBody = this.game.add.tilemap("map");

          //camera
          this.jellyCamera = {cx:0,cy:0,focx:-1,focy:-1,mode:0,zoom:1,width:640,height:640,levelZoom:1,scale:0.8};

          //player and flag
          this.player;
          this.flag;

          //objects
          this.statBody;
          this.scorePoint;
          this.failPoint;
          this.jellyObj;

          //Level win and fail
          this.win;
          this.restart;
          this.level_Fail = null;

         //score
          this.timeTrail;
          this.second;
          this.score;
          this.bonus;
          this.score_txt;
          this.spotLight;
          this.contact_count;
          this.truck_status;
          //Level Specific Objects
          this.enemy_truck;
          this.enemy_move;
          this.downArrows = [];
          this.lastWatchCall;
      },
      create: function() {
          //score,bonus and win
          this.win = false;
          this.restart=false;
          this.second = 1000;
          this.score=0;
          this.bonus=0;
          this.timeTrail=0;
          this.contact_count=0;
          this.truck_status=0;
          this.enemy_move=false;
          //level data
          this.game.mobLevel = "Level 16";
          this.game.levelNumber = "level16";
          this.game.nextlevelNumber = "level17";
          jt.current_level = 16;

          //init Game music and sound
          this.game.sound.stopAll();
          if(jt.sfx)
              jt.sfx.playMusic("evenbg");


          //setup sky background
          this.bg = new GameBg(this.game);

          //setup level scene
          this.scene = jt.setupScene(this.game,this.map,"scene_16",this.map.objects["Ground"][0].x-5,this.map.objects["Ground"][0].y-280,this.jellyCamera.width,this.jellyCamera.height,1000);
          this.jellyObj = jt.setupJellyObj(this.game,this.map,this.phyBody);
          this.game.world.setChildIndex(this.scene.art, 6);

          // setup static object
          this.statBody = jt.setupStaticObject(this.game,this.map,1000);

          //setup Score
          this.setupScore();

          //setup Flag
          this.setupFlag();

          //setup player
          this.player = jt.createTruck(this.game,this.scene.truck_x,this.scene.truck_y,this.scene.truck_type,this.phyBody);
          this.enemy_truck = this.createEnemy(this.game,567,663,this.phyBody);

          //setup Fail
          this.setupFail();
        
          //setup game menu
          if(jt.game_menu !=null)
              jt.game_menu.killMenu();
          jt.game_menu = new GameMenu(this.game);
          jt.game_menu.enable();

          //setup keyboard
          jt.initInput(this.game);
        //  if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)){
        //         jt.gameController(this.game);
        //  }

        var transform = [{x:4725, y:750, r:0}, {x:4920, y:1428, r:90}, {x:1347,y:1381, r:0}, {x:1148, y:2092, r:-90}];
        for(var i = 0; i < transform.length; i++){
            this.downArrows[i] = this.game.add.sprite(transform[i].x, transform[i].y, "downArrow");
            this.anim = this.downArrows[i].animations.add('down');
            this.downArrows[i].animations.play('down', 30, true);
            this.downArrows[i].rotation = Phaser.Math.degToRad(transform[i].r);
        }
        this.levelEnds = [4949, 1150, 5110];                          

      },
      // Level Pause and Resume
      onGamePause:function()
      {

      },
      onGameResume:function(){

      },
      //Level Update and Render
      updateCamera: function () {
          this._plx = this.player.truck.getSprite().x;
          this._ply = this.player.truck.getSprite().y;             
          var offset = this.findCurrentLevel(this.enemy_truck)%2!=0?-200:70;
          this._vlc = Math.abs(this.player.truck.getBox().data.m_linearVelocity.x);
          this.jellyCamera = jt.updateCamera(this.game, this.jellyCamera, this._plx+offset, this._ply, this._vlc, this.win, this.restart, jt.pause);
      },
      update: function(){
          this.updateCamera();
          if(jt.sfx)
            jt.sfx.loopMusic("evenbg");

          if(!this.win && !this.restart && !jt.pause)
          {
              this.timeTrail++;
          if(this.timeTrail%10==0){
                  this.second--;
              }
              this.keyEvent();
              this.truckSound();
              this.enemyUpdate();

            if(this.lastWatchCall + 1 < this.game.time.totalElapsedSeconds()){
                this.lastWatchCall = this.game.time.totalElapsedSeconds();             
            }

            }
          else if(this.win)
          {
              if(this.flag.joint)
                     this.game.physics.box2d.world.DestroyJoint(this.flag.joint);

          }
          else if(this.restart)
          {
              this.game.physics.box2d.world.DestroyJoint(this.player.joint1);
              this.game.physics.box2d.world.DestroyJoint(this.player.joint2);
          }
          if(this.restart && this.level_Fail && this.level_Fail.space.isDown)
              this.level_Fail.restartBtnClicked();
      },
      render:function(){
          if(this.jellyObj)
          {
              for(var i=0;i<this.jellyObj.length;i++)
                  this.jellyObj[i].renderJelly();
          }
          this.renderPlayer();
          if(jt.phy_debug){
          this.game.physics.box2d.debugDraw.joints = true;
              this.game.debug.box2dWorld();
      }
      },
      renderPlayer:function()
      {
          this.player.truck.renderJelly();
          this.player.front.renderJelly();
          this.player.back.renderJelly();
          this.enemy_truck.truck.renderJelly(true);
      },
      //Keyboard Event
      keyEvent:function() {
          jt.resetInput();
          if(!jt.pause && !this.restart && !this.win)
          {
              jt.updateinput();
              jt.gameAction(this.game,this.player.truck.getBox(),this.player.front.getBox(),this.player.back.getBox(),9,true);
          }

          if((jt.up || jt.down || jt.left || jt.right || jt.mobileleft || jt.mobileright||jt.mobileup||jt.mobiledown) && !this.enemy_move)
          // Add a delay so that the player has enough time to move and keep a distance
              this.game.time.events.add(Phaser.Timer.SECOND*0.5, function(){
                  this.enemy_move = true;
                  this.lastWatchCall = this.game.time.totalElapsedSeconds();
                },this);
      },
      truckSound:function(){
           if(jt.truck_speed && jt.truck_move>10)
              {
                  jt.sfx.stopSound("truck_idle");
                   jt.sfx.stopSound("truck_slow");
                  jt.sfx.playTruckSound("truck_speed");
              }
          else
          {
              jt.sfx.stopSound("truck_speed");
              if(jt.truck_move>30)
                  jt.sfx.playTruckSound("truck_slow");
              if(jt.truck_move==0)
              {
                   jt.sfx.stopSound("truck_speed");
                   jt.sfx.stopSound("truck_slow");
                   jt.sfx.playTruckSound("truck_idle");
              }
          }
            this._x1 = this.player.truck.getBody(0).x;
            this._y1 = this.player.truck.getBody(0).y;
            this._x2 = this.player.truck.getBody(6).x;
            this._y2 = this.player.truck.getBody(6).y;
            if((this._y2-this._y1)<-20 && !jt.pause && !this.restart && !this.win)
               if(jt.sfx)
               {
                       jt.sfx.truck_speed.volume = 0.7;
                       jt.sfx.playTruckSound("truck_wob");
               }
               else
                   jt.sfx.truck_speed.volume = 1;
          },
      //Score and Bonus
      setupScore:function() {
         this.scorePoint = jt.setupScoreObject(this.game,this.map);
          for(var i=0;i<this.scorePoint.length;i++)
              this.scorePoint[i].setCategoryContactCallback(TRUCK_CATEGORYBITS,this.scoreCollision,this);
      this.spotLight = this.scorePoint.length;
      },
      scoreCollision: function(body1, body2, fixture1, fixture2, begin) {
          if(begin)
              {
          body1.destroy();
          this.contact_count++;
              }
      else
              {
           this.contact_count=0;
              }
      if(this.contact_count === 1)
              {
          var value = this.second/ this.spotLight;
                  this.score +=value;
                  if(jt.game_menu !=null)
                  jt.game_menu.setScore(this.score);
                  this.spotLight--;
              }
      },
      //Fail
      setupFail:function(){
          if(this.enemy_truck)
          for(var i=0;i<this.enemy_truck.length;i++){
            this.enemy_truck.truck.getBody(i).setCategoryContactCallback(TRUCK_CATEGORYBITS,this.failCollision,this);
            this.enemy_truck.truck.getBody(i).setCategoryContactCallback(WHEEL_CATEGORYBITS,this.failCollision,this);
          }

          this.enemy_truck.back.setCategoryContactCallback(TRUCK_CATEGORYBITS,this.failCollision,this);
          this.enemy_truck.back.setCategoryContactCallback(WHEEL_CATEGORYBITS,this.failCollision,this);

          this.enemy_truck.front.setCategoryContactCallback(TRUCK_CATEGORYBITS,this.failCollision,this);
          this.enemy_truck.front.setCategoryContactCallback(WHEEL_CATEGORYBITS,this.failCollision,this);
      },
      failCollision: function(body1, body2, fixture1, fixture2, begin){
          if(begin && !this.win && !this.restart && !jt.pause)            
           {
             // body1.destroy();
              this.restart = true;
              this.jellyCamera.cx = (this.player.truck.getSprite().x - (this.jellyCamera.width / 2));
              this.jellyCamera.cy = (this.player.truck.getSprite().y - (this.jellyCamera.height / 2));
              if(jt.game_menu!=null)
              jt.game_menu.score_txt.visible =false;
          if(jt.game_fail == null)
          {
              jt.game_fail = new LevelFail(this.game);
              jt.game_fail.updateFail();
          }
          jt.sfx.stopSound("truck_idle");
          jt.sfx.stopSound("truck_speed");
          jt.sfx.stopSound("truck_slow");
          jt.sfx.playTruckSound("truck_bang1")
           }
      },
     // Flag
      setupFlag: function() {
       this.flag = jt.createFlag(this.game,"flag_head","flag_mid","flag_bot",this.map);
       this.flag.head.body.setCategoryContactCallback(TRUCK_CATEGORYBITS,this.flagCollision,this);
       this.flag.middle.body.setCategoryContactCallback(TRUCK_CATEGORYBITS,this.flagCollision,this);
       this.flag.bottom.body.setCategoryContactCallback(TRUCK_CATEGORYBITS,this.flagCollision,this);
      },
      flagCollision: function(body1, body2, fixture1, fixture2, begin){

          if(!this.win){
              this.win =true;
              this.jellyCamera.cx = (this.player.truck.getSprite().x -(this.jellyCamera.width/2));
              this.jellyCamera.cx = (this.player.truck.getSprite().x -(this.jellyCamera.height/2));
              this.cameraY = (this.player.truck.getSprite().y -(this.cameraHeight/2));
              this.str = jt.getStar(this.score,this.second);
              this.flag.head.body.applyForce(150,0);
              this.flag.middle.body.applyForce(150,0);
              this.flag.bottom.body.applyForce(150,0);
              this.flag.head.body.sensor = true;
              this.flag.middle.body.sensor = true;
              this.flag.bottom.body.sensor = true;
              this.player.truck.getBox().linearDamping = 20;
              this.player.truck.getBox().angularDampiong = 20;
              this.player.front.getBox().linearDamping = 20;
              this.player.front.getBox().angularDampiong = 20;
              this.player.back.getBox().linearDamping = 20;
              this.player.back.getBox().angularDampiong = 20;
              if(jt.game_menu!=null)
                jt.game_menu.disable();
              if(jt.well_done==null)
                jt.well_done = new WellDone(this.game,this.score,this.second,this.str);
           }

      },
      // ShutDown
      shutdown: function () {
        this.map.destroy();
        this.phyBody.destroy();
        
        this.game.physics.box2d.clear();
        this.game.world.removeAll();
		
		this.bg.destroy();
		this.scene.art.destroy();
		//this.ground_art.destroy();
		
		for(var i=0;i<this.statBody.length;i++)
			 this.game.physics.box2d.world.DestroyBody(this.statBody[i]);
		this.statBody.clear();
		this.statBody = null;
		
		for(var i=0;i<this.scorePoint.length;i++)
			 this.game.physics.box2d.world.DestroyBody(this.scorePoint[i]);
        this.scorePoint.clear();
		this.scorePoint=null;
			
		for(var i=0;i<this.jellyObj.length;i++)
			this.jellyObj[i].destroy();
        this.jellyObj.clear();
        this.jellyObj = null;
        
   
		
        this.scene.grounds[0].destroy();
        
        this.scene=null;
        if(this.joint_ground)
            this.game.physics.box2d.world.DestroyBody(this.joint_ground);
            
		this.player.truck.destroy();
		this.player.truck=null;
		this.player.front.destroy();
		this.player.front=null;
        this.player.back.destroy();
        
        this.flag.head.destroy();
        this.flag.head=null;
        this.flag.middle.destroy();
        this.flag.middle =null;
        this.flag.bottom.destroy();
        this.flag.bottom = null;        
    },
     // End Shutdown
      //Level Specfic object Methods
      createEnemy: function(game, x, y, map) {
        var etk;
        var ebk;
        var eft;
        var ej1;
        var ej2;
        etk = new Jelly(game, "Enemy_Truck", x, y, map, "Auto_Truck", 0.5, 0.5, -1);
        etk.setIndex(-80);
        etk.collisionFilter(ALLTOUCH_CATEGORYBITS,ALLTOUCH_MASKBITS);

        ebk = game.add.sprite(632,688,"Enemy_Truck_Back");
        game.physics.box2d.enable(ebk);
        ebk.body.setCircle(33,0,0);
        ebk.body.setCollisionCategory(ALLTOUCH_CATEGORYBITS);
        ebk.body.setCollisionMask(ALLTOUCH_MASKBITS);
        ebk.body.mass = 10;
        for (var f = ebk.body.data.GetFixtureList(); f; f = f.GetNext())
        {
           var filter = f.GetFilterData();
           filter.groupIndex = -80;
        }

        eft = game.add.sprite(518,700,"Enemy_Truck_Front");
        game.physics.box2d.enable(eft);
        eft.body.setCircle(21,0,0);
        eft.body.setCollisionCategory(ALLTOUCH_CATEGORYBITS);
        eft.body.setCollisionMask(ALLTOUCH_MASKBITS);
        eft.body.mass = 10;
        for (var f = eft.body.data.GetFixtureList(); f; f = f.GetNext())
        {
           var filter = f.GetFilterData();
           filter.groupIndex = -80;
        }
        ej1 = game.physics.box2d.revoluteJoint(etk.getBody(4), ebk.body,-28,15);
        ej2 = game.physics.box2d.revoluteJoint(etk.getBody(8), eft.body);
        this.game.world.swapChildren(etk.getSprite(), eft);
        return {
            truck:etk,
            front:eft.body,
            back:ebk.body,
            jointfront:ej2,
            jointback:ej1
        };
      },

      enemyUpdate:function()
      {      
        if(this.enemy_move)
        {
            var distance = Phaser.Math.distance(
                    this.enemy_truck.truck.getBox().x, 
                    this.enemy_truck.truck.getBox().y, 
                    this.player.truck.getBox().x,
                    this.player.truck.getBox().y);
            var minDistance = 350;
            var maxDistance = 950;            
            var distanceClamp = Phaser.Math.clamp(distance, minDistance, maxDistance);
            var minSpeed = 20;
            var maxSpeed = 50;            
            var speed = minSpeed + (distanceClamp - minDistance)/(maxDistance - minDistance)*(maxSpeed - minSpeed);
            
            if(distance < 350){
                speed /= 1.12;                
                if(Math.abs(this.enemy_truck.back.velocity.x) > 10){
                    this.enemy_truck.back.velocity.x /= 1.12;
                    this.enemy_truck.front.velocity.x /= 1.12;
                }
            }
            
            var truckLevel = this.findCurrentLevel(this.player);
            var enemyLevel = this.findCurrentLevel(this.enemy_truck);
            var target = truckLevel == enemyLevel ? this.player.truck.getBox().x:this.levelEnds[enemyLevel-1];

            if(this.enemy_truck.truck.getBox().x < target)// Level 1, or 3
            {
                this.enemy_truck.jointback.SetMotorSpeed(speed);
                this.enemy_truck.jointback.SetMaxMotorTorque(360);
                this.enemy_truck.jointback.EnableMotor(true);

                this.enemy_truck.jointfront.SetMotorSpeed(speed);
                this.enemy_truck.jointfront.SetMaxMotorTorque(120);
                this.enemy_truck.jointfront.EnableMotor(true);
            }
            else // Level 2
            {
                this.enemy_truck.jointback.SetMotorSpeed(-1*speed);
                this.enemy_truck.jointback.SetMaxMotorTorque(360);
                this.enemy_truck.jointback.EnableMotor(true);

                this.enemy_truck.jointfront.SetMotorSpeed(-1*speed);
                this.enemy_truck.jointfront.SetMaxMotorTorque(120);
                this.enemy_truck.jointfront.EnableMotor(true);
             }  
                          
            var angle = this.enemy_truck.truck.getBox().angle;

            if ((angle > 50 && angle < 180) || (angle < -50 && angle > -180)){
                this.game.physics.box2d.getBody(this.enemy_truck.truck.getBox()).ApplyTorque(-180 * angle);
            }

            if(enemyLevel == 1 && this.enemy_truck.truck.getBox().x > 4950){
                this.enemy_truck.back.velocity.x = 0;
                this.enemy_truck.front.velocity.x = 0;
            }
            else if(enemyLevel == 2 && this.enemy_truck.truck.getBox().x < 1200){
                this.enemy_truck.back.velocity.x = 0;
                this.enemy_truck.front.velocity.x = 0;
            }
        }
      },

    findCurrentLevel: function (obj) {
        var y = obj.truck.getBox().y;
        if (y < 1005) return 1;
        if (y < 1650) return 2;
        return 3;
    },
    moveBy: function (x, y) {
        var pieces = this.enemy_truck.truck.getBodies();
        for (var i = 0; i < pieces.length; i++) {
            pieces[i].getBody().x += x;
            pieces[i].getBody().y += y;
        }
        this.enemy_truck.front.x += x;
        this.enemy_truck.front.y += y;
        this.enemy_truck.back.x += x;
        this.enemy_truck.back.y += y;
    },
    moveTo: function(x, y) {
        var dx = x - this.enemy_truck.truck.getBox().x;
        var dy = y - this.enemy_truck.truck.getBox().y;
        this.moveBy(dx, dy);
    },    
  };