class Enemy extends Mover {
	constructor(x,y) {
		super(x,y);
		this.w = 40;
		this.h = 40;
		this.height = this.h;
		this.width = this.w; 
		this.color = "red";
		this.speed = 3;
		this.groundAccel = 5;
		this.mx = 1;
		this.turnsAroundAtWall = true;
    this.killPlayer = true;
    this.isColliding = false;
    this.cloudParticlesOn = particles.enemy.enabled;
	}
		 
	playerCollision(player) {
		if(player.vy > 0 && player.y-player.vy<this.y ) {
			return true;
		} else {
			return false;
		}
	}

	getHitByEntity(player) {
		player.bounceOffEntity(this);
		this.h=this.h/2;
		// this.die();
	}

	onHitPlayer(player) {
	}


	update(dt, frameCount) {
		if(this.turnsAroundAtWall&&this.wallcolliding == true) {
			this.mx = this.mx*-1;
		}
		super.update(dt, frameCount);       
		var enemyBox = this.getHitBox();	// Perforamnce effeciency issue
		var playerBox = this.game.player.getHitBox();
		if(rectangleCollision(enemyBox, playerBox) == true) {
      if(!this.isColliding&&this.game.player.bounceTimer<=0) {
        if(this.playerCollision(this.game.player) == true) {
          this.getHitByEntity(this.game.player);
          this.isColliding = true;
        } else {
          this.onHitPlayer(this.game.player);
          this.game.player.getHitByEntity(this);
        }
      }
		} else {
      this.isColliding = false;
    }
	}       
	draw(canvas) {
    super.draw(canvas);
    // var box = this.getHitBox();
    // canvas.strokeRect(box.x,box.y,box.w,box.h);
  }
}