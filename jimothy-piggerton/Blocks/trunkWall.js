addBlock(function() { return {
  name: "TrunkWall",
  solid: true,
  groundBlock: false,
  trunk: true,
  platform: true,
  safe: true,
  treeWall: true,
  id: BLOCKS.length,
  draw: function(canvas, x,y,w,h, world,i,j) {
    //CELLMAP[18].draw(canvas,x,y, w, h, world, i,j);  
    canvas.lineWidth = 4;
    x+=w*.05;
    w*=.9;
    
    //x+=w/2;
    var color1 = "#805940";
    var color2 = "#531";
    // var color1 = "#754";
    // var color2 = "#532";
    // color1 = "#555";
    // color2 = "#777";
    // color3 = "#000";
    canvas.fillStyle=color2;
    canvas.fillRect(x,y,w/2,h);
    canvas.strokeStyle="#000";
    var s = Math.max(w,h);
    // canvas.strokeRect(x,y,w,h);
    canvas.fillStyle=color1;
    canvas.fillRect(x+w/4,y,w/4,h);
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
      //canvas.strokeRect(x+w,y,0,h);
    // }


    canvas.fillStyle=color1;
    canvas.fillRect(x+w/2,y,w/2,h);
    canvas.strokeStyle="#000";
    s = Math.max(w,h);

    canvas.fillStyle=color2;
    canvas.fillRect(x+w*3/4,y,w/4,h);
    ww = s/3;
    hh = ww;
    spacing = 10;
    // for(var ii=0;ii<3;ii++) {
    //   var r1 = psuedoRandom(x,y,ii,1);
    //   var r2 = psuedoRandom(x,y,ii,2);
    //   var xx = Math.floor(r1*(w-ww)/spacing) * spacing;
    //   var yy = Math.floor(r2*(h-hh)/spacing) * spacing;
    //   canvas.fillRect(xx+x,yy+y,ww,hh);
    // }
    // if(world.getCell(i,j-1).id!=this.id) {
    if(!world)
        return;
    //if(!world.getCell(i+1,j).treeWall) {
      canvas.strokeRect(x+w,y,0,h);
    //}
    //if(!world.getCell(i-1,j).treeWall) {
      canvas.strokeRect(x,y,0,h);
    //}
           
    if(!world.getCell(i,j+1).treeWall) {
    canvas.strokeRect(x,y+h*.95,w,0);
    }
    if(!world.getCell(i,j-1).treeWall) {
    canvas.strokeRect(x,y,w,0);
    }
  
    canvas.lineWidth = 1;
  },
  isColliding: function(entity, pos, dx, dy, cellPos) {
    if(entity.apple)
      return false;
    //if(Math.abs(dx)>0){//&&Math.abs(entity.x-cellPos.x)<this.w/2) {
    return true;
    //}
    return false;
  },
}});
