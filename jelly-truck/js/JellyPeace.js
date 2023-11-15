function JellyPeace(game,x,y,density,friction,bounce,adamp,ldamp,sen,sta,colb,colm,poly,inx,type,gravity,bullet)
{
    this.game = game;
    this._body = new Phaser.Physics.Box2D.Body(game,null,x,y,2);
    this._body.setPolygon(poly);
    this._body.mass = density;
    this._body.friction = friction;
    this._body.restitution = bounce;
    this._body.linearDamping = ldamp;
    this._body.angularDampiong =adamp;
    this._body.fixedRotation = false
    this._body.bullet = bullet;
    this._body.gravityScale = gravity;
   /* this.stredx = (poly[0] + poly[4])/2;
    this.stredy =(poly[1] + poly[5])/2;
    this.delx = this.stredx - this._body.x;
	this.dely = this.stredy - this._body.y;
    this.beta = Math.atan(this.dely / this.delx);
    if (this.delx < 0)
	{
			this.beta += Math.PI;
	}*/
    this._body.sensor = sen;
    this._body.static = false;//sta;
    this.sopjene = false;

  /*  this._pA = new box2d.b2Vec2();
    this._pB = new box2d.b2Vec2();
    this._pC = new box2d.b2Vec2();
    this._pD = new box2d.b2Vec2();*/
    this.type = type;
    this._body.setCollisionCategory(colb);
    this._body.setCollisionMask(colm);
    if(inx !==0)
    for (var f = this._body.data.GetFixtureList(); f; f = f.GetNext())
     {
        var filter = f.GetFilterData();
        filter.groupIndex = inx;
     }
    this._body.data.allowSleep = true; 
    this._body.data.SetAwake(false);  
};
JellyPeace.prototype.update = function(xp,yp) {
 /*   for (var f = this._body.data.GetFixtureList(); f; f = f.GetNext())
            {
                var v = f.GetShape();
                //console.log(v.m_vertices);
                //if(v.GetVertexCount>=4)
                {
                  //  alert(v.GetVertexCount);
                    this.setA(this._body.x-this.game.physics.box2d.mpx(v.m_vertices[0].x),this._body.y-this.game.physics.box2d.mpx(v.m_vertices[0].y));
                    this.setB(this._body.x-this.game.physics.box2d.mpx(v.m_vertices[1].x),this._body.y-this.game.physics.box2d.mpx(v.m_vertices[1].y));
                    this.setC(this._body.x-this.game.physics.box2d.mpx(v.m_vertices[2].x),this._body.y-this.game.physics.box2d.mpx(v.m_vertices[2].y));
                    this.setD(this._body.x-this.game.physics.box2d.mpx(v.m_vertices[3].x),this._body.y-this.game.physics.box2d.mpx(v.m_vertices[3].y));
                }



            }*/
};
JellyPeace.prototype.setIndex = function(inx)
{
  for (var f = this._body.data.GetFixtureList(); f; f = f.GetNext())
   {
      var filter = f.GetFilterData();
      filter.groupIndex = inx;
   }
};
JellyPeace.prototype.setSpojene = function(val)
{
    this.sopjene = val;
};
JellyPeace.prototype.getSpojene = function()
{
    return this.sopjene;
};
JellyPeace.prototype.getBeta = function()
{
    return this.beta;
};
JellyPeace.prototype.getX = function()
{
    return this._body.x;
};
JellyPeace.prototype.getY = function()
{
    return this._body.y;
};
JellyPeace.prototype.destroy = function(game)
{
  if(this._body!=null)
    game.physics.box2d.world.DestroyBody(this._body);
};
JellyPeace.prototype.getBody = function()
{
    return this._body;
};

/*JellyPeace.prototype.getA = function()
{
    return this._pA;
};
JellyPeace.prototype.getB = function()
{
    return this._pB;
};
JellyPeace.prototype.getC = function()
{
    return this._pC;
};
JellyPeace.prototype.getD = function()
{
    return this._pD;
};

JellyPeace.prototype.setA = function(x,y) {
    this._pA.x = x;
    this._pA.y = y;
};
JellyPeace.prototype.setB = function(x,y) {
    this._pB.x = x;
    this._pB.y = y;
};
JellyPeace.prototype.setC = function(x,y) {
    this._pC.x = x;
    this._pC.y = y;
};
JellyPeace.prototype.setD = function(x,y) {
    this._pD.x = x;
    this._pD.y = y;
};*/
