define(function(require) {
	let Formulas = require("../src/scripts/Formulas.js")

	for (let key in Formulas) {
		if (Formulas.hasOwnProperty(key)) {
			document.body.innerHTML += `<a href="test.html?function=${"Formulas." + key}">${Object.keys({Formulas})[0] + "." + key} test</a>`;
		}
	}
});