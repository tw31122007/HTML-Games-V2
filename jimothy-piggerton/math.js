
function linearMove(a,b,s) {
  if(Math.abs(a-b)<=s)return b;
  if(a>b)return a-s;
  if(a<b)return a+s;
}

function angleBetween(a, b, signed) {
  a = (a % (Math.PI*2)) + Math.PI*2;
  b = (b % (Math.PI*2)) + Math.PI*2;
  var negate = a < b;
  var dif = Math.abs(a-b);
  if(dif>Math.PI) {
    dif = Math.PI*2-dif;
    negate = !negate;
  }
  if(negate && signed) dif = -dif;
  return dif;
}

function fakeShaderTest(canvas, game) {
  var posX = game.player.x-game.camera.x-canvas.width/2;
  var posY = game.player.y-game.camera.y+canvas.height/2;
  canvas.drawImage(canvas.canvas, posX,posY,10,10,100,100,100,100);
  return;
  var imageData = canvas.getImageData(0,0,canvas.width,canvas.height);
  var data = imageData.data;
  var originalData = data.slice();
  // // Loop over each pixel and invert the color.
  // for (var i = 0, n = pix.length; i < n; i += 4) {
  //   pix[i  ] = 255 - pix[i  ]; // red
  //   pix[i+1] = 255 - pix[i+1]; // green
  //   pix[i+2] = 255 - pix[i+2]; // blue
  //   // i+3 is alpha (the fourth element)
  // }
  var circleRadius = 50+ Math.cos(game.driver.frameCount*Math.PI/15) * 50;
  var circleWidth = circleRadius*2;
  var circleHeight = circleRadius*2;
  var posX = game.player.x-game.camera.x-canvas.width/2-100;
  var posY = game.player.y-game.camera.y+canvas.height/2-100;
  var centerX = circleWidth/2;
  var centerY = circleHeight/2;
  var canvasWidth = canvas.width;
  var ra = Math.cos(game.driver.frameCount*Math.PI/20)/2+.5;
  for(var i=0;i<circleWidth;i++) {
    for(var j=0;j<circleHeight;j++) {
      var dx = i - centerX;
      var dy = j - centerY;
      var tx = Math.floor(i + centerX+posX);
      var ty = Math.floor(j + centerY+posY);
      var r = Math.sqrt(dx*dx+dy*dy);
      if(r>circleRadius||r<circleRadius/2)continue;
      var nx = Math.floor(dx * ra + centerX+posX);
      var ny = Math.floor(dy * ra + centerY+posY);
      var ti = (tx + ty * canvasWidth) * 4;
      var ni = (nx + ny * canvasWidth) * 4;
      data[ti] = originalData[ni];
      data[ti+1] = originalData[ni+1];
      data[ti+2] = originalData[ni+2];
      data[ti+3] = originalData[ni+3];
    }
  }

  // Draw the ImageData at the given (x,y) coordinates.
  canvas.putImageData(imageData, 0,0);
}


function connectControls(controls, obj) {
  var result = {};
  for(var i in controls) {
    result[i] = {};
    for(var j in controls[i]) {
      result[i][j] = controls[i][j].bind(obj);
    }
  }
  return result;
}

function psuedoRandom(x,y,ii,jj) {
  // var xi = x + ii;
  // var yi = y + jj;
  // xi = Math.floor(xi) % 100;
  // yi = Math.floor(yi) % 100;
  // return psuedoRandom.grid[yi][xi];
  var seed = x*8746295+y*2193857+ii*1933857+jj*3855716;
  seed += (x+1)*(y+1)*(ii+1)*(jj+1)*1231230;
  // seed += x*x*20+y*y*43+ii*ii*110+jj*jj*234;
  var r = seed * 16807 % 2147483647;
  // r = r * 16807 % 2147483647;
  // r = r * 16807 % 2147483647;
  return (r-1)/2147483647;
}
function setUpRandomGrid(w,h) {
  var randoms = [];
  for(var j=0;j<h;j++) {
    randoms[j]=[];
    for(var i=0;i<w;i++) {
      randoms[j][i] = Math.random();
    }
  }
  return randoms;
}
psuedoRandom.grid = setUpRandomGrid(100,100);

// Expecting rectangle object. Don't pass weird shit ok? ok
function rectangleCollision(rect1, rect2) {
  if(rect1.x <= rect2.x + rect2.w &&
    rect1.x + rect1.w >= rect2.x &&
    rect1.y <= rect2.y + rect2.h &&
    rect1.h + rect1.y >= rect2.y) {
      return true;
    } else {
      return false;
    }
}

function pointInRect(x,y, rect) {
  return x >= rect.x && x <= rect.x+rect.w && y >= rect.y && y <= rect.y+rect.h;
}

function rectangleCollisionAtTopOfEnemy(rect1, rect2) {
  if(rect1.y + rect1.h == 0) {
    return true;
  } else {
    return false;
  }
}

function distanceBetweenEntities(a,b) {
  var dx = a.x-b.x;
  var dy = a.y-b.y;
  var r = Math.sqrt(dx*dx+dy*dy);
  return r;
}
function circleMove(direction,distance){
  return [circleMoveX(direction,distance),circleMoveY(direction,distance)];
}
function circleMoveX(direction,distance){
  return Math.cos(direction)*distance;
}
function circleMoveY(direction,distance){
  return Math.sin(direction)*distance;
}
function toDegrees(rad){
  return rad * (180 / Math.PI);
}
function toRadians(deg){
  return deg * (Math.PI / 180);
}
function pointAdd(pointA,pointB){
  return [pointA[0]+pointB[0],pointA[1]+pointB[1]];
}
function constrain(value,min,max){
  value = (value > max) ? max : value;
  value = (value < min) ? min : value;
  return value;
}
// class Random {
//   constructor(seed) {
//     this.seed = seed % 2147483647;
//     if (this.seed <= 0) this.seed += 2147483646;
//     this.startSeed = this.seed;    
//   }
//   reset() {
//     this.seed = this.startSeed;
//   }
//   next() {
//     return this.seed = this.seed * 16807 % 2147483647;
//   }
//   random() {
//     return (this.next() - 1) / 2147483646;
//   }
// }

// var PSEUDORANDOMIZER = new Random(18923412384291);
