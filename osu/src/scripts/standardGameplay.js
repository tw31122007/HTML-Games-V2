import * as Options from "./options.js";
import * as Formulas from "./formulas.js";
import {Mouse} from "./mouse.js";
import {Keyboard} from "./keyboard.js";
import * as Bezier from "./bezier.js";
import * as Utils from "./utils.js";
import * as HitObjects from "./hitObjects.js";
import {SkinLoader} from "./skinLoader.js";
import {Canvas} from "./canvas.js";
import {PlayDetails} from "./playDetails.js";
import * as EndScreen from "./endScreen.js";
import * as DatabaseManager from "./databaseManager.js";
import * as ReplayManager from "./replayManager.js";
import {AudioManager} from "./audioManager.js";
import {HitObjectRenderer} from "./hitObjectRenderer.js";

/* canvas setup */
let canvas = new Canvas("gameplay");
canvas.setHeight(window.innerHeight);
canvas.setWidth(window.innerWidth);
let ctx = canvas.context;
canvas.setFillStyle("#fff");
/* flashlight canvas setup */
let flashlightCanvas = document.getElementById("gameplay-flashlight");
flashlightCanvas.width = window.innerWidth;
flashlightCanvas.height = window.innerHeight;
let flashlightCtx = flashlightCanvas.getContext("2d");
let flashlightSize = Utils.map(100, 0, 512, 0, window.innerWidth);

const skin = "vaxei";
const Assets = new SkinLoader(skin);
const audioManager = new AudioManager();
let hitObjectRenderer = new HitObjectRenderer(canvas);
audioManager.load("hitsound", "../src/audio/hitsounds/soft-hitnormal.wav", "effects", true);

let currentLoadedMap;
let isGameRunning = false;
/* inputs setup */
let mouse = new Mouse("body", 100);
let keyboard = new Keyboard("body");
mouse.setPosition(window.innerWidth / 2, window.innerHeight / 2);
mouse.init();
mouse.positionBound(0, 0, window.innerWidth, window.innerHeight);
let mouseSize = 1;
keyboard.init();
let keyboardLeftReleased = true;
let keyboardRightReleased = true;
/* Details about the play, including replays */
let playDetails;
/* replay variables */
let isReplay = false;
let currentMouseEvent = 0;
let currentKeyEvent = 0;
/* object arrays */
let endingTime;
let currentHitObjects = 0;
let hitEvents = [];
let hitObjects = [];
let hitErrors = [];
let judgementObjects = [];
let effectObjects = [];
/* Playfield calculations and data */
let playfieldXOffset = 0;
let playfieldYOffset = window.innerHeight / 50;
/* HP values */
let currentHP = 1;
let displayedHP = 1;
let previousTime = 0;
/* Timing point indexes */
let timingPointUninheritedIndex = 0;
let currentTimingPoint = 0;
/* Score letiables */
let score = 0;
let displayedScore = 0;
let meanHitErrorPosition = 0;
/* Combo letiables */
let combo = 0;
let currentComboNumber = 1;
let currentComboColour = 0;
let comboPulseSize = 1;
/* break periods */
let currentBreakPeriod = 0;
let isBreakPeriod = false;
/* spinner tests */
let previousSigns = [];
let angleChange = 0;
let previousAngle = 0;
let angle = 0;
/* Audio letiables */
let backupStartTime = 0;
let audio = document.getElementById("menu-audio");
let audioFailedToLoad = false;
/* combo colour tints*/
let hitCircleColourBuffers = [];
let approachCircleColourBuffers = [];
/* 	attempting to run in offline on a chromebook causes audio loading errors
 *	switch to performance.now instead
 */
audio.addEventListener("error", function() {
	audioFailedToLoad = true;
	backupStartTime = window.performance.now();
	console.warn("failed to load audio, switching to window.performance for timing");
});
audio.addEventListener("canplaythrough", function() {
	audio.play();
});
/* after 3s just start playing */
setTimeout(function() {
	audio.play();
}, 3000);
/* Beatmap difficulty data constants */
let ARTime;
let ARFadeIn;
let circleDiameter;
let difficultyMultiplier;
let ODTime;
/* osu constants */
const FOLLOW_CIRCLE_SIZE = 2;
const PLAYFIELD_ACTUAL_SIZE = 0.8;
let HIT_OBJECT_OFFSET_X = playfieldXOffset + window.innerWidth / 2 - window.innerHeight * PLAYFIELD_ACTUAL_SIZE * (4 / 3) / 2;
let HIT_OBJECT_OFFSET_Y = playfieldYOffset + window.innerHeight / 2 - window.innerHeight * PLAYFIELD_ACTUAL_SIZE / 2;
const PLAYFIELD_SIZE_X = 512;
const PLAYFIELD_SIZE_Y = 384;
const PLAYFIELD_CENTER_X = PLAYFIELD_SIZE_X / 2;
const PLAYFIELD_CENTER_Y = PLAYFIELD_SIZE_Y / 2;
const JUDGEMENT_BEZIER_ANIMATION = Bezier.cubic(0, 1.4, 0, 1);
/* in radians */
const AUTO_SPIN_SPEED = 50;
const AUTOPILOT_SPIN_SPEED = 30;

window.addEventListener("resize", function() {
	canvas.canvas.width = window.innerWidth;
	canvas.canvas.height = window.innerHeight;
	flashlightCanvas.width = window.innerWidth;
	flashlightCanvas.height = window.innerHeight;
	/* Playfield calculations and data */
	playfieldYOffset = window.innerHeight / 50;
	HIT_OBJECT_OFFSET_X = playfieldXOffset + window.innerWidth / 2 - window.innerHeight * PLAYFIELD_ACTUAL_SIZE * (4 / 3) / 2;
	HIT_OBJECT_OFFSET_Y = playfieldYOffset + window.innerHeight / 2 - window.innerHeight * PLAYFIELD_ACTUAL_SIZE / 2;
	mouse.positionBound(0, 0, window.innerWidth, window.innerHeight);
});

function enterPointerLock() {
	if (Options.getProperty("Inputs", "useRawPosition") === false) {
		mouse.lockPointer();
	} else {
		mouse.hide();
	}
}

function exitPointerLock() {
	if (Options.getProperty("Inputs", "useRawPosition") === false) {
		mouse.unlockPointer();
	} else {
		mouse.show();
	}
}

