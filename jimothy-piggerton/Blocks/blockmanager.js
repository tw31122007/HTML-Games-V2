var BLOCKS = [];

function drawEntity(canvas, x,y,width,height, world,ii,jj) {
  canvas.fillStyle = 'rgba(50,0,50,.5)';
  canvas.fillRect(x,y,width,height);
  this.drawer.x=x+width/2;
  this.drawer.y=y+height;
  this.drawer.draw(canvas);
}

function addBlock(b) {
  b.id = BLOCKS.length;
  BLOCKS.push(b);
}

function createBlocks() {
  var map = [];
  for(var i=0;i<BLOCKS.length; i+= 1) {
    var block = BLOCKS[i]();
    block.id = i;
    // block.redraws = true;//temp testing
    map[i] = block;
  }
  return map;
}