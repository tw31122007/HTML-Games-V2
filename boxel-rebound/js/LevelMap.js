
(function (window) {

    //extend & promote createjs.Container functions to window
    createjs.extend(LevelMap, createjs.Container);
    window.LevelMap = createjs.promote(LevelMap, "Container");

    //main prototype
	function LevelMap() {
        //prototype functions
	    this.init = function(){
            this.Container_constructor();
            this.box = Math.floor(window.Game.box12);
            this.map = [];
            this.mapHistory = [];
            this.historyIndex = 0;
        };

        //update
        this.tick = function (delta) {
            this.x = -window.Game.player.xPos;
        };

        this.createMapFromString = function(mapString){
            this.map = []; //create empty map
            var rows = window.lb.occurrences(mapString,"\n", false)+1;
            var cols = Math.floor(mapString.substring(0,mapString.indexOf('\n')).length / 2); //ignores hidden \r
            mapString = mapString.replace(/(\r\n|\n|\r)/gm,"");
            for (var row=0; row < rows; row++){
                this.map[row] = [];
                for (var col=0; col < cols; col++){
                    var i = col+(row*(cols));
                    this.map[row][col] = new this.tile(parseInt(mapString.substring(i*2,(i*2)+2)));
                }
            }
        }

        this.createEmptyMap = function(cols, rows){
            this.map = [];
            for (var row=0; row < rows; row++){
                this.map[row] = [];
                for (var col=0; col < cols; col++){
                    this.map[row][col] = new this.tile(0);
                }
            }
        };

        this.tile = function(type){
            this.type = type;
            this.isSolid = window.tiles.isSolid(type);
        };

        this.setTile = function(col, row, type, lockCols, lockRows){
            var rows = this.map.length;
            var cols = (rows > 0) ? this.map[0].length : 0;
            var nRow = row < 0 ? Math.abs(row) : 0;
            var nCol = col < 0 ? Math.abs(col) : 0;
            var nRowCount = nRow;
            var nColCount = nCol;
            if (lockCols == null) lockCols = false;
            if (lockRows == null) lockRows = true;
            var success = true;

            //prevent array row mutation if specified
            if (lockRows != true){
                while (nRow > 0){ //check if row < 0
                    this.map.unshift([]);
                    for (var c=0; c < cols; c++){ this.map[0][c] = new this.tile(0); }
                    nRow--;
                }
                while (row > (rows-1)){ //check if row > current rows
                    this.map[rows] = [];
                    for (var c=0; c < cols; c++){ this.map[rows][c] = new this.tile(0); }
                    rows++;
                }
            }
            //prevent array column mutation if specified
            if (lockCols != true){
                while (nCol > 0){ //check if col < 0
                    for (var r=0; r < rows+nRowCount; r++){
                        try { if (nRow <= 0 && row < rows) this.map[r].unshift(new this.tile(0)); }
                        catch (e) { if (e instanceof TypeError) { success = false; }}
                    }
                    nCol--;
                }
                while (col > (cols-1)){ //check if col > current columns
                    for (var r=0; r < rows+nRowCount; r++){
                        try { if (nRow <= 0 && row < rows) this.map[r][cols] = new this.tile(0); }
                        catch (e) { if (e instanceof TypeError) { success = false; }}
                    }
                    cols++;
                }
            }
            //set the array property type if within the 'lock' rules
            try {
                var tempMap = this.map[row+nRowCount+(lockRows && row<0 ? -1:0)][col+nColCount+(lockCols && col<0 ? -1:0)];
                tempMap.type = type;
                tempMap.isSolid = window.tiles.isSolid(type);
            }
            catch (e) { if (e instanceof TypeError) { success = false; }}
            return success;
        };

        this.getTile = function(x, y){
            var tile;
            if (x < this.x || y < this.y || x >+ this.getWidth() || y >= this.y+this.getHeight()) tile = null;
            else tile = this.map[this.getTileRow(y)][this.getTileCol(x)];
            return tile;
        };

        this.getTileRow = function(y){ return Math.floor((y-this.y)/this.box); };
        this.getTileCol = function(x){ return Math.floor(x/this.box); };
        this.toString = function(toConsole){
            var aString = "";
            for (var row=0; row < this.map.length; row++){
                for (var col=0; col < this.map[row].length; col++){
                    aString += ('0'+this.map[row][col].type).slice(-2); //double digit string
                }
                if (row < this.map.length-1) aString += "\r\n"; //prevent last return & next line
            }
            if (toConsole == true) console.log(aString);
            return aString;
        };
        this.removeColumn = function(){
            var col = (((this.box * 6) - this.x)/this.box);
            if (col < 0) col = 0;
            if (col > this.getCols()) col = this.getCols();
            for (var row=0; row < this.getRows(); row++){ this.map[row].splice(col, 1); }
        };
        this.insertColumn = function(){
            var col = (((this.box * 6) - this.x)/this.box);
            if (col < 0) col = 0;
            if (col > this.getCols()) col = this.getCols();
            for (var row=0; row < this.getRows(); row++){ this.map[row].splice(col, 0, new this.tile(0)); }
        }

        this.renderMap = function(){
            this.removeAllChildren();
            var rMap = new createjs.Container(); //bg color
            var rows = this.map.length;
            var cols = this.map[0].length;
            for (var row=0; row < rows; row++){
                for (var col=0; col < cols; col++) {
                    var type = this.map[row][col].type;
                    if (type > 0) rMap.addChild(window.tiles.drawShape(window.Game.theme.main_color4,row,col,type,true));
                }
            }
            rMap.cache(0,0, cols*this.box, rows*this.box);
            this.addChild(rMap);
            this.alignFromCenter();
        };
        this.getRows = function(){ return this.map.length; };
        this.getCols = function(){ return this.getRows() > 0 ? this.map[0].length : 0; };
        this.getWidth = function(){ return this.getCols() * this.box; };
        this.getHeight = function(){ return this.getRows() * this.box; };
        this.setBoxSize = function(boxSize){ this.box = boxSize; };
        this.shiftChildren = function(x,y){
            for (var i=0; i < this.children.length; i++){
                this.getChildAt(i).x += x;
                this.getChildAt(i).y += y;
            }
        };
        this.alignFromCenter = function(){ this.y = (window.Game.getHeight()/2)-((this.getRows()*this.box)/2); };
        this.saveMapHistory = function(resumeEditing){
            if (resumeEditing != true) {
                var tempMap = JSON.parse(JSON.stringify(this.map)); //clone
                this.mapHistory.splice(this.historyIndex+1, (this.mapHistory.length)-this.historyIndex); //trim excess lists
                this.mapHistory.push(tempMap);
                if (this.mapHistory.length > 1) this.historyIndex++;
            }
        };
        this.undoMapHistory = function(){
            if (this.mapHistory.length > 0){ //if history exists
                this.historyIndex -= this.historyIndex > 0 ? 1 : 0;
                this.map = JSON.parse(JSON.stringify(this.mapHistory[this.historyIndex]));
                this.renderMap(); //rerender
            }
        };
        this.redoMapHistory = function(){
            if (this.historyIndex < this.mapHistory.length-1){
                this.historyIndex++;
                this.map = JSON.parse(JSON.stringify(this.mapHistory[this.historyIndex]));
            }
            this.renderMap(); //rerender
        };
        this.clearMapHistory = function(){
            this.mapHistory = []; //create empty map
            this.historyIndex = 0;
        };

        //initiate prototype variables
        this.init();
	}
}(window));