function setHitObjectsCache(hitObject, useTime, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y) {
	/* Cache setup */
	let sliderSpeedMultiplier = currentLoadedMap.SliderMultiplier;
	if (hitObject.cache.cacheSet === false) {
		/* Immediate Cache setup */
		hitObject.cache.comboNumber = currentComboNumber;
		hitObject.cache.comboColour = currentComboColour;
		if (hitObject.type[0] === "1") {
			/* Cache setup for HitCircle */
			hitObject.cache.cacheSet = true;
		} else if (hitObject.type[1] === "1") {
			hitObject.cache.cacheSet = true;
			/* Cache setup for Slider */
			hitObject.cache.hitHead = false;
			hitObject.cache.hitEnd = false;
			hitObject.cache.onFollowCircle = false;
			hitObject.cache.hasHitAtAll = false;
			hitObject.cache.hasEnded = false;
			hitObject.cache.sliderFollowCirclePreviousPosition = 0;
			hitObject.cache.sliderFollowCirclePosition = 0;
			hitObject.cache.sliderFollowCircleSize = 0;
			hitObject.cache.currentSlide = 0;
			hitObject.cache.sliderTicksHit = 0;
			hitObject.cache.repeatsHit = 0;
			hitObject.cache.points = [];
			hitObject.cache.timingPointUninheritedIndex = timingPointUninheritedIndex;
			/* Precalculate Slider Curve Points */
			/* Calculate Slider Points */
			let circle;
			if (hitObject.curvePoints.length === 3) {
				circle = Utils.circumcircle(hitObject.curvePoints[0], hitObject.curvePoints[1], hitObject.curvePoints[2]);
			}
			if (hitObject.curveType === "B" || hitObject.curveType === "C" || hitObject.curveType === "L" || isFinite(circle.r) === false) {
				/* Slider Type Bezier, Catmull and Linear */
				/* I will likely not support catmull sliders */
				/* determine slider red / white anchor */
				let bezier = [];
				let bezierTemp = [];
				for (let j = 0; j < hitObject.curvePoints.length; j++) {
					if (hitObject.curvePoints[j + 1] && hitObject.curvePoints[j].x === hitObject.curvePoints[j + 1].x && hitObject.curvePoints[j].y === hitObject.curvePoints[j + 1].y) {
						bezierTemp.push(hitObject.curvePoints[j]);
						let point = Bezier.nGrade(bezierTemp, 1 / hitObject.length);
						/* second pass */
						let length = Utils.totalDistance(point);
						point = Bezier.nGrade(bezierTemp, 1 / length);
						for (let k = 0; k < point.length; k++) {
							bezier.push(point[k]);
						}
						bezierTemp = [];
					} else {
						bezierTemp.push(hitObject.curvePoints[j]);
					}
				}
				let point = Bezier.nGrade(bezierTemp, 1 / hitObject.length);
				/* second pass */
				let length = Utils.totalDistance(point);
				point = Bezier.nGrade(bezierTemp, 1 / length);
				for (let k = 0; k < point.length; k++) {
					bezier.push(point[k]);
				}
				hitObject.cache.points = bezier;
			} else if (hitObject.curveType === "P" && hitObject.curvePoints.length === 3) {
				/* Slider Type Perfect Circle */
				/* There are a select few maps that have infinity circle radius. I'm look at you sotarks */
				hitObject.cache.points = Utils.circleToPoints(circle.x, circle.y, circle.r, Math.abs(hitObject.length), -Utils.direction(circle.x, circle.y, hitObject.curvePoints[0].x, hitObject.curvePoints[0].y) - Math.PI / 2, Utils.orientation(hitObject.curvePoints[0], hitObject.curvePoints[1], hitObject.curvePoints[2]));
			}
		} else if (hitObject.type[3] === "1") {
			hitObject.cache.cacheSet = true;
			/* Cache setup for Spinner */
			/* In spinners are measured in radians */
			hitObject.cache.spins = 0;
			hitObject.cache.velocity = 0;
			hitObject.cache.spinnerBonus = false;
			hitObject.cache.spinAngle = 0;
			hitObject.cache.spinAngle = 0;
			hitObject.cache.timeSpentAboveSpinnerMinimum = 0;
			hitObject.cache.cleared = false;
		}
	}
	/* Inherited timing point */
	if (currentLoadedMap.timingPoints[currentTimingPoint].uninherited === 0) {
		sliderSpeedMultiplier *= Formulas.sliderMultiplier(currentLoadedMap.timingPoints[currentTimingPoint].beatLength);
	}
	/* Cache setup after hit objects expected hit time */
	if (useTime >= hitObject.time) {
		/* Cache setup After Object Hit Time */
		if (hitObject.type[0] === "1" && hitObject.cache.cacheSetAfterHit === false) {
			/* Cache setup for HitCircle */
			hitObject.cache.cacheSetAfterHit = true;
		} else if (hitObject.type[1] === "1" && hitObject.cache.cacheSetAfterHit === false) {
			hitObject.cache.cacheSetAfterHit = true;
			/* Cache setup for Slider */
			hitObject.cache.sliderInheritedMultiplier = sliderSpeedMultiplier;
			hitObject.cache.timingPointUninheritedIndex = timingPointUninheritedIndex;
			let time = Math.abs(hitObject.length) / (hitObject.cache.sliderInheritedMultiplier * 100) * currentLoadedMap.timingPoints[hitObject.cache.timingPointUninheritedIndex].beatLength;
			/* Actual ticks is -1 due to unexplicable phenomenon */
			hitObject.cache.totalTicks = time / currentLoadedMap.timingPoints[hitObject.cache.timingPointUninheritedIndex].beatLength * currentLoadedMap.SliderTickRate;
			hitObject.cache.specificSliderTicksHit = [];
			hitObject.cache.specificSliderTicksPosition = [];
			let inc = hitObject.cache.points.length / (hitObject.cache.totalTicks);
			for (let j = 0; j < hitObject.slides; j++) {
				let temporaryTickPositions = [];
				let tempArrayBoolean = [];
				if (j % 2 === 0) {
					for (let k = 0; k < hitObject.cache.points.length; k += inc) {
						if (k > 1 && k < hitObject.cache.points.length - 1) {
							temporaryTickPositions.push(Math.floor(k));
							tempArrayBoolean.push(false);
						}
					}
				} else {
					for (let k = hitObject.cache.points.length - 1; k >= 0; k -= inc) {
						if (k > 1 && k < hitObject.cache.points.length - 1) {
							temporaryTickPositions.push(Math.floor(k));
							tempArrayBoolean.push(false);
						}
					}
				}
				hitObject.cache.specificSliderTicksHit.push(tempArrayBoolean);
				hitObject.cache.specificSliderTicksPosition.push(temporaryTickPositions);
			}
			hitObject.cache.totalTicks = hitObject.cache.specificSliderTicksPosition[0].length;
		} else if (hitObject.type[3] === "1" && hitObject.cache.cacheSetAfterHit === false) {
			hitObject.cache.cacheSetAfterHit = true;
			/* Cache setup for Spinner */
			hitObject.cache.bonusSpins = 0;
			hitObject.cache.size = 0;
		}
	}
}

