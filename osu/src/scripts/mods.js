/* FIXME: improve structure */
let incompatibilities = {
	"easy": ["hardRock"],
	"noFail": ["suddenDeath", "perfect", "relax", "autopilot"],
	"halfTime": ["doubleTime", "nightcore"],

	"hardRock": ["easy"],
	"suddenDeath": ["noFail", "perfect", "relax", "autopilot", "auto"],
	"perfect": ["noFail", "suddenDeath", "relax", "autopilot", "auto"],
	"doubleTime": ["nightcore", "halfTime"],
	"nightcore": ["doubleTime", "halfTime"],
	"hidden": [],
	"flashlight": [],

	"relax": ["noFail", "suddenDeath", "perfect", "autopilot", "auto"],
	"autopilot": ["noFail", "suddenDeath", "perfect", "relax", "auto", "spunOut"],
	"spunOut": ["autoPilot"],
	"auto": ["suddenDeath", "perfect", "relax", "autopilot", "spunOut"],
	"scoreV2": [],
};
export class Mods {
	constructor(easy = false, noFail = false, halfTime = false, hardRock = false, suddenDeath = false, perfect = false, doubleTime = false, nightcore = false, hidden = false, flashlight = false, relax = false, autopilot = false, spunOut = false, auto = false, scoreV2 = false) {
		/* difficulty reduction */
		this.easy = easy;
		this.noFail = noFail;
		this.halfTime = halfTime;
		/* difficulty increases */
		this.hardRock = hardRock;
		this.suddenDeath = suddenDeath;
		this.perfect = perfect;
		this.doubleTime = doubleTime;
		this.nightcore = nightcore;
		this.hidden = hidden;
		this.flashlight = flashlight;
		/* special */
		this.relax = relax;
		this.autopilot = autopilot;
		this.spunOut = spunOut;
		this.auto = auto;
		this.scoreV2 = scoreV2;
	}
	enableMod(name) {
		let incompatibleMods = incompatibilities[name];
		for (let i = 0; i < incompatibleMods.length; i++) {
			this.disableMod(incompatibleMods[i])
		}
		this[name] = true;
	}
	disableMod(name) {
		this[name] = false;
	}
};