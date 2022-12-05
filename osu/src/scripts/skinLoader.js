function loadImage(src) {
	let image = new Image();
	image.src = src;
	return image;
}

export class Skin {
	constructor(iniData, elements) {
		this.iniData = iniData;
		this.elements = [];
	}
}

export class SkinLoader {
	constructor(skin) {
		/* cursor assets */
		this.cursor = loadImage(`./src/images/skins/${skin}/cursor.png`);
		this.cursorTrail = loadImage(`./src/images/skins/${skin}/cursortrail.png`);
		/* hit circle assets */
		this.hitCircle = loadImage(`./src/images/skins/${skin}/hitcircle.png`);
		this.hitCircleOverlay = loadImage(`./src/images/skins/${skin}/hitcircleoverlay.png`);
		this.approachCircle = loadImage(`./src/images/skins/${skin}/approachcircle.png`);
		/* slider assets */
		this.sliderBody = loadImage(`./src/images/skins/${skin}/sliderb0.png`);
		this.sliderFollowCircle = loadImage(`./src/images/skins/${skin}/sliderfollowcircle.png`);
		this.sliderScorePoint = loadImage(`./src/images/skins/${skin}/sliderscorepoint.png`);
		this.reverseArrow = loadImage(`./src/images/skins/${skin}/reversearrow.png`);
		/* spinner assets */
		this.spinnerApproachCircle = loadImage(`./src/images/skins/${skin}/spinner-approachcircle.png`);
		this.spinnerRPM = loadImage(`./src/images/skins/${skin}/spinner-rpm.png`);
		this.spinnerTop = loadImage(`./src/images/skins/${skin}/spinner-top.png`);
		this.spinnerClear = loadImage(`./src/images/skins/${skin}/spinner-clear.png`);
		/* healthbar assets */
		this.scoreBarBg = loadImage(`./src/images/skins/${skin}/scorebar-bg.png`);
		this.scoreBarColour = loadImage(`./src/images/skins/${skin}/scorebar-colour.png`);
		/* combo number assets */
		this.comboNumbersPath = `./src/images/skins/${skin}/fonts/aller/default-`;
		this.comboNumbers = [
			loadImage(`./src/images/skins/${skin}/fonts/aller/default-0.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/default-1.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/default-2.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/default-3.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/default-4.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/default-5.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/default-6.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/default-7.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/default-8.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/default-9.png`),
		];
		this.scoreNumbers = [
			loadImage(`./src/images/skins/${skin}/fonts/aller/numbers-0.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/numbers-1.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/numbers-2.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/numbers-3.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/numbers-4.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/numbers-5.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/numbers-6.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/numbers-7.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/numbers-8.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/numbers-9.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/numbers-comma.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/numbers-dot.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/numbers-percent.png`),
			loadImage(`./src/images/skins/${skin}/fonts/aller/numbers-x.png`),
		];
		/* hit score number assets */
		this.hitNumbers = [
			loadImage(`./src/images/skins/${skin}/hit300.png`),
			loadImage(`./src/images/skins/${skin}/hit100.png`),
			loadImage(`./src/images/skins/${skin}/hit50.png`),
			loadImage(`./src/images/skins/${skin}/hit0.png`),
		];
		this.grades = {
			xh: loadImage(`./src/images/skins/${skin}/ranking-xh-small.png`),
			x: loadImage(`./src/images/skins/${skin}/ranking-x-small.png`),
			sh: loadImage(`./src/images/skins/${skin}/ranking-sh-small.png`),
			s: loadImage(`./src/images/skins/${skin}/ranking-s-small.png`),
			a: loadImage(`./src/images/skins/${skin}/ranking-a-small.png`),
			b: loadImage(`./src/images/skins/${skin}/ranking-b-small.png`),
			c: loadImage(`./src/images/skins/${skin}/ranking-c-small.png`),
			d: loadImage(`./src/images/skins/${skin}/ranking-d-small.png`),
		};
	}
};