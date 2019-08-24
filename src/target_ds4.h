#pragma once

#include "types.h"

ViGemTargetWrap wrap_vigem_target_ds4_alloc(const Napi::CallbackInfo& info);

Napi::Number wrap_vigem_target_ds4_register_notification(const Napi::CallbackInfo& info);

void wrap_vigem_target_ds4_unregister_notification(const Napi::CallbackInfo& info);

Napi::Number wrap_vigem_target_ds4_update(const Napi::CallbackInfo& info);