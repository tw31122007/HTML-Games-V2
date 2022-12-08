addBlock(function() { return {
  //Byrd Block
  id: BLOCKS.length,
  name: "Squirrel Follow",
  hide: true,   
  ignoreCollisions: true,
  drawer: new SquirrelFollow(),
  draw: drawEntity,
  onload: function(game, x,y,width,height, world,ii,jj) {
    game.addEntity(new SquirrelFollow(x + width/2,y + height));
  },
}});
