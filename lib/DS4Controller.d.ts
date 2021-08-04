import { ViGEmTarget } from "./ViGEmTarget";
import { DS4_BUTTONS, DS4_SPECIAL_BUTTONS } from "./common";
import { DS4TrackpadTouch } from "./DS4ControllerExtendedReport";

type TDS4Buttons = keyof (typeof DS4_BUTTONS & typeof DS4_SPECIAL_BUTTONS)
type TDS4Axis = 'leftX' | 'leftY' | 'rightX' | 'rightY' | 'leftTrigger' | 'rightTrigger' | 'dpadHorz' | 'dpadVert'

export class DS4Controller extends ViGEmTarget<TDS4Buttons, TDS4Axis> { }
export class DS4ControllerExtended extends ViGEmTarget<TDS4Buttons, TDS4Axis | 'batteryLevel'> {
	setGyro(pitch: number, yaw: number, roll: number): void
	setAccelerometer(x: number, y: number, z: number): void
	addTouch(touch: DS4TrackpadTouch): void
}