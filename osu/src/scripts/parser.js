import * as HitObject from "./hitObjects.js"
import * as Utils from "./utils.js"
/* refer to https://osu.ppy.sh/wiki/sk/osu!_File_Formats/Osu_(file_format) */
let beatmapTypeMap = {
	/* under [General] */
	AudioFilename: "string",
	AudioLeadIn: "number",
	/* depreciated, but might as well support it */
	AudioHash: "string",
	PreviewTime: "number",
	Countdown: "number",
	SampleSet: "string",
	StackLeniency: "number",
	Mode: "number",
	LetterboxInBreaks: "number",
	/* depreciated */
	StoryFireInFront: "number",
	UseSkinSprites: "number",
	/* depreciated */
	AlwaysShowPlayfield: "number",
	OverlayPosition: "string",
	SkinPreference: "string",
	EpilepsyWarning: "number",
	CountdownOffset: "number",
	SpecialStyle: "number",
	WidescreenStoryboard: "number",
	SamplesMatchPlaybackRate: "number",
	/* under [Editor] */
	Bookmarks: "string",
	DistanceSpacing: "number",
	BeatDivisor: "number",
	GridSize: "number",
	TimelineZoom: "number",
	/* under [Metadata] */
	Title: "string",
	TitleUnicode: "string",
	Artist: "string",
	ArtistUnicode: "string",
	Creator: "string",
	Version: "string",
	Source: "string",
	Tags: "string",
	BeatmapID: "number",
	BeatmapSetID: "number",
	/* under [Difficulty] */
	HPDrainRate: "number",
	CircleSize: "number",
	OverallDifficulty: "number",
	ApproachRate: "number",
	SliderMultiplier: "number",
	SliderTickRate: "number",
};

let iniTypeMap = {
	/* under [General] */
	Name: "string",
	Author: "string",
	Version: "string",
	AnimationFramerate: "number",
	AllowSliderBallTint: "number",
	ComboBurstRandom: "number",
	CursorCentre: "string",
	CursorExpand: "number",
	CursorRotate: "number",
	CursorTrailRotate: "number",
	CustomComboBurstSounds: "string",
	HitCircleOverlayAboveNumber: "number",
	LayerHitSounds: "number",
	SliderBallFlip: "number",
	SliderStyle: "number",
	SpinnerFadePlayfield: "number",
	SpinnerFrequencyModulate: "number",
	SpinnerNoBlink: "number",
	/* under [Colours] */
	Combo1: "rgb",
	Combo2: "rgb",
	Combo3: "rgb",
	Combo4: "rgb",
	Combo5: "rgb",
	Combo6: "rgb",
	Combo7: "rgb",
	Combo8: "rgb",
	InputOverlayText: "rgb",
	MenuGlow: "rgb",
	SliderBall: "rgb",
	SliderBorder: "rgb",
	SliderTrackOverride: "rgb",
	SongSelectActiveText: "rgb",
	SongSelectInactiveText: "rgb",
	SpinnerBackground: "rgb",
	StarBreakAdditive: "rgb",
	/* under [Fonts] */
	HitCirclePrefix: "string",
	HitCircleOverlap: "number",
	ScorePrefix: "string",
	ScoreOverlap: "number",
	ComboPrefix: "string",
	ComboOverlap: "number",
};


