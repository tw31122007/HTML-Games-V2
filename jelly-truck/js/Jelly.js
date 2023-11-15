var STAND  = 0;
var GUM    = 1;
var BRIDGE = 2;
var LIFT   = 3;
var TRUCK  = 4;
var CIRCLE = 5;
var BALLOON = 6;
var WHEEL = 7;
function Jelly(game,tex_name,x,y,map,obj_name,offx,offy,index)
{
    this.game = game;
    this._sprite = this.game.add.image(x,y,tex_name);
    this._sprite.anchor.set(offx,offy);
    this._xp = x;
    this._yp = y;
    this._bodies =[];
    this._pop ={tx:0,ty:0,tw:0,th:0,ta:0,td:0,tf:0,tb:0,tad:0,tld:0,se:false,fx:false,cb:0,mb:0,ot:0,jot:0,lm:false,jll:0,jul:0,mo:false,msp:0,mtq:0,sp:[],st:false,gr:0,bl:false,arc:0.0};
    this._box;
    this._bump;
    this._vbump = {tx:0,ty:0,tw:0,th:0};
    this._index = index;
    this._mask = this.game.add.graphics(0, 0);
    this._createJelly(map,obj_name);
    
    this.joint;
    this.time_trail =0;
    this._exSprite;
    this._link =[];
    this.object_name = obj_name;
    this.renderJelly();
    //  this._index=index;

};
Jelly.prototype.enablePrimatic = function(ground,low,up,ax,ay)
{
        this._bodyA = ground;
        this._bodyB = this._box;
        this.la = new box2d.b2Vec2();
        this.lb = new box2d.b2Vec2();
        this._bodyA.toLocalPoint(this.la, new box2d.b2Vec2(this._box.x,this._box.y));
        this._bodyB.toLocalPoint(this.lb, new box2d.b2Vec2(this._box.x,this._box.y));
        this.xs = Math.cos(-40 * Math.PI / 180);
	      this.ys = Math.sin(-40 * Math.PI / 180);
        this.xs = (this.xs * 1000)/1000;
        this.ys = (this.ys * 1000)/1000;
        this.joint = this.game.physics.box2d.prismaticJoint(this._bodyA,this._bodyB,ax,ay,this.la.x,this.la.y,this.lb.x,this.lb.y,0,0,false,low,up,true);
        this.joint.collideConnected = false;
};
Jelly.prototype.enablePrimatic1 = function(xp,yp,ground,low,up,ax,ay)
{
        this._bodyA = ground;
        this._bodyB = this._box;
        this.la = new box2d.b2Vec2();
        this.lb = new box2d.b2Vec2();
        this._bodyA.toLocalPoint(this.la, new box2d.b2Vec2(this._box.x,this._box.y));
        this._bodyB.toLocalPoint(this.lb, new box2d.b2Vec2(this._box.x,this._box.y));
        this.xs = Math.cos(-40 * Math.PI / 180);
	      this.ys = Math.sin(-40 * Math.PI / 180);
        this.xs = (this.xs * 1000)/1000;
        this.ys = (this.ys * 1000)/1000;
        this.joint = this.game.physics.box2d.prismaticJoint(this._bodyA,this._bodyB,ax,ay,xp,yp,this.lb.x,this.lb.y,0,0,false,low,up,true);
        this.joint.collideConnected = false;
};
Jelly.prototype.enableRevolute = function(ground,speed,torque,motor,low,up,limit)
{
        this._bodyA = ground;
        this._bodyB = this._box;
        this.la = new box2d.b2Vec2();
        this.lb = new box2d.b2Vec2();
        this._bodyA.toLocalPoint(this.la, new box2d.b2Vec2(this._box.x,this._box.y));
        this._bodyB.toLocalPoint(this.lb, new box2d.b2Vec2(this._box.x,this._box.y));
        this.joint = this.game.physics.box2d.revoluteJoint(this._bodyA,this._bodyB,this.la.x,this.la.y,this.lb.x,this.lb.y,speed,torque,motor,low,up,limit);
        this.joint.collideConnected = false;
};
Jelly.prototype.disableJoint = function()
{
     if (this.joint)
         this.game.physics.box2d.world.DestroyJoint(this.joint);
};
Jelly.prototype.disable = function() {
    this.disabled = true;
  for(var j=0;j<this._bodies.length;j++)
     this._bodies[j].getBody().sensor =true;
     this._box.static=true;
     this._box.sensor=true;
     this._sprite.visible=false;

};
Jelly.prototype.SetAngularDamp= function(val) {
    for(var j=0;j<this._bodies.length;j++)
       this._bodies[j].getBody().angularDampiong =val;
       this._box.angularDampiong =val;
  
};
Jelly.prototype.SetAngularVelocity = function(val,val1) {
    for(var j=0;j<this._bodies.length;j++)
      if(this._bodies[j].getBody().data.GetAngularVelocity() <val)
        this._bodies[j].getBody().data.SetAngularVelocity(50);
  
};

