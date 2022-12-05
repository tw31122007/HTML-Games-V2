var canvas;
var ctx;
var centerX;
var centerY;
var maxRadius;
var rotationsPerSecond;
var rotationDirection;
var zoomSpeed;
var path;
var pathStart;
var pathEnd;
var pathIndex;
var interpIndex;
var time;
var startTime;
var rotationAngle;
var deltaTime;
var rotationReversalsPerSecond;
var nextAvailableReversalTime;
var rewindInterval;
var audio;
var backgroundColor;
var pathColor;
var trailColor;
var usedPaletteIndices;
var currentPaletteIndex;
var nextPaletteChangeTime;
var loopIndex;
var encoder;
var imageDatas;
var encoderInterval;
var palette;
var savedPalette;
var savedTimeHeight;
var savedHelpHeight;
var defaultHelpText;
var isPortrait;
var raindrops;
var gameOverAudio;
var isInhale;

var isLoaded = false;
var isGameRunning = false;
var isGameOver = false;
var stepLength = 0.25;
var lastQuoteIndex = -1;
var speedupLevel = 0;
var measureLength = 12 / 13;
var pickupMeasures = 8;
var songLength = 104 * measureLength;

var palettes = [["#00eac7","#2bffdf","#ff0060"],["#6aedff","#d5faff","#ff0053"],["#00eaea","#80fff9","#de3682"],["#092b4d","#15385b","#fff89c"],["#004022","#004f29","#fafa85"],["#102870","#13348c","#ffffff"],["#b80707","#d02209","#fffff4"],["#7c002b","#a5003c","#ffb700"],["#ff8017","#ff9326","#ffffff"],["#630068","#74107e","#ffffff"],["#003239","#004048","#ffffaa"],["#660043","#820054","#ffff5e"],["#88250d","#9f2c0f","#ffff80"]];

var quotes = [
	"To be great is to be misunderstood.",
	"There are more stars in the Milky Way than there are atoms in the universe.",
	"On the sea of life, sometimes the best ships, are friendships.",
	"It's hard to be someone's everything. It's easier to be everyone's nothing.",
	"We are infinitely complicated in every possible and impossible way.",
	"If you love someone, put their name in a circle, instead of a heart, because hearts can break, but circles go on forever.",
	"Follow your dreams. They know the way.",
	"Take love, multiply it by infinity and take it to the depths of forever.",
	"Every exit is an entrance to new experiences.",
	"The world is a beautiful book for those who read it.",
];

function getPoint(radial, angular) {
	var radius = radial * radial * maxRadius;
	var angle = angular * 2 * Math.PI / 6;
	angle += rotationAngle;
	return {
		x: centerX + Math.sin(angle) * radius,
		y: centerY + Math.cos(angle) * radius
	};
}

function radialMoveTo(radial, angular) {
	var point = getPoint(radial, angular);
	ctx.moveTo(point.x, point.y);
}
 
function radialLineTo(radial, angular) {
	var point = getPoint(radial, angular);
	ctx.lineTo(point.x, point.y);
};

function addDitheredColorStop(dgrad, ratio, color) {
	var r = parseInt(color.substring(1, 3), 16);
	var g = parseInt(color.substring(3, 5), 16);
	var b = parseInt(color.substring(5, 7), 16);
	dgrad.addColorStop(ratio, r, g, b);
}
 
