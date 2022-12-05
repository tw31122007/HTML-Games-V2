(function (window) {

    //extend & promote createjs.Container functions to window
    createjs.extend(AssetManager, createjs.Container);
    window.AssetManager = createjs.promote(AssetManager, "Container");

	//constructor
	function AssetManager(width, height, box) {

        //prototype functions
        this.init = function(){
            //initiate object variables
            this.Container_constructor();
            this.width = width;
            this.height = height;
            this.box = box;
            //load game assets
            this.preload = new createjs.LoadQueue(true);
            this.preload.installPlugin(createjs.Sound);
            this.preload.loadManifest({ id: "assets", src:"assets.json" });

            //draw background of progress bar
            this.barX = this.width / 2;
            this.barY = this.height / 2;
            this.barWidth = this.width * 0.75;
            this.barHeight = this.box / 2;
            this.bar1 = new createjs.Shape();
            this.bar1.graphics.beginFill("#dc265a").drawRect(
                this.barX - (this.barWidth/2) - (this.box * 0.5),
                this.barY - (this.barHeight/2) - (this.box * 0.5),
                this.barWidth + this.box * 1,
                this.barHeight + this.box * 1);

            //draw progress bar
            this.bar2 = new createjs.Shape();

            //add to containger -> stage
            this.addChild(this.bar1, this.bar2);
        };

        //update
        this.updateLoading = function() {
            this.bar2.graphics.beginFill("#ffffff").drawRect(
                this.barX - (this.barWidth/2),
                this.barY - (this.barHeight/2),
                this.preload.progress * this.barWidth,
                this.barHeight);
        };

        //initiate variables
        this.init();
	}
}(window));
