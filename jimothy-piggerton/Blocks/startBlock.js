addBlock(function() { return {
  //Start Block
  id: BLOCKS.length,
  name: "Start",
  hide: true,   
  ignoreCollisions: true,
  drawer: new Player(),
  draw: drawEntity,
  onload: function(game, x,y,width,height, world,ii,jj) {
    game.player.x = x + width/2;
    game.player.y = y + height;
  },
}});
