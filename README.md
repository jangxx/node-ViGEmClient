# node-ViGEmClient
Native Node.js bindings for the ViGEm virtual gamepad driver.

Current SDK version: **1.16.28.0**

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

cnotroller.button.Y.setValue(true); // press Y button
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

**createDS4Controller**()  
Create a new `DS4Controller` instance, with this client as its parent.
Can only be called after a connection to the driver has been established.

## ViGEmTarget

Both `X360Controller` and `DS4Controller` inherit from this class, but you can not instantiate it yourself.
Most of the methods and properties are the same for both controller types and where they aren't, the differences will be made clear.

_get_ **vendorID**  
_set_ **vendorID**  
Get or set the vendor ID of the device. Can only be accessed after `connect()` has been called.

_get_ **productID**  
_set_ **productID**  
Get or set the product ID of the device. Can only be accessed after `connect()` has been called.

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

All of these buttons are instances of `InputAxis` (documented below).

_get_ **userIndex** (`X360Controller` only)  
Get the user index of the virtual Xbox controller.
This values corresponds to the player number displayed on the LEDs.

**connect**()  
Connect the controller to the driver.
This is equivalent of plugging the controller into a USB port.
Returns `null` on success and an `Error` on error.

**disconnect**()  
Disconnect the controller from the driver.
This is equivalent of unplugging the controller.
Returns `null` on success and an `Error` on error.

**update**()  
Submit updated button and axis values to the driver.
If `updateMode` is set to "auto" (default), this method will be called automatically if a value is changed.

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