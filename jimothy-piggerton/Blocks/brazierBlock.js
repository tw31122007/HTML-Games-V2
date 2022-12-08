addBlock(function() { return {
      //Brazier
      id: BLOCKS.length,
      name: "Brazier",
      hide: true,   
      ignoreCollisions: true,
      drawer: new Brazier(),
      draw: drawEntity,
  onload: function(game, x,y,width,height, world,ii,jj) {
    game.addEntity(new Brazier(x + width/2,y + height));
  },
}});