Jelly.prototype.inactive = function() {
  for(var j=0;j<this._bodies.length;j++)
     this._bodies[j].getBody().sensor =true;
};
Jelly.prototype.active = function() {
  for(var j=0;j<this._bodies.length;j++)
     this._bodies[j].getBody().sensor =true;
};
Jelly.prototype.enable = function() {
  for(var j=0;j<this._bodies.length;j++)
     this._bodies[j].getBody().sensor =false;
     this._box.static=false;
//     this._box.sensor=false;
     this._sprite.visible=true;
     this.disabled = false;

};
Jelly.prototype.collisionFilter = function(categorybit,mask) {
  for(var j=0;j<this._bodies.length;j++)
  {
    this._bodies[j].getBody().setCollisionCategory(categorybit);
    this._bodies[j].getBody().setCollisionMask(mask);
    this._box.setCollisionCategory(categorybit);
    this._box.setCollisionMask(mask);
  }
};
Jelly.prototype.setGravity = function(val) {
  for(var j=0;j<this._bodies.length;j++)
  {
    this._bodies[j].getBody().gravityScale = val;
    this._box.gravityScale=val;
  }
};
Jelly.prototype.setIndex = function(inx){
  for(var j=0;j<this._bodies.length;j++)
     this._bodies[j].setIndex(inx)
};
Jelly.prototype.getX = function() {
    return this._xp;
};
Jelly.prototype.getMask = function(){
   return this._mask;
};
Jelly.prototype.getLocal = function() {
    this.la = new box2d.b2Vec2();
    this._box.toLocalPoint(this.la, new box2d.b2Vec2(this._box.x,this._box.y));
    return this.la;
};

