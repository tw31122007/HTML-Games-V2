"use strict";
Array.prototype.clear = function () {
    while (this.length) {
        this.pop();
    }
};
window.JellyTruck = {	
	// reference to the Phaser.Game instance
	game: null,
	disableWebAudio: true,
	// main function
	main: function(){
		this.game = new Phaser.Game(800,480, Phaser.CANVAS, document.body, window.JellyTruck.state.boot);
	},	
	// here we will store all states
	state: {}
};

window.addEventListener('DOMContentLoaded', function(){	
	window.JellyTruck.main();	
}, false);