function processHitObjects(hitObject, useTime, previousTime, index, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y) {
	/* notelocked for circles */
	if (index !== 0 && hitObject.type[0] === "1" && playDetails.mods.auto === false) {
		return;
	}
	let hasSpliced = false;
	let hitObjectMapped = Utils.mapToOsuPixels(hitObject.x, hitObject.y, window.innerHeight * PLAYFIELD_ACTUAL_SIZE * (4 / 3), window.innerHeight * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, playDetails.mods.hardRock);
	if (playDetails.mods.auto) {
		keyboard.emulateKeyUp(Options.getProperty("Inputs", "keyboardLeftButton"));
		if (index === 0) {
			if ((hitObject.cache.hasHitAtAll === false || hitObject.cache.hasHitAtAll === undefined) && hitObject.type[3] !== "1") {
				mouse.changePosition((hitObjectMapped.x - mouse.position.x) / 4, (hitObjectMapped.y - mouse.position.y) / 4);
			}
		}
		if (hitObject.type[0] === "1" && useTime > hitObject.time/* - ODTime[2] / 2*/) {
			mouse.setPosition(hitObjectMapped.x, hitObjectMapped.y);
			keyboard.emulateKeyDown(Options.getProperty("Inputs", "keyboardLeftButton"));
		}
		if (hitObject.type[1] === "1" && useTime > hitObject.time/* - ODTime[2] / 2*/) {
			let sliderFollowCirclePos = Utils.mapToOsuPixels(hitObject.cache.points[hitObject.cache.sliderFollowCirclePosition].x, hitObject.cache.points[hitObject.cache.sliderFollowCirclePosition].y, window.innerHeight * PLAYFIELD_ACTUAL_SIZE * (4 / 3), window.innerHeight * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, playDetails.mods.hardRock);
			mouse.setPosition(sliderFollowCirclePos.x, sliderFollowCirclePos.y);
			keyboard.emulateKeyDown(Options.getProperty("Inputs", "keyboardLeftButton"));
		}
	}
	if ((playDetails.mods.auto || playDetails.mods.spunOut) && hitObject.type[3] === "1" && useTime > hitObject.time) {
			if (playDetails.mods.auto) {
				angleChange = AUTO_SPIN_SPEED;
			} else if (playDetails.mods.spunOut) {
				angleChange = AUTOPILOT_SPIN_SPEED;
			}
			mouse.setPosition(hitObjectMapped.x + 100 * Math.cos(hitObject.cache.spinAngle), hitObjectMapped.y + 100 * Math.sin(hitObject.cache.spinAngle));
			keyboard.emulateKeyDown(Options.getProperty("Inputs", "keyboardLeftButton"));
		}
	/* Hit Circle Hit Handling */
	if (hitObject.type[0] === "1" && Utils.dist(mouse.position.x, mouse.position.y, hitObjectMapped.x, hitObjectMapped.y) <= circleDiameter / 2 && ((keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardLeftButton")) && keyboardLeftReleased) || (keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardRightButton")) && keyboardRightReleased))) {
		let hitWindowScore = 0;
		if (Utils.withinRange(useTime, hitObject.time, ODTime[0])) {
			if (Utils.withinRange(useTime, hitObject.time, ODTime[2])) {
				hitWindowScore = 300;
			} else if (Utils.withinRange(useTime, hitObject.time, ODTime[1])) {
				hitWindowScore = 100;
			} else if (Utils.withinRange(useTime, hitObject.time, ODTime[0])) {
				hitWindowScore = 50;
			}
			hitErrors.push(useTime - hitObject.time);
			hitObject.cache.hasHit = true;
			hitObject.cache.hitTime = useTime;
			hitEvents.push(new HitObjects.HitEvent("hit-circle", hitWindowScore, "increasing", hitObjectMapped.x, hitObjectMapped.y));
			if (playDetails.mods.hidden === false) {
				effectObjects.push(new HitObjects.EffectObject(hitCircleColourBuffers[hitObject.cache.comboColour], hitObjectMapped.x, hitObjectMapped.y, useTime, useTime + 0.2));
				effectObjects.push(new HitObjects.EffectObject(Assets.hitCircleOverlay, hitObjectMapped.x, hitObjectMapped.y, useTime, useTime + 0.2));
			}
		} else {
			hitEvents.push(new HitObjects.HitEvent("hit-circle", 0, "reset", hitObjectMapped.x, hitObjectMapped.y));
		}
		hitObjects.splice(index, 1);
		hasSpliced = true;
		return hasSpliced;
	}
	/* Slider Follow Circle Handling */
	if (hitObject.type[1] === "1" && useTime >= hitObject.time) {
		hitObject.cache.sliderFollowCircleSize += (1 - hitObject.cache.sliderFollowCircleSize) / 8;
		if (hitObject.cache.currentSlide < hitObject.slides) {
			let sliderRepeat = false;
			let time = Math.abs(hitObject.length) / (hitObject.cache.sliderInheritedMultiplier * 100) * currentLoadedMap.timingPoints[hitObject.cache.timingPointUninheritedIndex].beatLength;
			hitObject.cache.sliderFollowCirclePreviousPosition = hitObject.cache.sliderFollowCirclePosition - 10;
			if (hitObject.cache.currentSlide % 2 === 0) {
				hitObject.cache.sliderFollowCirclePosition = Math.floor(Utils.map(useTime, hitObject.time + time * hitObject.cache.currentSlide, hitObject.time + time * (hitObject.cache.currentSlide + 1), 0, hitObject.cache.points.length - 1));
				/* Prevent Index Errors */
				hitObject.cache.sliderFollowCirclePosition = Math.max(hitObject.cache.sliderFollowCirclePosition, 0);
				/* Check if slider repeats, then switch direction */
				if (hitObject.cache.sliderFollowCirclePosition > hitObject.cache.points.length - 1) {
					hitObject.cache.sliderFollowCirclePosition = hitObject.cache.points.length - 1;
					sliderRepeat = true;
				}
			} else if (hitObject.cache.currentSlide % 2 === 1) {
				hitObject.cache.sliderFollowCirclePosition = Math.floor(Utils.map(useTime, hitObject.time + time * hitObject.cache.currentSlide, hitObject.time + time * (hitObject.cache.currentSlide + 1), hitObject.cache.points.length - 1, 0));
				/* Prevent Index Errors */
				hitObject.cache.sliderFollowCirclePosition = Math.min(hitObject.cache.sliderFollowCirclePosition, hitObject.cache.points.length - 1);
				/* Check if slider repeats, then switch direction */
				if (hitObject.cache.sliderFollowCirclePosition < 0) {
					hitObject.cache.sliderFollowCirclePosition = 0;
					sliderRepeat = true;
				}
			}
			/* Check if slider follow circle went over slider ticks */
			for (let j = 0; j < hitObject.cache.specificSliderTicksPosition[hitObject.cache.currentSlide].length; j++) {
				if (hitObject.cache.specificSliderTicksHit[hitObject.cache.currentSlide][j] === false && (keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardLeftButton")) || keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardRightButton")))) {
					let mapped = Utils.mapToOsuPixels(hitObject.cache.points[hitObject.cache.specificSliderTicksPosition[hitObject.cache.currentSlide][j]].x, hitObject.cache.points[hitObject.cache.specificSliderTicksPosition[hitObject.cache.currentSlide][j]].y, window.innerHeight * PLAYFIELD_ACTUAL_SIZE * (4 / 3), window.innerHeight * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, playDetails.mods.hardRock);
					if (hitObject.cache.sliderFollowCirclePreviousPosition < hitObject.cache.specificSliderTicksPosition[hitObject.cache.currentSlide][j] && hitObject.cache.sliderFollowCirclePosition > hitObject.cache.specificSliderTicksPosition[hitObject.cache.currentSlide][j]) {
						hitObject.cache.specificSliderTicksHit[hitObject.cache.currentSlide][j] = true;
						hitObject.cache.sliderTicksHit++;
						hitObject.cache.sliderFollowCircleSize += 0.125;
						hitEvents.push(new HitObjects.HitEvent("slider-tick", 10, "increasing", mapped.x, mapped.y));
					}
				}
			}
			let sliderFollowCirclePos = Utils.mapToOsuPixels(hitObject.cache.points[hitObject.cache.sliderFollowCirclePosition].x, hitObject.cache.points[hitObject.cache.sliderFollowCirclePosition].y, window.innerHeight * PLAYFIELD_ACTUAL_SIZE * (4 / 3), window.innerHeight * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, playDetails.mods.hardRock);
			if (Utils.dist(mouse.position.x, mouse.position.y, sliderFollowCirclePos.x, sliderFollowCirclePos.y) <= circleDiameter * FOLLOW_CIRCLE_SIZE / 2 && hitObject.cache.onFollowCircle && (keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardLeftButton")) || keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardRightButton")))) {
				hitObject.cache.onFollowCircle = true;
			} else if (Utils.dist(mouse.position.x, mouse.position.y, sliderFollowCirclePos.x, sliderFollowCirclePos.y) <= circleDiameter / 2 && (keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardLeftButton")) || keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardRightButton")))) {
				hitObject.cache.onFollowCircle = true;
			} else {
				hitObject.cache.onFollowCircle = false;
			}
			if (sliderRepeat) {
				hitObject.cache.currentSlide++;
				if (hitObject.cache.currentSlide < hitObject.slides) {
					let sliderFollowCirclePos = Utils.mapToOsuPixels(hitObject.cache.points[hitObject.cache.sliderFollowCirclePosition].x, hitObject.cache.points[hitObject.cache.sliderFollowCirclePosition].y, window.innerHeight * PLAYFIELD_ACTUAL_SIZE * (4 / 3), window.innerHeight * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, playDetails.mods.hardRock);
					if (Utils.dist(mouse.position.x, mouse.position.y, sliderFollowCirclePos.x, sliderFollowCirclePos.y) <= circleDiameter * FOLLOW_CIRCLE_SIZE / 2 && hitObject.cache.onFollowCircle && (keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardLeftButton")) || keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardRightButton")))) {
						hitObject.cache.repeatsHit++;
						hitEvents.push(new HitObjects.HitEvent("slider-element", 30, "increasing", sliderFollowCirclePos.x));
						if (playDetails.mods.hidden === false) {
							effectObjects.push(new HitObjects.EffectObject(hitCircleColourBuffers[hitObject.cache.comboColour], sliderFollowCirclePos.x, sliderFollowCirclePos.y, useTime, useTime + 0.2));
							effectObjects.push(new HitObjects.EffectObject(Assets.hitCircleOverlay, sliderFollowCirclePos.x, sliderFollowCirclePos.y, useTime, useTime + 0.2));
						}
					} else {
						hitEvents.push(new HitObjects.HitEvent("slider-element-miss", 0, "reset", sliderFollowCirclePos.x, sliderFollowCirclePos.y));
					}
				}
			}
		} else {
			hitObject.cache.hasEnded = true;
			if (hitObject.cache.currentSlide % 2 === 0) {
				if (Utils.dist(mouse.position.x, mouse.position.y, hitObject.cache.points[0].x, hitObject.cache.points[0].y) <= circleDiameter / 2) {
					hitObject.cache.hitEnd = true;
					hitObject.cache.hasHitAtAll = true;
				}
			} else if (hitObject.cache.currentSlide % 2 === 1) {
				if (Utils.dist(mouse.position.x, mouse.position.y, hitObject.cache.points[hitObject.cache.points.length - 1].x, hitObject.cache.points[hitObject.cache.points.length - 1].y) <= circleDiameter / 2) {
					hitObject.cache.hitEnd = true;
					hitObject.cache.hasHitAtAll = true;
				}
			}
		}
	}
	/* Slider Head Hit Handling */
	if (hitObject.type[1] === "1" && hitObject.cache.hitHead === false && Utils.dist(mouse.position.x, mouse.position.y, hitObjectMapped.x, hitObjectMapped.y) <= circleDiameter / 2 && ((keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardLeftButton")) && keyboardLeftReleased) || (keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardRightButton")) && keyboardRightReleased)) && Utils.withinRange(useTime, hitObject.time, ODTime[0])) {
		hitErrors.push(useTime - hitObject.time);
		hitEvents.push(new HitObjects.HitEvent("slider-element", 30, "increasing", hitObjectMapped.x, hitObjectMapped.y));
		if (playDetails.mods.hidden === false) {
			effectObjects.push(new HitObjects.EffectObject(hitCircleColourBuffers[hitObject.cache.comboColour], hitObjectMapped.x, hitObjectMapped.y, useTime, useTime + 0.2));
			effectObjects.push(new HitObjects.EffectObject(Assets.hitCircleOverlay, hitObjectMapped.x, hitObjectMapped.y, useTime, useTime + 0.2));
		}
		hitObject.cache.hitHead = true;
		hitObject.cache.hasHitAtAll = true;
	}
	/* Slider Tick Miss Check */
	/* todo */
	/* Slider Score Calculations */
	if (hitObject.type[1] === "1" && hitObject.cache.hasEnded) {
		let sliderElementsHit = 0;
		/* 1 head */
		/* 1 end */
		/* 1 follow circle */
		/* n repeats */
		/* m * n ticks */
		let totalSliderElements = 1 + hitObject.slides + hitObject.slides * hitObject.cache.totalTicks;
		if (hitObject.cache.hitHead) {
			sliderElementsHit++;
		}
		if (hitObject.cache.hitEnd) {
			sliderElementsHit++;
		}
		if (hitObject.cache.onFollowCircle) {
			sliderElementsHit++;
		}
		sliderElementsHit += hitObject.cache.repeatsHit;
		for (let j = 0; j < hitObject.cache.specificSliderTicksHit.length; j++) {
			for (let k = 0; k < hitObject.cache.specificSliderTicksHit[j].length; k++) {
				if (hitObject.cache.specificSliderTicksHit[j][k]) {
					sliderElementsHit++;
				}
			}
		}
		let mapped;
		if (hitObject.slides % 2 === 0) {
			mapped = Utils.mapToOsuPixels(hitObject.x, hitObject.y, window.innerHeight * PLAYFIELD_ACTUAL_SIZE * (4 / 3), window.innerHeight * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, playDetails.mods.hardRock);
		} else {
			mapped = Utils.mapToOsuPixels(hitObject.cache.points[hitObject.cache.points.length - 1].x, hitObject.cache.points[hitObject.cache.points.length - 1].y, window.innerHeight * PLAYFIELD_ACTUAL_SIZE * (4 / 3), window.innerHeight * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, playDetails.mods.hardRock);
		}
		let hitScore = 0;
		if (sliderElementsHit >= totalSliderElements) {
			hitScore = 300;
		} else if (sliderElementsHit >= 0.5 * totalSliderElements) {
			hitScore = 100;
		} else if (sliderElementsHit > 0) {
			hitScore = 50;
		}
		if (hitScore !== 0) {
			hitEvents.push(new HitObjects.HitEvent("hit-circle", hitScore, "increasing", mapped.x, mapped.y));
			if (playDetails.mods.hidden === false) {
				effectObjects.push(new HitObjects.EffectObject(hitCircleColourBuffers[hitObject.cache.comboColour], mapped.x, mapped.y, useTime, useTime + 0.2));
				effectObjects.push(new HitObjects.EffectObject(Assets.hitCircleOverlay, mapped.x, mapped.y, useTime, useTime + 0.2));
			}
		} else {
			hitEvents.push(new HitObjects.HitEvent("hit-circle", 0, "reset", mapped.x, mapped.y));
		}
		hitObjects.splice(index, 1);
		hasSpliced = true;
		return hasSpliced;
	}
	/* Miss (Outside OD window) calculation */
	let miss = false;
	let mapped = hitObjectMapped;
	if (hitObject.type[0] === "1" && useTime >= hitObject.time + ODTime[0] / 2) {
		miss = true;
	} else if (hitObject.type[1] === "1" && hitObject.cache.hasEnded && hitObject.cache.hasHitAtAll === false) {
		miss = true;
		let mapped;
		if (hitObject.slides % 2 === 0) {
			mapped = Utils.mapToOsuPixels(hitObject.x, hitObject.y, window.innerHeight * PLAYFIELD_ACTUAL_SIZE * (4 / 3), window.innerHeight * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, playDetails.mods.hardRock);
		} else {
			mapped = Utils.mapToOsuPixels(hitObject.cache.points[hitObject.cache.points.length - 1].x, hitObject.cache.points[hitObject.cache.points.length - 1].y, window.innerHeight * PLAYFIELD_ACTUAL_SIZE * (4 / 3), window.innerHeight * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, playDetails.mods.hardRock);
		}
	}
	if (miss) {
		hitEvents.push(new HitObjects.HitEvent("hit-circle", 0, "reset", mapped.x, mapped.y));
		hitObjects.splice(index, 1);
		hasSpliced = true;
		return hasSpliced;
	}
	/* Spinner handling */
	if (hitObject.type[3] === "1") {
		/* velocity changes slowly due to spinner inertia*/
		hitObject.cache.velocity += (angleChange - hitObject.cache.velocity) / 32;
		hitObject.cache.spinAngle += hitObject.cache.velocity * (useTime - previousTime);
		hitObject.cache.size -= hitObject.cache.size / 16;
		hitObject.cache.size = Math.min(hitObject.cache.size, 2);
		if ((keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardLeftButton")) || keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardRightButton"))) && Math.abs(hitObject.cache.velocity / (Math.PI)) >= Formulas.ODSpinner(currentLoadedMap.OverallDifficulty, playDetails.mods)) {
			hitObject.cache.timeSpentAboveSpinnerMinimum += useTime - previousTime;
		}
		/* spinner is officialy cleared if time spent spinning is above 25% */
		if (hitObject.cache.timeSpentAboveSpinnerMinimum >= (hitObject.endTime - hitObject.time) * 0.25) {
			hitObject.cache.cleared = true;
		}
		while (hitObject.cache.spinAngle >= Math.PI * 2 && (keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardLeftButton")) || keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardRightButton")))) {
			hitObject.cache.spins++;
			hitObject.cache.spinAngle -= Math.PI * 2;
			if (hitObject.cache.cleared === false) {
				hitEvents.push(new HitObjects.HitEvent("spinner-spin", 100, "no-increase", mapped.x, mapped.y));
			} else {
				hitObject.cache.bonusSpins++;
				hitObject.cache.size += 0.125;
				hitEvents.push(new HitObjects.HitEvent("spinner-bonus-spin", 1100, "no-increase", mapped.x, mapped.y));
			}
		}
		while (hitObject.cache.spinAngle <= -Math.PI * 2 && (keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardLeftButton")) || keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardRightButton")))) {
			hitObject.cache.spins++;
			hitObject.cache.spinAngle += Math.PI * 2;
			if (hitObject.cache.cleared === false) {
				hitEvents.push(new HitObjects.HitEvent("spinner-spin", 100, "no-increase", mapped.x, mapped.y));
			} else {
				hitObject.cache.bonusSpins++;
				hitObject.cache.size += 0.125;
				hitEvents.push(new HitObjects.HitEvent("spinner-bonus-spin", 1100, "no-increase", mapped.x, mapped.y));
			}
		}
	}
	/* Spinner end handling */
	if (hitObject.type[3] === "1" && useTime >= hitObject.endTime) {
		let mapped = Utils.mapToOsuPixels(PLAYFIELD_CENTER_X, PLAYFIELD_CENTER_Y, window.innerHeight * PLAYFIELD_ACTUAL_SIZE * (4 / 3), window.innerHeight * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, playDetails.mods.hardRock);
		/* spinner is cleared is if the time spent spinning is over 25% of the spinner length */
		if (hitObject.cache.cleared) {
			hitEvents.push(new HitObjects.HitEvent("hit-circle", 300, "increasing", mapped.x, mapped.y));
			/* award 100 if time spent spinning is between 25% and 18.75% */
		} else if (hitObject.cache.timeSpentAboveSpinnerMinimum >= (hitObject.endTime - hitObject.time) * 18.75) {
			hitEvents.push(new HitObjects.HitEvent("hit-circle", 100, "increasing", mapped.x, mapped.y));
			/* award 50 if time spent spinning is between 18.75% and 6.25% */
		} else if (hitObject.cache.timeSpentAboveSpinnerMinimum >= (hitObject.endTime - hitObject.time) * 0.0625) {
			hitEvents.push(new HitObjects.HitEvent("hit-circle", 50, "increasing", mapped.x, mapped.y));
			/* award miss if time spent spinning is below 6.25% */
		} else if (hitObject.cache.timeSpentAboveSpinnerMinimum < (hitObject.endTime - hitObject.time) * 0.0625) {
			hitEvents.push(new HitObjects.HitEvent("hit-circle", 0, "reset", mapped.x, mapped.y));
		}
		hitObjects.splice(index, 1);
		hasSpliced = true;
		return hasSpliced;
	}
	if (playDetails.mods.auto) {
		keyboard.emulateKeyUp(Options.getProperty("Inputs", "keyboardLeftButton"));
	}
	return hasSpliced;
}


