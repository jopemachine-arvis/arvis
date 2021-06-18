# Extension environment variables

Unlike Alfred, Arvis provides `$PATH` env to extension's scripts.

Also provides below additional envs.

## Arvis extension environment variables

### arvis_version

Version of arvis

### arvis_extension_bundleid

`bundleId` of extension

`bundleId` is set by `{creator}.{name}` of the config json file.

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

## Arvis platform environment variables

Arvis provides some useful env variables through `app.getPath` of electron.

This variable is set as below names

### arvis_platform_home

User's home directory.

### arvis_platform_cache

### arvis_platform_crashDumps

Directory where crash dumps are stored.

### arvis_platform_desktop

The current user's Desktop directory.

### arvis_platform_documents

Directory for a user's "My Documents".

### arvis_platform_downloads

The current executable file.

### arvis_platform_exe

The current executable file.

### arvis_platform_logs

Directory for your app's log folder.

### arvis_platform_module

The libchromiumcontent library.

### arvis_platform_music

Directory for a user's music.

### arvis_platform_pictures

Directory for a user's pictures.

### arvis_platform_temp

Temporary directory

### arvis_platform_userData

The directory for storing your app's configuration files, which by default it is the appData directory appended with your app's name.

### arvis_platform_appData

Per-user application data directory, which by default points to

### arvis_platform_videos

Directory for a user's videos.

### arvis_platform_recent

Directory for the user's recent files (Windows only).

## Alfred mock environment variables

Arvis sets [some environment variables](https://www.alfredapp.com/help/workflows/script-environment-variables/) that Alfred 4 sets.

Do not use these environment variables. they are mock values, and could be deleted later.

These variables are just set to help to convert Alfred workflow.

## variables

`variables` set in scripts in script filters or extension's setting json file are also applied to environment variables.