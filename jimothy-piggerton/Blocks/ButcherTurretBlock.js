addBlock(function() { return {
  //Enemy Block
  id: BLOCKS.length,
  name: "ButcherTurret",
  hide: true,   
  ignoreCollisions: true,
  drawer: new ButcherTurretPoint(),
  draw: drawEntity,
  onload: function(game, x,y,width,height, world,ii,jj) {
    game.addEntity(new ButcherTurretPoint(x + width/2,y + height/2));
  },
}});