function parseHitObject(data) {
	let splited = data.split(",");
	let len = splited.length;
	for (var i = 0; i < len; i++) {
		if (/^[0-9]+$/.test(splited[i])) {
			splited[i] = parseFloat(splited[i]);
		}
	}
	let asBinary = Utils.reverse(Utils.binary(splited[3], 8));
	if (asBinary[0] === "1") {
		/* hitCircle */
		return new HitObject.HitCircle(...splited);
	} else if (asBinary[1] === "1") {
		/* slider */
		return new HitObject.Slider(...splited);
	} else if (asBinary[3] === "1") {
		/* spinner */
		return new HitObject.Spinner(...splited);
	}
}
function parseTimingPoint(data) {
	let splited = data.split(",");
	let len = splited.length;
	for (var i = 0; i < len; i++) {
		if (/^[0-9]+$/.test(splited[i])) {
			splited[i] = parseFloat(splited[i]);
		}
	}
	return new HitObject.TimingPoint(...splited);
}
function parseComboColour(data) {
	let splitTriplets = data.split(":")[1].split(",");
	return [parseInt(splitTriplets[0]), parseInt(splitTriplets[1]), parseInt(splitTriplets[2])];
}
function parseBreakPeriod(data) {
	let splited = data.split(",");
	return new HitObject.BreakPeriod(...splited);
}
function parseBackground(data) {
	let splited = data.replaceAll("\"", "").split(",");
	/* ignore video files for now */
	if (splited[0] !== "Video") {
		return new HitObject.Background(...splited);
	}
}
function defaultComboColours() {
	return [
		parseComboColour(":255,213,128"),
		parseComboColour(":242,121,97"),
		parseComboColour(":255,140,179"),
		parseComboColour(":187,103,229"),
		parseComboColour(":140,236,255"),
		parseComboColour(":145,229,103"),
	];
}

export function parseBeatmap(data) {
	/* split by line */
	let splited = data.split(/[\n\r]/g);
	let beatmap = {
		version: splited[0],
		hitObjects: [],
		timingPoints: [],
		comboColours: [],
		breakPeriods: [],
		background: "",
	};
	let section = "";
	let subSection = "";
	/* start from 1 to ignore version */
	let len = splited.length;
	for (var i = 1; i < len; i++) {
		/* skip empty lines*/
		if (splited[i] === "") {
			continue;
		}
		/* detect comments for sub sections */
		if (splited[i].substr(0, 2) === "//") {
			subSection = splited[i];
		}
		/* detect sections covered by [] */
		if (splited[i][0] === "[") {
			section = splited[i].replace(/[\n\r]/g, "");
			continue;
		}
		if (section === "[TimingPoints]" && /[,]/g.test(splited[i])) {
			beatmap.timingPoints.push(parseTimingPoint(splited[i]));
			continue;
		}
		if (section === "[HitObjects]" && /[,]/g.test(splited[i])) {
			beatmap.hitObjects.push(parseHitObject(splited[i]));
			continue;
		}
		if (section === "[Colours]" && /(Combo)/g.test(splited[i])) {
			beatmap.comboColours.push(parseComboColour(splited[i]));
			continue;
		}
		if (section === "[Events]" && splited[i] !== subSection) {
			if (subSection === "//Background and Video events") {
				let parsedBackground = parseBackground(splited[i]);
				if (parsedBackground !== undefined) {
					beatmap.background = parsedBackground;
				}
			}
			if (subSection === "//Break Periods") {
				beatmap.breakPeriods.push(parseBreakPeriod(splited[i]));
			}
			// if (subSection === "//Storyboard Layer 0 (Background)") {
			// }
			// if (subSection === "//Storyboard Layer 1 (Fail)") {
			// }
			// if (subSection === "//Storyboard Layer 2 (Pass)") {
			// }
			// if (subSection === "//Storyboard Layer 3 (Foreground)") {
			// }
			continue;
		}
		let keyValuePair = splited[i].split(/:(.+)/);
		if (keyValuePair.length === 1) {
			continue;
		}
		/* remove empty space from key pairs */
		if (keyValuePair[1].substr(0, 1) === " ") {
			keyValuePair[1] = keyValuePair[1].substr(1);
		}
		if (beatmapTypeMap[keyValuePair[0]] === "string") {
			beatmap[keyValuePair[0]] = keyValuePair[1];
		} else {
			beatmap[keyValuePair[0]] = parseFloat(keyValuePair[1]);
		}
	}
	if (beatmap.comboColours.length === 0) {
		beatmap.comboColours = defaultComboColours();
	}
	return beatmap;
}

