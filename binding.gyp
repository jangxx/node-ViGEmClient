{
	"targets": [
		{
			"target_name": "vigemclient",
			"sources": [
				"src/target.cpp",
				"src/target_x360.cpp",
				"src/target_ds4.cpp",
				"src/vigemclient.cpp"
			],
			"include_dirs": [
				"<(module_root_dir)/include",
				"<!@(node -p \"require('node-addon-api').include\")"
			],
			"dependencies": [
				"<!(node -p \"require('node-addon-api').gyp\")"
			],
			"libraries": [
				"<(module_root_dir)/native/<(target_arch)/ViGEmClient.lib"
			],
			"copies": [
				{
					"destination": "<(module_root_dir)/build/Release/",
					"files": [ "<(module_root_dir)/native/<(target_arch)/ViGEmClient.dll" ]
				}
			],
			"defines": [
				"NAPI_DISABLE_CPP_EXCEPTIONS"
			]
		}
	]
}