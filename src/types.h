#pragma once

#define WIN32_LEAN_AND_MEAN

#include "napi.h"
#include <Windows.h>
#include <ViGEm/Client.h>
#include <unordered_map>

typedef struct {
	UCHAR LargeMotor;
	UCHAR SmallMotor;
	UCHAR LedNumber;
} NotificationData_x360;

typedef struct {
	UCHAR LargeMotor;
	UCHAR SmallMotor;
	DS4_LIGHTBAR_COLOR LightbarColor;
} NotificationData_ds4;

using ViGemClientWrap = Napi::External<_VIGEM_CLIENT_T>;
using ViGemTargetWrap = Napi::External<_VIGEM_TARGET_T>;