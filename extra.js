const { DS4TrackpadTouch } = require('./lib/DS4ControllerExtendedReport');

module.exports = {
	DS4TrackpadTouch, // objects of this type can be submitted to the extended DS4 controller to control the simulated touchpad
	DS4TrackpadSize: Object.freeze({
		width: 1920,
		height: 943
	}), // just for convenience
};