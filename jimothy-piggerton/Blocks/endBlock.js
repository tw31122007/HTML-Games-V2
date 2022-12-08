addBlock(function() { return {
  //End Block
  id: BLOCKS.length,
  name: "End",
  hide: true,
  ignoreCollisions: true,
  redraws: false,
  drawer: new Pig(),
  draw: drawEntity,
  onload: function(game, x,y,width,height, world,ii,jj) {
    game.pig = new Pig(x + width/2,y + height);
    game.addEntity(game.pig);
  },
}});

