#include "target_ds4.h"

std::unordered_map<PVIGEM_TARGET, Napi::ThreadSafeFunction> ds4_notification_functions;

void ds4_notification_callback(PVIGEM_CLIENT Client, PVIGEM_TARGET Target, UCHAR LargeMotor, UCHAR SmallMotor, DS4_LIGHTBAR_COLOR LightbarColor, LPVOID userData) {
	// store data on the heap so we can pass it to the callback function
	NotificationData_ds4* data = new NotificationData_ds4{ LargeMotor, SmallMotor, LightbarColor };

	ds4_notification_functions[Target].NonBlockingCall(data, [](Napi::Env env, Napi::Function fn, NotificationData_ds4* data) {
		// create JS object version of the notification data
		Napi::Object evt = Napi::Object::New(env);
		evt.Set("LargeMotor", Napi::Number::New(env, (double)data->LargeMotor));
		evt.Set("SmallMotor", Napi::Number::New(env, (double)data->SmallMotor));
		
		Napi::Object lightbarColor = Napi::Object::New(env);
		lightbarColor.Set("Red", Napi::Number::New(env, (double)data->LightbarColor.Red));
		lightbarColor.Set("Green", Napi::Number::New(env, (double)data->LightbarColor.Green));
		lightbarColor.Set("Blue", Napi::Number::New(env, (double)data->LightbarColor.Blue));

		evt.Set("LightbarColor", lightbarColor);

		// pass data to JS callback
		fn.Call( {evt} );

		delete data; // clean up
	});
}

DS4_TOUCH js_object_to_touch(Napi::Object& obj) {
	DS4_TOUCH touch = { 0 };

	touch.bPacketCounter = obj.Get("packetCounter").As<Napi::Number>().Uint32Value() & 0xFF;

	if (!obj.Get("finger1").As<Napi::Boolean>().Value()) {
		touch.bIsUpTrackingNum1 |= 0x80; // set highest bit to 1 if the finger is not rested (active low)
	}
	touch.bIsUpTrackingNum1 |= obj.Get("finger1_num").As<Napi::Number>().Uint32Value() & 0x7F;

	if (!obj.Get("finger2").As<Napi::Boolean>().Value()) {
		touch.bIsUpTrackingNum2 |= 0x80; // set highest bit to 1 if the finger is not rested (active low)
	}
	touch.bIsUpTrackingNum2 |= obj.Get("finger2_num").As<Napi::Number>().Uint32Value() & 0x7F;

	uint16_t finger1_x = obj.Get("finger1_x").As<Napi::Number>().Uint32Value();
	uint16_t finger1_y = obj.Get("finger1_y").As<Napi::Number>().Uint32Value();

	touch.bTouchData1[0] = finger1_x & 0xFF;
	touch.bTouchData1[1] = ((finger1_x >> 8) & 0x0F) | ((finger1_y & 0x0F) << 4);
	touch.bTouchData1[2] = (finger1_y >> 4) & 0xFF;

	uint16_t finger2_x = obj.Get("finger2_x").As<Napi::Number>().Uint32Value();
	uint16_t finger2_y = obj.Get("finger2_y").As<Napi::Number>().Uint32Value();

	touch.bTouchData2[0] = finger2_x & 0xFF;
	touch.bTouchData2[1] = ((finger2_x >> 8) & 0x0F) | ((finger2_y & 0x0F) << 4);
	touch.bTouchData2[2] = (finger2_y >> 4) & 0xFF;

	return touch;
}

ViGemTargetWrap wrap_vigem_target_ds4_alloc(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	return ViGemTargetWrap::New(env, vigem_target_ds4_alloc(), [](Napi::Env env, PVIGEM_TARGET target) {
		ds4_notification_functions.erase(target);

		vigem_target_free(target);
	});
}

Napi::Number wrap_vigem_target_ds4_register_notification(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	ViGemClientWrap client_wrap = info[0].As<ViGemClientWrap>();
	PVIGEM_CLIENT client = client_wrap.Data();

	ViGemTargetWrap target_wrap = info[1].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	Napi::Function callback = info[2].As<Napi::Function>();
	ds4_notification_functions[target] = Napi::ThreadSafeFunction::New(env, callback, "function", 0, 1);

	VIGEM_ERROR err = vigem_target_ds4_register_notification(client, target, &ds4_notification_callback, NULL);

	return Napi::Number::New(env, (double)err);
}

void wrap_vigem_target_ds4_unregister_notification(const Napi::CallbackInfo& info) {
	ViGemTargetWrap target_wrap = info[0].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	vigem_target_ds4_unregister_notification(target);

	ds4_notification_functions.erase(target);
}

