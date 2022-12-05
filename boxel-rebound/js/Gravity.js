(function (window) {

    //add prototype to window
    window.gravity = new Gravity();

    //main prototype
    function Gravity(){
        //prototype functions
        this.init = function(){
            this.direction = 1; //1 = normal, -1 = reverse
        };

        this.set = function(amplitude, duration){
            this.box = window.Game.box12;
            this.amplitude = amplitude * this.box; //15 * (360/12) = 450
            this.duration = duration; //1000 = 1 second until y is negative
            this.pauseDiff = 0;
            if (this.originalAmplitude == null) this.originalAmplitude = this.amplitude;
            if (this.originalDuration == null) this.originalDuration = this.duration;
        };
        this.reset = function(){
            this.amplitude = this.originalAmplitude;
            this.duration = this.originalDuration;
        };
        this.push = function(startX, startY){
            this.pauseDiff = 0;
            this.startTime = Date.now();
            this.startX = this.x = startX; //0 = push, 0.5 = pull
            this.startY = this.y = (startY + this.calculateY(startX));
            this.y = this.startY;
        };
        this.pull = function() {
            this.currentTime = Date.now();
            this.timeDiff = (this.currentTime - this.startTime);
            this.timeDiff -= (this.timeDiff > this.pauseDiff) ? this.pauseDiff : 0;
            this.x = (this.timeDiff / (this.duration / window.Game.speed / window.Game.gravityMultiplier)) + this.startX;
            this.yDiff = this.calculateY(this.x);
            this.y = (this.startY - this.yDiff);
            return this.y;
        };
        this.stop = function() {

        };
        this.calculateY = function(x){
            //ex: y = 450*​(‑(x^​2))+​450*​x    y = 112.5 when x = 0.5
            return (this.amplitude*(-(Math.pow(x,2)))+(this.amplitude*x));
        };
        this.isFalling = function(){ return this.x > 0.5; };
        this.isRising = function(){ return this.x < 0.5; };
        this.isLanded = function(){ return this.x == 0.5; };
        this.forceDirection = function(){ return this.isFalling() ? 1 : -1; };
        this.setPauseDiff = function(pauseDiff) { this.pauseDiff = pauseDiff; };

        //initiate prototype variables
        this.init();
    }
}(window));