define(["../testLib.js", "../../src/scripts/Formulas.js", "../../src/scripts/Mods.js"], function(Test, Formulas, Mods) {
	Test.table(Formulas.modScoreMultiplier, [
		[Mods(false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false)],
		[Mods(true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false)],
		[Mods(false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false)],
		[Mods(false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false)],
		[Mods(true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false)],
		], [
		1,
		0.5,
		0.5,
		0.3,
		0.075,
	]);
});