const XUSB_BUTTON = Object.freeze({
	DPAD_UP: 0x0001,
    DPAD_DOWN: 0x0002,
    DPAD_LEFT: 0x0004,
    DPAD_RIGHT: 0x0008,
    START: 0x0010,
    BACK: 0x0020,
    LEFT_THUMB: 0x0040,
    RIGHT_THUMB: 0x0080,
    LEFT_SHOULDER: 0x0100,
    RIGHT_SHOULDER: 0x0200,
    GUIDE: 0x0400,
    A: 0x1000,
    B: 0x2000,
    X: 0x4000,
    Y: 0x8000
});

const DS4_BUTTONS = Object.freeze({
	THUMB_RIGHT: 1 << 15,
    THUMB_LEFT: 1 << 14,
    OPTIONS: 1 << 13,
    SHARE: 1 << 12,
    TRIGGER_RIGHT: 1 << 11,
    TRIGGER_LEFT: 1 << 10,
    SHOULDER_RIGHT: 1 << 9,
    SHOULDER_LEFT: 1 << 8,
    TRIANGLE: 1 << 7,
    CIRCLE: 1 << 6,
    CROSS: 1 << 5,
    SQUARE: 1 << 4
});

const DS4_SPECIAL_BUTTONS = Object.freeze({
	SPECIAL_PS: 1 << 0,
    SPECIAL_TOUCHPAD: 1 << 1
});

const DS4_DPAD_DIRECTIONS = Object.freeze({
	DPAD_NONE: 0x8,
    DPAD_NORTHWEST: 0x7,
    DPAD_WEST: 0x6,
    DPAD_SOUTHWEST: 0x5,
    DPAD_SOUTH: 0x4,
    DPAD_SOUTHEAST: 0x3,
    DPAD_EAST: 0x2,
    DPAD_NORTHEAST: 0x1,
    DPAD_NORTH: 0x0
});

const VIGEM_ERRORS = Object.freeze({
	0x20000000: "VIGEM_ERROR_NONE",
	0xE0000001: "VIGEM_ERROR_BUS_NOT_FOUND",
	0xE0000002: "VIGEM_ERROR_NO_FREE_SLOT",
	0xE0000003: "VIGEM_ERROR_INVALID_TARGET",
	0xE0000004: "VIGEM_ERROR_REMOVAL_FAILED",
	0xE0000005: "VIGEM_ERROR_ALREADY_CONNECTED",
	0xE0000006: "VIGEM_ERROR_TARGET_UNINITIALIZED",
	0xE0000007: "VIGEM_ERROR_TARGET_NOT_PLUGGED_IN",
	0xE0000008: "VIGEM_ERROR_BUS_VERSION_MISMATCH",
	0xE0000009: "VIGEM_ERROR_BUS_ACCESS_FAILED",
	0xE0000010: "VIGEM_ERROR_CALLBACK_ALREADY_REGISTERED",
	0xE0000011: "VIGEM_ERROR_CALLBACK_NOT_FOUND",
	0xE0000012: "VIGEM_ERROR_BUS_ALREADY_CONNECTED",
	0xE0000013: "VIGEM_ERROR_BUS_INVALID_HANDLE",
	0xE0000014: "VIGEM_ERROR_XUSB_USERINDEX_OUT_OF_RANGE"
});

class InputReport {
	constructor() {
		this.reportObj = {};
	}

	updateButton(name, value) {}
	updateAxis(name, value) {}

	getButtonValue(name) {}
    getAxisValue(name) {}
    
    reset() {}
}

function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

function rangeMap(value, spec) {
	let inRange = spec.maxIn - spec.minIn;
	let outRange = spec.maxOut - spec.minOut;

	return spec.minOut + outRange * ((value - spec.minIn) / inRange);
}

module.exports = {
	XUSB_BUTTON,
	VIGEM_ERRORS,
	InputReport,
	DS4_BUTTONS,
	DS4_SPECIAL_BUTTONS,
    DS4_DPAD_DIRECTIONS,
    clamp,
    rangeMap,
};