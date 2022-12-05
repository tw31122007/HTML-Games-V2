(function (window) {

    //add prototype to window
    window.tiles = new Tiles();

    //main prototype
    function Tiles(){
        //prototype functions
        this.init = function(){
            //initiate object variables
        };

        this.drawShape = function(color, r, c, type, addFill, boxSize){
            var shape = new createjs.Shape();
            var box = Math.floor(window.Game.box12);
            if (boxSize != null) box = boxSize;

            if (type == 0){ //remove box
                shape.graphics.beginFill(color).drawRect(0, box*0.4, box, box*0.2);
            }
            else if (type == 1){ //box
                shape.graphics.beginFill(color).drawRect(0, 0, box, box);
            }
            else if (type == 2){ //tip
                if (addFill == true){
                    color = "#0286f2";
                    shape.graphics.beginFill("#ffffff").drawRect(box*0.4, box*0.1, box*0.2, box*0.5);
                    shape.graphics.beginFill("#ffffff").drawRect(box*0.4, box*0.7, box*0.2, box*0.2);
                }
                shape.graphics.beginFill(color).drawRect(0, 0, box*0.4, box);
                shape.graphics.beginFill(color).drawRect(box*0.4, 0, box*0.2, box*0.1);
                shape.graphics.beginFill(color).drawRect(box*0.4, box*0.6, box*0.2, box*0.1);
                shape.graphics.beginFill(color).drawRect(box*0.4, box*0.9, box*0.2, box*0.1);
                shape.graphics.beginFill(color).drawRect(box*0.6, 0, box*0.4, box);
            }
            else if (type == 3){ //spawn
                shape.graphics.beginFill(color).drawRect(0, 0, box, box*0.2);
                shape.graphics.beginFill(color).drawRect(0, box*0.2, box*0.2, box*0.6);
                shape.graphics.beginFill(color).drawRect(box*0.8, box*0.2, box*0.2, box*0.6);
                shape.graphics.beginFill(color).drawRect(0, box*0.8, box, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.4, box*0.4, box*0.2, box*0.2);
            }
            else if (type == 4){ //up spike
                shape.graphics.beginFill(color).lineTo(0, box).lineTo(box*0.25, 0).lineTo(box*0.5, box).lineTo(box*0.75, 0).lineTo(box,box).closePath();
            }
            else if (type == 5){ //right spike
                shape.graphics.beginFill(color).lineTo(0, 0).lineTo(box, box*0.25).lineTo(0, box*0.5).lineTo(box, box*0.75).lineTo(0, box).closePath();
            }
            else if (type == 6){ //down spike
                shape.graphics.beginFill(color).lineTo(0, 0).lineTo(box*0.25, box).lineTo(box*0.5, 0).lineTo(box*0.75, box).lineTo(box, 0).closePath();
            }
            else if (type == 7){ //left spike
                shape.graphics.beginFill(color).lineTo(box,0).lineTo(0,box*0.25).lineTo(box,box*0.5).lineTo(0,box*0.75).lineTo(box,box).closePath();
            }
            else if (type == 8){ //expand box
                shape.graphics.beginFill(color).drawRect(0, 0, box*0.4, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.6, 0, box*0.4, box*0.2);
                shape.graphics.beginFill(color).drawRect(0, box*0.2, box*0.2, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.8, box*0.2, box*0.2, box*0.2);
                shape.graphics.beginFill(color).drawRect(0, box*0.6, box*0.2, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.8, box*0.6, box*0.2, box*0.2);
                shape.graphics.beginFill(color).drawRect(0, box*0.8, box*0.4, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.6, box*0.8, box*0.4, box*0.2);
            }
            else if (type == 9){ //shrink box
                shape.graphics.beginFill(color).drawRect(box*0.2, 0, box*0.2, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.6, 0, box*0.2, box*0.2);
                shape.graphics.beginFill(color).drawRect(0, box*0.2, box*0.4, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.6, box*0.2, box*0.4, box*0.2);
                shape.graphics.beginFill(color).drawRect(0, box*0.6, box*0.4, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.6, box*0.6, box*0.4, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.2, box*0.8, box*0.2, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.6, box*0.8, box*0.2, box*0.2);
            }
            else if (type == 10){ //bounce up box
                shape.graphics.beginFill(color).drawRect(0, 0, box, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.4, box*0.2, box*0.2, box*0.2);
                shape.graphics.beginFill(color).drawRect(0, box*0.4, box, box*0.6);
            }
            else if (type == 11){ //finish box
                if (addFill == true && color != "#ffffff"){ shape.graphics.beginFill("#ffffff").drawRect(0, 0, box, box); }
                for (var row=0; row < 8; row++){
                    for (var col=0; col < 8; col += 2){
                        shape.graphics.beginFill(color).drawRect(
                            col*(box*0.125)+((box*0.125)*(row % 2)), row*(box*0.125), box*0.125, box*0.125);
                    }
                }
            }
            else if (type == 12){ //up arrow
                if (addFill == true){ color = "#0286f2"; shape.graphics.beginFill("#ffffff").drawRect(box*0.2, box*0.2, box*0.6, box*0.6); }
                shape.graphics.beginFill(color).drawRect(0, 0, box, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.8, box*0.2, box*0.2, box*0.6);
                shape.graphics.beginFill(color).drawRect(0, box*0.8, box, box*0.2);
                shape.graphics.beginFill(color).drawRect(0, box*0.2, box*0.2, box*0.6);
                shape.graphics.beginFill(color).drawRect(box*0.2, box*0.5, box*0.2, box*0.3);
                shape.graphics.beginFill(color).drawRect(box*0.6, box*0.5, box*0.2, box*0.3);
                shape.graphics.beginFill(color).lineTo(box*0.2, box*0.2).lineTo(box*0.2, box*0.5).lineTo(box*0.5, box*0.2).closePath();
                shape.graphics.beginFill(color).lineTo(box*0.5, box*0.2).lineTo(box*0.8, box*0.5).lineTo(box*0.8, box*0.2).closePath();
            }
            else if (type == 13){ //right arrow
                if (addFill == true){ color = "#0286f2"; shape.graphics.beginFill("#ffffff").drawRect(box*0.2, box*0.2, box*0.6, box*0.6); }
                shape.graphics.beginFill(color).drawRect(0, 0, box, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.8, box*0.2, box*0.2, box*0.6);
                shape.graphics.beginFill(color).drawRect(0, box*0.8, box, box*0.2);
                shape.graphics.beginFill(color).drawRect(0, box*0.2, box*0.2, box*0.6);
                shape.graphics.beginFill(color).drawRect(box*0.2, box*0.2, box*0.3, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.2, box*0.6, box*0.3, box*0.2);
                shape.graphics.beginFill(color).lineTo(box*0.5, box*0.2).lineTo(box*0.8, box*0.5).lineTo(box*0.8, box*0.2).closePath();
                shape.graphics.beginFill(color).lineTo(box*0.5, box*0.8).lineTo(box*0.8, box*0.8).lineTo(box*0.8, box*0.5).closePath();
            }
            else if (type == 14){ //down arrow
                if (addFill == true){ color = "#0286f2"; shape.graphics.beginFill("#ffffff").drawRect(box*0.2, box*0.2, box*0.6, box*0.6); }
                shape.graphics.beginFill(color).drawRect(0, 0, box, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.8, box*0.2, box*0.2, box*0.6);
                shape.graphics.beginFill(color).drawRect(0, box*0.8, box, box*0.2);
                shape.graphics.beginFill(color).drawRect(0, box*0.2, box*0.2, box*0.6);
                shape.graphics.beginFill(color).drawRect(box*0.2, box*0.2, box*0.2, box*0.3);
                shape.graphics.beginFill(color).drawRect(box*0.6, box*0.2, box*0.2, box*0.3);
                shape.graphics.beginFill(color).lineTo(box*0.2, box*0.5).lineTo(box*0.2, box*0.8).lineTo(box*0.5, box*0.8).closePath();
                shape.graphics.beginFill(color).lineTo(box*0.5, box*0.8).lineTo(box*0.8, box*0.8).lineTo(box*0.8, box*0.5).closePath();
            }
            else if (type == 15){ //left arrow
                if (addFill == true){ color = "#0286f2"; shape.graphics.beginFill("#ffffff").drawRect(box*0.2, box*0.2, box*0.6, box*0.6); }
                shape.graphics.beginFill(color).drawRect(0, 0, box, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.8, box*0.2, box*0.2, box*0.6);
                shape.graphics.beginFill(color).drawRect(0, box*0.8, box, box*0.2);
                shape.graphics.beginFill(color).drawRect(0, box*0.2, box*0.2, box*0.6);
                shape.graphics.beginFill(color).drawRect(box*0.5, box*0.2, box*0.3, box*0.2);
                shape.graphics.beginFill(color).drawRect(box*0.5, box*0.6, box*0.3, box*0.2);
                shape.graphics.beginFill(color).lineTo(box*0.2, box*0.2).lineTo(box*0.2, box*0.5).lineTo(box*0.5, box*0.2).closePath();
                shape.graphics.beginFill(color).lineTo(box*0.2, box*0.5).lineTo(box*0.2, box*0.8).lineTo(box*0.5, box*0.8).closePath();
            }
            else if (type == 16){ //reverse gravity box
                if (addFill == true){ color = "#0286f2"; shape.graphics.beginFill("#ffffff").drawRect(box*0.125, box*0.125, box*0.875, box*0.875); }
                shape.graphics.beginFill(color).lineTo(box*0.0, box*0.0).lineTo(box*0.625, box*0.0).lineTo(box*0.0, box*0.625).closePath();
                shape.graphics.beginFill(color).lineTo(box*0.375, box*0.0).lineTo(box*1.0, box*0.0).lineTo(box*1.0, box*0.625).closePath();
                shape.graphics.beginFill(color).lineTo(box*0.0, box*0.5).lineTo(box*0.375, box*0.5).lineTo(box*0.0, box*0.875).closePath();
                shape.graphics.beginFill(color).lineTo(box*0.675, box*0.5).lineTo(box*1.0, box*0.5).lineTo(box*1.0, box*0.875).closePath();
                shape.graphics.beginFill(color).drawRect(box*0.0, box*0.75, box*1.0, box*0.25);
            }
            else if (type == 17){ //fast box
                if (addFill == true){ color = "#0286f2"; shape.graphics.beginFill("#ffffff").drawRect(box*0.125, box*0.125, box*0.875, box*0.875); }
                shape.graphics.beginFill(color).lineTo(box*0.125, box*0.0).lineTo(box*0.5, box*0.0).lineTo(box*0.5, box*0.375).closePath();
                shape.graphics.beginFill(color).lineTo(box*0.125, box*1.0).lineTo(box*0.5, box*0.675).lineTo(box*0.5, box*1.0).closePath();
                shape.graphics.beginFill(color).lineTo(box*0.375, box*0.0).lineTo(box*1.0, box*0.0).lineTo(box*1.0, box*0.625).closePath();
                shape.graphics.beginFill(color).lineTo(box*0.375, box*1.0).lineTo(box*1.0, box*0.375).lineTo(box*1.0, box*1.0).closePath();
                shape.graphics.beginFill(color).drawRect(box*0.0, box*0.0, box*0.25, box*1.0);
            }
            else if (type == 18){ //reset gravity box
                if (addFill == true){ color = "#0286f2"; shape.graphics.beginFill("#ffffff").drawRect(box*0.125, box*0.125, box*0.875, box*0.875); }
                shape.graphics.beginFill(color).lineTo(box*0.0, box*0.125).lineTo(box*0.375, box*0.5).lineTo(box*0.0, box*0.5).closePath();
                shape.graphics.beginFill(color).lineTo(box*1.0, box*0.125).lineTo(box*1.0, box*0.5).lineTo(box*0.625, box*0.5).closePath();
                shape.graphics.beginFill(color).lineTo(box*0.0, box*0.375).lineTo(box*0.625, box*1.0).lineTo(box*0.0, box*1.0).closePath();
                shape.graphics.beginFill(color).lineTo(box*1.0, box*0.375).lineTo(box*1.0, box*1.0).lineTo(box*0.375, box*1.0).closePath();
                shape.graphics.beginFill(color).drawRect(box*0.0, box*0.0, box*1.0, box*0.25);
            }
            else if (type == 19){ //slow box
                if (addFill == true){ color = "#0286f2"; shape.graphics.beginFill("#ffffff").drawRect(box*0.125, box*0.125, box*0.875, box*0.875); }
                shape.graphics.beginFill(color).lineTo(box*0.0, box*0.0).lineTo(box*0.625, box*0.0).lineTo(box*0.0, box*0.625).closePath();
                shape.graphics.beginFill(color).lineTo(box*0.0, box*0.375).lineTo(box*0.625, box*1.0).lineTo(box*0.0, box*1.0).closePath();
                shape.graphics.beginFill(color).lineTo(box*0.5, box*0.0).lineTo(box*0.875, box*0.0).lineTo(box*0.5, box*0.375).closePath();
                shape.graphics.beginFill(color).lineTo(box*0.5, box*0.625).lineTo(box*0.875, box*1.0).lineTo(box*0.5, box*1.0).closePath();
                shape.graphics.beginFill(color).drawRect(box*0.75, box*0.0, box*0.25, box*1.0);
            }
            else if (type == 50){ //player skin - default
                shape.graphics.beginFill(color).drawRect(0, 0, box*1, box*1);
            }
            else if (type == 51){ //player skin - triangles
                shape.graphics.beginFill(color).lineTo(0, box*1).lineTo(box*0.25, box*0.5).lineTo(box*0.5, box*1).closePath();
                shape.graphics.beginFill(color).lineTo(box*0.25, box*0.5).lineTo(box*0.5, box*0).lineTo(box*0.75, box*0.5).closePath();
                shape.graphics.beginFill(color).lineTo(box*0.5, box*1).lineTo(box*0.75, box*0.5).lineTo(box*1, box*1).closePath();
            }
            else if (type == 52){ //player skin - circle
                shape.graphics.beginFill(color).drawCircle(box*0.5, box*0.5, box*0.5);
            }
            else if (type == 53){ //player skin - heart
                shape.graphics.beginFill(color).drawCircle(box*0.3334, box*0.3334, box*0.3334);
                shape.graphics.beginFill(color).drawCircle(box*0.6667, box*0.6667, box*0.3334);
                shape.graphics.beginFill(color).drawRect(0, box*0.3334, box*0.6667, box*0.6667);
            }
            else if (type == 54){ //player skin - cat
                var pixels = [
                    [0.375, 0], [0.875, 0],
                    [0.375, 0.125], [0.5, 0.125], [0.625, 0.125], [0.75, 0.125], [0.875, 0.125],
                    [0.375, 0.25], [0.625, 0.25], [0.875, 0.25],
                    [0, 0.375], [0.5, 0.375], [0.625, 0.375], [0.75, 0.375],
                    [0, 0.5],  [0.625, 0.5],
                    [0, 0.625], [0.375, 0.625], [0.5, 0.625], [0.625, 0.625], [0.75, 0.625],
                    [0, 0.75], [0.25, 0.75], [0.375, 0.75], [0.5, 0.75], [0.625, 0.75], [0.75, 0.75],
                    [0.125, 0.875], [0.25, 0.875], [0.375, 0.875], [0.5, 0.875], [0.625, 0.875], [0.875, 0.875]
                ]
                for (var i = 0; i < pixels.length; i++){
                    shape.graphics.beginFill(color).drawRect(box*pixels[i][0], box*pixels[i][1], box*0.125, box*0.125);
                }
            }
            else if (type == 55){ //player skin - dog
                var pixels = [
                    [0.625, 0],
                    [0.625, 0.125], [0.75, 0.125], [0.875, 0.125],
                    [0, 0.25], [0.625, 0.25], [0.75, 0.25], [0.875, 0.25],
                    [0.125, 0.375], [0.25, 0.375], [0.375, 0.375], [0.5, 0.375], [0.625, 0.375],
                    [0.125, 0.5], [0.25, 0.5], [0.375, 0.5], [0.5, 0.5], [0.625, 0.5],
                    [0.125, 0.625], [0.25, 0.625], [0.375, 0.625], [0.5, 0.625], [0.625, 0.625],
                    [0.125, 0.75], [0.625, 0.75],
                    [0.125, 0.875], [0.25, 0.875], [0.625, 0.875], [0.75, 0.875]
                ]
                for (var i = 0; i < pixels.length; i++){
                    shape.graphics.beginFill(color).drawRect(box*pixels[i][0], box*pixels[i][1], box*0.125, box*0.125);
                }
            }
            else if (type == 56){ //player skin - mouse
                var pixels = [
                    [0.375, 0], [0.5, 0], [0.75, 0], [0.875, 0],
                    [0.375, 0.125], [0.5, 0.125], [0.625, 0.125], [0.75, 0.125], [0.875, 0.125],
                    [0, 0.25], [0.5, 0.25], [0.75, 0.25],
                    [0, 0.375], [0.5, 0.375], [0.625, 0.375], [0.75, 0.375], [0.875, 0.375],
                    [0, 0.5], [0.25, 0.5], [0.375, 0.5], [0.5, 0.5], [0.75, 0.5],
                    [0.125, 0.625], [0.25, 0.625], [0.375, 0.625], [0.5, 0.625],
                    [0.125, 0.75], [0.25, 0.75], [0.375, 0.75], [0.5, 0.75],
                    [0.125, 0.875], [0.25, 0.875], [0.375, 0.875], [0.625, 0.875],
                ]
                for (var i = 0; i < pixels.length; i++){
                    shape.graphics.beginFill(color).drawRect(box*pixels[i][0], box*pixels[i][1], box*0.125, box*0.125);
                }
            }
            else if (type == 57){ //player skin - bird
                var pixels = [
                    [0.5, 0], [0.625, 0], [0.75, 0],
                    [0.5, 0.125], [0.75, 0.125], [0.875, 0.125],
                    [0.5, 0.25], [0.625, 0.25], [0.75, 0.25],
                    [0.375, 0.375], [0.5, 0.375], [0.625, 0.375], [0.75, 0.375],
                    [0, 0.5], [0.125, 0.5], [0.25, 0.5], [0.375, 0.5], [0.5, 0.5], [0.625, 0.5], [0.75, 0.5],
                    [0.125, 0.625], [0.25, 0.625], [0.375, 0.625], [0.5, 0.625], [0.625, 0.625], [0.75, 0.625],
                    [0.375, 0.75], [0.5, 0.75], [0.625, 0.75],
                    [0.375, 0.875], [0.625, 0.875]
                ]
                for (var i = 0; i < pixels.length; i++){
                    shape.graphics.beginFill(color).drawRect(box*pixels[i][0], box*pixels[i][1], box*0.125, box*0.125);
                }
            }
            shape.x = c*box;
            shape.y = r*box;
            shape.cache(0, 0, box*1, box*1);
            return shape;
        };
        this.isSolid = function(type){
            var solid = type > 0; //assume all tiles are solid
            switch (type){ //exceptions
                case(3): solid = false; break; //respawn box
                case(8): solid = false; break; //expand box
                case(9): solid = false; break; //shrink box
            }
            return solid;
        };

        //initiate variables
        this.init();
    }
}(window));