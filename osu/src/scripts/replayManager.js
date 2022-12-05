export class Replay {
	constructor() {
		this.mouseEvents = [];
		this.keyEvents = [];
	}
	addMouseEvent(event) {	
		this.mouseEvents.push(event);
	}
	addKeyEvent(event) {	
		this.keyEvents.push(event);
	}
}
export class MouseReplayEvent {
	constructor(time, x, y) {
		this.time = time;
		this.x = x;
		this.y = y;
	}
}
export class KeyboardReplayEvent {
	constructor(time, key, state) {
		this.time = time;
		/* 
		 *	either 1, 2, 3
		 *	0 being the left key 
		 *	1 being the right key
		 *	2 being space (skip beginning)
		 */
		this.key = key;
		/* 
		 *	either down
		 *  or up
		 */
		this.state = state;
	}
}