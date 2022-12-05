import {Mods} from "./mods.js"
import * as ReplayManager from "./replayManager.js"
export class PlayDetails {
	constructor(mapIdentifier, mods = new Mods()) {
		this.mapIdentifier = mapIdentifier;
		this.title = "";
		this.creator = "";
		this.artist = "";
		this.version = "";
		this.score = 0;
		this.maxCombo = 0;
		this.comboType = "";
		this.unstableRate = 0;
		this.performancePoints = 0;
		this.great = 0;
		this.ok = 0;
		this.meh = 0;
		this.miss = 0;
		this.comboBreaks = 0;
		this.sliderBreaks = 0;
		this.mods = mods;
		this.datePlayed = "";
		this.replay = new ReplayManager.Replay();
	}
};