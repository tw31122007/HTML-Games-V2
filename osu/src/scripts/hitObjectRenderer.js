import * as Utils from "./utils.js";

const APPROACH_CIRCLE_MAX_SIZE = 4;
const APPROACH_CIRCLE_MIN_SIZE = 1;
const HIDDEN_FADE_IN_PERCENT = 0.4;
const HIDDEN_FADE_OUT_PERCENT = 0.7;
const PLAYFIELD_ACTUAL_SIZE = 0.8;
const FOLLOW_CIRCLE_SIZE = 2;
/* Playfield calculations and data */
let playfieldXOffset = 0;
let playfieldYOffset = window.innerHeight / 50;
let HIT_OBJECT_OFFSET_X = playfieldXOffset + window.innerWidth / 2 - window.innerHeight * PLAYFIELD_ACTUAL_SIZE * (4 / 3) / 2;
let HIT_OBJECT_OFFSET_Y = playfieldYOffset + window.innerHeight / 2 - window.innerHeight * PLAYFIELD_ACTUAL_SIZE / 2;
const SLIDER_STROKE_SIZE_PERCENT = 0.9;
const SLIDER_BODY_SIZE_PERCENT = 0.8;



export class HitObjectRenderer {
	constructor(canvas) {
		this.skinAssets = {};
		this.hitCircleColourBuffers = [];
		this.approachCircleColourBuffers = [];
		this.canvas = canvas;
		this.difficultyDetails = {};
		this.modDetails = {};
    this.options = {};
	}
	loadOptions(options) {
		this.options = options;
	}
	loadSkin(skin) {
		this.skinAssets = skin;
	}
	loadBuffers(comboColourBuffer, approachBuffer) {
		this.hitCircleColourBuffers = comboColourBuffer;
		this.approachCircleColourBuffers = approachBuffer;
	}
	loadDifficultyDetails(difficultyDetails) {
		this.difficultyDetails = difficultyDetails;
	}
	loadModDetails(modDetails) {
		this.modDetails = modDetails;
	}
	calculateApproachCircle(hitObject, time) {
		/* Approach Circle Calculations */
		let approachCircleSize = Utils.map(time - (hitObject.time - this.difficultyDetails.ARTime), 0, this.difficultyDetails.ARTime, APPROACH_CIRCLE_MAX_SIZE, APPROACH_CIRCLE_MIN_SIZE);
		/* approach circle max size */
		approachCircleSize = Math.min(approachCircleSize, APPROACH_CIRCLE_MAX_SIZE);
		/* approach circle min size */
		approachCircleSize = Math.max(approachCircleSize, APPROACH_CIRCLE_MIN_SIZE);

		return approachCircleSize;
	}
	calculateAlpha(hitObject, time) {
		let mappedTime = Utils.map(time - (hitObject.time - this.difficultyDetails.ARTime), 0, this.difficultyDetails.ARTime, 0, 1);
		if (hitObject.type[0] === "1") {
			if (this.modDetails.hidden) {
				/* hidden fade in and out for hit circle */
				if (mappedTime <= HIDDEN_FADE_IN_PERCENT) {
					return Utils.map(time - (hitObject.time - this.difficultyDetails.ARTime), 0, this.difficultyDetails.ARTime * HIDDEN_FADE_IN_PERCENT, 0, 1);
				} else if (mappedTime <= HIDDEN_FADE_OUT_PERCENT) {
					return Utils.map(time - (hitObject.time - this.difficultyDetails.ARTime), this.difficultyDetails.ARTime * HIDDEN_FADE_IN_PERCENT, this.difficultyDetails.ARTime * HIDDEN_FADE_OUT_PERCENT, 1, 0);
				} else {
					return 0;
				}
			} else {
				/* normal fade in and out for hit circle */
				if (mappedTime <= 1) {
					return Utils.map(time - (hitObject.time - this.difficultyDetails.ARTime), 0, this.difficultyDetails.ARFadeIn, 0, 1);
				} else {
					let alpha = Utils.map(time - (hitObject.time - this.difficultyDetails.ARTime), this.difficultyDetails.ARTime, this.difficultyDetails.ARTime + this.difficultyDetails.ODTime[0] / 2, 1, 0);
					return Math.max(alpha, 0);
				}
			}
		} else if (hitObject.type[1] === "1") {
			if (mappedTime <= 1) {
				return Utils.map(time - (hitObject.time - this.difficultyDetails.ARTime), 0, this.difficultyDetails.ARFadeIn, 0, 1);
			} else {
				return 1;
			}
		}
		return 0.5;
	}
	renderHitObject(hitObject, time) {
		this.canvas.setGlobalAlpha(1);
		if (hitObject.type[0] === "1") {
			this.renderHitCircle(hitObject, time);
		} else if (hitObject.type[1] === "1") {
			this.renderSlider(hitObject, time);
		} else if (hitObject.type[3] === "1") {
			this.renderSpinner(hitObject, time);
		}		
	}
	renderHitCircle(hitObject, time) {
		let alpha = this.calculateAlpha(hitObject, time);
		this.canvas.setGlobalAlpha(alpha);
		let approachCircleSize = this.calculateApproachCircle(hitObject, time);
		let hitObjectMapped = Utils.mapToOsuPixels(hitObject.x, hitObject.y, this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE * (4 / 3), this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, this.modDetails.hardRock);
		/* Draw hit circle */
		this.canvas.drawImage(this.hitCircleColourBuffers[hitObject.cache.comboColour], hitObjectMapped.x, hitObjectMapped.y, this.difficultyDetails.circleDiameter, this.difficultyDetails.circleDiameter);
		this.canvas.drawImage(this.skinAssets.hitCircleOverlay, hitObjectMapped.x, hitObjectMapped.y, this.difficultyDetails.circleDiameter, this.difficultyDetails.circleDiameter);
		if (this.modDetails.hidden === false) {
			this.canvas.drawImage(this.approachCircleColourBuffers[hitObject.cache.comboColour], hitObjectMapped.x, hitObjectMapped.y, this.difficultyDetails.circleDiameter * approachCircleSize, this.difficultyDetails.circleDiameter * approachCircleSize);
		}
		let individualDigits = hitObject.cache.comboNumber.toString();
		let aspectRatio = this.skinAssets.comboNumbers[0].width / this.skinAssets.comboNumbers[0].height;
		this.canvas.drawDigits(this.skinAssets.comboNumbers, individualDigits, hitObjectMapped.x, hitObjectMapped.y, this.difficultyDetails.circleDiameter / 4, this.difficultyDetails.circleDiameter / (4 * aspectRatio));
	}
	renderSlider(hitObject, time) {
		let alpha = this.calculateAlpha(hitObject, time);
		this.canvas.setGlobalAlpha(alpha);
		let approachCircleSize = this.calculateApproachCircle(hitObject, time);
		let hitObjectMapped = Utils.mapToOsuPixels(hitObject.x, hitObject.y, this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE * (4 / 3), this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, this.modDetails.hardRock);


		/* Draw Slider */
		/* Slider slide in code */
		let sliderDrawPercent = Math.floor(Utils.map(time, hitObject.time - this.difficultyDetails.ARTime, hitObject.time - this.difficultyDetails.ARTime / 4, hitObject.cache.points.length / 4, hitObject.cache.points.length));
		if (sliderDrawPercent < Math.floor(hitObject.cache.points.length / 4)) {
			sliderDrawPercent = Math.floor(hitObject.cache.points.length / 4);
		}
		if (sliderDrawPercent > hitObject.cache.points.length - 1 || this.options.Gameplay.snakingSlidersIn === false) {
			sliderDrawPercent = hitObject.cache.points.length - 1;
		}
		/* 2 ** 4x */
		let inc = Math.pow(2, 4 * this.options.Performance.sliderResolution);
		if (sliderDrawPercent <= inc) {
			inc = 1;
		}
		/* Slider Curve calculated the at the hitobject time - ar time */
		this.canvas.context.lineCap = "round";
		this.canvas.context.lineJoin = "round";
		/* Draw Outer Slider Body */
		this.canvas.context.lineWidth = this.difficultyDetails.circleDiameter * SLIDER_STROKE_SIZE_PERCENT;
		this.canvas.setStrokeStyle("#fff");
		this.canvas.context.beginPath();
		for (let j = 0; j < sliderDrawPercent; j += inc) {
			let mapped = Utils.mapToOsuPixels(hitObject.cache.points[j].x, hitObject.cache.points[j].y, this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE * (4 / 3), this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, this.modDetails.hardRock);
			this.canvas.context.lineTo(mapped.x, mapped.y);
		}
		/* draw last point to make sure slider ends properly */
		let mapped = Utils.mapToOsuPixels(hitObject.cache.points[sliderDrawPercent].x, hitObject.cache.points[sliderDrawPercent].y, this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE * (4 / 3), this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, this.modDetails.hardRock);
		this.canvas.context.lineTo(mapped.x, mapped.y);
		this.canvas.context.stroke();
		/* Draw Inner Slider Body */
		this.canvas.context.lineWidth = this.difficultyDetails.circleDiameter * SLIDER_BODY_SIZE_PERCENT;
		this.canvas.setStrokeStyle("#222");
		this.canvas.context.beginPath();
		for (let j = 0; j < sliderDrawPercent; j += inc) {
			let mapped = Utils.mapToOsuPixels(hitObject.cache.points[j].x, hitObject.cache.points[j].y, this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE * (4 / 3), this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, this.modDetails.hardRock);
			this.canvas.context.lineTo(mapped.x, mapped.y);
		}
		/* draw last point to make sure slider ends properly */
		this.canvas.context.lineTo(mapped.x, mapped.y);
		this.canvas.context.stroke();
		/* Draw Slider Ticks */
		if (hitObject.cache.totalTicks >= 1 && hitObject.cache.specificSliderTicksPosition[hitObject.cache.currentSlide]) {
			for (let j = 0; j < hitObject.cache.specificSliderTicksPosition[hitObject.cache.currentSlide].length; j++) {
				if (hitObject.cache.specificSliderTicksHit[hitObject.cache.currentSlide][j]) {
					continue;
				}
				let mapped = Utils.mapToOsuPixels(hitObject.cache.points[hitObject.cache.specificSliderTicksPosition[hitObject.cache.currentSlide][j]].x, hitObject.cache.points[hitObject.cache.specificSliderTicksPosition[hitObject.cache.currentSlide][j]].y, this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE * (4 / 3), this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, this.modDetails.hardRock);
				this.canvas.drawImage(this.skinAssets.sliderScorePoint, mapped.x, mapped.y);
			}
		}
		let elements = Utils.generateSliderElements(hitObject.slides);

		/* draw tail, determine whether or not to draw reverse arrow */
		if (elements.tail[Utils.elementIndex(hitObject.cache.currentSlide, "tail")] === "normal") {
			this.canvas.drawImage(this.hitCircleColourBuffers[hitObject.cache.comboColour], mapped.x, mapped.y, this.difficultyDetails.circleDiameter, this.difficultyDetails.circleDiameter);
			this.canvas.drawImage(this.skinAssets.hitCircleOverlay, mapped.x, mapped.y, this.difficultyDetails.circleDiameter, this.difficultyDetails.circleDiameter);
		} else if (elements.tail[Utils.elementIndex(hitObject.cache.currentSlide, "tail")] === "repeat") {
			this.canvas.context.translate(mapped.x, mapped.y);
			let direction = Utils.direction(hitObject.cache.points[hitObject.cache.points.length - 2].x, hitObject.cache.points[hitObject.cache.points.length - 2].y, hitObject.cache.points[hitObject.cache.points.length - 1].x, hitObject.cache.points[hitObject.cache.points.length - 1].y) - Math.PI / 2;
			if (this.modDetails.hardRock) {
				this.canvas.context.rotate(direction);
			} else {
				this.canvas.context.rotate(-direction);
			}
			this.canvas.drawImage(this.hitCircleColourBuffers[hitObject.cache.comboColour], 0, 0, this.difficultyDetails.circleDiameter, this.difficultyDetails.circleDiameter);
			this.canvas.drawImage(this.skinAssets.reverseArrow, 0, 0, this.difficultyDetails.circleDiameter, this.difficultyDetails.circleDiameter);
			this.canvas.context.resetTransform();
		}
		/* draw head, determine whether or not to draw reverse arrow */
		if (elements.head[Utils.elementIndex(hitObject.cache.currentSlide, "head")] === "normal" || (hitObject.cache.hitHead === false && hitObject.cache.currentSlide === 0)) {
			this.canvas.drawImage(this.hitCircleColourBuffers[hitObject.cache.comboColour], hitObjectMapped.x, hitObjectMapped.y, this.difficultyDetails.circleDiameter, this.difficultyDetails.circleDiameter);
			this.canvas.drawImage(this.skinAssets.hitCircleOverlay, hitObjectMapped.x, hitObjectMapped.y, this.difficultyDetails.circleDiameter, this.difficultyDetails.circleDiameter);
			if (hitObject.cache.currentSlide === 0) {
				if (this.modDetails.hidden === false) {
					this.canvas.drawImage(this.approachCircleColourBuffers[hitObject.cache.comboColour], hitObjectMapped.x, hitObjectMapped.y, this.difficultyDetails.circleDiameter * approachCircleSize, this.difficultyDetails.circleDiameter * approachCircleSize);
				}
				let individualDigits = hitObject.cache.comboNumber.toString();
				let aspectRatio = this.skinAssets.comboNumbers[0].width / this.skinAssets.comboNumbers[0].height;
				this.canvas.drawDigits(this.skinAssets.comboNumbers, individualDigits, hitObjectMapped.x, hitObjectMapped.y, this.difficultyDetails.circleDiameter / 4, this.difficultyDetails.circleDiameter / (4 * aspectRatio));
			}
		} else if (elements.head[Utils.elementIndex(hitObject.cache.currentSlide, "head")] === "repeat") {
			let mapped = Utils.mapToOsuPixels(hitObject.cache.points[0].x, hitObject.cache.points[0].y, this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE * (4 / 3), this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, this.modDetails.hardRock);
			this.canvas.context.translate(mapped.x, mapped.y);
			let direction = Utils.direction(hitObject.cache.points[1].x, hitObject.cache.points[1].y, hitObject.cache.points[0].x, hitObject.cache.points[0].y) - Math.PI / 2;
			if (this.modDetails.hardRock) {
				this.canvas.context.rotate(direction);
			} else {
				this.canvas.context.rotate(-direction);
			}
			this.canvas.drawImage(this.hitCircleColourBuffers[hitObject.cache.comboColour], 0, 0, this.difficultyDetails.circleDiameter, this.difficultyDetails.circleDiameter);
			this.canvas.drawImage(this.skinAssets.reverseArrow, 0, 0, this.difficultyDetails.circleDiameter, this.difficultyDetails.circleDiameter);
			this.canvas.context.resetTransform();
		}
		if (time >= hitObject.time) {
			let mapped = Utils.mapToOsuPixels(hitObject.cache.points[hitObject.cache.sliderFollowCirclePosition].x, hitObject.cache.points[hitObject.cache.sliderFollowCirclePosition].y, this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE * (4 / 3), this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, this.modDetails.hardRock);
			let tempAlpha = this.canvas.getGlobalAlpha();
			this.canvas.setGlobalAlpha(1);
			this.canvas.drawImage(this.skinAssets.sliderBody, mapped.x, mapped.y, this.difficultyDetails.circleDiameter, this.difficultyDetails.circleDiameter);
			if (hitObject.cache.onFollowCircle) {
				this.canvas.drawImage(this.skinAssets.sliderFollowCircle, mapped.x, mapped.y, this.difficultyDetails.circleDiameter * FOLLOW_CIRCLE_SIZE * hitObject.cache.sliderFollowCircleSize, this.difficultyDetails.circleDiameter * FOLLOW_CIRCLE_SIZE * hitObject.cache.sliderFollowCircleSize);
			}
			this.canvas.setGlobalAlpha(tempAlpha);
		}

	}
	renderSpinner(hitObject, time) {
		let alpha = this.calculateAlpha(hitObject, time);
		this.canvas.setGlobalAlpha(alpha);

		if (hitObject.cache.cleared) {
			this.canvas.drawImage(this.skinAssets.spinnerClear, this.canvas.canvas.width / 2, this.canvas.canvas.height / 4);
			let individualDigits = (hitObject.cache.bonusSpins * 1000).toString();
			let aspectRatio = this.skinAssets.scoreNumbers[0].width / this.skinAssets.scoreNumbers[0].height;
			this.canvas.drawDigits(this.skinAssets.scoreNumbers, individualDigits, this.canvas.canvas.width / 2, this.canvas.canvas.height * 3 / 4, this.canvas.canvas.width * 0.03 * (hitObject.cache.size + 1), this.canvas.canvas.width * 0.03 * (hitObject.cache.size + 1) / aspectRatio);
		}
		/* draw spinner */
		let mapped = Utils.mapToOsuPixels(hitObject.x, hitObject.y, this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE * (4 / 3), this.canvas.canvas.height * PLAYFIELD_ACTUAL_SIZE, HIT_OBJECT_OFFSET_X, HIT_OBJECT_OFFSET_Y, this.modDetails.hardRock);
		this.canvas.context.translate(mapped.x, mapped.y);
		this.canvas.context.rotate(hitObject.cache.spinAngle);
		let size = Utils.map(hitObject.endTime - time, 0, hitObject.endTime - (hitObject.time - this.difficultyDetails.ARTime), 0, 0.8) * Utils.map(Math.abs(hitObject.cache.velocity), 0, 50, 1, 1.2);
		this.canvas.drawImage(this.skinAssets.spinnerApproachCircle, 0, 0, size * this.canvas.canvas.height, size * this.canvas.canvas.height);
		let tempAlpha = this.canvas.context.globalAlpha;
		this.canvas.setGlobalAlpha(1);
		this.canvas.drawImage(this.skinAssets.spinnerTop, 0, 0, 0.2 * this.canvas.canvas.height, 0.2 * this.canvas.canvas.height);
		this.canvas.setGlobalAlpha(tempAlpha);
		this.canvas.context.resetTransform();
	}
}