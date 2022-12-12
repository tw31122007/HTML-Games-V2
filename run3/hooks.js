Reflect.defineProperty(Document.prototype, 'domain', {
	get: () => 'player03.com',
});

const original_src = Reflect.getOwnPropertyDescriptor(Image.prototype, 'src');
const ad = 'img/ads/Spinner.png';

Reflect.defineProperty(Image.prototype, 'src', {
	get: original_src.get,
	set(value) {
		if (value.startsWith(ad)) {
			value = value.replace(ad, 'img/gads/Spinner.png');
		}
		return Reflect.apply(original_src.set, this, [value]);
	},
});
