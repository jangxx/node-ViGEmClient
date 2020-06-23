const vigemclient = require('../build/Release/vigemclient');
const { ViGEmTarget } = require('./ViGEmTarget');
const { XUSB_BUTTON, VIGEM_ERRORS } = require('./common');
const { InputButton } = require('./InputButton');
const { InputAxis } = require('./InputAxis');
const { X360ControllerReport } = require('./X360ControllerReport');

class X360Controller extends ViGEmTarget {
	constructor(client) {
		super(client);

		this._report = new X360ControllerReport();

		this._notificationData = {
			LargeMotor: null,
			SmallMotor: null,
			LedNumber: null
		};

		let buttons = {};
		for(let name in XUSB_BUTTON) {
			if (!name.includes("DPAD")) { // DPAD is handled as an axis
				buttons[name] = new InputButton(this, name);
			}
		}

		this._buttons = Object.freeze(buttons);

		this._axes = Object.freeze({
			leftX: new InputAxis(this, "sThumbLX", { minIn: -1, maxIn: 1, minOut: -32768, maxOut: 32767 }),
			leftY: new InputAxis(this, "sThumbLY", { minIn: -1, maxIn: 1, minOut: -32768, maxOut: 32767 }),
			rightX: new InputAxis(this, "sThumbRX", { minIn: -1, maxIn: 1, minOut: -32768, maxOut: 32767 }),
			rightY: new InputAxis(this, "sThumbRY", { minIn: -1, maxIn: 1, minOut: -32768, maxOut: 32767 }),
			leftTrigger: new InputAxis(this, "bLeftTrigger", { minIn: 0, maxIn: 1, minOut: 0, maxOut: 255 }),
			rightTrigger: new InputAxis(this, "bRightTrigger", { minIn: 0, maxIn: 1, minOut: 0, maxOut: 255 }),
			dpadHorz: new InputAxis(this, "dpadH", { minIn: -1, maxIn: 1, minOut: -1, maxOut: 1 }),
			dpadVert: new InputAxis(this, "dpadV", { minIn: -1, maxIn: 1, minOut: -1, maxOut: 1 })
		});
	}

	get userIndex() {
		this._checkConnection();
		return vigemclient.vigem_target_x360_get_user_index(this._client._handle, this._target);
	}

	_alloc() {
		return vigemclient.vigem_target_x360_alloc();
	}

	connect(opts = {}) {
		let err = super.connect(opts);

		if (!err) {
			vigemclient.vigem_target_x360_register_notification(this._client._handle, this._target, data => {
				if (data.LargeMotor != this._notificationData.LargeMotor) {
					this.emit("large motor", data.LargeMotor);
				}

				if (data.SmallMotor != this._notificationData.SmallMotor) {
					this.emit("small motor", data.SmallMotor);
				}
				
				if (data.LargeMotor != this._notificationData.LargeMotor || data.SmallMotor != this._notificationData.SmallMotor) {
					this.emit("vibration", { large: data.LargeMotor, small: data.SmallMotor });
				}

				if (data.LedNumber != this._notificationData.LedNumber) {
					this.emit("led change", data.LedNumber);
				}
				
				this._notificationData = data;

				this.emit("notification", data);
			});
		}

		return err;
	}

	disconnect() {
		this._checkConnection();

		vigemclient.vigem_target_x360_unregister_notification(this._target);

		super.disconnect();
	}

	update() {
		this._checkConnection();

		let client = this._client._handle;

		let errCode = vigemclient.vigem_target_x360_update(client, this._target, this._report.reportObj);
		let errMsg = VIGEM_ERRORS[errCode];

		if (errMsg == "VIGEM_ERROR_NONE") {
			return null;
		} else {
			return new Error(errMsg);
		}
	}
}

module.exports = { X360Controller };