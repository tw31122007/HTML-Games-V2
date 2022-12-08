addBlock(function() { return {
  name: "Kaizo",
  solid: false,
  id: BLOCKS.length,
  hide: true,
  //ignoreCollisions: true,
  draw: function(canvas, x,y,w,h, world,i,j) {
    //var w= width;
    //var h=height;
    canvas.fillStyle = 'rgba(50,50,0,.5)';
    canvas.fillRect(x,y,w,h);
  },
  entityCollision: function(entity, pos, dx, dy, cellPos) {
    if(dy<0) {
      console.log(pos, cellPos);
      entity.game.world.world[cellPos.y/cellPos.h][cellPos.x/cellPos.w] = 1;
      entity.game.world.forceRedraw();
      //entity.game.world.world[cellPos.y/cellPos.h][cellPos.x/cellPos.w] = this.id;
    }
  },
}});