Jelly.prototype.getY = function(){
    return this._yp;
};
Jelly.prototype.getSprite = function(){
return this._sprite;
};
/*Jelly.prototype.getexSprite = function(){
return this._exsprite;
};
Jelly.prototype.setexSprite = function(name){
 this._exsprite = this.game.add.sprite(this._box.x,this._box.y);
 this._exsprite.anchor.set(offx,offy);
};*/
Jelly.prototype.getBox = function(){
    return this._box;
};
Jelly.prototype.getCenter = function(){
    return this._bump;
};
Jelly.prototype.getBody = function(index){
    return this._bodies[index].getBody();
};
Jelly.prototype.getBodies = function(index){
    return this._bodies;
};
Jelly.prototype.toArrayInt = function(val)
{
    var b = val.split(',').map(function(item) {
    return parseInt(item, 10);
   });
   return b;
},
 Jelly.prototype.distance = function(_x1, _y1, _x2, _y2){
    return Math.sqrt(Math.pow((_x1 - _x2), 2) + Math.pow((_y1 - _y2), 2));
};
Jelly.prototype.direction = function(_x1,_y1,_x2,_y2) {
return Math.atan2(_y2 - _y1, _x2 - _x1);
};
Jelly.prototype._findBod3 = function(type,map,object)
{
      var _result ={tx:0,ty:0,tw:0,th:0,ta:0,td:0,tf:0,tb:0,tad:0,tld:0,se:false,fx:false,cb:0,mb:0,ot:0,jot:0,lm:false,jll:0,jul:0,mo:false,msp:0,mtq:0,sp:[],st:false,gr:0,bl:false,arc:0.0};
      map.objects[object].forEach(function(element){
      if(element.type === type) {
          _result.tx  = parseFloat((element.x + element.width/2).toFixed(3));
          _result.ty  = parseFloat((element.y + element.height/2).toFixed(3));
          _result.tw  = parseFloat((element.width).toFixed(3));
          _result.th  = parseFloat((element.height).toFixed(3));
          _result.ta  = parseFloat((element.rotation).toFixed(3));
          _result.td  = parseFloat((element.properties.density).toFixed(3));
          _result.tf  = parseFloat((element.properties.friction).toFixed(3));
          _result.tb  = parseFloat((element.properties.bounce).toFixed(3));
          _result.tad = parseFloat((element.properties.angulardamp).toFixed(3));
          _result.tld = parseFloat((element.properties.linerdamp).toFixed(3));
          _result.se  = element.properties.sensor;
          _result.fx  = element.properties.fixed;
          _result.cb  = element.properties.categorybit;
          _result.mb  = element.properties.maskbit;
          _result.ot  = element.properties.object_type;
          _result.jot = element.properties.joint_type;
          _result.lm  = element.properties.joint_limit;
          _result.jll = element.properties.joint_low_limit;
          _result.jul = element.properties.joint_up_limit;
          _result.mo  = element.properties.joint_motor;
          _result.msp = parseFloat((element.properties.joint_motor_speed).toFixed(3));
          _result.mtq = parseFloat((element.properties.joint_motor_torque).toFixed(3));
          _result.sp = element.properties.spojene.split(',').map(Number);

          _result.st = element.properties.static;
          _result.gr = element.properties.gravity;
          _result.bl  = element.properties.bullet;

          _result.arc  = parseFloat((element.properties.arc).toFixed(1));
        
     }
    });
    return _result;
};
Jelly.prototype._findJoint = function(type,map,object)
{
      var _result=[];
      var tx =this._pop.tx,ty=this._pop.ty;
      var xpos = this._xp;
      var ypos = this._yp;
      map.objects[object].forEach(function(element){
      if(element.type === type){
         this.jx  = tx - (parseFloat((element.x + element.width/2).toFixed(3)));
         this.jy  = ty - (parseFloat((element.y + element.height/2).toFixed(3)));
         this.bA = element.properties.bodyA;
         this.bB = element.properties.bodyB;
         var po = {x:xpos-this.jx,y:ypos-this.jy,b1:this.bA,b2:this.bB};
         _result.push(po);
       }
     });
     return _result;
};
Jelly.prototype._findBod2 = function(type,map,object)
{
     var b2;
      map.objects[object].forEach(function(element){
      if(element.type === type) {
          b2 = element.polyline;
      }
      });
    return b2;
};
Jelly.prototype._findBod1 = function(type,map,object)
{
     var b1;
      map.objects[object].forEach(function(element){
      if(element.type === type) {
          b1 = element.polyline;
      }
      });
    return b1;
};
Jelly.prototype.kill=function()
{
  this._mask.destroy();
  this._sprite.destroy();
/*  if(this._box!=null)
    this._box.destroy();
  for(var i=0;i<this._bodies.length;i++)
     this._bodies[i].getBody().destroy();*/

};
Jelly.prototype.change = function(tex_name) {
  this._sprite.destroy();
  this._sprite = this.game.add.image(this._spr,this._yp,tex_name);
};
Jelly.prototype._addBox = function()
{
    this._box = new Phaser.Physics.Box2D.Body(this.game,null,this._xp,this._yp,2);
    this._box.setRectangle(this._pop.tw,this._pop.th,0,0);
    this._box.angle = this._pop.ta;
    this._box.mass = this._pop.td;
    this._box.friction = this._pop.tf;
    this._box.restitution = this._pop.tb;
    this._box.linearDamping = this._pop.tld;
    this._box.angularDampiong =this._pop.tad;
    this._box.fixedRotation = this._pop.fx;
    this._box.sensor = true;//this._pop.se;
    this._box.static = this._pop.st;
    this._box.bullet = this._pop.bl;
    this._box.gravityScale = this._pop.gr;
    this._box.setCollisionCategory(this._pop.cb);
    this._box.setCollisionMask(this._pop.mb);
    this._box.data.userData = {name:"truck"}
    //this._box.setCollisionMask(this._pop.mb);
};
/*Jelly.prototype._createPoly = function()
{
    var dp = this._bod1.length;

	for( var i=0;i<dp;i++)
	{
		if( i < dp-1)
		{
           this.poly =[(this._pop.tx +this._bod2[i][0])-this._xp,   (this._pop.ty +this._bod2[i][1])-this._yp,
                       (this._pop.tx +this._bod2[i+1][0])-this._xp, (this._pop.ty +this._bod2[i+1][1])-this._yp,
			           (this._pop.tx +this._bod1[i+1][0])-this._xp, (this._pop.ty +this._bod1[i+1][1])-this._yp,
                       (this._pop.tx +this._bod1[i][0])-this._xp,  (this._pop.ty +this._bod1[i][1])-this._yp]
        this._jbody = new JellyPeace(this.game,this._xp,this._yp,this._pop.td,this._pop.tf,this._pop.tb,this._pop.tad,this._pop.tld,false,true,this._pop.cb,this._pop.mb,this.poly);
        this._bodies.push(this._jbody);
        }
        else
        {

        }
    }
},*/
Jelly.prototype._findbump = function(type,map,object)
{
    var _result ={tx:0,ty:0,tw:0,th:0};
    var tx =this._pop.tx,ty=this._pop.ty;
    map.objects[object].forEach(function(element){
    if(element.type === type) {
           this._bx = parseInt((element.x + element.width/2)) - tx;
           this._by = parseInt((element.y + element.height/2))-ty;
          _result.tx  = (this._bx).toFixed(0);
          _result.ty  = (this._by).toFixed(0);
          _result.tw  = parseFloat((element.width).toFixed(3));
          _result.th  = parseFloat((element.height).toFixed(3));
     }
    });
    return _result;
};
Jelly.prototype._addBump = function()
{
    this._bux = this._xp;
    this._buy = parseInt(this._yp) + parseInt(this._vbump.ty);
    this._bump = new Phaser.Physics.Box2D.Body(this.game,null,this._xp,this._buy,2);
    this._bump.setRectangle(this._vbump.tw,this._vbump.th,0,0);
    this._bump.angle = this._pop.ta;
    this._bump.mass = this._pop.td;
    this._bump.friction = this._pop.tf;
    this._bump.restitution = this._pop.tb;
    this._bump.linearDamping = this._pop.tld;
    this._bump.angularDampiong =this._pop.tad;
    this._bump.fixedRotation = this._pop.fx;
    this._bump.sensor = true;//this._pop.se;
    this._bump.static = this._pop.st;
    this._bump.bullet = this._pop.bl;
    this._bump.gravityScale = this._pop.gr;
    this._bump.setCollisionCategory(this._pop.cb);
    this._bump.setCollisionMask(this._pop.mb);
  // this._bump.data.userData = {name:"truck"}
    //this._box.setCollisionMask(this._pop.mb);
   // var dir = this.direction(this._bump.x,this._bump.y,this._box.x,this._box.y);
  //  this._firstJoint(this._box,this._bump,this._bump.x,this._bump.y,dir);
};
Jelly.prototype._findPoly = function(type,map,object)
{
    var result = [];
    var tx =this._pop.tx,ty=this._pop.ty;
    var po = this._pop;
    var ga = this.game;
    var xpos = this._xp;
    var ypos = this._yp;
    var inx = this._index;
    map.objects[object].forEach(function(element){
        if(element.type === type)
        {
            var x = tx - element.x;
            var y = ty - element.y;
            var poly =[element.polygon[0][0],element.polygon[0][1],
                       element.polygon[1][0],element.polygon[1][1],
			           element.polygon[2][0],element.polygon[2][1],
                       element.polygon[3][0],element.polygon[3][1]];
           this._jbody = new JellyPeace(ga,xpos-x,ypos-y,po.td,po.tf,po.tb,po.tad,po.tld,false,false,po.cb,po.mb,poly,inx,po.ot,po.gr);

            result.push(this._jbody);
        }
    });
    return result;
};
Jelly.prototype.applyJelly = function(obj) {
  for(var i=0;i<obj.length;i++)
      for(var j=0;j<this._pop.sp.length;j++)
          if(i === this._pop.sp[j])
             obj[i].setSpojene(true);
};
Jelly.prototype._firstJoint = function(bodyA,bodyB,x,y,angle)
{
    this.la = new box2d.b2Vec2();
    this.lb = new box2d.b2Vec2();
    bodyA.toLocalPoint(this.la, new box2d.b2Vec2(x,y));
    bodyB.toLocalPoint(this.lb, new box2d.b2Vec2(x,y));
    this.xs = Math.cos(angle * Math.PI / 180);
	  this.ys = Math.sin(angle * Math.PI / 180);
    this.xs = (this.xs * 1000)/1000;
    this.ys = (this.ys * 1000)/1000;
    this.joint = this.game.physics.box2d.prismaticJoint(bodyA,bodyB,this.xs,this.ys,this.la.x,this.la.y,0,0,0,0,false,this._pop.jll,this._pop.jul,this._pop.lm);
    this.joint.collideConnected = true;
  //  this.jointList.push(this.joint);
};

