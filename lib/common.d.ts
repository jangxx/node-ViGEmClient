export const XUSB_BUTTON: {
	readonly DPAD_UP: number
	readonly DPAD_DOWN: number
	readonly DPAD_LEFT: number
	readonly DPAD_RIGHT: number
	readonly START: number
	readonly BACK: number
	readonly LEFT_THUMB: number
	readonly RIGHT_THUMB: number
	readonly LEFT_SHOULDER: number
	readonly RIGHT_SHOULDER: number
	readonly GUIDE: number
	readonly A: number
	readonly B: number
	readonly X: number
	readonly Y: number
}

export const DS4_BUTTONS: {
	readonly THUMB_RIGHT: number
	readonly THUMB_LEFT: number
	readonly OPTIONS: number
	readonly SHARE: number
	readonly TRIGGER_RIGHT: number
	readonly TRIGGER_LEFT: number
	readonly SHOULDER_RIGHT: number
	readonly SHOULDER_LEFT: number
	readonly TRIANGLE: number
	readonly CIRCLE: number
	readonly CROSS: number
	readonly SQUARE: number
}

export const DS4_SPECIAL_BUTTONS: {
	readonly SPECIAL_PS: number
	readonly SPECIAL_TOUCHPAD: number
}

export const DS4_DPAD_DIRECTIONS: {
	readonly DPAD_NONE: number
	readonly DPAD_NORTHWEST: number
	readonly DPAD_WEST: number
	readonly DPAD_SOUTHWEST: number
	readonly DPAD_SOUTH: number
	readonly DPAD_SOUTHEAST: number
	readonly DPAD_EAST: number
	readonly DPAD_NORTHEAST: number
	readonly DPAD_NORTH: number
}

export const VIGEM_ERRORS: {
	readonly 0x20000000: string
	readonly 0xE0000001: string
	readonly 0xE0000002: string
	readonly 0xE0000003: string
	readonly 0xE0000004: string
	readonly 0xE0000005: string
	readonly 0xE0000006: string
	readonly 0xE0000007: string
	readonly 0xE0000008: string
	readonly 0xE0000009: string
	readonly 0xE0000010: string
	readonly 0xE0000011: string
	readonly 0xE0000012: string
	readonly 0xE0000013: string
	readonly 0xE0000014: string
}

export class InputReport {
	updateButton(name: string, value: boolean): void
	updateAxis(name: string, value: number): void

	getButtonValue(name: string): void
	getAxisValue(name: string): void

	reset(): void
}

export function clamp(value: number, min: number, max: number): Number
export function rangeMap(value: number, spec: ISpec): number

export interface ISpec {
	minIn: number
	maxIn: number
	minOut: number
	maxOut: number
}