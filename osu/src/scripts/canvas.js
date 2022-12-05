export class Canvas {
	constructor(canvasId) {
		this.canvas = document.getElementById(canvasId);
		this.canvas.style.margin = 0;
		this.context = this.canvas.getContext("2d");
		this.customProperties = {
			textAlign: "left",
			imageAlign: "top-left",
		}
	}
	setWidth(width) {
		this.canvas.width = width;
	}
	setHeight(height) {
		this.canvas.height = height;
	}
	setStrokeStyle(style) {
		this.context.strokeStyle = style;
	}
	getStrokeStyle() {
		return this.context.strokeStyle;
	}
	setFillStyle(style) {
		this.context.fillStyle = style;
	}
	getFillStyle() {
		return this.context.fillStyle;
	}
	setlineCap(style) {
		this.context.lineCap = style;
	}
	getlineCap() {
		return this.context.lineCap;
	}
	setlineJoin(style) {
		this.context.lineJoin = style;
	}
	getlineJoin() {
		return this.context.lineJoin;
	}
	setStrokeWidth(style) {
		this.context.lineWidth = style;
	}
	getStrokeWidth() {
		return this.context.lineWidth;
	}
	setGlobalAlpha(alpha) {
		this.context.globalAlpha = alpha;
	}
	getGlobalAlpha() {
		return this.context.globalAlpha;
	}
	setImageAlignment(alignment) {
		this.customProperties.imageAlign = alignment;
	}
	getImageAlignment() {
		return this.customProperties.imageAlign;
	}
	fillText(text, x, y, offsetOveride) {
		let offset = 0;
		if (this.customProperties.textAlign === "center") {
			offset = this.context.measureText(text).width;
		}
		this.context.fillText(text, x + offset, y);
	}
	drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
		if (arguments.length === 3) {
			if (this.customProperties.imageAlign === "center") {
				this.context.drawImage(image, sx - image.width / 2, sy - image.height / 2);
			} else {
				this.context.drawImage(image, sx, sy);
			}
		} else if (arguments.length === 5) {
			if (this.customProperties.imageAlign === "center") {
				this.context.drawImage(image, sx - sWidth / 2, sy - sHeight / 2, sWidth, sHeight);
			} else {
				this.context.drawImage(image, sx, sy, sWidth, sHeight);
			}
		} else if (arguments.length === 9) {
			if (this.customProperties.imageAlign === "center") {
				this.context.drawImage(image, sx, sy, sWidth, sHeight, dx - dWidth / 2, dy - dHeight / 2, dWidth, dHeight);
			} else {
				this.context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
			}
		}
	}
	drawDigits(images, digits, x, y, width, height) {
		let digitsAsString = digits.toString(); 
		for (let i = 0; i < digitsAsString.length; i++) {
			this.context.drawImage(images[digitsAsString[i]], x - (digitsAsString.length) * width / 2 + i * width, y - height / 2, width, height);
		}
	}
	/* courtesy of https://web.archive.org/web/20171014203801/http://www.playmycode.com/blog/2011/06/realtime-image-tinting-on-html5-canvas/*/
	generateRGBKs(img) {
		let w = img.width;
		let h = img.height;
		let rgbks = [];
		let canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		let ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		let pixels = ctx.getImageData(0, 0, w, h).data;
		/*
		 * 4 is used to ask for 3 images: red, green, blue and
		 *	black in that order
		 */
		let length = pixels.length;
		let l = 0;
		for (let rgbI = 0; rgbI < 4; rgbI++) {
			let canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			let ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
			let to = ctx.getImageData(0, 0, w, h);
			let toData = to.data;
			for (let i = 0; i < length; i += 4) {
				// ignore alpha 0 values
				if (pixels[i + 3] === 0) {
					continue;
				}
				toData[i] = (rgbI === 0) ? pixels[i] : 0;
				toData[i + 1] = (rgbI === 1) ? pixels[i + 1] : 0;
				toData[i + 2] = (rgbI === 2) ? pixels[i + 2] : 0;
				toData[i + 3] = pixels[i + 3];
			}
			ctx.putImageData(to, 0, 0);
			rgbks.push(canvas);
		}
		return rgbks;
	}
	generateTintImage(img, rgbks, red, green, blue, width, height) {
		if (width === undefined) {
			width = img.width;
		}
		if (height === undefined) {
			height = img.height;
		}
		let buff = document.createElement("canvas");
		buff.width = width;
		buff.height = height;
		let ctx = buff.getContext("2d");
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = "copy";
		ctx.drawImage(rgbks[3], 0, 0, width, height);
		ctx.globalCompositeOperation = "lighten";
		if (red > 0) {
			ctx.globalAlpha = red / 255;
			ctx.drawImage(rgbks[0], 0, 0, width, height);
		}
		if (green > 0) {
			ctx.globalAlpha = green / 255;
			ctx.drawImage(rgbks[1], 0, 0, width, height);
		}
		if (blue > 0) {
			ctx.globalAlpha = blue / 255;
			ctx.drawImage(rgbks[2], 0, 0, width, height);
		}
		let bufferAsImage = document.createElement("img");
		bufferAsImage.src = buff.toDataURL("image/png");
		return bufferAsImage;
	}
	combineImages(img1, img2) {
		let buff = document.createElement("canvas");
		buff.width = img1.width;
		buff.height = img1.width;
		let ctx = buff.getContext("2d");
		ctx.drawImage(img2, 0, 0, buff.width, buff.height);
		ctx.drawImage(img1, 0, 0, buff.width, buff.height);
		let bufferAsImage = document.createElement("img");
		bufferAsImage.src = buff.toDataURL("image/png");
		return bufferAsImage;
	}
}