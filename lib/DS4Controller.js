const vigemclient = require('../build/Release/vigemclient');
const { ViGEmTarget } = require('./ViGEmTarget');
const { DS4_BUTTONS, DS4_SPECIAL_BUTTONS, VIGEM_ERRORS } = require('./common');
const { InputButton } = require('./InputButton');
const { InputAxis } = require('./InputAxis');
const { DS4ControllerReport } = require('./DS4ControllerReport');

class DS4Controller extends ViGEmTarget {
	constructor(client) {
		super(client);

		this._report = new DS4ControllerReport();

		this._notificationData = {
			LargeMotor: null,
			SmallMotor: null,
			LightbarColor: { Red: null, Green: null, Blue: null }
		};

		let buttons = {};
		for(let name in DS4_BUTTONS) {
			buttons[name] = new InputButton(this, name);
		}
		for(let name in DS4_SPECIAL_BUTTONS) {
			buttons[name] = new InputButton(this, name);
		}

		this._buttons = Object.freeze(buttons);

		this._axes = Object.freeze({
			leftX: new InputAxis(this, "bThumbLX", { minIn: -1, maxIn: 1, minOut: 0, maxOut: 255 }),
			leftY: new InputAxis(this, "bThumbLY", { minIn: -1, maxIn: 1, minOut: 255, maxOut: 0 }),
			rightX: new InputAxis(this, "bThumbRX", { minIn: -1, maxIn: 1, minOut: 0, maxOut: 255 }),
			rightY: new InputAxis(this, "bThumbRY", { minIn: -1, maxIn: 1, minOut: 255, maxOut: 0 }),
			leftTrigger: new InputAxis(this, "bTriggerL", { minIn: 0, maxIn: 1, minOut: 0, maxOut: 255 }),
			rightTrigger: new InputAxis(this, "bTriggerR", { minIn: 0, maxIn: 1, minOut: 0, maxOut: 255 }),
			dpadHorz: new InputAxis(this, "dpadH", { minIn: -1, maxIn: 1, minOut: -1, maxOut: 1 }),
			dpadVert: new InputAxis(this, "dpadV", { minIn: -1, maxIn: 1, minOut: -1, maxOut: 1 })
		});
	}

	_alloc() {
		return vigemclient.vigem_target_ds4_alloc();
	}

	connect(opts = {}) {
		let err = super.connect(opts);

		if (!err) {
			vigemclient.vigem_target_ds4_register_notification(this._client._handle, this._target, data => {
				if (data.LargeMotor != this._notificationData.LargeMotor) {
					this.emit("large motor", data.LargeMotor);
				}

				if (data.SmallMotor != this._notificationData.SmallMotor) {
					this.emit("small motor", data.SmallMotor);
				}
				
				if (data.LargeMotor != this._notificationData.LargeMotor || data.SmallMotor != this._notificationData.SmallMotor) {
					this.emit("vibration", { large: data.LargeMotor, small: data.SmallMotor });
				}

				if (!colorsEqual(data.LightbarColor, this._notificationData.LightbarColor)) {
					this.emit("color change", data.LightbarColor);
				}
				
				this._notificationData = data;

				this.emit("notification", data);
			});
		}

		return err;
	}

	disconnect() {
		this._checkConnection();

		vigemclient.vigem_target_ds4_unregister_notification(this._target);

		super.disconnect();
	}

	update() {
		this._checkConnection();

		let client = this._client._handle;

		let errCode = vigemclient.vigem_target_ds4_update(client, this._target, this._report.reportObj);
		let errMsg = VIGEM_ERRORS[errCode];

		if (errMsg == "VIGEM_ERROR_NONE") {
			return null;
		} else {
			return new Error(errMsg);
		}
	}
}

module.exports = { DS4Controller };

function colorsEqual(c1, c2) {
	return `${c1.Red}${c1.Green}${c1.Blue}` == `${c2.Red}${c2.Green}${c2.Blue}`;
}