function drawBackground() {
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateRaindrops() {
	if (Math.random() < deltaTime * rotationsPerSecond / 0.1) {
		raindrops.push({
			x: 2 * Math.random() * centerX,
			y: 2 * Math.random() * centerY,
			age: 0
		});
	}
	for (var i = raindrops.length - 1; i >= 0; i--) {
		raindrops[i].age += deltaTime * 1.2;
		if (raindrops[i].age > 1) {
			raindrops.splice(i, 1);
		}
	}
}

function drawHexagon(x, y, size, direction) {
	drawPolygon(x, y, 6, size, direction);
}

function drawPolygon(x, y, n, size, direction) {
	for (var i = 0; i < n; i++) {
		var angle = direction * i * Math.PI * 2 / n;
		var xx = x + size * Math.cos(angle);
		var yy = y + size * Math.sin(angle);
		if (i == 0) {
			ctx.moveTo(xx, yy);
		} else {
			ctx.lineTo(xx, yy);
		}
	}
	ctx.closePath();
}

function drawRaindrops() {
	for (var i = 0; i < raindrops.length; i++) {
		var raindrop = raindrops[i];
		var maxSize = maxRadius / 13;
		ctx.fillStyle = pathColor;
		ctx.beginPath();
		drawHexagon(raindrop.x, raindrop.y, raindrop.age * maxSize, 1);
		var cutoff = 0.3;
		var t = (raindrop.age - cutoff) / (1 - cutoff);
		if (t > 0) {
			drawHexagon(raindrop.x, raindrop.y, t * maxSize, -1);
		}
		ctx.fill();
	}
}

function updateTime() {
	if (!encoder) {
		deltaTime = new Date().getTime() / 1000 - time;
	} else {
		deltaTime = 1 / 60;
	}
	time += deltaTime;
}

function getFirstPaletteChangeTime() {
	return pickupMeasures * measureLength;
}

function updatePalette() {
	if (audio.currentTime + loopIndex * songLength >= nextPaletteChangeTime) {
		if (audio.currentTime < measureLength) {
			nextPaletteChangeTime = loopIndex * songLength + getFirstPaletteChangeTime();
		} else {
			nextPaletteChangeTime += 16 * measureLength;
		}
		switchToNextPalette();
	}
	advanceColors();
}

function switchToNextPalette() {
	var usedPalettes = 0;
	for (var i in usedPaletteIndices) {
		usedPalettes += 1;
	}
	if (usedPalettes == palettes.length - 1) {
		usedPaletteIndices = {};
	}
	usedPaletteIndices[currentPaletteIndex] = true;
	while (true) {
		var index = Math.floor(Math.random() * palettes.length);
		if (!usedPaletteIndices[index]) {
			setPalette(index);
			break;
		}
	}
}

function accelerate(speedup, balanceValue) {
	zoomSpeed += speedup * (1 - balanceValue);
	rotationReversalsPerSecond += speedup * (1 + balanceValue);
	rotationsPerSecond += speedup * 1.5 * (1 + balanceValue);
}

function updateRotation() {
	var rotationFudge = 1;
	if (time > nextAvailableReversalTime &&
		Math.random() < deltaTime * rotationReversalsPerSecond) {
			nextAvailableReversalTime = time + 1 / (3 * rotationReversalsPerSecond);
			rotationDirection = -rotationDirection;
			rotationFudge = 3 / (60 * deltaTime);
	}
	var earlyFudge = 1 - 0.3 / (time - startTime + 0.3);
	rotationAngle += deltaTime * 2 * Math.PI * rotationsPerSecond * rotationDirection * rotationFudge * earlyFudge;
	var speedup = deltaTime / 200;
	speedup *= (time - startTime + 20) / (time - startTime + 5);
	accelerate(speedup, Math.cos(time - startTime) * 0.9);
}

function updatePath() {
	var delta = zoomSpeed * deltaTime;
	pathStart -= delta;
	pathEnd -= delta;
	
	/*if (audio.currentTime % measureLength > 0.87) {
		pathStart += deltaTime;
		pathEnd += deltaTime;
	}*/
	
	while (pathEnd < 2) {
		var n = path.length;
		var delta = n >= 2 ? path[n - 1] - path[n - 2] : 0;
		if (n >= 6 &&
			path[n - 2] - path[n - 3] == delta &&
			path[n - 3] - path[n - 4] == delta &&
			path[n - 4] - path[n - 5] == delta &&
			path[n - 5] - path[n - 6] == delta) {
				path.push(path[n - 1]);
		} else {
			var r = Math.random() < 0.5;
			var nextDelta = delta == 0 ?
				Math.random() < 0.5 ? -1 : 1 :
				Math.random() < 0.6 ? delta : 0;
	        path.push(path[n - 1] + nextDelta);
			
		}
		if (path[n - 1] == path[n - 2]) {
			pathEnd += stepLength;
		}
	}
	while (pathStart < 0) {
		if (pathIndex == 0) {
			gameOver();
			return;
		}
		if (path[0] == path[1]) {
			pathStart += stepLength;
		}
		path.shift();
		pathIndex -= 1;
		interpIndex -= 1;
	}
	var factor = zoomSpeed * 50 * deltaTime * (zoomSpeed + 0.2) / 0.35;
	interpIndex = (factor * pathIndex + interpIndex) / (factor + 1);
}

function drawPathSegment(n, color, thickness) {
	if (n == 0) {
		return;
	}
	
	var radial = pathStart;
	var angular = path[0];
	var index = 0;
	
	function advance(d) {
		var factor = (index - n) * (index + d - n) < 0 ? n % 1 : 1;
		if (path[index + d] == path[index]) {
			radial += factor * d * stepLength;
		}
		angular += factor * (path[index + d] - path[index]);
		index += d;
	}
	
	ctx.fillStyle = color;	
	ctx.beginPath();
	var began = false;

	function addPoint(radial, angular) {
		if (!began) {
			radialMoveTo(radial, angular);
			began = true;
		} else {
			radialLineTo(radial, angular);
		}
	}
	
	function addCurrentPoint(dx, dy) {
		addPoint(radial + thickness * dy, angular + 3 * thickness * dx);
	}

	function addLineCap(d) {
		if (d > 0) {
			addCurrentPoint(0, 0);
		} else {
			var delta = path[index + d] - path[index];
			var fudge = -3.1 * Math.abs(Math.sin(n * Math.PI));
			if (delta == 0) {
				addCurrentPoint(d, 0);
				addCurrentPoint(0, 1);
				addCurrentPoint(-d, 0);
			} else if (delta == 1) {
				addCurrentPoint(0, fudge + d);
				addCurrentPoint(0, fudge - d);
			} else {
				addCurrentPoint(0, fudge - d);
				addCurrentPoint(0, fudge + d);
			}
		}
		advance(d);
	}

	function addCorner(d) {
		var d1 = path[index] - path[index - 1];
		var d2 = path[index + 1] - path[index];
		if (d1 == d2) {
			addCurrentPoint(0, d * (d1 > 0 ? 1 : -1));
		} else {
			addCurrentPoint(-d, d * (d1 + d2));
		}
		advance(d);
	}
	
	addLineCap(1);
	for (var i = 0; i < Math.ceil(n) - 1; i++) {
		addCorner(1);
	}
	addLineCap(-1);
	for (var i = 0; i < Math.ceil(n) - 1; i++) {
		addCorner(-1);
	}

	ctx.fill();
}

function drawScene() {
	drawBackground();
	drawRaindrops();
	drawPathSegment(path.length - 1, pathColor, 0.03);
	drawPathSegment(interpIndex, trailColor, 0.015);
}

function fillSkewedRect(x, y, w, h) {
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + w + 0.5 * h, y);
	ctx.lineTo(x + w, y + h);
	ctx.lineTo(x, y + h);
	ctx.fill();
}