export function parseSkinIni(data) {
	/* split by line */
	data = data.replaceAll("    ", "");
	let splited = data.split(/[\n\r]/g);
	let iniData = {
		comboColours: [],
	};
	let section = "";
	let subSection = "";
	/* start from 1 to ignore version */
	let len = splited.length;
	for (var i = 1; i < len; i++) {
		/* skip empty lines*/
		if (splited[i] === "") {
			continue;
		}
		/* detect comments for sub sections */
		if (splited[i].substr(0, 2) === "//") {
			subSection = splited[i];
		}
		/* detect sections covered by [] */
		if (splited[i][0] === "[") {
			section = splited[i].replace(/[\n\r]/g, "");
			continue;
		}
		let keyValuePair = splited[i].split(/:(.+)/);
		if (keyValuePair.length === 1) {
			continue;
		}
		/* remove empty space from key pairs */
		if (keyValuePair[1].substr(0, 1) === " ") {
			keyValuePair[1] = keyValuePair[1].substr(1);
		}
		/* check type maps and match keys to the type map */
		if (iniTypeMap[keyValuePair[0]] === "string") {
			iniData[keyValuePair[0]] = keyValuePair[1];
		} else if (iniTypeMap[keyValuePair[0]] === "number") {
			iniData[keyValuePair[0]] = parseFloat(keyValuePair[1]);
		} else if (iniTypeMap[keyValuePair[0]] === "rgb") {
			/* separate the RGB's and parse them */
			let values = keyValuePair[1].replaceAll(" ", "").split(",");
			for (let i = 0; i < values.length; i++) {
				values[i] = parseInt(values);
			}
			/* determine if the given rgb is a combo colour */
			if (keyValuePair[0].includes("Combo")) {
				iniData.comboColours.push(values);
			} else {
				iniData[keyValuePair[0]] = values;
			}
		}
	}
	return iniData;
}


