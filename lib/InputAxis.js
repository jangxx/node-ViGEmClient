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

function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

function rangeMap(value, spec) {
	let inRange = spec.maxIn - spec.minIn;
	let outRange = spec.maxOut - spec.minOut;

	return spec.minOut + outRange * ((value - spec.minIn) / inRange);
}

module.exports = { InputAxis };