Jelly.prototype._outlineJoint = function(bodyA,bodyB,x,y,angle)
{
  /*  this.la = new box2d.b2Vec2();
    this.lb = new box2d.b2Vec2();
    bodyA.toLocalPoint(this.la, new box2d.b2Vec2(x,y));
    bodyB.toLocalPoint(this.lb, new box2d.b2Vec2(x,y));
    this.joint = this.game.physics.box2d.weldJoint(bodyA,bodyB,this.la.x,this.la.y,this.lb.x,this.lb.y,30,2);
    this.joint.collideConnected = true;*/
        var len = this.distance(bodyA.x,bodyA.y,bodyB.x,bodyB.y);
    this.la = new box2d.b2Vec2();
    this.lb = new box2d.b2Vec2();
    bodyA.toLocalPoint(this.la, new box2d.b2Vec2(x,y));
    bodyB.toLocalPoint(this.lb, new box2d.b2Vec2(x,y));
    this.xs = Math.cos(angle * Math.PI / 180);
	  this.ys = Math.sin(angle * Math.PI / 180);
    this.xs = (this.xs * 1000)/1000;
    this.ys = (this.ys * 1000)/1000;
    this.joint = this.game.physics.box2d.prismaticJoint(bodyA,bodyB,this.xs,this.ys,this.la.x,this.la.y,this.lb.x,this.lb.y,0,0,false,0,0,true);
    this.joint.collideConnected = true;
//    this.jointList.push(this.joint);
};
Jelly.prototype._createBoxLink = function(obj) {
  for(var i=0;i<obj.length;i++)
  {
       if(obj[i].getSpojene())
       {
            var bodyA = obj[i].getBody();
            var dir = this.direction(bodyA.x,bodyA.y,this._box.x,this._box.y);
            this._firstJoint(this._box,bodyA,bodyA.x,bodyA.y,dir);
        }

  }

};