Napi::Number wrap_vigem_target_ds4_update(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	ViGemClientWrap client_wrap = info[0].As<ViGemClientWrap>();
	PVIGEM_CLIENT client = client_wrap.Data();

	ViGemTargetWrap target_wrap = info[1].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	DS4_REPORT report;
	DS4_REPORT_INIT(&report);

	Napi::Object data = info[2].As<Napi::Object>();
	report.wButtons = data.Get("wButtons").As<Napi::Number>().Uint32Value();
	report.bSpecial = data.Get("bSpecial").As<Napi::Number>().Uint32Value();
	report.bTriggerL = data.Get("bTriggerL").As<Napi::Number>().Uint32Value();
	report.bTriggerR = data.Get("bTriggerR").As<Napi::Number>().Uint32Value();
	report.bThumbLX = data.Get("bThumbLX").As<Napi::Number>().Uint32Value();
	report.bThumbLY = data.Get("bThumbLY").As<Napi::Number>().Uint32Value();
	report.bThumbRX = data.Get("bThumbRX").As<Napi::Number>().Uint32Value();
	report.bThumbRY = data.Get("bThumbRY").As<Napi::Number>().Uint32Value();

	VIGEM_ERROR err = vigem_target_ds4_update(client, target, report);

	return Napi::Number::New(env, (double)err);
}

Napi::Number wrap_vigem_target_ds4_update_ex(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	ViGemClientWrap client_wrap = info[0].As<ViGemClientWrap>();
	PVIGEM_CLIENT client = client_wrap.Data();

	ViGemTargetWrap target_wrap = info[1].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	DS4_REPORT_EX report;
	RtlZeroMemory(&report, sizeof(DS4_REPORT_EX));

	Napi::Object data = info[2].As<Napi::Object>();
	report.Report.wButtons = data.Get("wButtons").As<Napi::Number>().Uint32Value();
	report.Report.bSpecial = data.Get("bSpecial").As<Napi::Number>().Uint32Value();
	report.Report.bTriggerL = data.Get("bTriggerL").As<Napi::Number>().Uint32Value();
	report.Report.bTriggerR = data.Get("bTriggerR").As<Napi::Number>().Uint32Value();
	report.Report.bThumbLX = data.Get("bThumbLX").As<Napi::Number>().Uint32Value();
	report.Report.bThumbLY = data.Get("bThumbLY").As<Napi::Number>().Uint32Value();
	report.Report.bThumbRX = data.Get("bThumbRX").As<Napi::Number>().Uint32Value();
	report.Report.bThumbRY = data.Get("bThumbRY").As<Napi::Number>().Uint32Value();

	report.Report.wTimestamp = data.Get("wTimestamp").As<Napi::Number>().Uint32Value();
	report.Report.bBatteryLvl = data.Get("bBatteryLvl").As<Napi::Number>().Uint32Value();
	report.Report.wGyroX = data.Get("wGyroX").As<Napi::Number>().Int32Value();
	report.Report.wGyroY = data.Get("wGyroY").As<Napi::Number>().Int32Value();
	report.Report.wGyroZ = data.Get("wGyroZ").As<Napi::Number>().Int32Value();
	report.Report.wAccelX = data.Get("wAccelX").As<Napi::Number>().Int32Value();
	report.Report.wAccelY = data.Get("wAccelY").As<Napi::Number>().Int32Value();
	report.Report.wAccelZ = data.Get("wAccelZ").As<Napi::Number>().Int32Value();
	// report.Report.bBatteryLvlSpecial = data.Get("bBatteryLvlSpecial").As<Napi::Number>().Uint32Value();
	report.Report.bTouchPacketsN = data.Get("bTouchPacketsN").As<Napi::Number>().Uint32Value();

	if (report.Report.bTouchPacketsN > 3) {
		report.Report.bTouchPacketsN = 3;
	}

	Napi::Array touches = data.Get("touches").As<Napi::Array>();

	if (report.Report.bTouchPacketsN > 0) {
		report.Report.sCurrentTouch = js_object_to_touch(touches.Get(0U).As<Napi::Object>());
	}
	if (report.Report.bTouchPacketsN > 1) {
		report.Report.sPreviousTouch[0] = js_object_to_touch(touches.Get(1U).As<Napi::Object>());
	}
	if (report.Report.bTouchPacketsN > 2) {
		report.Report.sPreviousTouch[1] = js_object_to_touch(touches.Get(2U).As<Napi::Object>());
	}

	VIGEM_ERROR err = vigem_target_ds4_update_ex(client, target, report);

	return Napi::Number::New(env, (double)err);
}