function getLargerDimension() {
	return isPortrait ? centerY : centerX;
}

function drawGameOver() {
	drawScene();
	var delta = (new Date().getTime() / 1000 - time) * 10;
	ctx.shadowBlur = maxRadius / 10;
	ctx.globalAlpha = 0.8;

	if (!savedPalette) {
		savedPalette = palettes[currentPaletteIndex];
	}
	savedTimeHeight = document.getElementById("time").clientHeight;
	savedHelpHeight = document.getElementById("help").clientHeight;

	ctx.fillStyle = savedPalette[1];
	ctx.shadowColor = interpolateColor(savedPalette[1], backgroundColor, 0.7);
	fillSkewedRect(0, 0, delta * 1.1 * 2 * centerX, 0.045 * getLargerDimension() + savedTimeHeight);
	fillSkewedRect(2 * centerX, 2 * centerY, - delta * 1.1 * 2 * centerX, -(0.067 * getLargerDimension() + savedHelpHeight));

	ctx.shadowBlur = 0;
	ctx.globalAlpha = 1;
	if (delta > 1) {
		isGameOver = false;
	}
}

function drawStartButton() {
	ctx.fillStyle = pathColor;
	ctx.beginPath();
	drawHexagon(centerX, centerY + centerX / 6.5, maxRadius / 7, 1);
	ctx.fill();

	ctx.fillStyle = trailColor;
	ctx.beginPath();
	drawPolygon(centerX, centerY + centerX / 6.5, 3, maxRadius / 14, 1);
	ctx.fill();
}

