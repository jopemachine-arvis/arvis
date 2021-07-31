# Build and development

## Template

Arvis is builted with [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

## Other packages

* [arvis-core](https://github.com/jopemachine/arvis-core)

Arvis module not directly related to electron, renderer

## Build from sources

* [Windows](./build-windows.md)
* [Macos](./build-macos.md)
* [Linux](./build-linux.md)

## Module aliasing

Currently, module aliasing is applied on `renderer process`'s scripts.

To apply module aliasing on main process, you might need to update some webpack config.

## [iohook](https://github.com/wilix-team/iohook) config

This package uses [iohook](https://github.com/wilix-team/iohook) which depending on the version of the electron and node, has different binaries.

View [Here](https://github.com/electron/releases) to check [electron release versions](https://github.com/electron/releases).

So, If `node` or `electron` version is updated, the `iohook` config of `package.json` should be updated as well.

## Config file pathes

[Click to view config file pathes](../documents/config-file-paths.md)

## External packages

Arvis edits and uses some libraries.

These codes are in `src/external` separated from `src/app`.