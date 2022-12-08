addBlock(function() { return {
    name: "treeTrunk",
    solid: false,
    groundBlock: false,
    ignoreCollisions: true,
    id: BLOCKS.length,
    trunk: true,
    draw: function(canvas, x,y,w,h, world,i,j) {
      //h*=.5;
      // var color1 = "#754";
      // var color2 = "#532";
      // var color1 = "#6a5545";
      // var color2 = "#4a3525";
      var color1 = "#4a3525";
      var color2 = "#3a2515";
      // color1 = "#555";
      // color2 = "#777";
      // color3 = "#000";
      canvas.fillStyle=color1;
      canvas.fillRect(x,y,w,h);
      canvas.strokeStyle="#000";
      var s = Math.max(w,h);
      // canvas.strokeRect(x,y,w,h);
      canvas.fillStyle=color2;
      canvas.fillRect(x+w/2,y,w/2,h);
      var ww = s/3;
      var hh = ww;
      var spacing = 10;
      
      for(var ii=0;ii<3;ii++) {
          var r1 = psuedoRandom(x,y,ii,1);
          var r2 = psuedoRandom(x,y,ii,2);
          var xx = Math.floor(r1*(w-ww)/spacing) * spacing;
          var yy = Math.floor(r2*(h-hh)/spacing) * spacing;
          canvas.fillRect(xx+x,yy+y,ww,hh);
      }
      return;
      if(!world)
        return;
      if(!world.getCell(i,j-1).trunk&&world.getCell(i,j-1).id!=this.id+1) {
        canvas.strokeRect(x,y,w,0);
       }
      if(!world.getCell(i,j+1).trunk&&world.getCell(i,j+1).id!=this.id+1) {
        canvas.strokeRect(x,y+h,w,0);
      }
      if(!world.getCell(i+1,j).trunk&&!(world.getCell(i+1,j).id==this.id+1&&world.getCell(i,j+1).id!=this.id)) {
        canvas.strokeRect(x+w,y,0,h);
      }
      if(!world.getCell(i-1,j).trunk&&!(world.getCell(i-1,j).id==this.id+1&&world.getCell(i,j+1).id!=this.id)) {
        canvas.strokeRect(x,y,0,h);
      }
    },
    isColliding: function(entity, pos, dx, dy, cellPos) {
      if(dy>0&&entity.y<=cellPos.y) {
        return true;
      }
      return false;
    },
}});
