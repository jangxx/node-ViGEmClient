#pragma once

#include "types.h"

ViGemTargetWrap wrap_vigem_target_x360_alloc(const Napi::CallbackInfo& info);

Napi::Number wrap_vigem_target_x360_register_notification(const Napi::CallbackInfo& info);

void wrap_vigem_target_x360_unregister_notification(const Napi::CallbackInfo& info);

Napi::Number wrap_vigem_target_x360_update(const Napi::CallbackInfo& info);

Napi::Number wrap_vigem_target_x360_get_user_index(const Napi::CallbackInfo& info);