Jelly.prototype._createBumpLink = function(obj) {
  for(var i=0;i<obj.length;i++)
  {
       if(obj[i].getSpojene())
       {
            var bodyA = obj[i].getBody();
            var dir = this.direction(bodyA.x,bodyA.y,this._bump.x,this._bump.y);
            this._firstJoint(this._bump,bodyA,bodyA.x,bodyA.y,dir);
        }

  }

};
Jelly.prototype._createinnerLink = function(obj) {
    for(var i=0;i<obj.length;i++)
  {


      if(i < obj.length-1)
      {
        var bodyA = obj[i].getBody();
        var bodyB = obj[(i+1)%obj.length].getBody();
        var dir = this.direction(bodyA.x,bodyA.y,bodyB.x,bodyB.y);
        this._outlineJoint(bodyA,bodyB,bodyB.x,bodyB.y,dir);
      }
      else
      {
          var bodyA = obj[i].getBody();
          var bodyB = obj[0].getBody();
          var dir = this.direction(bodyA.x,bodyA.y,bodyB.x,bodyB.y);
          this._outlineJoint(bodyA,bodyB,bodyB.x,bodyB.y,dir);
      }

  }
};
Jelly.prototype._createJointLink = function(joint) {
  for(var j=0;j<joint.length;j++)
  {
    this.vAnchorA  = new box2d.b2Vec2();
    this.vAnchorB  = new box2d.b2Vec2();
    this.bodyA = this.getBody(joint[j].b1);
    this.bodyB = this.getBody(joint[j].b2);
    if(this.bodyA !== undefined && this.bodyB !== undefined )
    {
        this.bodyA.toLocalPoint(this.vAnchorA,new box2d.b2Vec2(joint[j].x, joint[j].y));
        this.bodyB.toLocalPoint(this.vAnchorB,new box2d.b2Vec2(joint[j].x, joint[j].y));
        this.game.physics.box2d.weldJoint(this.bodyA,this.bodyB,this.vAnchorA.x,this.vAnchorA.y,this.vAnchorB.x,this.vAnchorB.y);

    }
  //  this.game.physics.box2d.weldJoint(this.bodyA,this.bodyB);
    /*var bodyArray   = this.game.physics.box2d.getBodiesAtPoint(joint[j].x, joint[j].y, false,false);

    if(bodyArray.length > 0)
    {
      this.bodyA = bodyArray[0];
      this.bodyA.toLocalPoint(this.vAnchorA,new box2d.b2Vec2(joint[j].x, joint[j].y));
      this.bodyB = bodyArray[1];
      if(this.bodyA !== undefined && this.bodyB !== undefined )
        {
          this.bodyB.toLocalPoint(this.vAnchorB,new box2d.b2Vec2(joint[j].x, joint[j].y));
          this.game.physics.box2d.weldJoint(this.bodyA,this.bodyB);//this.vAnchorA.x,this.vAnchorA.y,this.vAnchorB.x,this.vAnchorB.y);
        }
      }*/
  }
};
Jelly.prototype._createJelly = function(map,object)
{
    this._pop = this._findBod3("mid",map,object);
    this._addBox();
    //  this._createPoly();
    switch(this._pop.ot)
    {
     case STAND:
        this._bodies = this._findPoly("bod",map,object);
        this.applyJelly(this._bodies);
        this._createBoxLink(this._bodies);
        this._createinnerLink(this._bodies);
     break;
     case GUM:
        this._bodies = this._findPoly("bod",map,object);
        this.applyJelly(this._bodies);
        this._createBoxLink(this._bodies);
        this._createinnerLink(this._bodies);
        this._link = this._findJoint("joint",map,object);
        this._createJointLink(this._link);
     break;
     case BRIDGE:
        this._bodies = this._findPoly("bod",map,object);
        this.applyJelly(this._bodies);
        this._createBoxLink(this._bodies);
        this._createinnerLink(this._bodies);
        this._link = this._findJoint("joint",map,object);
        this._createJointLink(this._link);

     break;
     case LIFT:
        this._bodies = this._findPoly("bod",map,object);
        this.applyJelly(this._bodies);
        this._createBoxLink(this._bodies);
        this._createinnerLink(this._bodies);
        this._link = this._findJoint("joint",map,object);
        this._createJointLink(this._link);
     break;
     case TRUCK:
        this._bodies = this._findPoly("bod",map,object);
        this.applyJelly(this._bodies);
        this._createBoxLink(this._bodies);
        this._createinnerLink(this._bodies);
        this._vbump = this._findbump("center",map,object);
        this._addBump();
         this._createBumpLink(this._bodies);
     break;
     case CIRCLE:
        this._bodies = this._findPoly("bod",map,object);
        this.applyJelly(this._bodies);
        this._createBoxLink(this._bodies);
        this._createinnerLink(this._bodies);
     break;
     case BALLOON:
        this._bodies = this._findPoly("bod",map,object);
        this.applyJelly(this._bodies);
        this._createBoxLink(this._bodies);
        this._createinnerLink(this._bodies);
        this._vbump = this._findbump("center",map,object);
        this._addBump();
        this._createBumpLink(this._bodies);
     break;
     case WHEEL:
     this._bodies = this._findPoly("bod",map,object);
     this.applyJelly(this._bodies);
     this._createBoxLink(this._bodies);
     this._createinnerLink(this._bodies);
     break;
   }
};
Jelly.prototype.renderClose = function() {
   for(var j=0;j<this._bodies.length;j++)

      {
         if(j==0)
             this._mask.moveTo(this._bodies[j].getBody().x,this._bodies[j].getBody().y);
          else
            this._mask.lineTo(this._bodies[j].getBody().x,this._bodies[j].getBody().y);
            this._sprite.angle = this._box.angle;//this._bodies[j].getBody().angle;
      }
    this._mask.endFill();
};

