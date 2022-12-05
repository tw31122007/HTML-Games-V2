function getURLParameter(sParam) {
	let sPageURL = window.location.search.substring(1);
	let sURLletiables = sPageURL.split("&");
	for (let i = 0; i < sURLletiables.length; i++) {
		let sParameterName = sURLletiables[i].split("=");
		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}
	}
}
let moduleName = `tests/${getURLParameter("function")}.test`;

define([moduleName], function(moduleName) {
	require(moduleName);
});