export class Keyboard {
	constructor(id) {
		this.canUserControl = true;
		/* the element the keyboard is attached to */
		this.element = document.getElementById(id);
		this.keys = [];
		this.releasedKeys = [];
		/* maps keys to a hash map so that they can be accessed in O(1) time */
		this.keyMap = {};
		/* IIFE to set keyMap */
		(() => {
			let keyData = [];
			/* key datas for commonly used characters */
			keyData[8] = "backspace";
			keyData[9] = "tab";
			keyData[13] = "enter";
			keyData[16] = "shift";
			keyData[17] = "control";
			keyData[18] = "alt";
			keyData[27] = "escape";
			keyData[32] = "space";
			keyData[37] = "arrowLeft";
			keyData[38] = "arrowUp";
			keyData[39] = "arrowRight";
			keyData[40] = "arrowDown";
			keyData[46] = "delete";
			const alphabet = "abcdefghijklmnopqrstuvwxyz";
			/* keys 0-9 */
			for (let i = 48; i < 58; i++) {
				keyData[i] = i - 48;
			}
			/* keys a-z */
			for (let i = 65; i < 91; i++) {
				keyData[i] = alphabet.substr(i - 65, 1);
			}
			/* numpad keys 0-9 */
			for (let i = 96; i < 106; i++) {
				keyData[i] = "numpad" + (i - 96);
			}
			/* fn keys */
			for (let i = 113; i < 125; i++) {
				keyData[i] = "f" + (i - 112);
			}
			keyData[186] = ";";
			keyData[187] = "=";
			keyData[188] = ",";
			keyData[189] = "-";
			keyData[190] = ".";
			keyData[191] = "/";
			keyData[219] = "[";
			keyData[220] = "\\";
			keyData[221] = "]";
			keyData[222] = "\'";
			/* remap keys from array of values to hash map */
			for (let i = 0; i < keyData.length; i++) {
				if (keyData[i]) {
					this.keyMap[keyData[i]] = i;
				}
			}
		})();
		const that = this;
		this.keydown = function(e) {
			if (that.canUserControl) {
				if (that.keys[e.keyCode]) {
					that.releasedKeys[e.keyCode] = false;
				}
				that.keys[e.keyCode] = true;
			}
		};
		this.keyup = function(e) {
			if (that.canUserControl) {
				that.releasedKeys[e.keyCode] = true;
				that.keys[e.keyCode] = false;
			}
		};
	}
	disableUserControl() {
		this.canUserControl = false;
	}
	enableUserControl() {
		this.canUserControl = true;
	}
	getKeyDown(keyName) {
		return this.keys[this.keyMap[keyName]];
	}
	emulateKeyDown(keyName) {
		this.keys[this.keyMap[keyName]] = true;
	}
	emulateKeyUp(keyName) {
		this.keys[this.keyMap[keyName]] = false;
	}
	init() {
		this.element.addEventListener("keydown", this.keydown);
		this.element.addEventListener("keyup", this.keyup);
	}
	/* 
	 *	although not used much as the application will most likely instantiate only 1 input class
	 *	it is useful incase as it will destroy past event listeners preventing leaks
	 */
	destroy() {
		this.element.removeEventListener("keydown", this.keydown);
		this.element.removeEventListener("keyup", this.keyup);
	}
}