const createPaddle = function(game, socket, options) {
  const paddle = document.createElement('div');
  paddle.style.left = options.x + '%';
  paddle.style.top = options.y + '%';
  paddle.classList.add('paddle');
  paddle.style.backgroundColor = options.color;
  game.appendChild(paddle);

  // add mouse controls if this paddle is the one we (the player) are to control
  if (options.isClient) {
    let startY = 0;

    game.addEventListener('mousemove', function movePaddle(event) {
      let newY = event.clientY - startY;
      const maxY = game.offsetHeight - paddle.offsetHeight;
      newY = newY < 0 ? 0 : newY > maxY ? maxY : newY;
      paddle.style.top = newY;

      if (newY === 0) {
        startY = event.clientY;
      } else if (newY === maxY) {
        startY = event.clientY - maxY;
      }

      const percent = (newY / game.offsetHeight) * 100;
      // TODO: throttle movement!
      socket.send({type: 'movePlayer', y: percent});
    });
  }

  return paddle;
};
