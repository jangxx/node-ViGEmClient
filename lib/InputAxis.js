const { clamp, rangeMap } = require('./common');

class InputAxis {
	constructor(parent, name, inputSpec) {
		this._parent = parent;
		this._name = name;

		this._spec = inputSpec;
	}

	get name() {
		return this._name;
	}

	get parent() {
		return this._parent;
	}

	get value() {
		const v = this._parent._report.getAxisValue(this.name);
		return rangeMap(v, {
			minIn: this._spec.minOut,
			maxIn: this._spec.maxOut,
			minOut: this._spec.minIn,
			maxOut: this._spec.maxIn,
		});
	}

	get valueRaw() {
		return this._parent._report.getAxisValue(this.name);
	}

	get minValue() {
		return this._spec.minIn;
	}

	get maxValue() {
		return this._spec.maxIn;
	}

	get minValueRaw() {
		return this._spec.minOut;
	}

	get maxValueRaw() {
		return this._spec.maxOut;
	}

	get neutralValue() {
		return ("neutral" in this._spec) ? this._spec.neutral : 0;
	}

	setValue(value) {
		value = clamp(value, this.minValue, this.maxValue);
		value = rangeMap(value, this._spec);

		this.parent._report.updateAxis(this.name, value);

		if (this.parent.updateMode == "auto") {
			return this.parent.update();
		}

		return null;
	}

	reset() {
		return this.setValue(this.neutralValue);
	}
}

module.exports = { InputAxis };