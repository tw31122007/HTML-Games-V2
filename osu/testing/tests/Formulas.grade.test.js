define(["../testLib.js", "../../src/scripts/Formulas.js"], function(Test, Formulas) {
	/* dependencies */
	Test.table(Formulas.grade, [
		[0, 0, 0, 0, false],
		[100, 0, 0, 0, false],
		[100, 0, 0, 0, true],
		[95, 5, 0, 0, false],
		[95, 5, 0, 0, true],
		[89, 11, 0, 0, false],
		[99, 0, 0, 1, false],
		[99, 0, 1, 0, false],
		[99, 0, 2, 0, false],
		[71, 29, 0, 0, false],
		[81, 18, 0, 1, false],
		[61, 39, 0, 0, false],
		[0, 0, 0, 100, false],
		], [
		"x",
		"x",
		"xh",
		"s",
		"sh",
		"a",
		"a",
		"s",
		"a",
		"b",
		"b",
		"c",
		"d",
	]);
});