function repaint() {
	if (isGameOver) {
		drawGameOver();
		requestAnimationFrame(repaint);
		return;
	} else if (!isGameRunning) {
		ctx.fillStyle = savedPalette ? savedPalette[1] : backgroundColor;
		ctx.fillRect(0, 0, 1, 1);				
		requestAnimationFrame(repaint);
		return;	
	}
	
	updateTime();
	updatePalette();
	updateRotation();
	updatePath();
	updateRaindrops();

	if (isGameOver) {
		drawGameOver();
		requestAnimationFrame(repaint);
		return;
	}

	drawScene();
	
	if (savedPalette) {
		var delta = 1 - (time - startTime) * 10;
		if (delta > 0) {
			ctx.shadowBlur = maxRadius / 10;
			ctx.globalAlpha = 0.8;
			ctx.fillStyle = savedPalette[1];
			ctx.shadowColor = interpolateColor(savedPalette[1], backgroundColor, 0.7);
			fillSkewedRect(2 * centerX, 0, -delta * 1.1 * 2 * centerX, 0.045 * getLargerDimension() + savedTimeHeight);
			fillSkewedRect(0, 2 * centerY, delta * 1.1 * 2 * centerX, -(0.067 * getLargerDimension() + savedHelpHeight));			
			ctx.shadowBlur = 0;
			ctx.globalAlpha = 1;
		} else {
			savedPalette = false;
		}
	}
	
	if (encoder) {
		encodeCurrentFrame();
	}

	requestAnimationFrame(repaint);
}

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	centerX = canvas.width / 2;
	centerY = canvas.height / 2;
	maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
	isPortrait = centerX < centerY;
	document.body.className = isPortrait ? "portrait" : "landscape";
	if (document.getElementById("title").style.display != "none") {
		drawStartButton();
	}
	window.focus();
}

function hexChar(i) {
	return i < 10 ? ("" + i) :
		i == 10 ? "A" :
		i == 11 ? "B" :
		i == 12 ? "C" :
		i == 13 ? "D" :
		i == 14 ? "E" :
		i == 15 ? "F" :
		"";
}

function formatColorComponent(i) {
	return hexChar(Math.floor(i / 16)) + hexChar(i % 16);
}

function interpolateColorComponent(c1, c2, t) {
	var i1 = parseInt(c1, 16);
	var i2 = parseInt(c2, 16);
	var i = Math.round((1 - t) * i1 + t * i2);
	if ((i == i1) && (i1 != i2)) {
		i = i1 + (i2 - i1) / Math.abs(i2 - i1);
	}
	return formatColorComponent(i);
}

function interpolateColor(color1, color2, t) {
	return "#" +
		interpolateColorComponent(color1.substring(1, 3), color2.substring(1, 3), t) +
		interpolateColorComponent(color1.substring(3, 5), color2.substring(3, 5), t) +
		interpolateColorComponent(color1.substring(5, 7), color2.substring(5, 7), t);
}

function advanceColors() {
	var palette = palettes[currentPaletteIndex];
	backgroundColor = interpolateColor(backgroundColor, palette[0], 1 / 6);
	pathColor = interpolateColor(pathColor, palette[1], 1 / 6);
	trailColor = palette[2];
}

