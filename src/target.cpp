#include "target.h"

std::unordered_map<VIGEM_TARGET_TYPE, std::string> type_map = {
	{ Xbox360Wired, "Xbox360Wired" },
	{ DualShock4Wired, "DualShock4Wired" }
};

Napi::Number wrap_vigem_target_add(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	ViGemClientWrap client_wrap = info[0].As<ViGemClientWrap>();
	PVIGEM_CLIENT client = client_wrap.Data();

	ViGemTargetWrap target_wrap = info[1].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	VIGEM_ERROR err = vigem_target_add(client, target);

	return Napi::Number::New(env, (double)err);
}

Napi::Number wrap_vigem_target_remove(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	ViGemClientWrap client_wrap = info[0].As<ViGemClientWrap>();
	PVIGEM_CLIENT client = client_wrap.Data();

	ViGemTargetWrap target_wrap = info[1].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	VIGEM_ERROR err = vigem_target_remove(client, target);

	return Napi::Number::New(env, (double)err);
}

void wrap_vigem_target_set_vid(const Napi::CallbackInfo& info) {
	ViGemTargetWrap target_wrap = info[0].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	Napi::Number vid_wrap = info[1].As<Napi::Number>();
	USHORT vid = vid_wrap.Uint32Value();

	vigem_target_set_vid(target, vid);
}

void wrap_vigem_target_set_pid(const Napi::CallbackInfo& info) {
	ViGemTargetWrap target_wrap = info[0].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	Napi::Number pid_wrap = info[1].As<Napi::Number>();
	USHORT pid = pid_wrap.Uint32Value();

	vigem_target_set_pid(target, pid);
}

Napi::Number wrap_vigem_target_get_vid(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	ViGemTargetWrap target_wrap = info[0].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	USHORT vid = vigem_target_get_vid(target);
	return Napi::Number::New(env, (double)vid);
}

Napi::Number wrap_vigem_target_get_pid(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	ViGemTargetWrap target_wrap = info[0].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	USHORT pid = vigem_target_get_pid(target);
	return Napi::Number::New(env, (double)pid);
}

Napi::Number wrap_vigem_target_get_index(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	ViGemTargetWrap target_wrap = info[0].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	ULONG index = vigem_target_get_index(target);
	return Napi::Number::New(env, (double)index);
}

Napi::String wrap_vigem_target_get_type(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	ViGemTargetWrap target_wrap = info[0].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	VIGEM_TARGET_TYPE type = vigem_target_get_type(target);
	std::string typeString = type_map[type];

	return Napi::String::New(env, typeString);
}

Napi::Boolean wrap_vigem_target_is_attached(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	ViGemTargetWrap target_wrap = info[0].As<ViGemTargetWrap>();
	PVIGEM_TARGET target = target_wrap.Data();

	return Napi::Boolean::New(env, vigem_target_is_attached(target));
}