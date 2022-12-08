addBlock(function() { return {
  //Doink Block
  id: BLOCKS.length,
  name: "DoinkPad",
  hide: true,
  ignoreCollisions: true,
  redraws: false,
  drawer: new DoinkPad(),
  draw: drawEntity,
  onload: function(game, x,y,width,height, world,ii,jj) {
    game.addEntity(new DoinkPad(x + width/2,y + height));
  },
}});