function snapToColors() {
	var palette = palettes[currentPaletteIndex];
	backgroundColor = palette[0];
	pathColor = palette[1];
	trailColor = palette[2];
}

function setPalette(index) {
	currentPaletteIndex = index;
	var palette = palettes[index];
	var color1 = palette[0];
	var color2 = palette[1];
	var color3 = palette[2];
	document.getElementById("debug").style.color = color3;
	document.documentElement.style.backgroundColor = color1;
	document.getElementById("help").style.color = color3;
	document.getElementById("time").style.color = color3;
	document.getElementById("title").style.color = color2;
}

function rewindMusic() {
	audio.currentTime = 0;
	audio.play();
	loopIndex += 1;
}

function startGame() {
	document.getElementById("overlay").style.display = "none";
	isGameRunning = true;
	rotationsPerSecond = 0.1;
	rotationDirection = Math.random() < 0.5 ? -1 : 1;
	rotationReversalsPerSecond = 0.35;
	zoomSpeed = 0.15;
	path = [0, 0];
	pathStart = 0.5;
	pathEnd = pathStart;
	pathIndex = 1;
	interpIndex = 1;
	speedupLevel = 0;
	for (var i = 0; i < speedupLevel; i++) {
		accelerate(0.15, 0);
	}
	time = new Date().getTime() / 1000;
	startTime = time;
	rotationAngle = Math.PI;
	if (rewindInterval) {
		clearInterval(rewindInterval);
	}
	rewindInterval = setInterval(rewindMusic, songLength * 1000);
	loopIndex = -1;
	rewindMusic();
	nextPaletteChangeTime = getFirstPaletteChangeTime();
	usedPaletteIndices = {};
	setPalette(Math.floor(Math.random() * palettes.length));
	nextAvailableReversalTime = startTime + 1;
	raindrops = [];
	isInhale = true;
}

function formatTwoDigits(value) {
	var secondDigit = value % 10;
	var firstDigit = (value - secondDigit) / 10;
	return firstDigit + "" + secondDigit;
}

function formatTime(combinedTime) {
	var minutes = Math.floor(combinedTime / 60);
	var seconds = Math.floor(combinedTime - minutes * 60);
	return formatTwoDigits(minutes) + ":" + formatTwoDigits(seconds);
}

function setDefaultHelpText() {
	document.getElementById("help").innerHTML = defaultHelpText;
}

function gameOver() {
	if (!isGameRunning) {
		return;
	}
	isGameOver = true;
	stopEncoding();

	document.getElementById("overlay").style.display = "block";
	document.getElementById("title").style.display = "none";
	document.getElementById("time").style.display = "block";
	
	var seconds = time - startTime;
	var record = window.localStorage.getItem("zigzagRecord");
	if (!record) {
		record = 0;
	}
	var isNewRecord = Math.floor(seconds) > Math.floor(record);
	record = Math.max(record, seconds);
	window.localStorage.setItem('zigzagRecord', record);
	document.getElementById("time1").innerHTML = formatTime(seconds);
	document.getElementById("time2").innerHTML = isNewRecord ? "(new record)" : ("(record " + formatTime(record) + ")");
	if (seconds >= getFirstPaletteChangeTime()) {
		var quoteIndex = lastQuoteIndex;
		while (quoteIndex == lastQuoteIndex) {
			quoteIndex = Math.floor(Math.random() * quotes.length);			
		}
		document.getElementById("help").innerHTML = quotes[quoteIndex];
		lastQuoteIndex = quoteIndex;
	} else {
		setDefaultHelpText();
	}
	
	isGameRunning = false;
	clearInterval(rewindInterval);
	setTimeout(function() {
		if (!isGameRunning) {
			audio.pause();
		}
	}, 100);
	gameOverAudio.play();
}

