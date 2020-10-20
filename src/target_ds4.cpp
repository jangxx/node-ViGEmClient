#include "target_ds4.h"

std::unordered_map<PVIGEM_TARGET, Napi::ThreadSafeFunction> ds4_notification_functions;

void ds4_notification_callback(PVIGEM_CLIENT Client, PVIGEM_TARGET Target, UCHAR LargeMotor, UCHAR SmallMotor, DS4_LIGHTBAR_COLOR LightbarColor) {
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

	VIGEM_ERROR err = vigem_target_ds4_register_notification(client, target, (PFN_VIGEM_DS4_NOTIFICATION)&ds4_notification_callback);

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