Jelly.prototype.renderBridge = function() {
   for(var j=0;j<this._bodies.length;j++)

      {
         if(j==0)
             this._mask.moveTo(this._bodies[j].getBody().x,this._bodies[j].getBody().y);
          else
            this._mask.lineTo(this._bodies[j].getBody().x,this._bodies[j].getBody().y);
            this._sprite.angle = this._box.angle
      }
       this._mask.endFill();
};

Jelly.prototype.renderGum = function() {
  for(var j=0;j<this._bodies.length;j++)

     {
        if(j==0)
            this._mask.moveTo(this._bodies[j].getBody().x,this._bodies[j].getBody().y);
         else
           this._mask.lineTo(this._bodies[j].getBody().x,this._bodies[j].getBody().y);
           this._sprite.angle = this._bodies[j].getBody().angle;
     }
      this._mask.endFill();
};
Jelly.prototype.bezierPoint = function(p0, p1, p2, p3, t){
    var cX = 3 * (p1.x - p0.x);
    var bX = 3 * (p2.x - p1.x) - cX;
    var aX = p3.x - p0.x - cX - bX;
    var cY = 3 * (p1.y - p0.y);
    var bY = 3 * (p2.y - p1.y) - cY;
    var aY = p3.y - p0.y - cY - bY;
    var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
    var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;
    return {x: x, y: y};     
};
Jelly.prototype.renderCircle = function() {
   this._mask.moveTo(this._bodies[0].getBody().x,this._bodies[0].getBody().y);
   for(var j=1;j<this._bodies.length;j++)

      {
			var arcxp = (this._bodies[j].getBody().x + this._bodies[j-1].getBody().x)/2;
			var arcyp = (this._bodies[j].getBody().y + this._bodies[j-1].getBody().y)/2;
			var beta = Math.atan(arcyp /arcxp);
			var alfa  = Math.atan2(this._bodies[j].getBody().y - this._bodies[j-1].getBody().y,this._bodies[j].getBody().x-this._bodies[j-1].getBody().x)+beta;
            var polma =this._pop.arc * -1;
        	var arcX  = arcxp +(polma * Math.cos(alfa));
			var arcY = arcyp +(polma * Math.sin(alfa));  
			this._mask.quadraticCurveTo(arcX,arcY,this._bodies[j].getBody().x,this._bodies[j].getBody().y);
	
           // this._sprite.angle = this._bodies[j].getBody().angle;
	  }
	  var dp = this._bodies.length-1;
	     var arcxp = (this._bodies[0].getBody().x + this._bodies[dp].getBody().x)/2;
				var arcyp = (this._bodies[0].getBody().y + this._bodies[dp].getBody().y)/2;
			var beta = Math.atan(arcyp /arcxp);
			var alfa  = Math.atan2(this._bodies[dp].getBody().y - this._bodies[0].getBody().y,this._bodies[dp].getBody().x-this._bodies[0].getBody().x)+beta;
			var polma =this._pop.arc;
			var arcX  = arcxp +(polma * Math.cos(alfa));
			var arcY = arcyp +(polma * Math.sin(alfa));  
			
			  this._mask.quadraticCurveTo(arcX,arcY,this._bodies[0].getBody().x,this._bodies[0].getBody().y);
              this._sprite.angle = this._box.angle;
  //   this._mask.endFill();

  /* */
};

