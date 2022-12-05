import * as DatabaseManager from "./databaseManager.js";
import * as StarRating from "./starRating.js"
import * as Formulas from "./formulas.js"

if (window.localStorage.getItem("starRatingVersion") < StarRating.version()) {
	console.log(`Star rating needs to be updated (${window.localStorage.getItem("starRatingVersion")} --> ${StarRating.version()})`);
}

let mapsLoaded = 0;
let beatmapsSorted = [];
let beatMapGroups = [];
let previous = "";
let alreadyRefreshing = false;
/* noop function */
let onLoadComplete = function() {};

class DatabaseData {
	constructor() {
		this.values = [];
		this.complete = false;
		this.onComplete = function() {};
	}
	onLoadingComplete(callback) {
		this.onComplete = callback;
	}
}

let returns = new DatabaseData();
let isLoadingComplete = false;
let database = indexedDB.open("osw-database", 4);
database.addEventListener("upgradeneeded", function(event) {
	console.log(`Your version of the database needs to be updated (${event.oldVersion} --> ${event.version})`);
	let db = event.target.result;
	let expectedStores = ["beatmaps", "audio", "images", "scores", "replays", "skin-elements"];
	for (let i = 0; i < expectedStores.length; i++) {
		if (db.objectStoreNames.contains(expectedStores[i]) === false) {
			db.createObjectStore(expectedStores[i], {
				keyPath: "name",
			});
		}
	}
});
export function getStarRatingVersion() {
	return StarRating.version();
}
export function onLoadingComplete(callback) {
	onLoadComplete = callback;
}
export function get() {
	return beatmapsSorted;
}
export function refresh() {
	if (alreadyRefreshing === false) {
		this.clearMemory();
		isLoadingComplete = false;
		let database = indexedDB.open("osw-database");
		database.addEventListener("error", function(event) {
			console.error(`Attempt to open database failed: ${event.target.error}`);
		});
		database.addEventListener("success", function(event) {
			let database = event.target.result;
			returns.onLoadingComplete(function checkComplete() {
				returns.values.sort(function (a, b) {
					return (a.name > b.name) ? 1 : -1;
				});
				for (let i = 0; i < returns.values.length; i++) {
					let parsedMap = returns.values[i];
					if (i === 0) {
						previous = parsedMap.data.Creator + parsedMap.data.Title;
					}
					/* ignore other gamemodes... for now */
					if (parsedMap.data.Mode !== 0) {
						continue;
					}
					if (beatMapGroups.length !== 0 && parsedMap.data.Creator + parsedMap.data.Title !== previous) {
						beatmapsSorted.push(beatMapGroups);
						beatMapGroups = [];
						previous = parsedMap.data.Creator + parsedMap.data.Title;
					}
					beatMapGroups.push(parsedMap);
				}
				if (beatMapGroups.length >= 1) {
					beatmapsSorted.push(beatMapGroups);
				}
				isLoadingComplete = true;
				alreadyRefreshing = false;
				onLoadComplete();
			});
			DatabaseManager.getAllInDatabase(database, "beatmaps", returns);
		});
	}
}
export function clearMemory() {
	mapsLoaded = 0;
	beatmapsSorted = [];
	beatMapGroups = [];
	previous = "";
	returns = new DatabaseData();
}

export function generate(maps) {
	let cache = [];
	for (let i = 0; i < maps.length; i++) {
		cache.push(new MapSet(maps[i]));
	}
	return cache;
}
export function addMapSet(mapset) {
	let cache = getCache("beatmapCache");
	if (cache === null) {
		cache = [];
	}
	cache.push(new MapSet(mapset));
	this.setCache("beatmapCache", cache);
}
export function getCache(cacheName) {
	return JSON.parse(window.localStorage.getItem(cacheName));
}
export function setCache(cacheName, data) {
	window.localStorage.setItem(cacheName, JSON.stringify(data));
}
export function deleteCache(cacheName) {
	window.localStorage.removeItem(cacheName);
}
/* 	the beatmap cache is designed to hold data to prevent useless calculations
 *	with only the bare neccessities to allow for minimal memory usage in local storage
 */
export class MapSet {
	constructor(mapSet) {
		this.audioFilename = mapSet[0].data.AudioFilename;
		this.artist = mapSet[0].data.Artist;
		this.creator = mapSet[0].data.Creator;
		this.title = mapSet[0].data.Title;
		this.tags = mapSet[0].data.Tags;
		this.source = mapSet[0].data.Source;
		this.previewTime = mapSet[0].data.PreviewTime / 1000;
		this.difficulties =  [];
		for (let i = 0; i < mapSet.length; i++) {
			this.difficulties.push(new Beatmap(mapSet[i]));
		}
		this.difficulties.sort(function(a, b) {
			return a.starRating - b.starRating;
		});
	}
}
export class Beatmap {
	constructor(beatmap) {
		this.databaseKey = beatmap.name;
		this.version = beatmap.data.Version;
		this.approachRate = beatmap.data.ApproachRate;
		this.circleSize = beatmap.data.CircleSize;
		this.overallDifficulty = beatmap.data.OverallDifficulty
		this.healthDrain = beatmap.data.HPDrainRate;
		this.starRating = StarRating.calculate(beatmap.data);
		this.beatLength = beatmap.data.timingPoints[0].beatLength * 1000;
		this.backgroundFilename = (beatmap.data.background) ? beatmap.data.background.filename : "";
		this.objectCounts = Formulas.getObjectCount(beatmap.data);
		this.drainTime = beatmap.data.hitObjects[beatmap.data.hitObjects.length - 1].time - beatmap.data.hitObjects[0].time;
	}
}