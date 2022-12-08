addBlock(function() { return {
  //Byrd Block
  id: BLOCKS.length,
  name: "Squirrel",
  hide: true,   
  ignoreCollisions: true,
  drawer: new Squirrel(),
  draw: drawEntity,
  onload: function(game, x,y,width,height, world,ii,jj) {
    game.addEntity(new Squirrel(x + width/2,y + height));
  },
}});