function startEncoding() {
	if (!encoder) {
		encoder = new GIFEncoder();
		encoder.setSize(canvas.width, canvas.height);
		encoder.setRepeat(0);
		encoder.setDelay(1000 / 60);
		encoder.start();
		imageDatas = [];
	}
}

function encodeCurrentFrame() {
	imageDatas.push(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
}

function stopEncoding() {
	if (!encoder || encoderInterval) {
		return;
	}
	var i = 0;
	encoderInterval = setInterval(function() {
		if (i < imageDatas.length) {
			document.getElementById("debug").innerHTML = "" + (i + 1) + "/" + imageDatas.length;
			encoder.addFrame(imageDatas[i], true);
			i++;
		} else {
			document.getElementById("debug").innerHTML = "";
			encoder.finish();
			var binaryGif = encoder.stream().getData();
			var dataUrl = 'data:image/gif;base64,' + encode64(binaryGif);
			window.open(dataUrl);
			encoder = null;
			imageDatas = null;
			clearInterval(encoderInterval);
			encoderInterval = null;
		}
	}, 10);
	gameOver();
}

function makeScreenshot() {
	startEncoding();
	encodeCurrentFrame();
	stopEncoding();
}

function handleMove(direction) {
	if (path[pathIndex + 1] - path[pathIndex] == direction) {
		while (path[pathIndex + 1] - path[pathIndex] == direction) {
			pathIndex += 1;
		}
		pathIndex += 1;
	} else {
		gameOver();
	}
}

function handleKey(event) {
	if (event.keyCode == 32 ||
		event.keyCode == 37 ||
		event.keyCode == 38 ||
		event.keyCode == 39 ||
		event.keyCode == 40) {
		event.preventDefault();
	}
	if (!isLoaded) {
		return;
	}
    if (event.keyCode == 83) {
   		makeScreenshot();
   	}
	if (!isGameRunning) {
		if (event.keyCode == 32 || event.keyCode == 38) {
			startGame();
		}
	} else {
		if (event.keyCode == 32 || event.keyCode == 38) {
			accelerate(0.15, 0);
			speedupLevel += 1;
			//switchToNextPalette();
		} else if (event.keyCode == 40) {
			if (speedupLevel > 0) {
				accelerate(-0.15, 0);
				speedupLevel -= 1;
			}
		} else if (event.keyCode == 37) {
			handleMove(1);
		} else if (event.keyCode == 39) {
			handleMove(-1);
		} else if (event.keyCode == 71) {
			if (!encoder) {
				startEncoding();
			} else {
				stopEncoding();
			}
		}
	}
}

function handleTap(x) {
	if (!isLoaded) {
		return;
	}
	if (!isGameRunning) {
		startGame();
	} else {
		if (x < centerX) {
			handleMove(1);
		} else {
			handleMove(-1);
		}
	}
}

function init(helpText) {
	defaultHelpText = helpText;
	document.body.innerHTML = '<canvas id="canvas"></canvas><div id="overlay"><div id="title">Z<span style="left:0.5vw">I</span><span style="left:-0.3vw">G</span><span style="left:-0.5vw">Z</span><span style="left:0.5vw">A</span>G</div><div id="time"><span id="time1"></span><span id="time2"></span></div><div id="help">Loading...</div></div><div id="debug" style="position:absolute;top:40px;left:20px;color:white;font-family:sans-serif;font-size:20px;" onmousedown="event.stopPropagation()"></div>';
	
	var itemsToLoad = 2;
	function itemLoaded() {
		itemsToLoad -= 1;
		if (itemsToLoad == 0) {
			isLoaded = true;
			setDefaultHelpText();
		}
	}
	
	audio = new Audio("hybrid-edit.mp4");
	audio.addEventListener("canplaythrough", itemLoaded);
	gameOverAudio = new Audio("gameover.mp4");
	gameOverAudio.addEventListener("canplaythrough", itemLoaded);
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	window.addEventListener('resize', resizeCanvas, false);
	setPalette(Math.floor(Math.random() * palettes.length));
	snapToColors();
	resizeCanvas();
	repaint();
}