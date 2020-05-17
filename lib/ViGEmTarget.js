const { EventEmitter } = require('events');

const vigemclient = require('../build/Release/vigemclient');
const { VIGEM_ERRORS } = require('./common');

class NotConnectedError extends Error {
	constructor() {
		super("Target is not connected");
	}
}

class ViGEmTarget extends EventEmitter {
	constructor(client) {
		super();

		this._client = client;
		this._target = null;

		this._connected = false;
		this._report = null;
		this._updateMode = "auto";

		this._buttons = {};
		this._axes = {};
	}

	get vendorID() {
		this._checkConnection();
		return vigemclient.vigem_target_get_vid(this._target);
	}

	set vendorID(vid) {
		this._checkConnection();
		return vigemclient.vigem_target_set_vid(this._target, vid);
	}

	get productID() {
		this._checkConnection();
		return vigemclient.vigem_target_get_pid(this._target);
	}

	set productID(pid) {
		this._checkConnection();
		return vigemclient.vigem_target_set_pid(this._target, pid);
	}

	get index() {
		this._checkConnection();
		return vigemclient.vigem_target_get_index(this._target);
	}

	get type() {
		this._checkConnection();
		return vigemclient.vigem_target_get_type(this._target);
	}

	get attached() {
		if (!this._connected) return false;
		return vigemclient.vigem_target_is_attached(this._target);
	}

	get updateMode() {
		return this._updateMode;
	}

	set updateMode(mode) {
		if (!["auto", "manual"].includes(mode)) throw new Error("Invalid mode");
		this._updateMode = mode;
	}

	get button() {
		return this._buttons;
	}

	get axis() {
		return this._axes;
	}

	_alloc() {
		throw new Error("Method not implemented");
	}

	_checkConnection() {
		if (!this._connected) throw new NotConnectedError();
	}

	connect() {
		let client = this._client._handle;

		let target = this._alloc();

		let errCode = vigemclient.vigem_target_add(client, target);
		let errMsg = VIGEM_ERRORS[errCode];

		if (errMsg == "VIGEM_ERROR_NONE") {
			this._connected = true;
			this._target = target;
			return null;
		} else {
			this._connected = false;
			this._target = null;
			return new Error(errMsg);
		}
	}

	disconnect() {
		this._checkConnection();

		let client = this._client._handle;
		let errCode = vigemclient.vigem_target_remove(client, this._target);
		let errMsg = VIGEM_ERRORS[errCode];

		if (errMsg == "VIGEM_ERROR_NONE") {
			this._connected = false;
			this._target = null; // finalizer takes care of the clean up
			return null;
		} else {
			return new Error(errMsg);
		}
	}

	update() {
		throw new Error("Method not implemented");
	}
}

module.exports = { ViGEmTarget };
