addBlock(function() { return {
    /*
    X Y point is the top left corner of the saw.
    
    */
    id: BLOCKS.length,
    name: "BigSawSpawner",
    solid: false,
    angle: 0,
    redraws: false,
    hide: true,   
    drawer: new BigSaw(),
    draw: function(canvas, x,y,w,h, world,i,j) {
      canvas.fillStyle = 'green';
      canvas.fillRect(x,y,w,h);
    },
    
    onload: function(game, x,y,width,height, world,ii,jj) {
      var gridX = Math.floor(x/game.world.s);
      var gridY = Math.floor(y/game.world.s);
      var blockBelow = CELLMAP[game.world.world[gridY+1][gridX]];
      /*
      if(blockBelow.solid){
        //move saw upwards if no room below
        game.addEntity(new BigSaw(x,y-game.world.s));
      } else {
        game.addEntity(new BigSaw(x,y));
      }
      */
      game.addEntity(new BigSaw(x,y));
    },
    // isColliding: function(entity, pos,dx,dy,cellPos) {
    //   if (pos.y-dy >= cellPos.y + 1) return { y: cellPos.y + 1};
    // }
}});