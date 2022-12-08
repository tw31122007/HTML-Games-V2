addBlock(function() { return {
    name: "treeApple",
    solid: false,
    groundBlock: false,
    ignoreCollisions: true,
    leaves: true,
    id: BLOCKS.length,
    draw: function(canvas, x,y,w,h, world,i,j) {
      CELLMAP[19].draw(canvas,x,y, w, h, world, i,j);
      canvas.fillStyle = "#640";
      var dw = w*.44;
      var dh = h*.6;
      canvas.fillRect(x+dw,y+dh,w-dw*2,h-dh);
    },
    isColliding: function(entity, pos, dx, dy, cellPos) {
      if(dy>0&&entity.y<=cellPos.y) {
        return true;
      }
      return false;
    },
    onload: function(game, x,y,width,height, world,ii,jj) {
      // world.getCell(ii,jj).id = 19;
      game.addEntity(new Apple(x + width/2,y + height*1.5));
  },
}});
