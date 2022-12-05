(function (window) {
    /*This class is designed to globalize helpful functions*/
    String.prototype.splice = function(start, delCount, newSubStr) {
        return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
    };

    //add prototype to window
    window.lb = new LunchBox();

    //constructor
    function LunchBox(){
        this.getRandomInt = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        this.getRandomDouble = function(min, max) {
            return Math.random() * (max - min) + min;
        };
        this.occurrences = function(string, subString, allowOverlapping) {
            string += "";
            subString += "";
            if (subString.length <= 0) return (string.length + 1);
            var n = 0,
                pos = 0,
                step = allowOverlapping ? 1 : subString.length;
            while (true) {
                pos = string.indexOf(subString, pos);
                if (pos >= 0) {
                    ++n;
                    pos += step;
                } else break;
            }
            return n;
        };
        //Function to convert hex format to a rgb color.
        this.rgbToHex = function(rgb){
            rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
        };
        this.capitalize = function(text) {
            return text.charAt(0).toUpperCase() + text.slice(1);
        };
        //This function will return the byte size of any UTF-8 string you pass to it.
        this.byteCount = function(s) { return encodeURI(s).split(/%..|./).length - 1; }
    }
}(window));