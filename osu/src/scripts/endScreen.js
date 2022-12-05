export function displayResults(playDetails) {
	document.getElementById("end-results-map-name").textContent = playDetails.title;
	document.getElementById("end-results-artist-name").textContent = playDetails.artist;
	document.getElementById("end-results-grade").src = `./src/images/rank-icons/${playDetails.grade}-rank.png`;
	document.getElementById("end-results-score").textContent = Number(Math.round(playDetails.score)).toLocaleString();
	document.getElementById("end-results-accuracy-bar").style.width = playDetails.accuracy + "%";
	document.getElementById("end-results-accuracy-bar").textContent = playDetails.accuracy.toFixed(2) + "%";
	document.getElementById("end-results-difficulty-name").textContent = playDetails.version;
	document.getElementById("end-results-mapper-name").textContent = `Mapped by ${playDetails.creator}`;
	document.getElementById("end-results-accuracy-header").textContent = playDetails.accuracy.toFixed(2) + "%";
	document.getElementById("end-results-max-combo").textContent = playDetails.maxCombo;
	document.getElementById("end-results-combo-type").textContent = playDetails.comboType;
	document.getElementById("end-results-pp").textContent = Math.round(playDetails.performancePoints);
	document.getElementById("end-results-great").textContent = playDetails.great;
	document.getElementById("end-results-ok").textContent = playDetails.ok;
	document.getElementById("end-results-meh").textContent = playDetails.meh;
	document.getElementById("end-results-miss").textContent = playDetails.miss;
	document.getElementById("end-results-slider-ends").textContent = playDetails.sliderBreaks;
	document.getElementById("end-results-unstable-rate").textContent = Math.round(playDetails.unstableRate);
	document.getElementById("end-results-combo-breaks").textContent = playDetails.comboBreaks;
	document.getElementById("end-results-date-played").textContent = "Played on " + playDetails.datePlayed;
}