import { DS4ControllerReport } from "./DS4ControllerReport";

export class DS4ControllerExtendedReport extends DS4ControllerReport {
	addTouch(touch: DS4TrackpadTouch);
	setGyro(pitch: number, yaw: number, roll: number);
	setAccelerometer(x: number, y: number, z: number);
	prepareSend(): void;
	finishSend(): void;
}

export class DS4TrackpadTouch {
	getFingersDown(): number;
	addFingerDown(x: number, y: number): void;
	allFingersUp(): void;
}