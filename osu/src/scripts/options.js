let defaultOptions = {
	version: 7,
	Audio: {
		masterVolume: 1,
		musicVolume: 1,
		effectsVolume: 1,
	},
	Inputs: {
		keyboardLeftButton: "z",
		keyboardRightButton: "x",
		mouseSensitivity: 0.1,
		useRawPosition: false,
	},
	UserInterface: {
		menuParallax: true,
		backgroundBlur: 0.5,
	},
	Gameplay: {
		notelockStyle: "Full (original osu! implementation)",
		backgroundDim: 0.8,
		draw300Hits: true,
		snakingSlidersIn: true,
		cursorTrails: "Interpolated",
	},
	Performance: {
		maxFrameRate: "VSync",
		showFps: true,
		sliderResolution: 0,
		scoreUpdateRate: "Equal to frame rate",
	},
	Skin: {
		currentSkin: "Ajax Transparent",
	},
	Maintainence: {
		developerMode: false,
	}
};
if (window.localStorage.getItem("options") === null) {
	window.localStorage.setItem("options", JSON.stringify(defaultOptions));
} else {
	let optionsTemp = JSON.parse(window.localStorage.getItem("options"));
	if (optionsTemp.version < defaultOptions.version) {
		localStorage.setItem("options", JSON.stringify(defaultOptions));
		console.log("Your options was reset due to new version");
	} else {
		defaultOptions = optionsTemp;
	}
}
let types = [
	"slider",
	"slider",
	"slider",

	"text",
	"text",
	"slider",
	"checkbox",

	"checkbox",
	"slider",

	"selectbox",
	"slider",
	"checkbox",
	"checkbox",
	"selectbox",

	"selectbox",
	"checkbox",
	"slider",
	"selectbox",

	"selectbox",

	"checkbox",
];

export function getTypes() {
	return types;
}
export function get() {
	return defaultOptions;
}
export function getProperty(group, option) {
	return defaultOptions[group][option];
}
export function save() {
	localStorage.setItem("options", JSON.stringify(defaultOptions));
	console.log("settings saved!");
}
export function update(group, option, value) {
	defaultOptions[group][option] = value;
}
export function read() {
	defaultOptions = JSON.parse(window.localStorage.getItem("options"));	
}