import { ViGEmTarget } from "./ViGEmTarget";

export class InputButton<T extends ViGEmTarget<any, any>> {
	constructor(parent: T, name: string)

	get name(): string
	get parent(): T

	setValue(value: boolean): void
}