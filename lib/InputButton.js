class InputButton {
	constructor(parent, name) {
		this._parent = parent;
		this._name = name;
	}

	get name() {
		return this._name;
	}

	get parent() {
		return this._parent;
	}

	get value() {
		return this._parent._report.getButtonValue(this.name);
	}

	setValue(value) {
		this.parent._report.updateButton(this.name, value);

		if (this.parent.updateMode == "auto") {
			return this.parent.update();
		}

		return null;
	}
}

module.exports = { InputButton };