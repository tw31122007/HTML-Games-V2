define(["../testLib.js", "../../src/scripts/Formulas.js"], function(Test, Formulas) {
	Test.table(Formulas.beatmapDifficultyIcon, [
		-1,
		0,
		1,
		2,
		2.7,
		4,
		5.3,
		6.5,
		10,
		], [
		"easy",
		"easy",
		"easy",
		"normal",
		"hard",
		"insane",
		"expert",
		"expert+",
		"expert+",
	]);
});