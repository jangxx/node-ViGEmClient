#pragma once

#include "types.h"

Napi::Number wrap_vigem_target_add(const Napi::CallbackInfo& info);

Napi::Number wrap_vigem_target_remove(const Napi::CallbackInfo& info);

void wrap_vigem_target_set_vid(const Napi::CallbackInfo& info);

void wrap_vigem_target_set_pid(const Napi::CallbackInfo& info);

Napi::Number wrap_vigem_target_get_vid(const Napi::CallbackInfo& info);

Napi::Number wrap_vigem_target_get_pid(const Napi::CallbackInfo& info);

Napi::Number wrap_vigem_target_get_index(const Napi::CallbackInfo& info);

Napi::String wrap_vigem_target_get_type(const Napi::CallbackInfo& info);

Napi::Boolean wrap_vigem_target_is_attached(const Napi::CallbackInfo& info);