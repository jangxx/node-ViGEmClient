import EventEmitter from "events";
import { InputAxis } from "./InputAxis";
import { InputButton } from "./InputButton";

interface IConnectOptions {
	vendorID?: number
	productID?: number
}

export class ViGEmTarget<B extends string, A extends string> extends EventEmitter {
	get vendorID(): number
	get productID(): number
	get index(): number
	get type(): string
	get attached(): boolean
	get updateMode(): 'auto' | 'manual'
	get button(): { readonly [key in B]: InputButton<this> }
	get axis(): { readonly [key in A]: InputAxis<this> }

	connect(opt?: IConnectOptions): null | Error
	disconnect(): null | Error
	update(): void
	resetInputs(): void
}