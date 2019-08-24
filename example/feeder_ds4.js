const ViGEmClient = require('..');

let client = new ViGEmClient();

if (client.connect() == null) {
	let controller = client.createDS4Controller();

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

	setInterval(() => {
		controller.axis.leftX.setValue(Math.sin(t));
		controller.axis.leftY.setValue(Math.cos(t));

		controller.axis.rightX.setValue(-Math.sin(t));
		controller.axis.rightY.setValue(Math.cos(t));

		controller.axis.dpadHorz.setValue(Math.sin(t));
		controller.axis.dpadVert.setValue(Math.cos(t));

		controller.button[buttons[btn]].setValue(!controller.button[buttons[btn]].value); // invert button value

		controller.update(); // update manually for better performance

		t += 0.1;
		btn = (btn + 1) % buttons.length;
	}, 100);
}