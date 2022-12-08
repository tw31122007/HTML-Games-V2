addBlock(function() { return {
  name: "Bounce",
  solid: false,
  id: BLOCKS.length,
  draw: function(canvas, x,y,w,h, world,i,j) {
    canvas.fillStyle="#900";
    canvas.fillRect(x,y,w,h);
    canvas.strokeStyle = "#fff";
    canvas.beginPath();
    canvas.moveTo(x+w/4,y+h/2);
    canvas.lineTo(x+w*3/4,y+h/2);
    canvas.lineTo(x+w/2,y);
    canvas.lineTo(x+w/4,y+h/2);    
    canvas.lineTo(x+w/2,y+h);
    canvas.lineTo(x+w*3/4,y+h/2);    
    canvas.stroke();
  },
  entityCollision: function(entity, pos, dx, dy, cellPos) {
    if(entity.x<cellPos.x+cellPos.w/2 && entity.vx>=0) {
      entity.vy=-10;
      entity.vx = -20;
      entity.y-=1;
    }
    if(entity.x>cellPos.x+cellPos.w/2 && entity.vx<=0) {
      entity.vy=-10;
      entity.vx = 20;
      entity.y-=1;
    }

    entity.spinning=true;
    entity.angle += Math.PI;
    // entity.jumpCount = 0;
    // entity.jump();
    // entity.width+=10;
    // entity.vx = -entity.vx;
    // entity.spinning=true;
    // entity.eyeMovement.y -=10;
    // entity.height += 10;
    // entity.vy -= 10;
    // entity.game.world.world[cellPos.y/cellPos.h][cellPos.x/cellPos.w+1] = 1;
    // entity.game.world.forceRedraw();    
  },
}});
