define(["../testLib.js", "../../src/scripts/Formulas.js", "../../src/scripts/Mods.js"], function(Test, Formulas, Mods) {
	Test.table(Formulas.hitScore, [
		[300, 0, 0, 0],
		[100, 0, 0, 0],
		[50, 0, 0, 0],
		[0, 0, 0, 0],
		], [
		300,
		100,
		50,
		0,
	]);
});