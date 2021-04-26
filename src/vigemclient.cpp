#include "types.h"
#include "target.h"
#include "target_x360.h"
#include "target_ds4.h"

ViGemClientWrap wrap_vigem_alloc(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	return ViGemClientWrap::New(env, vigem_alloc(), [](Napi::Env env, PVIGEM_CLIENT client) { vigem_free(client); });
}

Napi::Number wrap_vigem_connect(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	ViGemClientWrap client_wrap = info[0].As<ViGemClientWrap>();
	PVIGEM_CLIENT client = client_wrap.Data();

	VIGEM_ERROR err = vigem_connect(client);

	uint32_t err_code = err; // cast to uint first

	return Napi::Number::New(env, static_cast<double>(err_code));
}

void wrap_vigem_disconnect(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	ViGemClientWrap client_wrap = info[0].As<ViGemClientWrap>();
	PVIGEM_CLIENT client = client_wrap.Data();

	vigem_disconnect(client);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
	exports.Set("vigem_alloc", Napi::Function::New(env, wrap_vigem_alloc));
	exports.Set("vigem_connect", Napi::Function::New(env, wrap_vigem_connect));
	exports.Set("vigem_disconnect", Napi::Function::New(env, wrap_vigem_disconnect));
	exports.Set("vigem_target_add", Napi::Function::New(env, wrap_vigem_target_add));
	exports.Set("vigem_target_remove", Napi::Function::New(env, wrap_vigem_target_remove));
	exports.Set("vigem_target_set_pid", Napi::Function::New(env, wrap_vigem_target_set_pid));
	exports.Set("vigem_target_set_vid", Napi::Function::New(env, wrap_vigem_target_set_vid));
	exports.Set("vigem_target_get_pid", Napi::Function::New(env, wrap_vigem_target_get_pid));
	exports.Set("vigem_target_get_vid", Napi::Function::New(env, wrap_vigem_target_get_vid));
	exports.Set("vigem_target_get_type", Napi::Function::New(env, wrap_vigem_target_get_type));
	exports.Set("vigem_target_get_index", Napi::Function::New(env, wrap_vigem_target_get_index));
	exports.Set("vigem_target_is_attached", Napi::Function::New(env, wrap_vigem_target_is_attached));

	exports.Set("vigem_target_x360_alloc", Napi::Function::New(env, wrap_vigem_target_x360_alloc));
	exports.Set("vigem_target_x360_register_notification", Napi::Function::New(env, wrap_vigem_target_x360_register_notification));
	exports.Set("vigem_target_x360_unregister_notification", Napi::Function::New(env, wrap_vigem_target_x360_unregister_notification));
	exports.Set("vigem_target_x360_update", Napi::Function::New(env, wrap_vigem_target_x360_update));
	exports.Set("vigem_target_x360_get_user_index", Napi::Function::New(env, wrap_vigem_target_x360_get_user_index));

	exports.Set("vigem_target_ds4_alloc", Napi::Function::New(env, wrap_vigem_target_ds4_alloc));
	exports.Set("vigem_target_ds4_register_notification", Napi::Function::New(env, wrap_vigem_target_ds4_register_notification));
	exports.Set("vigem_target_ds4_unregister_notification", Napi::Function::New(env, wrap_vigem_target_ds4_unregister_notification));
	exports.Set("vigem_target_ds4_update", Napi::Function::New(env, wrap_vigem_target_ds4_update));

	return exports;
}

NODE_API_MODULE(vigemclient, Init)