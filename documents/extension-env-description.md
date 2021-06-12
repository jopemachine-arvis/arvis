# Extension environment variables

Unlike Alfred, Arvis provides `$PATH` env to extension's scripts.

Also provides below additional envs.

## Arvis extension environment variables

### arvis_version

Version of arvis

### arvis_extension_bundleid

`bundleId` of extension

`bundleId` is set by `{createdby}.{name}` of the config json file.

### arvis_extension_name

`name` of the extension

### arvis_extension_version

`version` of the extension

### arvis_extension_data

[Data path](./config-file-paths.md) of the extension

### arvis_extension_cache

[Cache path](./config-file-paths.md) of the extension

### arvis_extension_history

[History file](./history.md) path of the Arvis

### arvis_extension_type

Depending on the extension type, this value is set by `workflow` or `plugin`

## Alfred mock environment variables

Arvis sets some environment variables that Alfred 4 sets.

Do not use these environment variables. they are mock values, and could be deleted later.

These variables are just set to help to convert Alfred workflow.

## variables

`variables` set in scripts in script filters or extension's setting json file are also applied to environment variables.