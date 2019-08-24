const vigemclient = require('../build/Release/vigemclient');
const { VIGEM_ERRORS } = require('./common');

const { X360Controller } = require('./X360Controller');
const { DS4Controller } = require('./DS4Controller');

class ViGEmClient {
	constructor() {
		this._clientHandle = null;

		this._connected = false;
	}

	get _handle() {
		return this._clientHandle;
	}

	connect() {
		this._clientHandle = vigemclient.vigem_alloc();

		let errCode = vigemclient.vigem_connect(this._clientHandle);
		let errMsg = VIGEM_ERRORS[errCode];

		if (errMsg == "VIGEM_ERROR_NONE") {
			this._connected = true;
			return null;
		} else {
			this._connected = false;
			return new Error(errMsg);
		}
	}

	createX360Controller() {
		if (!this._connected) throw new Error("Not connected");

		return new X360Controller(this);
	}

	createDS4Controller() {
		if (!this._connected) throw new Error("Not connected");

		return new DS4Controller(this);
	}
}

module.exports = { ViGEmClient };