
var left = "";
var canvas_sides = ["Left", "Right", "Top", "Bottom"];

var initialize_teleport_detection = function(){

	
	var canvas = document.getElementById("canvas");

	// //Mouse leave canvas event	
	canvas.onmouseleave = function(e)
	{	
		if(!left)
		{	
			//Gets side the canvas was left from
			var mouseX = e.clientX;
			var mouseY = e.clientY; 

			var width = canvas.scrollWidth;
			var height = canvas.scrollHeight;

			if(mouseX > width){
				left = "Right";
			}
			else if(mouseX < 0){
				left = "Left"; 
			}
			else if(mouseY > height){
				left = "Bottom"; 
			
			}
			else if(mouseY < 0){
				left = "Top"; 
			}

			gml_Script_gmcallback_mouse_left();
		}

	};


	//Mouse enter canvas event
	canvas.onmouseenter= function(e)
	{
		if(left != ""){

			//Gets side the screen was entered from
			var mouseX = e.clientX;
			var mouseY = e.clientY; 

			var width = canvas.scrollWidth;
			var height = canvas.scrollHeight;

			//Finds the side of the screen the pos is closest to
			canvas_sides["Right"] =  mouseX/width;
			canvas_sides["Left"]  =  1 - canvas_sides["Right"];
			canvas_sides["Bottom"] =  mouseY/height;
			canvas_sides["Top"]  =  1 - canvas_sides["Bottom"];
			var closest = Object.keys(canvas_sides).reduce(function(a, b){ return canvas_sides[a] > canvas_sides[b] ? a : b });

			//Determines teleported
			teleported = closest != left; 
			if(teleported){

				//Finally gamemaker teleports
				gml_Script_gmcallback_teleport();

			}
			
			left = "";

		}
	};

}

var is_mac = function(){

	 var mac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? 1 : 0;
	 return mac;
}
