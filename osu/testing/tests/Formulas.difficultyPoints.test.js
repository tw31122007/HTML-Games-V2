define(["../testLib.js", "../../src/scripts/Formulas.js"], function(Test, Formulas) {
	Test.table(Formulas.difficultyPoints, [
		[2, 0, 0],
		[2, 2, 1],
		[3, 4, 3],
		[7, 4, 3],
		[7, 8, 8],
		[7, 10, 10],
		[10, 10, 10],
		], [
		2,
		3,
		3,
		4,
		5,
		6,
		6,
	]);
});