function updateScore() {
	comboPulseSize -= comboPulseSize / 8;
	if (Options.getProperty("Performance", "scoreUpdateRate") === "Every frame") {
		displayedScore += (score - displayedScore) / 8;
	} else {
		displayedScore = score;
	}
	/* update score html element */
	Utils.htmlCounter(Math.round(displayedScore).toString(), "score-container", "score-digit-", Assets.scoreNumbers, "left", "calc(100vw - " + (document.getElementById("score-container").childNodes.length * 2) + "vw)");
	/* update combo html element */
	Utils.htmlCounter(combo + Options.getProperty("Inputs", "keyboardRightButton"), "combo-container", "combo-digit-", Assets.scoreNumbers, "top", "calc(100vh - 52 / 32 * " + 2 * (comboPulseSize + 1) + "vw)");
	/* update accuracy html element */
	Utils.htmlCounter(playDetails.accuracy.toFixed(2) + "%", "accuracy-container", "accuracy-digit-", Assets.scoreNumbers, "left", "calc(100vw - " + (document.getElementById("accuracy-container").childNodes.length * 1) + "vw)");
	/* rank grade */
	document.getElementById("grade").src = Assets.grades[playDetails.grade].src;
	/* combo pulse size */
	let els = document.getElementById("combo-container").querySelectorAll("img");
	for (let i = 0; i < els.length; i++) {
		els[i].style.width = 2 * (comboPulseSize + 1) + "vw";
	}
}

