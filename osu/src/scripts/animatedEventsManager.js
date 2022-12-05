export class AnimatedEventsManager {
	constructor() {
		this.events = [];
		this.eventsEveryFrame = [];
		this.currentEvent = 0;
		this.isDone = false;
	}
	addEvent(event) {
		this.events.push(event);
	}
	addEventEveryFrame(event) {
		this.eventsEveryFrame.push(event);
	}
	runEvent(eventIndex) {
		if (this.events[eventIndex]) {
			this.events[eventIndex].callback();
			return;
		}
		throw new Error("eventIndex out of range");
	}
	update(time) {
		while (this.events[this.currentEvent] && time >= this.events[this.currentEvent].time) {
			this.runEvent(this.currentEvent);
			this.currentEvent++;
		}
		for (let i = 0; i < this.eventsEveryFrame.length; i++) {
			this.eventsEveryFrame[i].callback(time);
		}
		if (this.currentEvent > this.events.length) {
			this.isDone = true;
		}
	}
}
export class UntimedEvent {
	constructor(callback) {
		this.callback = callback;
	}
};
export class TimedEvent extends UntimedEvent {
	constructor(time, callback) {
		super(callback);
		this.time = time;
	}
};