Jelly.prototype.renderWheel = function()
{
    for(var j=0;j<this._bodies.length;j++)

    {
       if(j==0)
           this._mask.moveTo(this._bodies[j].getBody().x,this._bodies[j].getBody().y);
       else
       {

          if(j!=this._bodies.length-1)
      {
        var d = this.game.math.distance(this._box.x, this._box.y,this._bodies[j].getBody().x,this._bodies[j].getBody().y);
        var start_angle = Math.abs(this.game.math.angleBetween(this._box.x, this._box.y,this._bodies[j].getBody().x,this._bodies[j].getBody().y));
        var end_angle = Math.abs(this.game.math.angleBetween(this._box.x, this._box.y,this._bodies[j+1].getBody().x,this._bodies[j+1].getBody().y));
        this._mask.arc(this._box.x, this._box.y, d, this.game.math.degToRad(start_angle), this.game.math.degToRad(end_angle), false);

      }
        else
      {
        var d = this.game.math.distance(this._box.x, this._box.y,this._bodies[j].getBody().x,this._bodies[j].getBody().y);
        var start_angle = Math.abs(this.game.math.angleBetween(this._box.x, this._box.y,this._bodies[j].getBody().x,this._bodies[j].getBody().y));
        var end_angle = Math.abs(this.game.math.angleBetween(this._box.x, this._box.y,this._bodies[0].getBody().x,this._bodies[0].getBody().y));
        this._mask.arc(this._box.x, this._box.y, d, this.game.math.degToRad(start_angle), this.game.math.degToRad(end_angle), false);
      }

       }


       this._sprite.angle = this._bodies[j].getBody().angle;
    }
}
Jelly.prototype.updateJelly = function()
{

     switch(this._pop.ot)
    {
        case STAND:
        break;
        case GUM:
            for(var i=0;i<this._bodies.length;i++)
                this._bodies[i].update(this._xp,this._yp);
        break;
        case BRIDGE:
        break;
        case LIFT:
        break;
        case TRUCK:
        break;
        case CIRCLE:
        break;
    }

};

