addBlock(function() { return {
      //Spike floor
      id: BLOCKS.length,
      name: "Ground Spike",
      solid: true,
      redraws: false,
      groundBlock: true,
      draw: function(canvas, x,y,width,height, world,ii,jj) {
        var w= width;
        var h=height;
        var dd = width*.1;
        CELLMAP[2].drawSpike(canvas,x+dd,y+dd,width-dd*2,height-dd*2,world,ii,jj)
        var dh = h * .4;
        CELLMAP[1].draw(canvas,x,y+dh, width, height-dh, world, ii,jj);
      },
      entityCollision: function(entity, pos, dx, dy) {
        if(entity.player && dy>0) entity.die();
        return true;
      },
      // isColliding: function(entity, pos,dx,dy,cellPos) {
      //   // return true;
      //   // return pos.y-dy > cellPos.y + 1; 
      //   if (pos.y-dy >= cellPos.y + 1) return { y: cellPos.y + 1};
      // }
}});
