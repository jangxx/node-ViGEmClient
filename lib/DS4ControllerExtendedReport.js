const { clamp, rangeMap } = require('./common');
const { DS4ControllerReport } = require('./DS4ControllerReport');

class DS4TrackpadTouch {
	constructor() {
		this._timestamp = 0;

		this._finger1 = null;
		this._finger2 = null;
	}

	_toNativeObject() {
		return {
			packetCounter: this._timestamp,
			finger1: this._finger1 !== null,
			finger1_x: (this._finger1 !== null) ? clamp(this._finger1.x, 0, 1920) : 0,
			finger1_y: (this._finger1 !== null) ? clamp(this._finger1.y, 0, 943) : 0,
			finger2: this._finger2 !== null,
			finger2_x: (this._finger2 !== null) ? clamp(this._finger2.x, 0, 1920) : 0,
			finger2_y: (this._finger2 !== null) ? clamp(this._finger2.y, 0, 943) : 0,
		};
	}

	getFingersDown() {
		return ((this._finger1 !== null) ? 1 : 0) + ((this._finger2 !== null) ? 1 : 0);
	}

	addFingerDown(x, y) {
		if (this._finger1 === null) {
			this._finger1 = { x, y };
		} else if (this._finger2 === null) {
			this._finger2 = { x, y };
		} else {
			throw new Error("You can only add up to two fingers to this DS4TrackpadTouch object.");
		}
	}

	allFingersUp() {
		this._finger1 = null;
		this._finger2 = null;
	}
}

class DS4ControllerExtendedReport extends DS4ControllerReport {
	constructor(parent) {
		super();

		this.reset();

		this._touchTimestamp = 0; // will not be reset

		this._parent = parent;
	}

	reset() {
		super.reset();

		this.reportObj = {
			wButtons: 8, // dpad_none
			bThumbLX: 127,
			bThumbLY: 127,
			bThumbRX: 127,
			bThumbRY: 127,
			bTriggerL: 0,
			bTriggerR: 0,
			bSpecial: 0,
			wTimestamp: 0,
			bBatteryLvl: 0,
			wGyroX: 0,
			wGyroY: 0,
			wGyroZ: 0,
			wAccelX: 0,
			wAccelY: 0,
			wAccelZ: 0,
			// bBatteryLvlSpecial: 0,
			bTouchPacketsN: 0,
			touches: [],
		};

		this._lastSend = 0;
	}

	addTouch(touch) {
		if (!(touch instanceof DS4TrackpadTouch)) throw new Error("Invalid touch type");

		this.reportObj.touches.unshift(touch); // add to the front of the touches array

		if (this._parent.updateMode == "auto") {
			this._parent.update();
		}
	}

	/**
	 * Set the gyro to a rotation. Each value is between -2000deg and 2000deg
	 * @param {number} pitch 
	 * @param {number} yaw 
	 * @param {number} roll 
	 */
	setGyro(pitch, yaw, roll) {
		const gyroSpec = {
			minIn: -2000,
			maxIn: 2000,
			minOut: -32767,
			maxOut: 32767,
		};

		this.reportObj.wGyroX = rangeMap(pitch, gyroSpec);
		this.reportObj.wGyroY = rangeMap(yaw, gyroSpec);
		this.reportObj.wGyroZ = rangeMap(roll, gyroSpec);
	}

	/**
	 * Set the accelerometer measurement. Each value is measured in g-force and between -4 and 4.
	 * @param {*} x 
	 * @param {*} y 
	 * @param {*} z 
	 */
	setAccelerometer(x, y, z) {
		const accelSpec = {
			minIn: -4,
			maxIn: 4,
			minOut: -32767,
			maxOut: 32767,
		};

		this.reportObj.wAccelX = rangeMap(x, accelSpec);
		this.reportObj.wAccelY = rangeMap(y, accelSpec);
		this.reportObj.wAccelZ = rangeMap(z, accelSpec);
	}

	/**
	 * Prepare this report for sending:
	 * - update bTouchPacketsN
	 * - update wTimestamp
	 * - prepare touches array
	 */
	prepareSend() {
		if (this.reportObj.touches.length > 3) {
			this.reportObj.touches = this.reportObj.touches.slice(0, 3);
		}

		this.reportObj.touches.forEach(touch => touch._timestamp = this._touchTimestamp++);
		this.reportObj.touches = this.reportObj.touches.map(touch => touch._toNativeObject());

		this.reportObj.bTouchPacketsN = this.reportObj.touches.length;

		if (this._lastSend == 0) {
			this.reportObj.wTimestamp = 0;
		} else {
			const now = microNow();
			const msecDiff = now - this._lastSend;

			// apparently (according to "documentation"), the value is commonly incremented by 188 at an update rate of 1.25ms per update.
			// I'm just going to emulate this behavior here, but if this doesn't work we might need to change this in the future
			this.reportObj.wTimestamp += msecDiff / 1.25 * 188;

			this._lastSend = now;
		}
	}

	/**
	 * Mark this report as sent, which resets the touches and the touch counter
	 */
	finishSend() {
		this.reportObj.bTouchPacketsN = 0;
		this.reportObj.touches = [];
	}
}

function microNow() {
	const [ sec, nsec ] = process.hrtime();

	return sec * 1000000 + nsec / 1000;
}

module.exports = {
	DS4ControllerExtendedReport,
	DS4TrackpadTouch,
};