const { DS4_BUTTONS, DS4_SPECIAL_BUTTONS, DS4_DPAD_DIRECTIONS, InputReport } = require('./common');

class DS4ControllerReport extends InputReport {
	constructor() {
		super();

		this.reset();
	}

	reset() {
		this.reportObj = {
			wButtons: 0,
			bThumbLX: 0,
			bThumbLY: 0,
			bThumbRX: 0,
			bThumbRY: 0,
			bTriggerL: 0,
			bTriggerR: 0,
			bSpecial: 0,
		};

		this._dpadH = 0;
		this._dpadV = 0;
	}

	updateButton(name, value) {
		if (name.includes("SPECIAL")) {
			if (value) {
				this.reportObj.bSpecial |= DS4_SPECIAL_BUTTONS[name];
			} else {
				this.reportObj.bSpecial &= ~DS4_SPECIAL_BUTTONS[name];
			}
		} else if (name.includes("DPAD")) {
			this.reportObj.wButtons &= 0xFFF0; // reset dpad
			this.reportObj.wButtons |= DS4_DPAD_DIRECTIONS[name];
		} else {
			if (value) {
				this.reportObj.wButtons |= DS4_BUTTONS[name];
			} else {
				this.reportObj.wButtons &= ~DS4_BUTTONS[name];
			}
		}
	}

	updateAxis(name, value) {
		switch (name) {
			case "dpadH":
				this._dpadH = value;
				this.updateButton(dpadButtonMap(this._dpadH, this._dpadV));
				break;
			case "dpadV":
				this._dpadV = value;
				this.updateButton(dpadButtonMap(this._dpadH, this._dpadV));
				break;
			default:
				this.reportObj[name] = value;
		}
	}

	getButtonValue(name) {
		if (name.includes("SPECIAL")) {
			return (this.reportObj.bSpecial & DS4_SPECIAL_BUTTONS[name]) > 0;
		} else if (name.includes("DPAD")) {
			return false; // dpad is not queried as buttons
		} else {
			return (this.reportObj.wButtons & DS4_BUTTONS[name]) > 0;
		}
	}

	getAxisValue(name) {
		switch (name) {
			case "dpadH":
				return this._dpadH;
			case "dpadV":
				return this._dpadV;
			default:
				return this.reportObj[name];
		}
	}
}

function dpadButtonMap(horz, vert) {
	switch (true) {
		case horz < 0.5 && horz > -0.5 && vert < 0.5 && vert > -0.5:
			return "DPAD_NONE";
		case horz < 0.5 && horz > -0.5 && vert > 0.5:
			return "DPAD_NORTH";
		case horz > 0.5 && vert > 0.5:
			return "DPAD_NORTHEAST";
		case horz > 0.5 && vert < 0.5 && vert > -0.5:
			return "DPAD_EAST";
		case horz > 0.5 && vert < -0.5 :
			return "DPAD_SOUTHEAST";
		case horz < 0.5 && horz > -0.5 && vert < -0.5:
			return "DPAD_SOUTH";
		case horz < -0.5 && vert < -0.5:
			return "DPAD_SOUTHWEST";
		case horz < -0.5 && vert < 0.5 && vert > -0.5:
			return "DPAD_WEST";
		case horz < -0.5 && vert > 0.5:
			return "DPAD_NORTHWEST";
		default:
			throw new Error("This configuration is not valid");
	}
}

module.exports = { DS4ControllerReport };