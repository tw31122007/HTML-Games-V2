addBlock(function() { return {
  //Byrd Block
  id: BLOCKS.length,
  name: "collectable",
  hide: true,   
  ignoreCollisions: true,
  draw: drawEntity,
  drawer: new Collectable(),
  // draw: function(canvas, x,y,width,height, world,ii,jj) {
  //   canvas.fillStyle = 'rgba(50,0,50,.5)';
  //   canvas.fillRect(x,y,width,height);
  // },
  onload: function(game, x,y,width,height, world,ii,jj) {
    game.addEntity(new Collectable(x+width/2,y+height));
  },
}});
