const rootPath = 'TemplateData';

function UnityProgress(gameInstance, progress) {
    if (!gameInstance.Module) {
        return;
    }

    if (!gameInstance.logo) {
        gameInstance.logo = document.createElement("div");
        gameInstance.logo.className = "logo " + gameInstance.Module.splashScreenStyle;
        gameInstance.container.appendChild(gameInstance.logo);
    }

    if (!gameInstance.progress) {
        gameInstance.progress = document.createElement("div");
        gameInstance.progress.className = "progress " + gameInstance.Module.splashScreenStyle;
        gameInstance.progress.empty = document.createElement("div");
        gameInstance.progress.empty.className = "empty";
        gameInstance.progress.appendChild(gameInstance.progress.empty);
        gameInstance.progress.full = document.createElement("div");
        gameInstance.progress.full.className = "full";
        gameInstance.progress.appendChild(gameInstance.progress.full);
        gameInstance.container.appendChild(gameInstance.progress);
        gameInstance.textProgress = document.createElement("div");
        gameInstance.textProgress.className = "text";
        gameInstance.container.appendChild(gameInstance.textProgress);
    }

    gameInstance.progress.full.style.width = (100 * progress) + "%";
    gameInstance.progress.empty.style.width = (100 * (1 - progress)) + "%";
    gameInstance.textProgress.innerHTML = 'Loading: ' + Math.floor(progress * 100) + '%' + ' <img src="' + rootPath + '/gears.gif" class="spinner" />';

    if (progress == 1) {
        gameInstance.textProgress.innerHTML = 'Running, Please Wait.. <img src="' + rootPath + '/gears.gif" class="spinner" />';
    }

    if (progress == 'complete') {
        SendMessage = gameInstance.SendMessage;
        gameInstance.logo.style.display = 'none';
        gameInstance.progress.style.display = 'none';
        gameInstance.textProgress.style.display = 'none';
    }
}

window.Game = (function() {
    var Game = function() {
        this.registerEvents();
    };

    Game.prototype.registerEvents = function() {
        var _this = this;
        /*
        window.addEventListener("keydown", function(e) {
            // space and arrow keys
            if ([8, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);

        document.onmousedown = function() {
            window.focus();
        };
        */
        document.addEventListener('DOMContentLoaded', function() {
            _this.resize();
        }, false);

        window.addEventListener('resize', function() {
            setTimeout(function() {
                _this.resize();
            }, 1000);
        }, false);
    };

    Game.prototype.getQueryVariable = function(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }

    Game.prototype.resize = function() {
        var gameContainer = document.getElementById('gameContainer');
        var canvas = document.getElementById('#canvas');

        var ratioTolerant = this.getQueryVariable('ratio_tolerant');
        var gameSizeRatio = gameContainer.getAttribute('width') / gameContainer.getAttribute('height');

        if ((!document.mozFullScreen && !document.webkitIsFullScreen)) {
            //FullScreen is disabled
            var maxHeight = window.innerHeight - 43; // minus the footer
        } else {
            //FullScreen is enabled
            var maxHeight = window.innerHeight; // minus the footer

        }

        //var maxHeight = window.innerHeight - 43; // minus the footer
        var maxWidth = window.innerWidth;
        var windowSizeRatio = maxWidth / maxHeight;
        var newStyle = {
            width: gameContainer.getAttribute('width'),
            height: gameContainer.getAttribute('height')
        };
        if (ratioTolerant) {
            if (ratioTolerant == 'true') {
                newStyle = {
                    width: maxWidth,
                    height: maxHeight
                };
            } else if (ratioTolerant == 'false') {
                if (gameSizeRatio > windowSizeRatio) {
                    newStyle = {
                        width: maxWidth,
                        height: maxWidth / gameSizeRatio
                    };
                } else {
                    newStyle = {
                        width: maxHeight * gameSizeRatio,
                        height: maxHeight
                    };
                }
            }

            this.updateStyle(gameContainer, newStyle);
            // canvas does not exists on page load
            if (canvas) {
                this.updateStyle(canvas, newStyle);
            }
        }
    };

    Game.prototype.updateStyle = function(element, size) {
        element.setAttribute('width', size.width);
        element.setAttribute('height', size.height);
        element.style.width = size.width + 'px';
        element.style.height = size.height + 'px';
    };

    return Game;
})();

var game = new Game();