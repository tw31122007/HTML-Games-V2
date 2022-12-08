addBlock(function() { return {
  //Byrd Block
  id: BLOCKS.length,
  name: "Owl",
  hide: true,   
  ignoreCollisions: true,
  drawer: new Owl(),
  draw: drawEntity,
  onload: function(game, x,y,width,height, world,ii,jj) {
    game.addEntity(new Owl(x + width/2,y + height));
  },
}});
addBlock(function() { return {
  //Byrd Block
  id: BLOCKS.length,
  name: "Follow Bird",
  hide: true,   
  ignoreCollisions: true,
  drawer: new FollowBird(),
  draw: drawEntity,
  onload: function(game, x,y,width,height, world,ii,jj) {
    game.addEntity(new FollowBird(x + width/2,y + height));
  },
}});

addBlock(function() { return {
  //Byrd Block
  id: BLOCKS.length,
  name: "Owl Striker",
  hide: true,   
  ignoreCollisions: true,
  drawer: new OwlStriker(),
  draw: drawEntity,
  onload: function(game, x,y,width,height, world,ii,jj) {
    game.addEntity(new OwlStriker(x + width/2,y + height));
  },
}});