(function (w) {
	w.drewsnow = {
		'draggable': (container, dragItem) => {
			if (dragItem === undefined) dragItem = container;

			var xOffset = yOffset = 0,
				active = false,
				currentX,
				currentY,
				initialX,
				initialY;

			container.addEventListener('touchstart', dragStart, false);
			document.addEventListener('touchend', dragEnd, false);
			document.addEventListener('touchmove', drag, false);

			container.addEventListener('mousedown', dragStart, false);
			document.addEventListener('mouseup', dragEnd, false);
			document.addEventListener('mousemove', drag, false);

			function dragStart(e) {
				if (e.type === 'touchstart') {
					initialX = e.touches[0].clientX - xOffset;
					initialY = e.touches[0].clientY - yOffset;
				} else {
					initialX = e.clientX - xOffset;
					initialY = e.clientY - yOffset;
				}
				let ignoredElems = ['INPUT', 'BUTTON', 'A', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN'];
				if (e.target === dragItem || container === dragItem && ignoredElems.indexOf(e.target.nodeName) == -1) active = true;
			}

			function dragEnd(e) {
				initialX = currentX;
				initialY = currentY;
				active = false;
			}

			function drag(e) {
				if (active) {
					e.preventDefault();
					if (e.type === 'touchmove') {
						currentX = e.touches[0].clientX - initialX;
						currentY = e.touches[0].clientY - initialY;
					} else {
						currentX = e.clientX - initialX;
						currentY = e.clientY - initialY;
					}
					xOffset = currentX;
					yOffset = currentY;
					setTranslate(currentX, currentY, container);
				}
			}

			function setTranslate(xPos, yPos, el) {
				el.style.transform = 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)';
			}
		},

		'addStyle': (css) => {
			let elem = document.createElement('style');
			elem.textContent = css;
			document.head.appendChild(elem);
			return elem;
		},

		'addHtml': (html, parent) => {
			elements = new DOMParser().parseFromString(html, 'text/html');
			container = elements.body.firstChild;
			(parent || document.body).appendChild(container);
			return container;
		},

		'htmlEncode': (str) => {
			return str
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;');
		},

		'addKeyBind': function (func, code = -1, key = '') {
			this.keybinds.push({
				'key': key,
				'on': false,
				'func': func,
				'code': code
			});
		},

		'removeKeyBind': function (code) {
			for (let i = 0; i < this.keybinds.length; i++) {
				let binds = this.keybinds;
				if (binds[i].code === code) {
					binds.splice(i, 1);
					return true;
				}
			}
			return false;
		},

		'keybinds': [],

		'getAngle': (x1, y1, x2, y2) => {
			return Math.atan2(y1 - y2, x1 - x2);
		},

		'getDist': (x1, y1, x2, y2) => {
			var a = x1 - x2;
			var b = y1 - y2;
			return Math.sqrt(a * a + b * b);
		},

		'closestObj': function (you, objects) {
			let closestObj = objects[0];
			let closestDist = Infinity;
			for (let i = 0; i < objects.length; i++) {
				let obj = objects[i],
					dist = this.getDist(you.x, you.y, obj.x, obj.y);
				if (dist < closestDist) {
					closestObj = obj;
					closestDist = dist;
				}
			}
			return closestObj;
		},

		'init': function () {
			var binds = this.keybinds;
			document.body.addEventListener('keydown', (e) => {
				for (let i = 0; i < binds.length; i++) {
					let data = binds[i];
					if ((e.which || e.keyCode) == data.code) {
						data.on = !data.on;
						data.func();
					}
				}
			});
		}
	}
	w.drewsnow.init();
})(window);

var skins = [
	{
		'name': 'Default',
		'id': 0
	}, {
		'name': 'Triangles',
		'id': 1
	}, {
		'name': 'Circle',
		'id': 2
	}, {
		'name': 'Checkered',
		'id': 3
	}, {
		'name': 'Cat',
		'id': 4
	}, {
		'name': 'Dog',
		'id': 5
	}, {
		'name': 'Mouse',
		'id': 6
	}, {
		'name': 'Bird',
		'id': 7
	},
],
	canvas = document.getElementById('gameCanvas'),
	noJumpCooldown = false,
	flight = false,
	mouseY = 100,
	collision = true;

canvas.addEventListener('mousemove', (e) => { mouseY = e.clientY - 5; });

function exploitLoop() {
	// Flight
	if (flight && mouseY < Game.player.y) {
		let speed = Number(document.getElementById('flight-speed').value);
		Game.player.jumpReady = true;
		Game.player.y = mouseY;
		Game.player.jump(speed, 750);
		
	}

	// Jump cooldown
	if (noJumpCooldown) Game.player.jumpReady = true;
	window.requestAnimationFrame(exploitLoop);
}
exploitLoop();