function renderMouse() {
	mouse.deleteMouseTrail(500);
	/* mouse trails */
	let numberOfMouseTrailsRendered = 0;
	let maxMouseTrails = 128;
	if (Options.getProperty("Gameplay", "cursorTrails") === "Interpolated") {
		let positions = [mouse.position];
		for (let i = mouse.previousPositions.x.length - 1; i >= 0; i--) {
			positions.push({
				x: mouse.previousPositions.x[i],
				y: mouse.previousPositions.y[i],
			});
		}
		for (let i = 0; i < positions.length - 1; i++) {
			let distance = Utils.dist(positions[i].x, positions[i].y, positions[i + 1].x, positions[i + 1].y);
			for (let j = distance; j >= 1; j -= 2) {
				canvas.setGlobalAlpha(Utils.map(numberOfMouseTrailsRendered, 0, Math.min(maxMouseTrails, Utils.totalDistance(positions) / 2), 0.5, 0));
				canvas.drawImage(Assets.cursorTrail, Utils.map(j, distance, 0, positions[i].x, positions[i + 1].x), Utils.map(j, distance, 0, positions[i].y, positions[i + 1].y));
				numberOfMouseTrailsRendered++;
				/* prevent the rendering of too many trails otherwise it will lag */
				if (numberOfMouseTrailsRendered >= maxMouseTrails) {
					break;
				}
			}
			if (numberOfMouseTrailsRendered >= maxMouseTrails) {
				break;
			}
		}
	}
	canvas.setGlobalAlpha(1);
	if ((keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardLeftButton")) || keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardRightButton")))) {
		mouseSize += 0.125;
	}
	mouseSize += (1 - mouseSize) / 4;
	canvas.drawImage(Assets.cursor, mouse.position.x, mouse.position.y, Assets.cursor.width * mouseSize, Assets.cursor.height * mouseSize);
}

function detectSpinSpeed(useTime, previousTime, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y) {
	let b = Utils.mapToOsuPixels(PLAYFIELD_CENTER_X, PLAYFIELD_CENTER_Y, window.innerHeight * PLAYFIELD_ACTUAL_SIZE * (4 / 3), window.innerHeight * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, playDetails.mods.hardRock);
	previousAngle = angle;
	angle = Math.atan2(mouse.position.y - b.y, mouse.position.x - b.x);
	if (Math.sign(angle) === -1) {
		angle = Math.PI * 2 + angle;
	}
	angleChange = ((angle - previousAngle) / (useTime - previousTime));
	if (isNaN(angleChange)) {
		angleChange = 0;
	}
	/* hard limit spinner speed at auto max spin speed */
	angleChange = Math.min(angleChange, AUTO_SPIN_SPEED);
	angleChange = Math.max(angleChange, -AUTO_SPIN_SPEED);
	/* Detect sudden sign changes due to rollover every spin */
	if (previousSigns.length > 10) {
		previousSigns.shift();
	}
	previousSigns.push(Math.sign(angleChange));
	let averageSign = 0;
	for (let i = 0; i < previousSigns.length; i++) {
		averageSign += previousSigns[i];
	}
	if (Math.sign(averageSign) !== Math.sign(angleChange)) {
		angleChange *= -1;
	}
}

function updateHp(useTime, previousTime) {
	currentHP = Math.min(currentHP, 1);
	currentHP = Math.max(currentHP, 0);
	if (currentHP <= 0 && (playDetails.mods.auto || playDetails.mods.relax || playDetails.mods.autopilot || playDetails.mods.noFail) === false) {
		document.getElementById("webpage-state-fail-screen").style.display = "block";
		audio.pause();
		isGameRunning = false;
		exitPointerLock();
	}
	/* only start draining health 2 seconds before the first hit object and also not during breaks */
	if (useTime > currentLoadedMap.hitObjects[0].time - 2 && isBreakPeriod === false) {
		currentHP -= Formulas.HPDrain(currentLoadedMap.HPDrainRate, useTime - previousTime);
	}
	displayedHP += (currentHP - displayedHP) / 8;
}

function processHitEvent(useTime, context) {
	switch (hitEvents[0].score) {
		/* great*/
		case 300:
			playDetails.great++;
			break;
			/* ok */
		case 100:
			if (hitEvents[0].type === "hit-circle") {
				playDetails.ok++;
			}
			break;
			/* meh */
		case 50:
			playDetails.meh++;
			break;
			/* miss */
		case 0:
			playDetails.miss++;
			break;
	}
	if ((hitEvents[0].score > 50 || hitEvents[0].score === 0) && hitEvents[0].type === "hit-circle") {
		if (playDetails.mods.perfect && hitEvents[0].score !== 300) {
			context.retry();
			return;
		}
		score += Formulas.hitScore(hitEvents[0].score, (combo === 0) ? combo : combo - 1, difficultyMultiplier, Formulas.modScoreMultiplier(playDetails.mods));
		let lifetime = (hitEvents[0].score === 0) ? 1 : 0.4;
		judgementObjects.push(new HitObjects.ScoreObject(hitEvents[0].score, hitEvents[0].x, hitEvents[0].y, useTime, useTime + lifetime));
	} else {
		score += hitEvents[0].score;
	}
	if (hitEvents[0].combo === "increasing") {
		combo++;
		playDetails.maxCombo = Math.max(playDetails.maxCombo, combo);
		comboPulseSize = 1;
	} else if (hitEvents[0].combo === "reset") {
		if (combo >= 1) {
			playDetails.comboBreaks++;
		}
		combo = 0;
		if (playDetails.mods.suddenDeath) {
			context.retry();
			return;
		}
		document.getElementById("combo-container").innerHTML = "";
	}
	currentHP += Formulas.HP(currentLoadedMap.HPDrainRate, hitEvents[0].score, hitEvents[0].type, playDetails.mods);
	hitEvents.shift();
}

function nextHitObjects() {
	/* create copy not reference, otherwise retrying wouldn't work */
	hitObjects.push(JSON.parse(JSON.stringify(currentLoadedMap.hitObjects[currentHitObjects])));
	currentComboNumber++;
	/* second bit flag determines new combo */
	if (currentLoadedMap.hitObjects[currentHitObjects].type[2] === "1") {
		currentComboNumber = 1;
		currentComboColour++;
		if (currentComboColour >= currentLoadedMap.comboColours.length) {
			currentComboColour -= currentLoadedMap.comboColours.length;
		}
	}
	currentHitObjects++;
}

