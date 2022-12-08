class SplashScreenScene extends Scene {
  constructor(playIntro, imageUrl, nextScene) {
    super(playIntro);
    this.splash = new Image();
    this.nextScene = nextScene;
    // this.splash.src = IMAGEASSETS + "CoolmathGames-800x600.jpg";
    // this.splash.src = IMAGEASSETS + "CoolmathGames-640x480_no-URL.jpg";
    this.splash.src = IMAGEASSETS + imageUrl;
    this.splash.onload = this.start.bind(this);
    this.running = false;
    this.showTime = 500;
    this.endingTime = 200;
    this.iconScale = 0.8;
    this.keyMap = {
      '27': {down: this.skip.bind(this)}
    }
  }
  start() {
    this.running = true;
    this.startTransition(25, -1, () => {
      setTimeout(() => {
        this.startTransition(15, 1, () => {
          this.running = false;
          setTimeout(() => {
            this.end();
          }, this.endingTime);
        })
      }, this.showTime)
    })
  }
  skip() {
    this.end();
  }
  end() {
    this.driver.setScene(new this.nextScene(true));
  }
  draw(canvas) { 
    canvas.fillStyle = 'black';
    canvas.fillRect(0,0,canvas.width,canvas.height);
    if (this.running) {
      var image = this.splash;
      var w = canvas.height * image.width / image.height;
      var h = canvas.height;
      w *= this.iconScale;
      h *= this.iconScale;
      var x = canvas.width/2 - w/2;
      var y = canvas.height/2 - h/2;
      canvas.drawImage(image, x,y, w, h);
      if(this.text) {
        canvas.fillStyle = 'white';
        canvas.fillText(this.text, x,y,w,h);
      }
    }
    drawTransitionOverlay(this.overlayColor,canvas);
  }
}