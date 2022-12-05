import * as Utils from "./utils.js"
import * as Formulas from "./formulas.js"
export function generate(maps) {
	let concatenated = "";
	for (let i = 0; i < maps.length; i++) {
		concatenated += this.group(maps[i], i);
	}
	return concatenated;
}
export function group(maps, i) {
	let mapsHTML = "";
	let iconsHTML = "";
	for (let j = 0; j < maps.difficulties.length; j++) {
		let mapStarRating = maps.difficulties[j].starRating;
		iconsHTML += `<img class="beatmap-selection-group-pane-difficulties-icon" src="./src/images/difficulty-icons/${Formulas.beatmapDifficultyIcon(mapStarRating)}-difficulty.png">`;
		mapsHTML += this.map(maps.difficulties[j], i, j, mapStarRating, maps);
	}
	return `<div class="beatmap-selection-group">
				<div data-audio-source="${maps.creator + maps.title + maps.audioFilename}" data-index="${i}" class="beatmap-selection-group-pane triangle-background">
					<div class="beatmap-selection-group-title">${maps.title}</div>
					<div class="beatmap-selection-group-pane-artist">${maps.artist}</div>
					${iconsHTML}
				</div>
				<div class="beatmap-selection-group-pane-maps" style="display: none;">
					${mapsHTML}
				</div>
			</div>`;
}
export function map(beatmap, groupIndex, mapIndex, mapStarRating, details) {
	let stars = "";
	if (mapStarRating < 10) {
		for (let i = 0; i < mapStarRating; i++) {
			let size = Utils.clamp(Utils.roundDigits(Utils.map(mapStarRating - i, 1, 0, 1, 0.5), 2), 0.5, 1);
			stars += `<img style="transform: scale(${size}); opacity: ${(size > 0.5) ? 1 : 0.5}; width: 3.5vh;" src="./src/images/star.png">`;
		}
	} else {
		stars = `<img src="./src/images/star.png" style="width: 3.5vh;"><p style="display: inline;">${"x" + (Math.round(mapStarRating * 100) / 100)}</p>`;
	}
	return `<div data-image-filename="${(beatmap.backgroundFilename !== "") ? (details.creator + details.title + beatmap.backgroundFilename) : ""}" data-group-index="${groupIndex}" data-map-index="${mapIndex}" class="beatmap-selection-map-pane triangle-background">
				<img class="beatmap-selection-map-pane-difficulty-icon" src="./src/images/difficulty-icons/${Formulas.beatmapDifficultyIcon(mapStarRating)}-difficulty.png">
					<div>
						<b class="beatmap-selection-group-map-difficulty-name">${beatmap.version}</b>
						<div class="beatmap-selection-map-pane-mapper">mapped by ${details.creator}</div>
					</div>
					${stars}						
			</div>`;
}