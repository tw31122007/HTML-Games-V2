addBlock(function() { return {
      //Spike
      id: BLOCKS.length,
      name: "Spike",
      solid: true,
      angle: 0,
      // redraws: true,
      draw: function(canvas, x,y,w,h, world,i,j) {
        if(world.getCell(i,j-1).trunk||world.getCell(i,j+1).trunk||world.getCell(i+1,j).trunk||world.getCell(i-1,j).trunk)
        CELLMAP[18].draw(canvas,x,y,w,h,world,i,j);   
        this.drawSpike(canvas,x,y,w,h,world,i,j);
      },
      drawSpike: function(canvas, x,y,w,h, world,i,j) {
        canvas.fillStyle="white";
        canvas.strokeStyle = "#000";
        canvas.save();
        canvas.translate(x+w/2,y+h/2);
        canvas.rotate(this.angle);
        // this.angle += Math.PI/20*1.5;
        // this.angle = frameCount * Math.PI/20*1.5;
        w=w*.9;
        h=h*.9;
        for(var i=0;i<3;i++){
          canvas.rotate(Math.PI/8);
          canvas.fillRect(-w/2,-h/2,w,h);        
          canvas.strokeRect(-w/2,-h/2,w,h);
        }
        w=w*.8;
        h=h*.8;
        canvas.rotate(-3*Math.PI/8);
        canvas.fillStyle="grey";
        canvas.fillRect(-w/2,-h/2,w,h);      
        canvas.restore();
      },
      entityCollision: function(entity, pos) {
        if(entity.player) entity.die();
        return true;
      },
      // isColliding: function(entity, pos,dx,dy,cellPos) {
      //   if (pos.y-dy >= cellPos.y + 1) return { y: cellPos.y + 1};
      // }
}});
