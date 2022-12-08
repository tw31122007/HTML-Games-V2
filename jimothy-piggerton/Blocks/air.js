addBlock(function() { return {
  //Ground
    id: BLOCKS.length,
    name: "Air",
    air: true,
    ignoreCollisions:true,
    // redraws:true,
    // draw: function(canvas, x,y,w,h, world,i,j) {
    //   canvas.save();
    //   canvas.globalCompositeOperation='color-dodge';
    //   var t=MAIN.frameCount;
    //   var n = i*i+j*j+t;
    //   var v = Math.abs((n)%(255*2-1)-255);
    //    var c = 'rgba('+v+','+v+','+v+',0.5)';
    //   canvas.fillStyle = c;
    //   canvas.fillRect(x,y,w,h);
    //   canvas.restore();
    // }
}});
