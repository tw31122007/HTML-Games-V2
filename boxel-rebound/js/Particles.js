//Particles Class
(function (window) {

    //extend & promote createjs.Container functions to window
    createjs.extend(Particles, createjs.Container); //instance of class
    window.Particles = createjs.promote(Particles, "Container");

    //main prototype
    function Particles() {
        //prototype functions
        this.init = function(){
            //initiate object variables
            this.Container_constructor();
        };
        //check all particles inside this container
        this.tick = function (delta) {
            for (var i=0; i < this.children.length; i++){
                this.getChildAt(i).tick(delta);
                if (this.getChildAt(i).alpha < 0) this.removeChildAt(i);
            }
        };
        //add particle containers to this container
        this.addParticles = function(x, y, size, color, direction, amount, once){
            if (this.children.length > 0 && once != null) once = false; //prevent adding particles more than once
            if (once == true || once == null){
                createjs.Sound.play("collect");
                for (var i=0; i < amount; i++) {
                    this.addChild(new Particle(x,y,size,color,direction));
                }
            }
        };
        this.removeAllParticles = function(){ this.removeAllChildren(); };
        this.pauseParticles = function(pauseDiff){
            for (var i=0; i < this.children.length; i++) {
                this.getChildAt(i).gravity.setPauseDiff(pauseDiff);
            }
        };

        //initiate prototype variables
        this.init();
    }
}(window));

//Particle Class
(function (window) {

    //extend & promote createjs.Container functions to window
    createjs.extend(Particle, createjs.Container);
    window.Particle = createjs.promote(Particle, "Container");

    //main prototype
    function Particle(x, y, size, color, direction) {
        //prototype functions
        this.init = function(){
            //initiate object variables
            this.Container_constructor();
            this.box = window.Game.box12;
            this.s = new createjs.Shape();
            this.x = x;
            this.y = y;
            this.size = size*window.lb.getRandomDouble(0.5,1.5);
            this.xV = (window.lb.getRandomDouble(0,1)*this.box) / 50;
            this.regX = this.regY = this.size/2;
            this.duration = this.maxDur = 1000;
            this.direction = direction;
            this.gravity = Object.create(window.gravity);
            this.gravity.set(window.lb.getRandomDouble(15,50), window.lb.getRandomDouble(750,1000));
            this.gravity.push(0, y);
            this.s.graphics.beginFill(color).drawRect(0,0,this.size,this.size);
            this.addChild(this.s);
        };

        //update
        this.tick = function (delta) {
            this.rotation += delta*this.xV*4;
            this.gravity.pull();
            this.duration -= delta;
            this.alpha = this.duration / this.maxDur;
            this.x += (delta * this.xV) * this.direction;
            this.y = this.gravity.y;
        };

        //initiate prototype variables
        this.init();
    }
}(window));