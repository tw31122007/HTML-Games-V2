addBlock(function() { return {
  //Dash power block
  id: BLOCKS.length,
  name: "DashPowerup",
  hide: true,
  ignoreCollisions: true,
  draw: drawEntity,
  drawer: new DashPowerup(),
  //entityCollision: function(entity, pos, dx, dy, cellPos) {
 //   entity.game.world.world[cellPos.y/cellPos.h][cellPos.x/cellPos.w] = 1;
//    entity.game.world.forceRedraw();
  //},
  onload: function(game, x,y,width,height, world,ii,jj) {
    game.addEntity(new DashPowerup(x + width/2,y));
  },
}});
