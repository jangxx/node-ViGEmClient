#include "target_x360.h"

std::unordered_map<PVIGEM_TARGET, Napi::ThreadSafeFunction> x360_notification_functions;

void x360_notification_callback(PVIGEM_CLIENT Client, PVIGEM_TARGET Target, UCHAR LargeMotor, UCHAR SmallMotor, UCHAR LedNumber) {
	// store data on the heap so we can pass it to the callback function
	NotificationData_x360* data = new NotificationData_x360{ LargeMotor, SmallMotor, LedNumber };

	x360_notification_functions[Target].NonBlockingCall(data, [](Napi::Env env, Napi::Function fn, NotificationData_x360* data) {
		// create JS object version of the notification data
		Napi::Object evt = Napi::Object::New(env);
		evt.Set("LargeMotor", Napi::Number::New(env, (double)data->LargeMotor));
		evt.Set("SmallMotor", Napi::Number::New(env, (double)data->SmallMotor));
		evt.Set("LedNumber", Napi::Number::New(env, (double)data->LedNumber));

		// pass data to JS callback
		fn.Call( {evt} );

		delete data; // clean up
	});
}

ViGemTargetWrap wrap_vigem_target_x360_alloc(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	return ViGemTargetWrap::New(env, vigem_target_x360_alloc(), [](Napi::Env env, PVIGEM_TARGET target) {
		x360_notification_functions.erase(target);

		vigem_target_free(target);
	});
}

Napi::Number wrap_vigem_target_x360_register_notification(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	ViGemClientWrap client_wrap = info[0].As<ViGemClientWrap>();
	PVIGEM_CLIENT client = client_wrap.Data();

	ViGemTargetWrap target_wrap = info[1].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	Napi::Function callback = info[2].As<Napi::Function>();
	x360_notification_functions[target] = Napi::ThreadSafeFunction::New(env, callback, "function", 0, 1);

	VIGEM_ERROR err = vigem_target_x360_register_notification(client, target, &x360_notification_callback);

	return Napi::Number::New(env, (double)err);
}

void wrap_vigem_target_x360_unregister_notification(const Napi::CallbackInfo& info) {
	ViGemTargetWrap target_wrap = info[0].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	x360_notification_functions.erase(target);

	vigem_target_x360_unregister_notification(target);
}

Napi::Number wrap_vigem_target_x360_update(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	ViGemClientWrap client_wrap = info[0].As<ViGemClientWrap>();
	PVIGEM_CLIENT client = client_wrap.Data();

	ViGemTargetWrap target_wrap = info[1].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	XUSB_REPORT report;
	XUSB_REPORT_INIT(&report);

	Napi::Object data = info[2].As<Napi::Object>();
	report.wButtons = data.Get("wButtons").As<Napi::Number>().Uint32Value();
	report.bLeftTrigger = data.Get("bLeftTrigger").As<Napi::Number>().Uint32Value();
	report.bRightTrigger = data.Get("bRightTrigger").As<Napi::Number>().Uint32Value();
	report.sThumbLX = data.Get("sThumbLX").As<Napi::Number>().Uint32Value();
	report.sThumbLY = data.Get("sThumbLY").As<Napi::Number>().Uint32Value();
	report.sThumbRX = data.Get("sThumbRX").As<Napi::Number>().Uint32Value();
	report.sThumbRY = data.Get("sThumbRY").As<Napi::Number>().Uint32Value();

	VIGEM_ERROR err = vigem_target_x360_update(client, target, report);

	return Napi::Number::New(env, (double)err);
}

Napi::Number wrap_vigem_target_x360_get_user_index(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	ViGemClientWrap client_wrap = info[0].As<ViGemClientWrap>();
	PVIGEM_CLIENT client = client_wrap.Data();

	ViGemTargetWrap target_wrap = info[1].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	ULONG index;

	VIGEM_ERROR err = vigem_target_x360_get_user_index(client, target, &index);

	if (err == VIGEM_ERROR_NONE) {
		return Napi::Number::New(env, (double)index);
	} else if (err == VIGEM_ERROR_XUSB_USERINDEX_OUT_OF_RANGE) {
		Napi::Error::New(env, "XUSB_USERINDEX_OUT_OF_RANGE").ThrowAsJavaScriptException();
		return Napi::Number::Number();
	} else {
		Napi::Error::New(env, "Unexpected Error").ThrowAsJavaScriptException();
		return Napi::Number::Number();
	}
}