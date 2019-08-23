{
    "targets": [
        {
            "target_name": "vigemclient",
            "sources": [

            ],
            "include_dirs": [
                "<(module_root_dir)/include",
				"<!@(node -p \"require('node-addon-api').include\")"
            ],
            "dependencies": [
				"<!(node -p \"require('node-addon-api').gyp\")"
			],
            "defines": [
				"NAPI_DISABLE_CPP_EXCEPTIONS"
			]
        }
    ]
}