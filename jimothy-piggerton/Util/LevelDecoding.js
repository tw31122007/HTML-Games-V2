function stringToGrid(string) {
  if(!string)return false;
  var grid = [];
  var currentRow;
  var currentDigit = '';
  var x = 0;
  var y = 0;
  // var params = string.split(';');
  // var levelString = params[0];
  var levelString = string;
  for(var i = 1; i < levelString.length-1; i++) {
    var char = levelString[i];
    switch(char) {
      case '[':
        currentRow = [];
        break;
      case ']':
        grid.push(currentRow);
        break;
      case ',':
        if(currentDigit != '') {
          var type = parseInt(currentDigit, 10);
          if(!CELLMAP[type]) type = 0;
          currentRow.push(type);
          currentDigit = '';
        }
        break;
      default:
        currentDigit += char;
    }
  }
  return grid;
}

function jsonToLevel(jsonString) {
  var level = JSON.parse(jsonString);
  level.worldtype = parseInt(level.worldtype);
  return level;
}

function versionLoadLevel(string, name) {
  if(string[0] == '[') {
    //previous version
    var grid = stringToGrid(string);
    var level = {
      name: name,
      grid: grid
    }
    return level;
  } else {
    return jsonToLevel(string);
  }
}