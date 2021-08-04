import { ViGEmTarget } from "./ViGEmTarget";
import { XUSB_BUTTON } from './common';

type TX360Buttons = keyof Omit<typeof XUSB_BUTTON, 'DPAD_UP' | 'DPAD_DOWN' | 'DPAD_LEFT' | 'DPAD_RIGHT'>
type TX360Axis = 'leftX' | 'leftY' | 'rightX' | 'rightY' | 'leftTrigger' | 'rightTrigger' | 'dpadHorz' | 'dpadVert'

export class X360Controller extends ViGEmTarget<TX360Buttons, TX360Axis> {
	get userIndex(): number
}