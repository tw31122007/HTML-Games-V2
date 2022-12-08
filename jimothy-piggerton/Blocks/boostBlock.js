addBlock(function() { return {
  name: "Boost",
  solid: false,
  id: BLOCKS.length,
  draw: function(canvas, x,y,w,h, world,i,j) {
    canvas.fillStyle="black";
    canvas.fillRect(x,y,w,h);
    canvas.strokeStyle = "#fff";
    canvas.beginPath();
    canvas.moveTo(x,y+h/2);
    canvas.lineTo(x+w,y+h/2);
    canvas.lineTo(x+w/2,y+h/4);
    canvas.lineTo(x,y+h/2);    
    canvas.lineTo(x+w/2,y+h*3/4);
    canvas.lineTo(x+w,y+h/2);    
    canvas.stroke();
  },
  entityCollision: function(entity, pos, dx, dy, cellPos) {
    // if(!entity.grounded)entity.dash(1-2*entity.flipped);
   if(entity.vy>0) {
     entity.vy=-10;
     entity.y-=1;
     entity.vx = 20*(1-2*entity.flipped);
   }
   return false;
    // var time = Date.now();
    // if(entity.boostCollision > time-100)return false;
    // entity.boostCollision = time;
    // entity.dash(1-2*entity.flipped);
    // return false;
  },
}});
