import * as Formulas from "./formulas.js"

let precomputedFactorials = [];
function precomputeFactorial(k) {
	let total = 1;
	for (let i = 2; i <= k; i++) {
		total *= i;
	}
	return total;
}
/* precompute factorials for performance */
for (let i = 0; i < 170; i++) {
	precomputedFactorials.push(precomputeFactorial(i));
}
export function map(num, numMin, numMax, mapMin, mapMax) {
	return mapMin + ((mapMax - mapMin) / (numMax - numMin)) * (num - numMin);
}
export function factorial(k) {
	if (k > 170) {
		return Infinity;
	}
	return precomputedFactorials[k];
}
export function roundDigits(value, digits) {
	return Math.round(value * 10 ** digits) / 10 ** digits;
}
export function clamp(value, min, max) {
	if (value < min) {
		return min;
	} else if (value > max) {
		return max;
	}
	return value;
}
export function randomInt(min, max) {
	return Math.round(randomRange(min, max));
}
export function randomRange(min, max) {
	return (Math.random() * (max - min)) + min;
}
export function dist(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
export function direction(x1, y1, x2, y2) {
	return Math.atan2(x1 - x2, y1 - y2);
}
export function removeInstances(str, items) {
	let s = str;
	for (let i = 0; i < items.length; i++) {
		s = s.replace(items[i], "");
	}
	return s;
}
export function binary(number, length) {
	let asBinary = (number).toString(2);
	while (asBinary.length <= length) {
		asBinary = "0" + asBinary;
	}
	return asBinary;
}
export function reverse(str) {
	let splitString = str.split("");
	let reverseArray = splitString.reverse();
	let joinArray = reverseArray.join("");
	return joinArray;
}
/* range centered around value */
export function withinRange(reference, value, range) {
	if (Math.abs(reference - value) <= range / 2) {
		return true;
	} else {
		return false;
	}
}
/*
 *	To find orientation of ordered triplets (p1, p2, p3). 
 *	The function returns following values 
 *	0 --> p, q and r are colinear 
 *	1 --> Clockwise 
 *	-1 --> Counterclockwise
 */
export function orientation(p1, p2, p3) {
	let val = (p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p3.y - p2.y);
	/* collinear */
	if (val == 0) {
		return 0;
	}
	/* clock or counterclock wise */ 
	return (val > 0) ? 1 : - 1;
}
/* 90 sided circle */
export function circleToPoints(x, y, r, length, startingAngle, direction) {
	let points = [];
	let totalLength = 0;
	let currentAngle = 0;
	while (totalLength < length) {
		points.push({
			x: x + Math.cos(startingAngle + direction * currentAngle) * r,
			y: y + Math.sin(startingAngle + direction * currentAngle) * r,
		});
		if (currentAngle < 0) {
			totalLength++;
		}
		currentAngle -= 1 / r;
	}
	return points;
}
export function circumcircle(a, b, c) {
	let EPSILON = 1 / 1048576;
	let fabsy1y2 = Math.abs(a.y - b.y);
	let fabsy2y3 = Math.abs(b.y - c.y);
	let xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;
	if (fabsy1y2 < EPSILON) {
		m2 = -((c.x - b.x) / (c.y - b.y));
		mx2 = (b.x + c.x) / 2;
		my2 = (b.y + c.y) / 2;
		xc = (b.x + a.x) / 2;
		yc = m2 * (xc - mx2) + my2;
	} else if (fabsy2y3 < EPSILON) {
		m1 = -((b.x - a.x) / (b.y - a.y));
		mx1 = (a.x + b.x) / 2;
		my1 = (a.y + b.y) / 2;
		xc = (c.x + b.x) / 2;
		yc = m1 * (xc - mx1) + my1;
	} else {
		m1 = -((b.x - a.x) / (b.y - a.y));
		m2 = -((c.x - b.x) / (c.y - b.y));
		mx1 = (a.x + b.x) / 2;
		mx2 = (b.x + c.x) / 2;
		my1 = (a.y + b.y) / 2;
		my2 = (b.y + c.y) / 2;
		xc = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
		yc = (fabsy1y2 > fabsy2y3) ? m1 * (xc - mx1) + my1 : m2 * (xc - mx2) + my2;
	}
	dx = b.x - xc;
	dy = b.y - yc;
	return {
		x: xc,
		y: yc,
		r: Math.sqrt(dx * dx + dy * dy),
	};
}
export function mapToOsuPixels(x, y, toWidth, toHeight, offsetX, offsetY, hardRock) {
	let yMap;
	if (hardRock) {
		yMap = offsetY + map(y, 0, 384, toHeight, 0);
	} else {
		yMap = offsetY + map(y, 0, 384, 0, toHeight);
	}
	return {
		x: offsetX + map(x, 0, 512, 0, toWidth),
		y: yMap,
	};
}
export function htmlCounter(digits, container, element, imageSource, positionTag, positioning) {
	digits = reverse(digits);
	if (digits.length < document.getElementById(container).childNodes.length) {
		document.getElementById(container).innerHTML = "";
	}
	for (let i = 0; i < digits.length; i++) {
		if (document.getElementById(element + i) === null) {
			let image = new Image();
			image.id = element + i;
			document.getElementById(container).insertBefore(image, document.getElementById(container).childNodes[0]);
		}
		let image = document.getElementById(element + i);
		if (/^[0-9]+$/.test(digits[i])) {
			image.src = imageSource[digits[i]].src;
		} else {
			const sourceMap = {
				",": 10,
				".": 11,
				"%": 12,
				"x": 13,
			}
			image.src = imageSource[sourceMap[digits[i]]].src;
		}
	}
	document.getElementById(container).style[positionTag] = positioning;
}
export function standardDeviation(arr, usePopulation) {
	if (usePopulation === undefined) {
		usePopulation = false;
	}
	if (arr.length === 1) {
		return arr[0];
	}
	const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
	return Math.sqrt(arr.reduce((acc, val) => acc.concat((val - mean) ** 2), []).reduce((acc, val) => acc + val, 0) / (arr.length - (usePopulation ? 0 : 1)));
}
export function sum(array, maxIndex) {
	let len = array.length;
	if (maxIndex) {
		len = maxIndex;
	}
	let sum = 0;
	for (let i = 0; i < len; i++) {
		sum += array[i];
	}
	return sum;
}
export function mean(array, startingIndex, endingIndex) {
	if (startingIndex === undefined) {
		startingIndex = 0;
	}
	if (endingIndex === undefined) {
		endingIndex = array.length;
	}
	/* default case for empty array */
	if (endingIndex === startingIndex) {
		return 0;
	}
	let sum = 0;
	for (let i = startingIndex; i < endingIndex; i++) {
		sum += array[i];
	}
	return sum / (endingIndex - startingIndex);
}
export function weightedMean(array, weightFunction, startingIndex, endingIndex) {
	if (startingIndex === undefined) {
		startingIndex = 0;
	}
	if (endingIndex === undefined) {
		endingIndex = array.length;
	}
	/* default case for empty array */
	if (endingIndex === startingIndex) {
		return 0;
	}
	let sum = 0;
	let weightSum = 0;
	for (let i = startingIndex; i < endingIndex; i++) {
		let weight = weightFunction(i - startingIndex);
		sum += array[i] * weight; 
		weightSum += weight;
	}
	return sum / weightSum;
}
export function camelCaseToDash(string) {
	return string.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
}
export function point(x, y) {
	return {
		x: x,
		y: y,
	};
}
export function formatDate(day, month, year, hour, minute) {
	const monthWords = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ];
	if (hour.toString().length === 1) {
		hour = "0" + hour;
	}
	if (minute.toString().length === 1) {
		minute = "0" + minute;
	}
	return `${day} ${monthWords[month]} ${year} ${hour}:${minute}`;
}
export function showWebpageStates(idList) {
	for (let i = 0; i < idList.length; i++) {
		document.getElementById(idList[i]).style.display = "block";
	}
}
export function hideWebpageStates(idList) {
	for (let i = 0; i < idList.length; i++) {
		document.getElementById(idList[i]).style.display = "none";
	}
}
export class Accumulator {
	constructor(callback, milliseconds, allowMultipleRuns, args) {
		this.accumulator = 0;
		this.callback = callback;
		this.milliseconds = milliseconds;
		this.allowMultipleRuns = allowMultipleRuns || false;
		this.args = args || [];
	}
	tick(deltaTime) {
		this.accumulator += deltaTime;
		if (this.allowMultipleRuns) {
			while (this.accumulator >= this.milliseconds) {
				this.accumulator = this.accumulator % this.milliseconds;
				this.callback(...this.args);
			}
		} else {
			if (this.accumulator >= this.milliseconds) {
				this.accumulator = this.accumulator % this.milliseconds;
				this.callback(...this.args);
			}
		}
	}
	forceRun() {
		this.callback(...this.args);
	}
}
export function pad(string, length, paddingCharacter, prepend) {
	/* convert to string first as the length property is needed */
	string = string.toString();
	paddingCharacter = paddingCharacter.toString();
	let paddingString = "";
	let paddingLength = length - string.length;
	for (let i = 0; i < paddingLength; i++) {
		paddingString += paddingCharacter;
	}
	if (prepend) {
		return paddingString + string;
	} else {
		return string + paddingString;
	}
}
export function secondsToMinuteSeconds(time) {
	let minutes = Math.floor(time / 60);
	let seconds = Math.round(time - minutes * 60);
	return `${minutes}:${pad(seconds, 2, "0", true)}`;
}
export function totalDistance(points) {
	let totalDistance = 0;
	for (let i = 0; i < points.length - 1; i++) {
		totalDistance += dist(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
	}
	return totalDistance;
}
export function setDifficultyBars(map, mods) {
	let parts = ["circle-size", "hp-drain", "accuracy", "approach-rate", "star-rating"];
	let key = ["circleSize", "healthDrain", "overallDifficulty", "approachRate", "starRating"];
	for (let i = 0; i < parts.length; i++) {
		let difficultyValue;
		if (key[i] === "starRating") {
			difficultyValue = map[key[i]];
		} else {
			let multiplier = (key[i] === "circleSize") ? 1.3 : 1.4;
			difficultyValue = Formulas.applyModMultiplier(map[key[i]], mods, multiplier);
		}
		document.getElementById(parts[i] + "-difficulty").style.width = clamp(difficultyValue, 0, 10) + "vw";
		document.getElementById(parts[i] + "-difficulty-value").textContent = roundDigits(difficultyValue, 2);
	}
}
export function setStatisticValues(group, map, mods) {
	let multiplier = 1;
	if (mods.doubleTime || mods.nightCore) {
		multiplier = 1.5;
	} else if (mods.halfTime) {
		multiplier = 0.75;
	}
	document.getElementById("beatmap-statistics-version").textContent = map.version;
	document.getElementById("beatmap-statistics-title").textContent = group.title;
	document.getElementById("beatmap-statistics-artist").textContent = group.artist;
	document.getElementById("beatmap-statistics-creator").textContent = group.creator;
	document.getElementById("beatmap-statistics-drain-time").textContent = secondsToMinuteSeconds(map.drainTime);
	document.getElementById("beatmap-statistics-bpm").textContent = Math.round(60000 / (map.beatLength / multiplier));
	document.getElementById("beatmap-statistics-circle-count").textContent = map.objectCounts.circles;
	document.getElementById("beatmap-statistics-slider-count").textContent = map.objectCounts.sliders;
	document.getElementById("beatmap-statistics-spinner-count").textContent = map.objectCounts.spinners;
}
export function extractFileExtension(name) {
	let split = name.toLowerCase().split(".");
	return split[split.length - 1];
}
/* https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser */
export function detectIfOnMobile() {
	const toMatch = [
		/Android/i,
		/webOS/i,
		/iPhone/i,
		/iPad/i,
		/iPod/i,
		/BlackBerry/i,
		/Windows Phone/i
	];
	
	return toMatch.some((toMatchItem) => {
		return navigator.userAgent.match(toMatchItem);
	});
}
export function elementIndex(x, type) {
	if (type === "head") {
		return Math.floor(x / 2) + 1
	} else if (type === "tail") {
		return Math.floor((x - 1) / 2) + 1
	}
}
export function generateSliderElements(n) {
	let sliderElements = {
		head: [],
		tail: [],
	}
	sliderElements.head.push("normal");

	for (let i = 0; i < n - 1; i++) {
		if (i % 2 === 0) {
			sliderElements.tail.push("repeat");
		} else {
			sliderElements.head.push("repeat");
		}
	}
	if ((n + 1) % 2 === 1) {
		sliderElements.head.push("normal");
	} else {
		sliderElements.tail.push("normal");
	}

	return sliderElements;
}