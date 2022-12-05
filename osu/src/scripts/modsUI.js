import {Mods} from "./mods.js"
const mods = new Mods();
let isUIOpen = false;
let el = [
	"mods-ui",
	"mods-blue-one",
	"mods-blue-two",
	"mods-blue-three",
	"mods-blue-four",
];
let elOpenTimes = [
	"0.75s",
	"0.35s",
	"0.45s",
	"0.55s",
	"0.65s",
];
let elCloseTimes = [
	"0.75s",
	"1.45s",
	"1.25s",
	"1.05s",
	"0.85s",
];
	export function getMods() {
		return mods;
	}
	export function isOpen() {
		return isUIOpen;
	}
	export function closeModsUI() {
		for (let i = 0; i < el.length; i++) {
			let element = document.getElementById(el[i]);
			element.style.transitionDuration = elCloseTimes[i];
			element.style.bottom = "-76vh";	
		}
		isUIOpen = false;
	}
	export function openModsUI() {
		for (let i = 0; i < el.length; i++) {
			let element = document.getElementById(el[i]);
			element.style.transitionDuration = elOpenTimes[i];
			element.style.bottom = "0";	
		}
		isUIOpen = true;
	}
	export function toggleModsUI() {
		if (this.isOpen() === false) {
			this.openModsUI();
		} else {
			this.closeModsUI();
		}
	}
	export function disableAllMods() {
		let elements = document.getElementsByClassName("mod-icons");
		for (let i = 0; i < elements.length; i++) {
			elements[i].className = elements[i].className.replace(/\bmod-selected\b/g, "");
			let modName = elements[i].id.replace("mod-", "");
			mods.disableMod(modName)
		}
	}
	export function showEnabledMods() {
		let elements = document.getElementsByClassName("mod-icons");
		for (let i = 0; i < elements.length; i++) {
			let modName = elements[i].id.replace("mod-", "");
			if (this.getMods()[modName]) {
				elements[i].classList.add("mod-selected");
			} else {
				elements[i].classList.remove("mod-selected");
			}
		}
	}