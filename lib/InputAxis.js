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
		return this._parent._report.getAxisValue(this.name);
	}

	get minValue() {
		return this._spec.minIn;
	}

	get maxValue() {
		return this._spec.maxIn;
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
}

module.exports = { InputAxis };