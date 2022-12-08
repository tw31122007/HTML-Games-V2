class WinScene extends Scene{
  constructor() {
    super();
    this.gui = [];
    this.keyMap = {
      '32': {down: this.start.bind(this)}
    }
  }
  start() {
    this.driver.setScene(new GameScene());
  }
  draw(canvas) {
    canvas.fillStyle = 'black';
    canvas.textAlign = 'center';
    canvas.fillText('You Win! Press Space To Restart', canvas.width/2, canvas.height/2);
  }
}