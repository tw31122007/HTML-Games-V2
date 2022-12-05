/* used https://github.com/Francesco149/ojsama by https://github.com/Francesco149 */
import * as Formulas from "./formulas.js"
const STAR_RATING_VERSION = 2;
const HARD_ROCK_MULTIPLIER = 1.4;
const HARD_ROCK_CS_MULTIPLIER = 1.3;
const EASY_MULTIPLIER = 0.5;
const SINGLE_SPACING = 125.0;
const CIRCLESIZE_BUFF_THRESHOLD = 30;
const STRAIN_STEP = 400;
const DECAY_BASE = {
	SPEED: 0.3,
	AIM: 0.15,
};
const WEIGHT_SCALING = {
	SPEED: 1400,
	AIM: 26.25,
};
const DECAY_WEIGHT = 0.9;
/* ~200BPM 1/4 streams */
let MIN_SPEED_BONUS = 75;
const ANGLE_BONUS_SCALE = 90;
const AIM_TIMING_THRESHOLD = 107;
const SPEED_ANGLE_BONUS_BEGIN = 5 * Math.PI / 6;
const AIM_ANGLE_BONUS_BEGIN = Math.PI / 3;
const STAR_SCALING_FACTOR = 0.0675;
class BeatmapStats {
	constructor(ar, od, hp, cs) {
		this.ApproachRate = ar;
		this.OverallDifficulty = od;
		this.HPDrainRate = hp;
		this.CircleSize = cs;
		this.speedMultiplier = 1;
	}
	multiply(key, multiplier) {
		this[key] *= multiplier;
		if (this[key] > 10) {
			this[key] = 10;
		}
	}
}
class BeatmapStatsCache {
	constructor(beatmap) {
		/* NM for nomod */
		this.NM = new BeatmapStats(beatmap.ApproachRate, beatmap.OverallDifficulty, beatmap.HPDrainRate, beatmap.CircleSize);
	}
	calculateForMods(mods) {
		let key = Formulas.toCalculatingShorthand(mods);
		if (this[key]) {
			return this[key];
		}
		let newStats = new BeatmapStats(this.NM.od, this.NM.hp, this.NM.ar, this.NM.cs);
		if (mods.hardRock) {
			newStats.multiply("ApproachRate", HARD_ROCK_MULTIPLIER);
			newStats.multiply("OverallDifficulty", HARD_ROCK_MULTIPLIER);
			newStats.multiply("HPDrainRate", HARD_ROCK_MULTIPLIER);
			newStats.multiply("CircleSize", HARD_ROCK_CS_MULTIPLIER);
		}
		if (mods.easy) {
			newStats.multiply("ApproachRate", EASY_MULTIPLIER);
			newStats.multiply("OverallDifficulty", EASY_MULTIPLIER);
			newStats.multiply("HPDrainRate", EASY_MULTIPLIER);
			newStats.multiply("CircleSize", EASY_MULTIPLIER);
		}
		if (mods.halfTime) {
			newStats.multiply("speedMultiplier", 0.75);
		}
		if (mods.doubleTime || mods.nightcore) {
			newStats.multiply("speedMultiplier", 1.5);
		}
		this[key] = newStats;
		return this[key];
	}
}

function vectorMultiply(a, b) {
	return [a[0] * b[0], a[1] * b[1]];
}

function vectorSubtract(a, b) {
	return [a[0] - b[0], a[1] - b[1]];
}

