addBlock(function() { return {
  //Byrd Block
  id: BLOCKS.length,
  name: "Smol Byrd",
  hide: true,   
  ignoreCollisions: true,
  drawer: new SmolByrd(),
  draw: drawEntity,
  onload: function(game, x,y,width,height, world,ii,jj) {
    game.addEntity(new SmolByrd(x + width/2,y + height));
  },
}});
