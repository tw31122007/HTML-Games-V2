addBlock(function() { return {
  //End Block
  id: BLOCKS.length,
  name: "Checkpoint",
  // hide: true, 
  ignoreCollisions: true,
  drawEntity: drawEntity,
  draw: function(canvas, x,y,w,h, world,i,j, editor) {
    if(world.getCell(i,j-1).trunk||world.getCell(i+1,j).trunk||world.getCell(i-1,j).trunk)
    CELLMAP[18].draw(canvas,x,y,w,h,world,i,j);   
    if(editor)
      this.drawEntity(canvas,x,y,w,h,world,i,j);
  },
  drawer: new Checkpoint(),
  //entityCollision: function(entity, pos, dx, dy, cellPos) {
 //   entity.game.world.world[cellPos.y/cellPos.h][cellPos.x/cellPos.w] = 1;
//    entity.game.world.forceRedraw();
  //},
  onload: function(game, x,y,width,height, world,ii,jj) {
    x=x+width/2;
    y=y+height;
    if(game.player.checkpoint) {
      if(game.player.checkpoint.x==x&&game.player.checkpoint.y==y) {
        game.addEntity(game.player.checkpoint);
        return;
        // c.die();
      }
    }
    var c = new Checkpoint(x,y);
    game.addEntity(c);
  },
}});
