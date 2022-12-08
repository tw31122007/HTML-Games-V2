class Animation2 {
  constructor(time, animate, callback) {
    this.time = time;
    this.animate = animate;
    this.callback = callback;
  }
  update(dt, frameCount) {
    this.time -= 1;
    if(this.time <=0) {
      this.callback(dt, frameCount);
    }
    else {
      this.animate(dt, frameCount);
    }
  }
}