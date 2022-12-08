addBlock(function() { return {
  //Woof Block
  id: BLOCKS.length,
  name: "Woof",
  hide: true,   
  ignoreCollisions: true,
  drawer: new Woof(),
  draw: drawEntity,
  onload: function(game, x,y,width,height, world,ii,jj) {
    game.addEntity(new Woof(x + width/2,y + height));
  },
}});
