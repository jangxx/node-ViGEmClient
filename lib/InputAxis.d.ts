import { ViGEmTarget } from "./ViGEmTarget";
import { ISpec } from "./common";

export class InputAxis<T extends ViGEmTarget<any, any>> {
	constructor(parent: T, name: string, inputSpec: ISpec)

	get name(): string

	get parent(): T

	get value(): number
	get valueRaw(): number

	get minValue(): number
	get maxValue(): number
	get minValueRaw(): number
	get maxValueRaw(): number
	get neutralValue(): number

	setValue(value: number): null | Error

	reset(): null | Error
}