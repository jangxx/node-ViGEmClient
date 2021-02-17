# node-ViGEmClient
Native Node.js bindings for the ViGEm virtual gamepad driver.

Current SDK version: [commit f719a1d](https://github.com/ViGEm/ViGEmClient/commit/f719a1d9eb51969a685a9213d9db6dbb801404c1)

# Installation

    npm install vigemclient

Since ViGEmBus only works on Windows, this module can also only be installed on Windows.
If you have problems building the native code parts, try installing the Windows Build Tools by running

```bash
npm install -g windows-build-tools
```

# Usage

A minimal example of a feeder application looks like this:

```javascript
const ViGEmClient = require('vigemclient');

let client = new ViGEmClient();

client.connect(); // establish connection to the ViGEmBus driver

let controller = client.createX360Controller();

controller.connect(); // plug in the virtual controller

// change some axes and buttons
controller.axis.leftX.setValue(0.5); // move left stick 50% to the left
controller.axis.leftY.setValue(-0.5); // move left stick 50% down
controller.axis.leftTrigger.setValue(1); // press in left trigger all the way

controller.button.Y.setValue(true); // press Y button
```

More examples can be found in the _examples/_ directory.

# Methods

## ViGEmClient

**constructor**()

**connect**()  
Connect to the ViGEmBus driver. Returns `null` on success and an `Error` if there was an error.

**createX360Controller**()  
Create a new `X360Controller` instance, with this client as its parent.
Can only be called after a connection to the driver has been established.

**createDS4Controller**(`extended = false`)  
Create a new `DS4Controller` instance, with this client as its parent.
Can only be called after a connection to the driver has been established.
If the `extended` parameter is set to `true`, a `DS4ControllerExtended` will be instantiated, which gives access to an experimental feature, allowing access to gyro, accelerometer, trackpad and more, but which is otherwise exactly the same as `DS4Controller`.

## ViGEmTarget

Both `X360Controller` and `DS4Controller` inherit from this class, but you can not instantiate it yourself.
Most of the methods and properties are the same for both controller types and where they aren't, the differences will be made clear.

_get_ **vendorID**   
Get the vendor ID of the device. Can only be accessed after `connect()` has been called.

_get_ **productID**  
Get the product ID of the device. Can only be accessed after `connect()` has been called.

_get_ **index**  
Get the internal index of the device. Can only be accessed after `connect()` has been called.

_get_ **type**  
Get a string describing the type of the device. Either "Xbox360Wired", "XboxOneWired" or "DualShock4Wired". Can only be accessed after `connect()` has been called.

_get_ **updateMode**  
_set_ **updateMode**  
Get or set the updateMode. Per default the mode is set to "auto", which leads to every change of each button or axis to be sent to the driver instantly.
Set to "manual" if you often update multiple values at once. but don't forget that you have to call `update()` yourself when in this mode.

_get_ **button**  
Get an object containing all the buttons of the controller.
This property differs between the controller types.

`X360Controller` has the following buttons:
- `START`
- `BACK`
- `LEFT_THUMB`
- `RIGHT_THUMB`
- `LEFT_SHOULDER`
- `RIGHT_SHOULDER`
- `GUIDE`
- `A`
- `B`
- `X`
- `Y`

`DS4Controller` has the following buttons:
- `THUMB_RIGHT`
- `THUMB_LEFT`
- `OPTIONS`
- `SHARE`
- `TRIGGER_RIGHT`
- `TRIGGER_LEFT`
- `SHOULDER_RIGHT`
- `SHOULDER_LEFT`
- `TRIANGLE`
- `CIRCLE`
- `CROSS`
- `SQUARE`
- `SPECIAL_PS`
- `SPECIAL_TOUCHPAD`

All of these buttons are instances of `InputButton` (documented below).

_get_ **axis**  
Get an object containing all the axes of the controller.
This property is the same for both controller types.

- `leftX`
- `leftY`
- `rightX`
- `rightY`
- `leftTrigger`
- `rightTrigger`
- `dpadHorz`
- `dpadVert`
- `batteryLevel` (only `DS4ControllerExtended`)

All of these buttons are instances of `InputAxis` (documented below).

_get_ **userIndex** (`X360Controller` only)  
Get the user index of the virtual Xbox controller.
This values corresponds to the player number displayed on the LEDs.

**connect**(`opts = {}`)  
Connect the controller to the driver.
This is equivalent of plugging the controller into a USB port.
The `opts` parameter is an object with the following optional properties:

- `vendorID`: Specify a custom device vendor ID.
- `productID`: Specify a custom device product ID.

Returns `null` on success and an `Error` on error.

**disconnect**()  
Disconnect the controller from the driver.
This is equivalent of unplugging the controller.
Returns `null` on success and an `Error` on error.

**update**()  
Submit updated button and axis values to the driver.
If `updateMode` is set to "auto" (default), this method will be called automatically if a value is changed.

**resetInputs**()  
Resets all buttons and axes to their unpressed/neutral states.

**addTouch**(touch) (`DS4ControllerExtended` only)  
Add a `DS4TrackpadTouch` object to the current input report. You can add up to 3 of these before having to call `update()`, but it is usually advised to submit new touch events as soon as they are available.

**setGyro**(pitch, yaw, roll) (`DS4ControllerExtended` only)  
Sets the gyroscope orientation. Each value is in degrees and must be between -2000 and 2000.

**setAccelerometer**(x, y, z) (`DS4ControllerExtended` only)  
Set the current accelerometer measurement. Each value is in g-force and must be between -4 and 4.

*Note about the gyroscope and the accelerometer: The values they produce are processed as a function of time, therefore each input report contains a timestamp so the receiving application can calculate the change over time. According to the documentation, this timestamp "usually increments" by 188 when the controller is updating every 1.25ms. Ergo, this library will measure the time between updates and increment the timestamp by the measured time multiplied by 188/1.25. I have no idea if this is correct way to do it, but I have no way to test it unfortunately. Just be warned that you need to call `update()` periodically (and probably with a high update rate) if you want the gyro and accelerometer values to make any sense/be usable.*

## InputButton

This class represents a single button on a controller.
You can not instantiate this class directly, instead you get objects of this class from the `.button` property from a `ViGEmTarget` instance.

_get_ **name**  
Get the internal name of this button.

_get_ **value**  
Get the currently set value of this button.

**setValue**(value)  
Set the value of the button (either `true` or `false`).

## InputAxis

This class represents a single axis on a controller.
You can not instantiate this class directly, instead you get objects of this class from the `.axis` property from a `ViGEmTarget` instance.

_get_ **name**  
Get the internal name of this axis.

_get_ **value**  
Get the currently set value of the axis.

_get_ **minValue**
Get the lowest value this axis can be set to.
Lower values will be clamped to this value.

_get_ **maxValue**  
Get the highest value this axis can be set to.
Higher values will be clamped to this value.

**setValue**(value)  
Set the value of this axis (between `minValue` and `maxValue`).
The POV switch is also represented as an axis and it also takes continuous values, but since POV switches are digital, the values are cut-off at 0.5, so `>`0.5 means pressed and `<=` 0.5 means not pressed.

## DS4TrackpadTouch

This class represents a single multitouch event on the DS4 trackpad.
You can import this class by requiring it from `"vigemclient/extra"`.

**getFingersDown**()  
Get the number of fingers that you have setup to touch the trackpad.
Either 0, 1 or 2.

**addFingerDown**(x, y)  
Place another finger on the trackpad at location (x,y), with `0 <= x <= 1920` and `0 <= y <= 943`.
If you try to add more than two fingers, the method will throw an error.

**allFingersUp**()  
Delete all previously added fingers from this event.

# Events

Both `X360Controller` and `DS4Controller` register a "notification callback" with the bus driver, which is called every time a controller is supposed to vibrate or if the LEDs on the controller change.
For the sake of convenience, the data contained in the notification is split up and emitted as regular node events.

Event "**large motor**"  
Emitted by: `X360Controller`, `DS4Controller`  
Emitted every time the intensity of the large vibration motor changes.
The emitted values range from 0 to 255.

Event "**small motor**"  
Emitted by: `X360Controller`, `DS4Controller`  
Emitted every time the intensity of the small vibration motor changes.
The emitted values range from 0 to 255.

Event "**vibration**"  
Emitted by: `X360Controller`, `DS4Controller`  
Emitted every time the intensity of the large or the small vibration motor changes.
The emitted values are objects of the form `{ large, small }`, containing the values of both motors.

Event "**notification**"  
Emitted by: `X360Controller`, `DS4Controller`  
Emitted every time the notification callback is called.
The emmitted values are objects of the form `{ LargeMotor, SmallMotor, LedNumber }` for `X360Controller` and `{ LargeMotor, SmallMotor, LightbarColor: { Red, Green, Blue } }` for `DS4Controller`.

Event "**led change**"  
Emitted by: `X360Controller`  
Emitted every time the LEDs around the guide button change.
The emitted values range from 0 to 3.

Event "**color change**"  
Emitted by: `DS4Controller`  
Emitted every time the color of the lightbar changes.
The emitted values are objects of the form `{ Red, Green, Blue }`, with each components value ranging from 0 to 255.