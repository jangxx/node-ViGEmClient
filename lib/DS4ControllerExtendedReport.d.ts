import { DS4ControllerReport } from "./DS4ControllerReport";

export class DS4ControllerExtendedReport extends DS4ControllerReport {}
export class DS4TrackpadTouch {
	getFingersDown(): number
	addFingerDown(x: number, y: number)
	allFingersUp(): void
}