#include "napi.h"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
	return exports;
}

NODE_API_MODULE(vigemclient, Init)