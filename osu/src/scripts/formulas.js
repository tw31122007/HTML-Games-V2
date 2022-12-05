import {Mods} from "./mods.js"
// const toShorthand = {
// 	/* difficulty reduction */
// 	easy: "EZ",
// 	noFail: "NF",
// 	halfTime: "HT",
// 	/* difficulty increases */
// 	hardRock: "HR",
// 	suddenDeath: "SD",
// 	perfect: "PF",
// 	doubleTime: "DT",
// 	nightcore: "NC",
// 	hidden: "HD",
// 	flashlight: "FL",
// 	/* special */
// 	relax: "RX",
// 	autopilot: "AP",
// 	spunOut: "SO",
// 	auto: "AT",
// 	scoreV2: "V2",
// };
// const toLonghand = {
// 	/* difficulty reduction */
// 	EZ: "easy",
// 	NF: "noFail",
// 	HT: "halfTime",
// 	/* difficulty increases */
// 	HR: "hardRock",
// 	SD: "suddenDeath",
// 	PF: "perfect",
// 	DT: "doubleTime",
// 	NC: "nightcore",
// 	HD: "hidden",
// 	FL: "flashlight",
// 	/* special */
// 	RX: "relax",
// 	AP: "autopilot",
// 	SO: "spunOut",
// 	AT: "auto",
// 	V2: "scoreV2",
// };
class ModMultiplier {
	constructor(name, multiplier) {
		this.multipliers = {};
	}
	addMultiplier(name, value) {
		this.multipliers[name] = value;
	}
	getMultiplier(name) {
		return this.multipliers[name];
	}
}
let modMultipliers = new ModMultiplier();
modMultipliers.addMultiplier("easy", 0.5);
modMultipliers.addMultiplier("noFail", 0.5);
modMultipliers.addMultiplier("halfTime", 0.3);
modMultipliers.addMultiplier("hardRock", 1.06);
modMultipliers.addMultiplier("suddenDeath", 1);
modMultipliers.addMultiplier("perfect", 1);
modMultipliers.addMultiplier("doubleTime", 1.12);
modMultipliers.addMultiplier("nightcore", 1.12);
modMultipliers.addMultiplier("hidden", 1.06);
modMultipliers.addMultiplier("flashlight", 1.12);
modMultipliers.addMultiplier("relax", 0);
modMultipliers.addMultiplier("autopilot", 0);
modMultipliers.addMultiplier("spunOut", 0.9);
modMultipliers.addMultiplier("auto", 1);
modMultipliers.addMultiplier("scoreV2", 0);
class ObjectCounts {
	constructor() {
		this.circles = 0;
		this.sliders = 0;
		this.spinners = 0;
	}
}
function clamp(value, min, max) {
	if (value < min) {
		return min;
	} else if (value > max) {
		return max;
	}
	return value;
}
export function applyModMultiplier(n, mods, multiplier) {
	if (mods) {
		if (mods.easy) {
			n *= 0.5;
		}
		if (mods.hardRock) {
			n *= multiplier;
			if (n >= 10) {
				n = 10;
			}
		}
	}
	return n;
}
export function AR(n, mods) {
	n = applyModMultiplier(n, mods, 1.4);
	if (n < 5) {
		return 1.2 + 0.6 * (5 - n) / 5;
	} else if (n === 5) {
		return 1.2;
	} else if (n > 5) {
		return 1.2 - 0.75 * (n - 5) / 5;
	}
}
export function msToAR(n) {
	let ar;
	if (n > 1.2) {
		ar = -(5 * (n - 1.2)) / 0.6 + 5;
	} else if (n === 1.2) {
		ar = 5;
	} else if (n < 1.2) {
		ar = -(5 * (n - 1.2)) / 0.75 + 5;
	}
	if (ar > -Number.EPSILON * 10 && ar < Number.EPSILON * 10) {
		ar = 0;
	}
	return ar;
}
export function ARFadeIn(n, mods) {
	n = applyModMultiplier(n, mods, 1.4);
	let ar;
	if (n < 5) {
		ar = 0.8 + 0.4 * (5 - n) / 5;
	} else if (n === 5) {
		ar = 0.8;
	} else if (n > 5) {
		ar = 0.8 - 0.5 * (n - 5) / 5;
	}
	return ar;
}
export function CS(n, mods) {
	n = applyModMultiplier(n, mods, 1.3);
	return (512 / 16) * (1 - 0.7 * (n - 5) / 5);
}
/* values for hit windows (centered around hit object time for 50, 100, 300) */
export function ODHitWindow(n, mods) {
	n = applyModMultiplier(n, mods, 1.4);
	/* in order 50, 100, 300 */
	return [
		0.4 - 0.02 * n,
		0.28 - 0.016 * n,
		0.16 - 0.012 * n,
	];
}
/* measured in spins per second required for clear */
export function ODSpinner(n, mods) {
	n = applyModMultiplier(n, mods, 1.4);
	let od;
	if (n < 5) {
		od = 5 - 2 * (5 - n) / 5;
	} else if (n === 5) {
		od = 5;
	} else if (n > 5) {
		od = 5 + 2.5 * (n - 5) / 5;
	}
	return od;
}
/* Natural HP drain */
export function HPDrain(n, time) {
	if (time === 0) {
		return 0;
	}
	return (time / 500) * (100 / (11 - n));
}
export function HP(n, hitScore, type, mod) {
	if (mod.suddenDeath && hitScore === 0) {
		return -1;
	}
	if (mod.perfect && hitScore != 300 && type === "hit-circle") {
		return -1;
	}
	switch (hitScore) {
		/* slider bonus spin */
		case 1100:
			return 0.025;
			break;
		/* great */
		case 300:
			return 0.5 / ((n / 4) + 1);
			break;
		/* good or spinner spin */
		case 100:
			if (type === "hit-circle") {
				return 0.2 / ((n / 4) + 1);
			} else {
				return 0.01;
			}
			break;
		/* meh */
		case 50:
			return 0;
			break;
		/* complete miss */
		case 0:
			return -(n + 1) / 55;
			break;
		/* Slider head, repeat and end */
		case 30:
			return 0.05 / ((n / 4) + 1);
			break;
		/* Slider tick */
		case 10:
			return 0.01 / ((n / 4) + 1);
			break;
	}
}
export function beatmapDifficultyIcon(starRating) {
	if (starRating <= 1.99) {
		return "easy";
	} else if (starRating <= 2.69) {
		return "normal";
	} else if (starRating <= 3.99) {
		return "hard";
	} else if (starRating <= 5.29) {
		return "insane";
	} else if (starRating <= 6.49) {
		return "expert";
	} else {
		return "expert+";
	}
}
export function beatmapDifficultyColour(starRating) {
	if (starRating <= 1.99) {
		return "#a1b855";
	} else if (starRating <= 2.69) {
		return "#78c6d3";
	} else if (starRating <= 3.99) {
		return "#eaca65";
	} else if (starRating <= 5.29) {
		return "#e78fb8";
	} else if (starRating <= 6.49) {
		return "#9b86d8";
	} else {
		return "#515151";
	}
}
/* https://osu.ppy.sh/wiki/en/Score#scoring */
export function difficultyPoints(cs, hp, od, objectCount, drainTime) {
	return Math.round((cs + hp + od + clamp(objectCount / drainTime * 8, 0, 16)) / 38 * 5);
}
export function hitScore(hitValue, comboMultiplier, difficultyMultiplier, modMultipliers) {
	return hitValue + (hitValue * ((comboMultiplier * difficultyMultiplier * modMultipliers) / 25));
}
export function grade(great, ok, meh, miss, mods) {
	let total = great + ok + meh + miss;
	if (great >= total) {
		if (mods.hidden || mods.flashlight) {
			return "xh";
		} else {
			return "x";
		}
	} else if (great >= total * 0.9 && meh <= total * 0.01 && miss === 0) {
		if (mods.hidden || mods.flashlight) {
			return "sh";
		} else {
			return "s";
		}
	} else if ((great >= total * 0.8 && miss === 0) || great >= total * 0.9) {
		return "a";
	} else if ((great >= total * 0.7 && miss === 0) || great >= total * 0.8) {
		return "b";
	} else if (great >= total * 0.6) {
		return "c";
	} else {
		return "d";
	}
}
export function accuracy(great, ok, meh, miss) {
	let total = great + ok + meh + miss;
	if (total === 0) {
		return 1;
	}
	return (50 * meh + 100 * ok + 300 * great) / (300 * total);
}
export function sliderMultiplier(multiplier) {
	return 1 / (-multiplier / 100);
}
export function modScoreMultiplier(mods) {
	let multiplier = 1;
	for (let mod in mods) {
		if (mods.hasOwnProperty(mod) && mods[mod]) {
			multiplier *= modMultipliers.getMultiplier(mod);
		}
	}
	return multiplier;
}
export function parseShorthand(string) {
	let splitMods = string.match(/.{1,2}/g);
	let mods = new Mods();
	for (let i = 0; i < splitMods.length; i++) {
		mods[shorthandToMod(splitMods[i])] = true;
	}
	return mods;
}
export function toShorthand(mods) {
	let output = "";
	for (let mod in mods) {
		if (mods[mod] === true) {
			output += modToShorthand(mod);
		}
	}
	if (output === "") {
		return "NM";
	}
	return output;
}
export function toCalculatingShorthand(mods) {
	let output = "";
	let valuesThatDontMatter = [
		"noFail",
		"suddenDeath",
		"perfect",
		"hidden",
		"flashlighht",
		"relax",
		"autopilot",
		"spunOut",
		"auto",
		"scoreV2",
	];
	for (let mod in mods) {
		if (mods[mod] === true && valuesThatDontMatter.includes(mod) == false) {
			output += modToShorthand(mod);
		}
	}
	if (output === "") {
		return "NM";
	}
	return output;
}
export function modToShorthand(mod) {
	return toShorthand[mod];
}
export function shorthandToMod(shorthand) {
	return toLonghand[shorthand];
}
export function getObjectCount(beatmap) {
	let counts = new ObjectCounts();
	for (let i = 0; i < beatmap.hitObjects.length; i++) {
		if (beatmap.hitObjects[i].type[0] === "1") {
			counts.circles++;
		} else if (beatmap.hitObjects[i].type[1] === "1") {
			counts.sliders++;
		} else if (beatmap.hitObjects[i].type[3] === "1") {
			counts.spinners++;
		}
	}
	return counts;
}