function nextTimingPoint() {
	currentTimingPoint++;
	if (currentLoadedMap.timingPoints[currentTimingPoint].uninherited === 1) {
		timingPointUninheritedIndex = currentTimingPoint;
	}
}

function nextBreakPeriod() {
	currentBreakPeriod++;
	isBreakPeriod = true;
}

function renderEffects(useTime) {
	for (let i = 0; i < judgementObjects.length; i++) {
		if (judgementObjects[i].lifetime - useTime >= 0) {
			/* ignore 300 hits */
			if (Options.getProperty("Gameplay", "draw300Hits") === false && judgementObjects[i].score === 300) {
				continue;
			}
			let useImage = -1;
			switch (judgementObjects[i].score) {
				case 300:
					useImage = 0;
					break;
				case 100:
					useImage = 1;
					break;
				case 50:
					useImage = 2;
					break;
				case 0:
					useImage = 3;
					break;
			}
			canvas.setGlobalAlpha(Math.min(Utils.map(useTime, judgementObjects[i].initialTime, judgementObjects[i].lifetime, 2, 0), 1));
			let size = circleDiameter * 0.75;
			if (judgementObjects[i].score === 0) {
				// size *= Math.pow(Math.E, -3 * Utils.map(useTime, judgementObjects[i].initialTime, judgementObjects[i].lifetime, 0, 2)) + 1;
				let x = Math.sin(Utils.map(useTime, judgementObjects[i].initialTime, judgementObjects[i].lifetime, 0, 4 * Math.PI) * judgementObjects[i].rotationVelocity) * size / 64;
				let y = Utils.map(useTime, judgementObjects[i].initialTime, judgementObjects[i].lifetime, 0, 75) ** 2 / 75 ** 1;
				ctx.translate(judgementObjects[i].x + x, judgementObjects[i].y + y);
				ctx.rotate(Utils.map(useTime, judgementObjects[i].initialTime, judgementObjects[i].lifetime, 0, 1) * judgementObjects[i].rotationVelocity);
				canvas.drawImage(Assets.hitNumbers[useImage], 0, 0, size * (Assets.hitNumbers[useImage].width / Assets.hitNumbers[useImage].height), size);
				ctx.resetTransform();
			} else {
				size *= JUDGEMENT_BEZIER_ANIMATION[Math.floor(Utils.map(useTime, judgementObjects[i].initialTime, judgementObjects[i].lifetime, 0, JUDGEMENT_BEZIER_ANIMATION.length - 1))].y;
				canvas.drawImage(Assets.hitNumbers[useImage], judgementObjects[i].x, judgementObjects[i].y, size  * (Assets.hitNumbers[useImage].width / Assets.hitNumbers[useImage].height), size);
			}
		} else {
			judgementObjects.splice(i, 1);
			i--;
		}
	}
	for (let i = 0; i < effectObjects.length; i++) {
		if (effectObjects[i].lifetime - useTime >= 0) {
			let alpha = Math.min(Utils.map(useTime, effectObjects[i].initialTime, effectObjects[i].lifetime, 1, 0), 1);
			canvas.setGlobalAlpha(alpha);
			let size = circleDiameter * Utils.map(useTime, effectObjects[i].initialTime, effectObjects[i].lifetime, 1, 1.5);
			canvas.drawImage(effectObjects[i].src, effectObjects[i].x, effectObjects[i].y, size, size);
		} else {
			effectObjects.splice(i, 1);
			i--;
		}
	}
}

function renderHitErrors() {
	canvas.setGlobalAlpha(1);
	canvas.setFillStyle("#ffcc22");
	ctx.fillRect(window.innerWidth / 2 - ODTime[0] * 1000 / 2, window.innerHeight * 0.975, ODTime[0] * 1000, window.innerHeight * 0.005);
	canvas.setFillStyle("#88b300");
	ctx.fillRect(window.innerWidth / 2 - ODTime[1] * 1000 / 2, window.innerHeight * 0.975, ODTime[1] * 1000, window.innerHeight * 0.005);
	canvas.setFillStyle("#66ccff");
	ctx.fillRect(window.innerWidth / 2 - ODTime[2] * 1000 / 2, window.innerHeight * 0.975, ODTime[2] * 1000, window.innerHeight * 0.005);
	for (let i = 0; i < hitErrors.length; i++) {
		if (i > 40) {
			break;
		}
		let useError = hitErrors[hitErrors.length - 1 - i];
		let alpha = Math.max(Utils.map(i, 40, 0, 0, 0.5), 0);
		canvas.setGlobalAlpha(alpha);
		if (Utils.withinRange(useError, 0, ODTime[2])) {
			canvas.setFillStyle("#66ccff");
		} else if (Utils.withinRange(useError, 0, ODTime[1])) {
			canvas.setFillStyle("#88b300");
		} else if (Utils.withinRange(useError, 0, ODTime[0])) {
			canvas.setFillStyle("#ffcc22");
		}
		ctx.fillRect(window.innerWidth / 2 + useError * 1000, window.innerHeight * 0.975 - window.innerHeight * 0.025 / 2, window.innerHeight * 0.005, window.innerHeight * 0.025);
	}
	let mean = Utils.weightedMean(hitErrors, function(n) {
    return Math.E ** (- n / 2);
  }, (hitErrors.length > 40) ? hitErrors.length - 40 : 0, hitErrors.length);
	meanHitErrorPosition += (mean - meanHitErrorPosition) / 16;
	canvas.setGlobalAlpha(1);
	canvas.setFillStyle("#fff");
	ctx.fillRect(window.innerWidth / 2 + meanHitErrorPosition * 1000, window.innerHeight * 0.965 - window.innerHeight * 0.025 / 2, window.innerHeight * 0.005, window.innerHeight * 0.005);

}
function renderFlashlight() {
	flashlightCtx.globalCompositeOperation = "source-over";
	flashlightCtx.fillStyle = "rgba(0, 0, 0, 1)";
	flashlightCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
	flashlightCtx.globalCompositeOperation = "destination-out";
	flashlightCtx.beginPath();
	flashlightCtx.arc(mouse.position.x, mouse.position.y, flashlightSize, 0, Math.PI * 2, false);
	flashlightCtx.fillStyle = "white";
	flashlightCtx.shadowOffsetX = 0;
	flashlightCtx.shadowOffsetY = 0;
	flashlightCtx.shadowBlur = 40;
	flashlightCtx.shadowColor = "rgba(255, 255, 255, 1)";
	flashlightCtx.fill();
	flashlightCtx.fill();
	flashlightCtx.fill();
	flashlightCtx.fill();
}

function getTime(audio, playDetails) {
	let useTime = audio.currentTime;
	if (audioFailedToLoad) {
		useTime = (window.performance.now() - backupStartTime) / 1000;
		if (playDetails.mods.doubleTime) {
			useTime *= 1.5;
		} else if (playDetails.mods.halfTime) {
			useTime *= 0.75;
		}
	}
	return useTime;
}