Jelly.prototype.renderJelly = function (skipAdvancedCheck) {        
    if(this.disabled)
        return;    

    this._xp = this._box.x;
    this.yp = this._box.y;
    this._sprite.x = this._box.x;
    this._sprite.y = this._box.y;

    if (!skipAdvancedCheck) {
        if (this._sprite.inCamera) {
            if (this.object_name.indexOf("Rect") < 0 && this.object_name.indexOf("Bridge") < 0) {
                if (!this._box.data.IsActive()) {
                    for (j = 0; j < this._bodies.length; j++) {
                        this._bodies[j].getBody().static = false;
                        this._bodies[j].getBody().data.SetActive(true);
                    }
                    this._box.data.SetActive(true);
                }
            }
        } else {
            if (this.object_name.indexOf("Rect") < 0 && this.object_name.indexOf("Bridge") < 0) {
                if (this._box.data.IsActive()) {
                    for (j = 0; j < this._bodies.length; j++) {
                        this._bodies[j].getBody().static = true;
                        this._bodies[j].getBody().data.SetActive(false);
                    }
                    this._box.data.SetActive(false);
                }
            }
            return;
        }
    }
    /*if(rotate)
       this._sprite.angle = Phaser.Math.radToDeg(this._box.angle);
    else
       this._sprite.angle = this._box.angle;*/
      if(this._sprite)
      {
        this._mask.clear();
        this._mask.beginFill(0xffffff);
        switch(this._pop.ot)
        {
            case STAND:
                this.renderClose();
                this._sprite.mask = this._mask;
            break;
            case GUM:
                this.renderGum();
                this._sprite.mask = this._mask;
            break;
            case BRIDGE:
                this.renderBridge();
                this._sprite.mask = this._mask;
            break;
            case LIFT:
                this.renderClose();
                this._sprite.mask = this._mask;
            break;
            case TRUCK:
                this.renderClose();
                this._sprite.mask = this._mask;
            break;
            case CIRCLE:
                this.renderCircle();
                this._sprite.mask = this._mask;
            break;
            case BALLOON:
                this.renderCircle();
                this._sprite.mask = this._mask;
            break;
            case WHEEL:
                this.renderWheel();
                this._sprite.mask = this._mask;
            break;
        }
      }


};

Jelly.prototype.collisionJelly = function(categoryBits,callback,cls) {
    for(var i=0;i<this._bodies.length;i++)
        this._bodies[i].getBody().setCategoryContactCallback(categoryBits,callback,cls); 
};

Jelly.prototype.destroy = function(){
    this._sprite.destroy();
    this.game.physics.box2d.world.DestroyBody(this._box);
    if(this._bump)
    this.game.physics.box2d.world.DestroyBody(this._bump);
	for(var i=0;i<this._bodies.length;i++)
	{
		this._bodies[i].destroy(this.game);
	}
	this._bodies.clear();
	this._bodies = null;
};
/////Lego Body

function Lego(game,x,y,img,physics,fr,rs,den)
{
    this.game   =  game;
    this.sprite =  this.game.add.sprite(x, y, img);
    this.sprite.anchor.set(0.5);
    this.game.physics.box2d.enable(this.sprite);
    this.sprite.body.clearFixtures();
    this.sprite.body.loadPolygon("legoData",physics,this.sprite);
    this.sprite.body.restitution = rs;
	this.sprite.body.friction = fr;
	this.sprite.body.mass = den;
    this.sprite.body.setCollisionCategory(OTHER_CATEGORYBITS);
    this.sprite.body.setCollisionMask(OTHER_MASKBITS);
    this.joint;
};

Lego.prototype.enableRevolute = function(ground,speed,torque,motor,low,up,limit)
{
        this._bodyA = ground;
        this._bodyB = this.sprite.body;
        this.la = new box2d.b2Vec2();
        this.lb = new box2d.b2Vec2();
        this._bodyA.toLocalPoint(this.la, new box2d.b2Vec2(this.sprite.body.x,this.sprite.body.y));
        this._bodyB.toLocalPoint(this.lb, new box2d.b2Vec2(this.sprite.body.x,this.sprite.body.y));
        this.joint = this.game.physics.box2d.revoluteJoint(this._bodyA,this._bodyB,this.la.x,this.la.y,this.lb.x,this.lb.y,speed,torque,motor,low,up,limit);
        this.joint.collideConnected = false;
  
};
Lego.prototype.setBolt = function(x,y,scale)
{
    this.bolt = this.game.add.image(x,y,'mill_bolt');
	this.bolt.anchor.set(0.5);
	this.bolt.scale.set(scale);
};
Lego.prototype.setIndex = function(inx){
    for (var f = this.sprite.body.data.GetFixtureList(); f; f = f.GetNext())
    {
       var filter = f.GetFilterData();
       filter.groupIndex = -60;
    }
  };
Lego.prototype.destroy = function(){
    this.sprite.body.destroy();
    this.sprite.destroy();
    this.sprite = null;
}

