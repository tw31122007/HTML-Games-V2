
class DoinkPad {
    constructor(x,y){
        this.x=x;this.y=y;
        this.w= 30;
        this.h = 30;
        this.r = 15;
        this.bounceAnimation = 0;
        this.behind = true;
    }
    update() {    
		var doinkBox = this.getHitBox();
    var playerBox = this.game.player.getHitBox();
    if(rectangleCollision(doinkBox, playerBox) == true) {
      if(!this.isColliding) {
        if(this.playerCollision(this.game.player) == true) {
          this.getHitByEntity(this.game.player);
          this.isColliding = true;
        }
      }
    } else {
      this.isColliding = false;
    }
        if (this.bounceAnimation > 0)this.bounceAnimation-=1;
	}
    draw(canvas) {
    var r = this.r;
    r += Math.cos(this.bounceAnimation*Math.PI/5)*10;
    canvas.fillStyle="#ffee5e";
    // canvas.arc(this.x,this.y-Math.cos(this.bounceAnimation*Math.PI/10)*10,r,0,Math.PI*2);
    var bounce = Math.cos(this.bounceAnimation*Math.PI/10);
    var pinch = this.w/10;
    pinch += 3*bounce;
    canvas.beginPath();    
    canvas.moveTo(this.x-this.w+pinch, this.y-this.h-5*bounce);
    canvas.quadraticCurveTo(this.x,this.y-this.h-20*bounce,this.x+this.w-pinch, this.y-this.h-5*bounce);
    canvas.lineTo(this.x+this.w,this.y);
    canvas.lineTo(this.x-this.w,this.y);
    canvas.fill();
    canvas.fillStyle = "#d1be55";
    canvas.beginPath();
    canvas.moveTo(this.x-this.w+pinch, this.y-this.h-5*bounce);
    canvas.quadraticCurveTo(this.x-this.w,this.y,this.x+this.w,this.y);
    canvas.lineTo(this.x-this.w,this.y);
    canvas.fill();
    }

    getHitByEntity(player) {
        this.bounceAnimation = 20;
      player.bounceOffEntity(this);
	}

  playerCollision(player) {
		if(player.vy > 0) {
			return true;
		} else {
			return false;
		}
	}

    getHitBox() {
      var w = this.w*2;
      var h = this.h;
    return {x:this.x-.5*w, y:this.y-h, w, h};
    }
    
}