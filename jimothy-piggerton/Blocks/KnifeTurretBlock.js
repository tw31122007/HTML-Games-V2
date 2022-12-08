addBlock(function() { return {
  //Enemy Block
  id: BLOCKS.length,
  name: "KnifeTurret",
  hide: true,   
  ignoreCollisions: true,
  drawer: new KnifeTurret(),
  draw: drawEntity,
  onload: function(game, x,y,width,height, world,ii,jj) {
    game.addEntity(new KnifeTurret(x + width/2,y + height/2));
  },
}});