console.log(parseSkinIni(`[General]

Name: Aesthetic 1.3 (Default)
Author: Redon
Version: 2.2

CursorRotate: 0
CursorExpand: 1
CursorCentre: 1

SliderStyle: 2
SliderBallFlip: 0

HitCircleOverlayAboveNumer: 0
SpinnerFadePlayfield: 1


HitCircleOverlayAboveNumber: 0
[Colours]

Combo1: 145,229,103
Combo2: 255,213,128
Combo3: 242,121,97
Combo4: 255,140,179
Combo5: 187,103,229
Combo6: 140,236,255

SongSelectActiveText: 240,240,240
SongSelectInactiveText: 230,230,230


SliderBorder: 230,230,230
SliderTrackOverride: 0,0,0


[Fonts]

HitCirclePrefix: fonts/aller/default
HitCircleOverlap: 4

ScorePrefix: fonts/aller/score
ScoreOverlap: 2
[Mania]
Keys: 4
//Mania skin config
ColumnStart: 250
HitPosition: 445
UpsideDown: 0
JudgementLine: 1
ScorePosition: 265
ComboPosition: 203
LightFramePerSecond: 48
ColumnWidth: 64,64,64,64
//Colours
Colour1: 0,0,0,255
Colour2: 0,0,0,255
Colour3: 0,0,0,255
Colour4: 0,0,0,255
//images
KeyImage0: Arrows\\left
KeyImage0D: Arrows\\leftD
KeyImage1: Arrows\\up
KeyImage1D: Arrows\\upD
KeyImage2: Arrows\\down
KeyImage2D: Arrows\\downD
KeyImage3: Arrows\\right
KeyImage3D: Arrows\\rightD
NoteImage0: Arrownote\\left
NoteImage0H: Arrownote\\leftH
NoteImage0L: Arrownote\\leftL
NoteImage1: Arrownote\\down
NoteImage1H: Arrownote\\downH
NoteImage1L: Arrownote\\leftL
NoteImage2: Arrownote\\up
NoteImage2H: Arrownote\\upH
NoteImage2L: Arrownote\\leftL
NoteImage3: Arrownote\\right
NoteImage3H: Arrownote\\rightH
NoteImage3L: Arrownote\\leftL
//Keys
ColumnLineWidth: 0,0,0,0,0
[Mania]
Keys: 5
//Mania skin config
ColumnStart: 260
HitPosition: 380
UpsideDown: 0
JudgementLine: 1
ScorePosition: 285
ComboPosition: 170
LightFramePerSecond: 24
ColumnWidth: 45,45,55,45,45
//Colours
Colour1: 0,0,0,230
Colour2: 0,0,0,230
Colour3: 0,0,0,230
Colour4: 0,0,0,230
Colour5: 0,0,0,230
ColourLight1: 255,0,0,255
ColourLight2: 0,0,255,255
ColourLight3: 255,0,0,255
ColourLight4: 0,0,255,255
ColourLight5: 255,0,0,255
ColourHold: 255,255,255,255
ColourBarline: 255,255,255,150
//images
KeyImage0: mania-key2
KeyImage0D: mania-key2D
KeyImage1: mania-key1
KeyImage1D: mania-key1
KeyImage2: mania-keyS
KeyImage2D: mania-keySD
KeyImage3: mania-key1
KeyImage3D: mania-key1
KeyImage4: mania-key2
KeyImage4D: mania-key2

NoteImage0L: 7k\\blueL
NoteImage0: 7k\\blue
NoteImage0H: 7k\\blueL

NoteImage1L: 7k\\whiteL
NoteImage1: 7k\\white
NoteImage1H: 7k\\whiteL

NoteImage2L: 7k\\middleL
NoteImage2: 7k\\middle
NoteImage2H: 7k\\middleL

NoteImage3L: 7k\\whiteL
NoteImage3: 7k\\white
NoteImage3H: 7k\\whiteL

NoteImage4L: 7k\\blueL
NoteImage4: 7k\\blue
NoteImage4H: 7k\\blueL

//Keys
ColumnLineWidth: 0,0,0,0,0,0
[Mania]
Keys: 6
//Mania skin config
ColumnStart: 185
HitPosition: 445
UpsideDown: 1
JudgementLine: 1
ScorePosition: 273
ComboPosition: 200
LightFramePerSecond: 48
ColumnWidth: 64,64,64,64,64,64
//Colours
Colour1: 0,0,0,230
Colour2: 0,0,0,230
Colour3: 0,0,0,230
Colour4: 0,0,0,230
Colour5: 0,0,0,230
Colour6: 0,0,0,230


ColourHold: 255,255,255,255
ColourBarline: 255,255,255,150
//images




NoteImage0: Arrownote\\left
NoteImage0H: Arrownote\\leftH
NoteImage0L: Arrownote\\leftL



NoteImage1: Arrownote\\upleft
NoteImage1H: Arrownote\\downH
NoteImage1L: Arrownote\\leftL


NoteImage2: Arrownote\\down
NoteImage2H: Arrownote\\downH
NoteImage2L: Arrownote\\leftL

NoteImage3: Arrownote\\up
NoteImage3H: Arrownote\\upH
NoteImage3L: Arrownote\\leftL



NoteImage4: Arrownote\\upright
NoteImage4H: Arrownote\\upH
NoteImage4L: Arrownote\\leftL


NoteImage5: Arrownote\\right
NoteImage5H: Arrownote\\rightH
NoteImage5L: Arrownote\\leftL



//Keys
ColumnLineWidth: 0,0,0,0,0,0,0
[Mania]
Keys: 7
//Mania skin config
ColumnStart: 245
HitPosition: 380
UpsideDown: 0
JudgementLine: 1
ScorePosition: 220
ComboPosition: 150
LightFramePerSecond: 24
ColumnWidth: 38,38,38,38,38,38,38
//Colours
Colour1: 0,0,0,235
Colour2: 0,0,0,235
Colour3: 0,0,0,235
Colour4: 15,15,15,235
Colour5: 0,0,0,235
Colour6: 0,0,0,235
Colour7: 0,0,0,235
ColourLight1: 215,215,215,255
ColourLight2: 66,215,255,255
ColourLight3: 215,215,215,255
ColourLight4: 255,178,58,255
ColourLight5: 215,215,215,255
ColourLight6: 66,215,255,255
ColourLight7: 215,215,215,255
ColourBreak: 255,0,0,255
ColourHold: 255,255,255,255
//images
NoteImage0L: 7k\\whiteL
NoteImage0: 7k\\white
NoteImage0H: 7k\\whiteL
NoteImage1L: 7k\\blueL
NoteImage1: 7k\\blue
NoteImage1H: 7k\\blueL
NoteImage2L: 7k\\whiteL
NoteImage2: 7k\\white
NoteImage2H: 7k\\whiteL
NoteImage3L: 7k\\blueL
NoteImage3: 7k\\blue
NoteImage3H: 7k\\middleL
NoteImage4L: 7k\\whiteL
NoteImage4: 7k\\white
NoteImage4H: 7k\\whiteL
NoteImage5L: 7k\\blueL
NoteImage5: 7k\\blue
NoteImage5H: 7k\\blueL
NoteImage6L: 7k\\whiteL
NoteImage6: 7k\\white
NoteImage6H: 7k\\whiteL
//Keys
ColumnLineWidth: 2,0,0,0,0,0,0,2
[Mania]
Keys: 8
//Mania skin config
ColumnStart: 190
HitPosition: 380
UpsideDown: 0
JudgementLine: 1
ScorePosition: 270
ComboPosition: 170
LightFramePerSecond: 24
ColumnWidth: 55,38,38,38,38,38,38,38
//Colours
Colour1: 10,10,10,230
Colour2: 0,0,0,230
Colour3: 10,10,10,230
Colour4: 0,0,0,230
Colour5: 10,10,10,230
Colour6: 0,0,0,230
Colour7: 10,10,10,230
Colour8: 0,0,0,230
ColourLight1: 255,212,0,255
ColourLight2: 255,0,0,255
ColourLight3: 0,0,255,255
ColourLight4: 255,0,0,255
ColourLight5: 0,0,255,255
ColourLight6: 255,0,0,255
ColourLight7: 0,0,255,255
ColourLight8: 255,0,0,255
ColourHold: 255,255,255,255
ColourBarline: 255,255,255,150
//images
NoteImage0L: 7k\\scratchL
NoteImage0: 7k\\scratch
NoteImage0H: 7k\\scratchL
NoteImage1L: 7k\\whiteL
NoteImage1: 7k\\white
NoteImage1H: 7k\\whiteL
NoteImage2L: 7k\\blueL
NoteImage2: 7k\\blue
NoteImage2H: 7k\\blueL
NoteImage3L: 7k\\whiteL
NoteImage3: 7k\\white
NoteImage3H: 7k\\whiteL
NoteImage4L: 7k\\blueL
NoteImage4: 7k\\blue
NoteImage4H: 7k\\blueL
NoteImage5L: 7k\\whiteL
NoteImage5: 7k\\white
NoteImage5H: 7k\\whiteL
NoteImage6L: 7k\\blueL
NoteImage6: 7k\\blue
NoteImage6H: 7k\\blueL
NoteImage7L: 7k\\whiteL
NoteImage7: 7k\\white
NoteImage7H: 7k\\whiteL
//Keys
ColumnLineWidth: 0,0,0,0,0,0,0,0,2
[Mania]
Keys: 9
[Mania]
Keys: 10
[Mania]
Keys: 1
[Mania]
Keys: 2
[Mania]
Keys: 3
[Mania]
Keys: 18
UpsideDown: 1
`));