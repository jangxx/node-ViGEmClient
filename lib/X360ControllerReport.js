const { XUSB_BUTTON, InputReport } = require('./common');

class X360ControllerReport extends InputReport {
	constructor() {
		super();

		this.reportObj = {
			wButtons: 0,
			bLeftTrigger: 0,
			bRightTrigger: 0,
			sThumbLX: 0,
			sThumbLY: 0,
			sThumbRX: 0,
			sThumbRY: 0,
		};

		this._dpadH = 0;
		this._dpadV = 0;
	}

	updateButton(name, value) {
		if (value) {
			this.reportObj.wButtons |= XUSB_BUTTON[name];
		} else {
			this.reportObj.wButtons &= ~XUSB_BUTTON[name];
		}
	}

	updateAxis(name, value) {
		switch (name) {
			case "dpadH":
				this._dpadH = value;

				if (value > 0.5) {
					this.updateButton("DPAD_RIGHT", true);
					this.updateButton("DPAD_LEFT", false);
				} else if (value < -0.5) {
					this.updateButton("DPAD_RIGHT", false);
					this.updateButton("DPAD_LEFT", true);
				} else {
					this.updateButton("DPAD_RIGHT", false);
					this.updateButton("DPAD_LEFT", false);
				}
				break;
			case "dpadV":
				this._dpadV = value;

				if (value > 0.5) {
					this.updateButton("DPAD_UP", true);
					this.updateButton("DPAD_DOWN", false);
				} else if (value < -0.5) {
					this.updateButton("DPAD_UP", false);
					this.updateButton("DPAD_DOWN", true);
				} else {
					this.updateButton("DPAD_UP", false);
					this.updateButton("DPAD_DOWN", false);
				}
				break;
			default:
				this.reportObj[name] = value;
		}
	}

	getButtonValue(name) {
		return (this.reportObj.wButtons & XUSB_BUTTON[name]) > 0;
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

module.exports = { X360ControllerReport };