export function tick() {
	let useTime = getTime(audio, playDetails);
	if (keyboard.getKeyDown("space") && document.getElementById("skip-button").style.opacity === "1") {
		audio.currentTime = currentLoadedMap.hitObjects[0].time - 2.5;
		if (isReplay === false) {
			playDetails.replay.addKeyEvent(new ReplayManager.KeyboardReplayEvent(useTime, 2, "down"));
			playDetails.replay.addKeyEvent(new ReplayManager.KeyboardReplayEvent(useTime + 1, 2, "up"));
		}
	}
	if (useTime > currentLoadedMap.hitObjects[0].time - 2 && currentHitObjects === 0) {
		document.getElementById("skip-button").style.opacity = "0";
	}
	if (currentHitObjects >= currentLoadedMap.hitObjects.length || (audio.currentTime > 0 && audio.paused)) {
		if (useTime > endingTime || (audio.currentTime > 0 && audio.paused)) {
			exitPointerLock();
			Utils.showWebpageStates([
				"webpage-state-always",
				"top-bar",
				"webpage-state-results-screen",
				"bottom-bar"
			]);
			Utils.hideWebpageStates([
				"webpage-state-beatmap-selection",
				"webpage-state-gameplay",
				"webpage-state-fail-screen",
				"webpage-state-pause-screen"
			]);
			let date = new Date();
			playDetails.datePlayed = Utils.formatDate(date.getDate(), date.getMonth(), date.getFullYear(), date.getHours(), date.getMinutes());
			playDetails.unstableRate = Utils.standardDeviation(hitErrors) * 1000 * 10;
			playDetails.title = currentLoadedMap.Title;
			playDetails.creator = currentLoadedMap.Creator;
			playDetails.artist = currentLoadedMap.Artist;
			playDetails.version = currentLoadedMap.Version;
			if (playDetails.miss === 0 && playDetails.sliderBreaks === 0) {
				playDetails.comboType = "Perfect";
			} else if (playDetails.miss === 0) {
				playDetails.comboType = "Full Combo";
			} else if (playDetails.miss <= 3) {
				playDetails.comboType = "Choke";
			} else {
				playDetails.comboType = "Clear";
			}
			EndScreen.displayResults(playDetails);
			isGameRunning = false;
			audio.playbackRate = 1;
			if (isReplay === false) {
				window.localStorage.setItem("replayTest", JSON.stringify(playDetails));
			}
		}
	}
	if (isReplay) {
		while (currentMouseEvent < playDetails.replay.mouseEvents.length - 1 && useTime >= playDetails.replay.mouseEvents[currentMouseEvent].time) {
			mouse.setPosition(playDetails.replay.mouseEvents[currentMouseEvent].x, playDetails.replay.mouseEvents[currentMouseEvent].y);
			currentMouseEvent++;
		}
		while (currentKeyEvent < playDetails.replay.keyEvents.length - 1 && useTime >= playDetails.replay.keyEvents[currentKeyEvent].time) {
			if (playDetails.replay.keyEvents[currentKeyEvent].key === 2 && playDetails.replay.keyEvents[currentKeyEvent].state === "down") {
				keyboard.emulateKeyDown("space");
			}
			if (playDetails.replay.keyEvents[currentKeyEvent].key === 2 && playDetails.replay.keyEvents[currentKeyEvent].state === "up") {
				keyboard.emulateKeyUp("space");
			}
			if (playDetails.replay.keyEvents[currentKeyEvent].key === 1 && playDetails.replay.keyEvents[currentKeyEvent].state === "down") {
				keyboard.emulateKeyDown(Options.getProperty("Inputs", "keyboardRightButton"));
			}
			if (playDetails.replay.keyEvents[currentKeyEvent].key === 1 && playDetails.replay.keyEvents[currentKeyEvent].state === "up") {
				keyboard.emulateKeyUp(Options.getProperty("Inputs", "keyboardRightButton"));
			}
			if (playDetails.replay.keyEvents[currentKeyEvent].key === 0 && playDetails.replay.keyEvents[currentKeyEvent].state === "down") {
				keyboard.emulateKeyDown(Options.getProperty("Inputs", "keyboardLeftButton"));
			}
			if (playDetails.replay.keyEvents[currentKeyEvent].key === 0 && playDetails.replay.keyEvents[currentKeyEvent].state === "up") {
				keyboard.emulateKeyUp(Options.getProperty("Inputs", "keyboardLeftButton"));
			}
			currentKeyEvent++;
		}
	}
	/* spinners */
	detectSpinSpeed(useTime, previousTime, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y);
	/* hp */
	updateHp(useTime, previousTime);
	/* +1 because the given time is beginning time, not end time */
	while (currentTimingPoint < currentLoadedMap.timingPoints.length - 1 && useTime >= currentLoadedMap.timingPoints[currentTimingPoint + 1].time) {
		nextTimingPoint();
	}
	while (currentHitObjects < currentLoadedMap.hitObjects.length && useTime >= currentLoadedMap.hitObjects[currentHitObjects].time - ARTime) {
		nextHitObjects();
	}
	while (currentBreakPeriod < currentLoadedMap.breakPeriods.length && useTime >= currentLoadedMap.breakPeriods[currentBreakPeriod].startTime / 1000) {
		nextBreakPeriod();
	}
	if (currentBreakPeriod > 0 && currentBreakPeriod < currentLoadedMap.breakPeriods.length && useTime >= currentLoadedMap.breakPeriods[currentBreakPeriod - 1].endTime / 1000 && isBreakPeriod === true) {
		isBreakPeriod = false;
	}
	/* Cache Loop */
	for (let i = 0; i < hitObjects.length; i++) {
		setHitObjectsCache(hitObjects[i], useTime, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y);
	}
	/* Processing Loop */
	for (let i = 0; i < hitObjects.length; i++) {
		let spliced = processHitObjects(hitObjects[i], useTime, previousTime, i, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y);
		if (spliced) {
			i = Math.max(i - 1, 0);
		}
	}
	if (isReplay === false) {
		/* keyboard events and replay recording */
		if (keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardLeftButton")) === false && keyboardLeftReleased === false) {
			keyboardLeftReleased = true;
			playDetails.replay.addKeyEvent(new ReplayManager.KeyboardReplayEvent(useTime, 0, "up"));
		}
		if (keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardRightButton")) === false && keyboardRightReleased === false) {
			keyboardRightReleased = true;
			playDetails.replay.addKeyEvent(new ReplayManager.KeyboardReplayEvent(useTime, 1, "up"));
		}
		if (keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardLeftButton")) && keyboardLeftReleased) {
				keyboardLeftReleased = false;
				playDetails.replay.addKeyEvent(new ReplayManager.KeyboardReplayEvent(useTime, 0, "down"));
			}
		if (keyboard.getKeyDown(Options.getProperty("Inputs", "keyboardRightButton")) && keyboardRightReleased) {
			keyboardRightReleased = false;
			playDetails.replay.addKeyEvent(new ReplayManager.KeyboardReplayEvent(useTime, 1, "down"));
		}
		/* if the mouse positions are the same, then don't bother recording */
		playDetails.replay.addMouseEvent(new ReplayManager.MouseReplayEvent(useTime, mouse.position.x, mouse.position.y));
	}
	/* Hit Events */
	while (hitEvents.length > 0) {
		processHitEvent(useTime, this);
	}
	playDetails.score = score;
	playDetails.accuracy = Formulas.accuracy(playDetails.great, playDetails.ok, playDetails.meh, playDetails.miss) * 100;
	playDetails.grade = Formulas.grade(playDetails.great, playDetails.ok, playDetails.meh, playDetails.miss, playDetails.mods);
	previousTime = useTime;

	if (combo >= 200) {
		flashlightSize = Utils.map(60, 0, 512, 0, window.innerWidth);
	} else if (combo >= 100) {
		flashlightSize = Utils.map(80, 0, 512, 0, window.innerWidth);
	} else {
		flashlightSize = Utils.map(100, 0, 512, 0, window.innerWidth);
	}

	if (keyboard.getKeyDown("escape")) {
		document.getElementById("webpage-state-pause-screen").style.display = "block";
		audio.pause();
		exitPointerLock();
		isGameRunning = false;
	}
}
export function render() {
	let useTime = getTime(audio, playDetails);
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	canvas.setStrokeStyle("#fff");
	ctx.lineWidth = 5;
	canvas.drawImage(Assets.scoreBarBg, Assets.scoreBarBg.width / 2, Assets.scoreBarBg.height / 2, Assets.scoreBarBg.width, Assets.scoreBarBg.height);
	canvas.setImageAlignment("top-left");
	canvas.drawImage(Assets.scoreBarColour, 0, 0, Utils.map(displayedHP, 0, 1, 0, Assets.scoreBarBg.width), Assets.scoreBarColour.height, window.innerWidth * 0.00425, window.innerHeight * 0.0226, Utils.map(displayedHP, 0, 1, 0, Assets.scoreBarBg.width), Assets.scoreBarColour.height);
	canvas.setImageAlignment("center");

	canvas.setFillStyle("#ffdf0044");
	let x = Math.max(0, Utils.map(audio.currentTime, currentLoadedMap.hitObjects[0].time, endingTime, 0, window.innerWidth * 0.13));
	ctx.fillRect(window.innerWidth * 0.85, window.innerHeight * 0.065, x, 5);
	/* Render Loop */
	for (let i = hitObjects.length - 1; i >= 0; i--) {
		hitObjectRenderer.renderHitObject(hitObjects[i], useTime);
	}
	renderEffects(useTime);
	/* hit errors */
	renderHitErrors();
	updateScore();
	renderMouse();
	if (playDetails.mods.flashlight) {
		renderFlashlight();
	}
}
export function continuePlaying() {
	isGameRunning = true;
	audio.play();
	if ((isReplay || playDetails.mods.auto) === false) {
		enterPointerLock();
	}
}
export function pause() {
	isGameRunning = false;
	audio.pause();
	exitPointerLock();
}
export function retry() {
	isGameRunning = false;
	play(currentLoadedMap, playDetails.mapIdentifier, playDetails.mods);
}
export function watchReplay(mapData, replayDetails) {
	isReplay = true;
	currentMouseEvent = 0;
	currentKeyEvent = 0;
	playDetails = new PlayDetails(replayDetails.mapIdentifier, replayDetails.mods);
	/* prevent auto mods from being applied twice */
	playDetails.mods.auto = false;
	playDetails.mods.autopilot = false;
	playDetails.mods.relax = false;
	playDetails.mods.spunOut = false;
	playDetails.replay = replayDetails.replay;
	playMap(mapData, playDetails.mapIdentifier, playDetails.mods);
}
export function play(mapData, mapIdentifier, mods) {
	isReplay = false;
	playDetails = new PlayDetails(mapIdentifier, mods);
	playMap(mapData, mods);
}
export function playMap(mapData, mods) {
	if (isReplay || mods.auto || mods.autopilot) {
		mouse.disableUserControl();
		keyboard.disableUserControl();
	} else {
		mouse.enableUserControl();
		keyboard.enableUserControl();
	}
	if ((isReplay || mods.auto) === false) {
		enterPointerLock();
	}
	Options.read();
	let hex = Math.round(Utils.map(Options.getProperty("Gameplay", "backgroundDim"), 0, 1, 0, 255)).toString(16);
	document.getElementById("webpage-state-gameplay").style.background = "#000000" + hex;
	mouse.sensitivity = Options.getProperty("Inputs", "mouseSensitivity") * 10;
	if (mapData.hitObjects[0].time > 10) {
		document.getElementById("skip-button").style.opacity = "1";
	} else {
		document.getElementById("skip-button").style.opacity = "0";
	}
	currentLoadedMap = mapData;
	if (mods.flashlight === false) {
		document.getElementById("gameplay-flashlight").style.display = "none";
	} else {
		document.getElementById("gameplay-flashlight").style.display = "block";
	}
	currentHitObjects = 0;
	hitEvents = [];
	hitObjects = [];
	hitErrors = [];
	judgementObjects = [];
	effectObjects = [];
	/* HP values */
	currentHP = 1;
	displayedHP = 1;
	previousTime = 0;
	/* Timing point indexes */
	timingPointUninheritedIndex = 0;
	currentTimingPoint = 0;
	/* Score letiables */
	score = 0;
	displayedScore = 0;
	/* Combo letiables */
	combo = 0;
	currentComboNumber = 1;
	currentComboColour = 0;
	comboPulseSize = 1;
	/* spinner tests */
	previousSigns = [];
	angleChange = 0;
	previousAngle = 0;
	angle = 0;
	/* Audio letiables */
	backupStartTime = window.performance.now();
	audioFailedToLoad = false;
	let database = window.indexedDB.open("osw-database");
	database.addEventListener("success", function(event) {
		let database = event.target.result;
		let objectStore = DatabaseManager.getObjectStore(database, "audio", "readonly");
		let request = objectStore.get(mapData.Creator + mapData.Title + mapData.AudioFilename);
		request.addEventListener("error", function(event) {
			console.error(`Attempt to find query failed: ${event.target.error}`);
		});
		request.addEventListener("success", function(event) {

			let audioType;
			if (event.target.result.name.toLowerCase().includes(".mp3")) {
				audioType = "mp3";
			} else if (event.target.result.name.toLowerCase().includes(".ogg")) {
				audioType = "ogg";
			} else if (event.target.result.name.toLowerCase().includes(".wav")) {
				audioType = "wav";
			}
			audio.src = `data:audio/${audioType};base64,${event.target.result.data}`;
			if (playDetails.mods.doubleTime || playDetails.mods.nightcore) {
				audio.playbackRate = 1.5;
			} else if (playDetails.mods.halfTime) {
				audio.playbackRate = 0.75;
			} else {
				audio.playbackRate = 1;
			}
			if (playDetails.mods.nightcore) {
				audio.preservesPitch = false;
			} else {
				audio.preservesPitch = true;
			}
		});
	});
	audio.currentTime = 0;
	/* Beatmap difficulty data */
	ARTime = Formulas.AR(mapData.ApproachRate, playDetails.mods);
	ARFadeIn = Formulas.ARFadeIn(mapData.ApproachRate, playDetails.mods);
	/* Map from osu!pixels to screen pixels */
	circleDiameter = Utils.map(Formulas.CS(mapData.CircleSize, playDetails.mods) * 2, 0, 512, 0, window.innerHeight * PLAYFIELD_ACTUAL_SIZE * (4 / 3));
	ODTime = Formulas.ODHitWindow(mapData.OverallDifficulty, playDetails.mods);
	let lastHitObjects = currentLoadedMap.hitObjects[currentLoadedMap.hitObjects.length - 1];
	if (lastHitObjects.type[0] === "1") {
		endingTime = lastHitObjects.time + 2;
	}
	if (lastHitObjects.type[1] === "1") {	
		let lastUninheritedTimingPoint = 0;
		for (let i = 0; i < currentLoadedMap.timingPoints.length; i++) {
			if (currentLoadedMap.timingPoints[i].uninherited === 1) {
				lastUninheritedTimingPoint = i;
				
			}
		}
		/* thanks to https://github.com/N3bby/osuBMParser/issues/2 */
		let sliderSpeedMultiplier = currentLoadedMap.SliderMultiplier;
		if (currentLoadedMap.timingPoints[currentLoadedMap.timingPoints.length - 1].uninherited === 1) {
			sliderSpeedMultiplier *= Formulas.sliderMultiplier(currentLoadedMap.timingPoints[currentLoadedMap.timingPoints.length - 1].beatLength);
		}
		endingTime = lastHitObjects.time + (Math.abs(lastHitObjects.length) * lastHitObjects.slides) / 100 + 5;
	}
	if (lastHitObjects.type[3] === "1") {
		endingTime = lastHitObjects.endTime + 2;
	}
	let drainTime = endingTime - mapData.hitObjects[0].time;
	difficultyMultiplier = Formulas.difficultyPoints(mapData.CircleSize, mapData.HPDrainRate, mapData.OverallDifficulty, mapData.hitObjects.length, drainTime);
	hitCircleColourBuffers = [];
	approachCircleColourBuffers = [];
	let hitCircleRgbks = canvas.generateRGBKs(Assets.hitCircle);
	let approachCircleRgbks = canvas.generateRGBKs(Assets.approachCircle);
	for (let i = 0; i < mapData.comboColours.length; i++) {
		let comboColours = mapData.comboColours[i];
		/* legacy maps with rgb object triplets */
		if (Number.isInteger(comboColours.r) && Number.isInteger(comboColours.g) && Number.isInteger(comboColours.b)) {
			hitCircleColourBuffers.push(canvas.generateTintImage(Assets.hitCircle, hitCircleRgbks, comboColours.r, comboColours.g, comboColours.b, circleDiameter, circleDiameter));
		approachCircleColourBuffers.push(canvas.generateTintImage(Assets.approachCircle, approachCircleRgbks, comboColours.r, comboColours.g, comboColours.b));
		} else {
			hitCircleColourBuffers.push(canvas.generateTintImage(Assets.hitCircle, hitCircleRgbks, comboColours[0], comboColours[1], comboColours[2], circleDiameter, circleDiameter));
		approachCircleColourBuffers.push(canvas.generateTintImage(Assets.approachCircle, approachCircleRgbks, comboColours[0], comboColours[1], comboColours[2]));
		}
	}
	hitObjectRenderer.loadSkin(Assets);
	hitObjectRenderer.loadBuffers(hitCircleColourBuffers, approachCircleColourBuffers);
	hitObjectRenderer.loadDifficultyDetails({
		ARTime: Formulas.AR(mapData.ApproachRate, playDetails.mods),
		ARFadeIn: Formulas.ARFadeIn(mapData.ApproachRate, playDetails.mods),
		/* Map from osu!pixels to screen pixels */
		circleDiameter: Utils.map(Formulas.CS(mapData.CircleSize, playDetails.mods) * 2, 0, 512, 0, window.innerHeight * PLAYFIELD_ACTUAL_SIZE * (4 / 3)),
		ODTime: Formulas.ODHitWindow(mapData.OverallDifficulty, playDetails.mods)
	});
	hitObjectRenderer.loadModDetails(playDetails.mods);
	hitObjectRenderer.loadOptions(Options.get());
	isGameRunning = true;
}
export function isRunning() {
	return isGameRunning;
}