function vectorLength(v) {
	return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

function vectorDot(a, b) {
	return a[0] * b[0] + a[1] * b[1];
}

function vectorDet(a, b) {
	return a[0] * b[1] - a[1] * b[0];
}

function normaliseCircleSize(circleSize) {
	let radius = (512 / 16) * (1 - 0.7 * (circleSize - 5) / 5);
	let scalingFactor = 52 / radius;
	// high circlesize (small circles) bonus
	if (radius < CIRCLESIZE_BUFF_THRESHOLD) {
		scalingFactor *= 1 + Math.min(CIRCLESIZE_BUFF_THRESHOLD - radius, 5) / 50;
	}
	return [scalingFactor, scalingFactor];
}

function initialiseObjects(beatmap) {
	let objectDifficulties = [];
	let circleSizeScalingVector = normaliseCircleSize(beatmap.CircleSize);
	let normalisedCenterVector = vectorMultiply([256, 192], circleSizeScalingVector);
	for (let i = 0; i < beatmap.hitObjects.length; i++) {
		let objectDifficulty;
		try {
			objectDifficulty = new hitObjectDifficulty(JSON.parse(JSON.stringify(beatmap.hitObjects[i])));
		} catch (e) {
			console.log(i);
			console.log(beatmap);
			console.log(beatmap.hitObjects[i]);
			throw new Error(e);
		}
		let baseObject = objectDifficulty.baseObject;
		/* spinner */
		if (baseObject.type[3] === "1") {
			objectDifficulty.normpos = normalisedCenterVector.slice();
		} else {
			objectDifficulty.normpos = vectorMultiply([baseObject.x, baseObject.y], circleSizeScalingVector);
		}
		if (i >= 2) {
			let prev1 = objectDifficulties[i - 1];
			let prev2 = objectDifficulties[i - 2];
			let v1 = vectorSubtract(prev2.normpos, prev1.normpos);
			let v2 = vectorSubtract(objectDifficulty.normpos, prev1.normpos);
			let dot = vectorDot(v1, v2);
			let det = vectorDet(v1, v2);
			objectDifficulty.angle = Math.abs(Math.atan2(det, dot));
		} else {
			objectDifficulty.angle = null;
		}
		objectDifficulties.push(objectDifficulty);
	}
	return objectDifficulties;
}
class hitObjectDifficulty {
	constructor(object) {
		this.baseObject = object;
		/* convert to milliseconds */
		this.baseObject.time *= 1000;
		this.strains = {
			AIM: 0,
			SPEED: 0,
		};
		this.normpos = [0, 0];
		this.angle = 0;
		this.isSingle = false;
		this.deltaTime = 0;
		this.dDistance = 0;
	}
}

function calculateStrain(type, objectDifficulty, previousObjectDifficulty, speedMultiplier) {
	let baseObject = objectDifficulty.baseObject;
	let previousBaseObject = previousObjectDifficulty.baseObject;
	let value = 0;
	let timeElapsed = (baseObject.time - previousBaseObject.time) / speedMultiplier;
	let decay = Math.pow(DECAY_BASE[type], timeElapsed / 1000);
	objectDifficulty.deltaTime = timeElapsed;
	if (baseObject.type[3] !== "1") {
		let distance = vectorLength(vectorSubtract(objectDifficulty.normpos, previousObjectDifficulty.normpos));
		objectDifficulty.dDistance = distance;
		if (type === "SPEED") {
			objectDifficulty.isSingle = distance > SINGLE_SPACING;
		}
		value = spacingWeight(type, distance, timeElapsed, previousObjectDifficulty.dDistance, previousObjectDifficulty.deltaTime, objectDifficulty.angle);
		value *= WEIGHT_SCALING[type];
	}
	objectDifficulty.strains[type] = previousObjectDifficulty.strains[type] * decay + value;
}

function spacingWeight(type, distance, deltaTime, previousDistance, previousDeltaTime, angle) {
	let angleBonus;
	let strain_time = Math.max(deltaTime, 50);
	switch (type) {
		case "AIM": {
			let prev_strain_time = Math.max(previousDeltaTime, 50);
			let result = 0;
			if (angle !== null && angle > AIM_ANGLE_BONUS_BEGIN) {
				angleBonus = Math.sqrt(Math.max(previousDistance - ANGLE_BONUS_SCALE, 0) * Math.pow(Math.sin(angle - AIM_ANGLE_BONUS_BEGIN), 2) * Math.max(distance - ANGLE_BONUS_SCALE, 0));
				result = 1.5 * Math.pow(Math.max(0, angleBonus), 0.99) / Math.max(AIM_TIMING_THRESHOLD, prev_strain_time);
			}
			let weightedDistance = Math.pow(distance, 0.99);
			return Math.max(result + weightedDistance / Math.max(AIM_TIMING_THRESHOLD, strain_time), weightedDistance / strain_time);
		}
		case "SPEED": {
			distance = Math.min(distance, SINGLE_SPACING);
			let speedBonus = 1;
			if (deltaTime < MIN_SPEED_BONUS) {
				speedBonus += Math.pow((MIN_SPEED_BONUS - deltaTime) / 40, 2);
			}
			angleBonus = 1;
			if (angle !== null && angle < SPEED_ANGLE_BONUS_BEGIN) {
				let s = Math.sin(1.5 * (SPEED_ANGLE_BONUS_BEGIN - angle));
				angleBonus += Math.pow(s, 2) / 3.57;
				if (angle < Math.PI / 2) {
					angleBonus = 1.28;
					if (distance < ANGLE_BONUS_SCALE && angle < Math.PI / 4) {
						angleBonus += (1 - angleBonus) * Math.min((ANGLE_BONUS_SCALE - distance) / 10, 1);
					} else if (distance < ANGLE_BONUS_SCALE) {
						angleBonus += (1 - angleBonus) * Math.min((ANGLE_BONUS_SCALE - distance) / 10, 1) * Math.sin((Math.PI / 2 - angle) * 4 / Math.PI);
					}
				}
			}
			return (1 + (speedBonus - 1) * 0.75) * angleBonus * (0.95 + speedBonus * Math.pow(distance / SINGLE_SPACING, 3.5)) / strain_time;
		}
	}
}

function calculateDifficulty(type, objectDifficulties, speedMultiplier) {
	let strains = [];
	let strainStep = STRAIN_STEP * speedMultiplier;
	let intervalEnd = Math.ceil(objectDifficulties[0].baseObject.time / strainStep) * strainStep;
	let maxStrain = 0;
	for (let i = 0; i < objectDifficulties.length; i++) {
		if (i > 0) {
			calculateStrain(type, objectDifficulties[i], objectDifficulties[i - 1], speedMultiplier);
		}
		while (objectDifficulties[i].baseObject.time > intervalEnd) {
			strains.push(Math.round(maxStrain));
			if (i > 0) {
				let decay = Math.pow(DECAY_BASE[type], (intervalEnd - objectDifficulties[i - 1].baseObject.time) / 1000);
				maxStrain = objectDifficulties[i - 1].strains[type] * decay;
			} else {
				maxStrain = 0;
			}
			intervalEnd += strainStep;
		}
		maxStrain = Math.max(maxStrain, objectDifficulties[i].strains[type]);
	}
	strains.push(Math.round(maxStrain));
	let weight = 1;
	let total = 0;
	let difficulty = 0;
	strains.sort(function(a, b) {
		return b - a;
	});
	for (let i = 0; i < strains.length; i++) {
		total += Math.pow(strains[i], 1.2);
		difficulty += strains[i] * weight;
		weight *= DECAY_WEIGHT;
	}
	return difficulty;
}

/* initial version */
if (window.localStorage.getItem("starRatingVersion") === null) {
	window.localStorage.setItem("starRatingVersion", 1);
}

export function version() {
	return STAR_RATING_VERSION;
}
export function calculate(beatmap, mods) {
	let baseStats = new BeatmapStatsCache(beatmap);
	let stats = baseStats.calculateForMods(mods);
	let objectDifficulties = initialiseObjects(beatmap);
	let speed = Math.sqrt(calculateDifficulty("SPEED", objectDifficulties, stats.speedMultiplier)) * STAR_SCALING_FACTOR;
	let aim = Math.sqrt(calculateDifficulty("AIM", objectDifficulties, stats.speedMultiplier)) * STAR_SCALING_FACTOR;
	return Math.cbrt(4 * (Math.pow(aim, 3) + Math.pow(speed, 3)));
}