# Build and development

## Template

This package is builded on [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

## Other packages

* [arvis-core](https://github.com/jopemachine/arvis-core)

Arvis module not directly related to electron, renderer

## Build from sources

* [Windows](./build-windows.md)
* [Macos](./build-macos.md)
* [Linux](./build-linux.md)

## module aliasing

Currently, module aliasing is applied on only `renderer process`'s scripts.

To apply module aliasing on main process, you might need to update some webpack config.

## iohook config

This package uses [iohook](https://github.com/electron/releases) which depending on the version of the electron and node, has different binaries.

So, If `node` or `electron` version is updated, the `iohook` config of `package.json` should be updated as well.

## config file pathes

[Click to view config file pathes](./config-file-paths.md)

## [use-key-capture](https://github.com/pranesh239/use-key-capture)

Arvis edits and uses some libraries.

These codes are separated from `src/app`.