addBlock(function() { return {
  //End Block
  id: BLOCKS.length,
  name: "DoubleJump",
  hide: true,
  ignoreCollisions: true,
  drawer: new doubleJump(),
  draw: drawEntity,
  onload: function(game, x,y,width,height, world,ii,jj) {
    game.addEntity(new doubleJump(x + width/2,y + height));
  },
}});
