addBlock(function() { return {
    name: "treeLeaves",
    solid: false,
    groundBlock: false,
    ignoreCollisions: true,
    leaves: true,
    id: BLOCKS.length,
    draw: function(canvas, x,y,w,h, world,i,j) {
      //h*=.5;
      var color1 = "#292";
      var color2 = "#181";
      var color3 = "#532";
      var color4 = "#754";
      

      var s = Math.max(w,h);
      var ww = s/3;
      var hh = ww;
      var spacing = 3;
      // canvas.strokeRect(x,y,w,h);
      canvas.fillStyle=color2;

      //var edge = false;

      var we = w;
      var he = h;
      var xe = x;
      var ye = y;
      if(!world)
        return;
      if(!world.getCell(i,j-1).leaves&&!world.getCell(i,j-1).trunk) {
        he /= 2;
        ye += he;
      }
      if(!world.getCell(i,j+1).leaves) {
        he /= 2;
      } 
      if(!world.getCell(i-1,j).leaves&&!world.getCell(i-1,j).trunk) {
        we /= 2;
        xe += we;
      }
      if(!world.getCell(i+1,j).leaves&&!world.getCell(i+1,j).trunk) {
        we /= 2;
      }

      canvas.fillRect(xe,ye,we,he);
      if (world.getCell(i,j+1).name == "treeTrunk")
      {
        //console.log("help");

        world.getCell(i,j+1).draw(canvas,x,y+h-he,w,he, world,i,j);
        /*canvas.fillStyle=color3;
        canvas.fillRect(x,y+h-he,w,he);


        canvas.fillStyle=color4;
        for(var ii=0;ii<3;ii++) {
            var r1 = psuedoRandom(x,y,ii,1);
            var r2 = psuedoRandom(x,y,ii,2);
            var xx = Math.floor(r1*(w-ww)/spacing) * spacing;
            var yy = Math.floor(r2*(h-hh)/spacing) * spacing;
            canvas.fillRect(xx+x,yy+y+h-he,ww,hh);
        }


        canvas.strokeStyle="#000";
        if(world.getCell(i+1,j+1).trunk) {
          canvas.strokeRect(x+w,y+h-he,0,he);
        }
        if(world.getCell(i-1,j+1).trunk) {
          canvas.strokeRect(x,y+h-he,0,he);
        } 
        */
      }

            
      canvas.fillStyle=color1;
      for(var ii=0;ii<10;ii++) {
          var r1 = psuedoRandom(x,y,ii,1);
          var r2 = psuedoRandom(x,y,ii,2);
          var xx = Math.floor(r1*(w-ww)/spacing) * spacing;
          var yy = Math.floor(r2*(h-hh)/spacing) * spacing;
          canvas.fillRect(xx+x,yy+y,ww,hh);
      }

    },
    isColliding: function(entity, pos, dx, dy, cellPos) {
      if(dy>0&&entity.y<=cellPos.y) {
        return true;
      }
      return false;
    },
}});
