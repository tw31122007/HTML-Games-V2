define(["../testLib.js", "../../src/scripts/Formulas.js", "../../src/scripts/Mods.js"], function(Test, Formulas, Mods) {
	Test.table(Formulas.ODHitWindow, [
		-1,
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		[0, Mods(true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false)],
		[10, Mods(true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false)],
		[0, Mods(false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false)],
		[5, Mods(false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false)],
		[10, Mods(false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false)],
		], [
		[
			0.4 - 0.02 * -1,
			0.28 - 0.016 * -1,
			0.16 - 0.012 * -1,
		],
		[
			0.4 - 0.02 * 0,
			0.28 - 0.016 * 0,
			0.16 - 0.012 * 0,
		],
		[
			0.4 - 0.02 * 1,
			0.28 - 0.016 * 1,
			0.16 - 0.012 * 1,
		],
		[
			0.4 - 0.02 * 2,
			0.28 - 0.016 * 2,
			0.16 - 0.012 * 2,
		],
		[
			0.4 - 0.02 * 3,
			0.28 - 0.016 * 3,
			0.16 - 0.012 * 3,
		],
		[
			0.4 - 0.02 * 4,
			0.28 - 0.016 * 4,
			0.16 - 0.012 * 4,
		],
		[
			0.4 - 0.02 * 5,
			0.28 - 0.016 * 5,
			0.16 - 0.012 * 5,
		],
		[
			0.4 - 0.02 * 6,
			0.28 - 0.016 * 6,
			0.16 - 0.012 * 6,
		],
		[
			0.4 - 0.02 * 7,
			0.28 - 0.016 * 7,
			0.16 - 0.012 * 7,
		],
		[
			0.4 - 0.02 * 8,
			0.28 - 0.016 * 8,
			0.16 - 0.012 * 8,
		],
		[
			0.4 - 0.02 * 9,
			0.28 - 0.016 * 9,
			0.16 - 0.012 * 9,
		],
		[
			0.4 - 0.02 * 10,
			0.28 - 0.016 * 10,
			0.16 - 0.012 * 10,
		],
		[
			0.4 - 0.02 * 11,
			0.28 - 0.016 * 11,
			0.16 - 0.012 * 11,
		],
		Formulas.ODHitWindow(0),
		Formulas.ODHitWindow(5),
		Formulas.ODHitWindow(0),
		Formulas.ODHitWindow(7),
		Formulas.ODHitWindow(10),
	]);
});