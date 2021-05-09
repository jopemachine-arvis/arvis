## Build and development

### Template

This package is builded on [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

### Other packages

Packages directly related to this package.

* [arvis-core]()
* [arvis-plist-converter]()

### Build from sources

```
// Install packages
$ yarn

// Build main js, renderer
$ yarn build

// Run after source build in dev mode
$ yarn dev

// Run after source build in prod mode
$ yarn start
```

### iohook config

This package uses `iohook` which depending on the version of the electron and node, has different binaries.

https://github.com/electron/releases

So, If node or electron version is updated, the config should be updated as well.
