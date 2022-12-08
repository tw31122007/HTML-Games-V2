addBlock(function() { return {
  name: "ByrdWall",
  solid: true,
  id: BLOCKS.length,
  hide: true,
  //ignoreCollisions: true,
  draw: function(canvas, x,y,w,h, world,i,j) {
    //var w= width;
    //var h=height;
    canvas.fillStyle = 'rgba(50,50,0,.5)';
    canvas.fillRect(x,y,w,h);
  },
  isColliding: function(entity, pos, dx, dy, cellPos) {
    if(entity.isSquirrel)entity.shouldJump = false;
    if(entity.isByrd||entity.isPig || entity.isBigSaw) {
      return true;
      //entity.mx = 2*(entity.x < this.x) - 1;
      //entity.mx = 2*(dx<0)-1;
      //entity.game.world.world[cellPos.y/cellPos.h][cellPos.x/cellPos.w] = 1;
      //entity.game.world.forceRedraw();
      //entity.game.world.world[cellPos.y/cellPos.h][cellPos.x/cellPos.w] = this.id;
    }
  },
}});
