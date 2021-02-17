const ViGEmClient = require('..');
const { DS4TrackpadTouch, DS4TrackpadSize } = require('../extra');

let client = new ViGEmClient();

if (client.connect() == null) {
	let controller = client.createDS4Controller(true); // create the extended controller version

	let err = controller.connect();

	if (err) {
		console.log(err.message);
		process.exit(1);
	}

	console.log("Vendor ID:", controller.vendorID);
	console.log("Product ID:", controller.productID);
	console.log("Index:", controller.index);
	console.log("Type:", controller.type);

	controller.on("notification", data => {
		console.log("notification", data);
	});

	controller.updateMode = "manual"; // requires manual calls to controller.update()

	let t = 0;

	let buttons = Object.keys(controller.button);
	let btn = 0;

	let roll = 0;

	setInterval(() => {
		controller.axis.leftX.setValue(Math.sin(t));
		controller.axis.leftY.setValue(Math.cos(t));

		controller.axis.rightX.setValue(-Math.sin(t));
		controller.axis.rightY.setValue(Math.cos(t));

		controller.axis.dpadHorz.setValue(Math.sin(t));
		controller.axis.dpadVert.setValue(Math.cos(t));

		controller.button[buttons[btn]].setValue(!controller.button[buttons[btn]].value); // invert button value

		/**
		 * All of the following features are unfortunately untested, because I couldn't find a good way to test them
		 * Please let me know if know of an app/game/remapper/whatever that allows us to read out these values from a virtual DS4 controller
		 */

		controller.setGyro(0, 0, roll);
		roll = (roll + 9) % 360; // rotate 9 deg every 100ms, i.e. one quarter turn per second

		// draw a circle on the trackpad
		let touch = new DS4TrackpadTouch();
		touch.addFingerDown(
			DS4TrackpadSize.width / 2 + Math.sin(t) * 500, 
			DS4TrackpadSize.height / 2 + Math.cos(t) * 500
		);

		controller.addTouch(touch);

		controller.update(); // update manually for better performance

		t += 0.1;
		btn = (btn + 1) % buttons.length;
	}, 100);
}