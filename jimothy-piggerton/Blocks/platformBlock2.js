addBlock(function() { return {
  name: "Platform2",
  solid: true,
  groundBlock: false,
  safe: true,
  platform: true,
  id: BLOCKS.length,
  draw: function(canvas, x,y,w,h, world,i,j) {
    h*=.4;
    var color1 = "#642";
    var color2 = "#532";
    
    // color1 = "#555";
    // color2 = "#777";
    // color3 = "#000";
    canvas.fillStyle=color1;
    canvas.fillRect(x,y,w,h);
    canvas.strokeStyle="#000";
    var s = Math.max(w,h);
    // canvas.strokeRect(x,y,w,h);
    canvas.fillStyle=color2;
    canvas.fillRect(x,y+h/2,w,h/2);
    var ww = s/3;
    var hh = ww;
    var spacing = 10;
    // for(var ii=0;ii<3;ii++) {
    //   var r1 = psuedoRandom(x,y,ii,1);
    //   var r2 = psuedoRandom(x,y,ii,2);
    //   var xx = Math.floor(r1*(w-ww)/spacing) * spacing;
    //   var yy = Math.floor(r2*(h-hh)/spacing) * spacing;
    //   canvas.fillRect(xx+x,yy+y,ww,hh);
    // }
    // if(world.getCell(i,j-1).id!=this.id) {
      canvas.strokeRect(x,y,w,0);
    // }
    // if(world.getCell(i,j+1).id!=this.id) {
      canvas.strokeRect(x,y+h,w,0);
    // }
    if(!world)
      return;
    if(!world.getCell(i+1,j).platform) {
      canvas.strokeRect(x+w,y,0,h);
    }
    if(!world.getCell(i-1,j).platform) {
      canvas.strokeRect(x,y,0,h);
    }
  },
  isColliding: function(entity, pos, dx, dy, cellPos) {
    if(entity.apple)
      return false;
    if(entity.ignoresPlatforms)return false;
    if(dy>0&&entity.y<=cellPos.y&&!entity.crouching) {
      return true;
    }
    return false;
  },
}});
