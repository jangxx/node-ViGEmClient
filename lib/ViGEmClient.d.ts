import { X360Controller } from "./X360Controller"
import { DS4ControllerExtended, DS4Controller } from "./DS4Controller"

export class ViGEmClient {
	get _handle(): any

	connect(): null | Error
	createX360Controller(): X360Controller

	createDS4Controller(v?: boolean): DS4Controller
	createDS4Controller(v: true): DS4ControllerExtended
}