var elem = drewsnow.addHtml(`
	<div style="top: 0; left: 0; z-index: 2147483647; transition: opacity .3s; opacity: 0; pointer-events: none; font-family: 'Courier New', Courier, monospace; z-index: 2147483647; background-color: #202020; position: fixed; width: 350px; height: 475px; margin: 0; padding: 0; box-shadow: 0 5px 35px rgba(0, 0, 0, .75)">
		<nav style="cursor: move; user-select: none; text-align: right; color: #fff; position: absolute; width: 348px; height: 25px; margin: 1px;">
			<span onclick="alert('Ha! No help for you loser!')" aria-label="Open Settings Model" style="font-size: 15px; cursor: pointer; width: 100%; height: 100%;">?</span>
			<span onclick="this.parentElement.parentElement.remove()" aria-label="Close Interface Model" style="cursor: pointer; width: 100%; height: 100%; padding-right: 5px; font-size: 20px;">&times;</span>
		</nav>
	
		<div class="exploit-container" style="padding: 10px 5px; border-radius: 3px; background-color: #141414; position: absolute; bottom: 0; width: auto; height: 425px; margin: 2px;">
			<button id="instantwin">Instant win</button>
			<button id="highscores">Unlock all levels and highscore</button>
			<button id="nocooldown">No jump cooldown</button>
			<button id="flight">Flight</button>
			<button id="removespikes">Remove Spikes</button>
			<button id="noclip">No Clip</button>

			Skin<input value="0" min="0" max="7" type="range" class="slider" id="class-selecter">

			Flight Speed<input value="3" min="1" max="30" type="range" class="slider" id="flight-speed">
		</div>
		
	</div>
`);

drewsnow.addStyle(`
	input.slider {
		-webkit-appearance: none;
		width: 100%;
		height: 15px;
		border-radius: 5px;
		background: #d3d3d3;
		outline: none;
		opacity: 0.7;
		-webkit-transition: .2s;
		transition: opacity .2s;
	}

	input.slider:hover {
		opacity: 1;
	}

	input.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background: #4CAF50;
		cursor: pointer;
	}

	input.slider::-moz-range-thumb {
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background: #4CAF50;
		cursor: pointer;
	}

	.exploit-container {
		background: rgba(111, 0, 255, 0.1);
		background: linear-gradient(347deg, rgba(111, 0, 255, 0.1) 0%, rgba(2, 10, 10, 0.1) 50%, rgba(4, 56, 210, 0.1) 100%);
		user-select: none;
	}

	.exploit-container button {
		background: rgb(33, 0, 33);
		background: linear-gradient(347deg, rgb(33, 0, 33) 0%, rgb(33, 25, 0) 63%);
		border: 1px solid #08871b;
		width: 100%; height: 45px;
		border-radius: 10px;
		font-size: 17px;
		margin-top: 5px;
		outline: none;
		color: #fff;
	}

	.active {
		border: 1px solid #871308 !important;
	}
`);

drewsnow.draggable(elem, elem.firstElementChild);

drewsnow.addKeyBind(function () {
	elem.style.opacity = +this.on;
	elem.style.pointerEvents = (this.on ? 'auto' : 'none');
}, 192, '`');

document.getElementById('instantwin').addEventListener('click', () => {
	Game.player.completeLevel();
});

document.getElementById('highscores').addEventListener('click', () => {
	for (let i = 0; i < 100; i++)
		localStorage.setItem('level_' + i + '_score', '00:01');

	window.location.reload()
});

document.getElementById('nocooldown').addEventListener('click', function () {
	this.classList.toggle('active');
	noJumpCooldown = !noJumpCooldown;
});

document.getElementById('flight').addEventListener('click', function () {
	this.classList.toggle('active');
	flight = !flight;
});

document.getElementById('removespikes').addEventListener('click', () => {
	let map = Game.levelMap.map,
		spikes = [4, 5, 6, 7];

	for (let j = 0; j < map.length; ++j) {
		for (let i = 0; i < map[j].length; ++i) {
			let tile = map[j][i];
			if (spikes.indexOf(tile.type) != -1) {
				tile.type = 1;
				tile.spike = true;
			}
		}
	}
});

document.getElementById('noclip').addEventListener('click', function () {
	this.classList.toggle('active');
	collision = !collision;

	let map = Game.levelMap.map;

	for (let j = 0; j < map.length; ++j) {
		for (let i = 0; i < map[j].length; ++i) {
			if (!map[j][i].wasSolid) map[j][i].wasSolid = map[j][i].isSolid;

			map[j][i].isSolid = (collision === false ? false : map[j][i].wasSolid);
		}
	}
});

document.getElementById('class-selecter').value = localStorage.getItem('skin') || 0;
document.getElementById('class-selecter').addEventListener('change', function () {
	let skin = skins[Number(this.value)];
	localStorage.setItem('skin', skin.id);
});