addBlock(function() { return {
  name: "Platform",
  solid: true,
  groundBlock: false,
  trunk: true,
  platform: true,
  safe: true,
  id: BLOCKS.length,
  draw: function(canvas, x,y,w,h, world,i,j) {
    CELLMAP[18].draw(canvas,x,y+h/2, w, h/2, world, i,j);  
    CELLMAP[9].draw(canvas,x,y, w, h, world, i,j);
  },
  isColliding: function(entity, pos, dx, dy, cellPos) {
    if(entity.apple)
      return false;
    if(entity.ignoresPlatforms)return false;
    if(dy>0&&entity.y<=cellPos.y) {
      return true;
    }
    return false;
  },
}});
