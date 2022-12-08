addBlock(function() { return {
  name: "PigEnd",
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
    if(entity.isPig) {
      entity.animationState = 1;
      entity.game.driver.setScene(new IntroScene());
      return false;
    }
  },
}});
