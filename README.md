# Arvis

**Table of Contents**

- [1. What is Arvis?](#)
    - [1.1 Cross-platform](#)
    - [1.2 Alfred-workflow Compatibility](#)
    - [1.3 Differences between plugins and workflows](#)
- [2. How to install](#)
    - [2.1 Program Install](#)
    - [2.2 Workflow Install](#)
    - [2.3 Plugin Install](#)
- [3. How to use](#)
    - [3.1 How to use workflow](#)
    - [3.2 How to use plugin](#)
- [4. How to write new workflows, plugins](#)
    - [4.1 How to write new workflows](#)
    - [4.2 How to write new plugins](#)
- [5. Build and development](#)
    - [5.1 Template](#)
    - [5.2 Other packages](#)
    - [5.3 Build from sources](#)
    - [5.4 iohook config](#)
    - [5.5 config file pathes](#)

## What is Arvis?

`Arvis` helps you run any scripts or binarys of your choice for specific keyboard events.

(For example, if you press the Cmd key twice with the appropriate workflow installation, the Chrome History search window might appear or something like that.)

I started making `Arvis` because I wanted to use useful alfred-workflows in other OSs.

`Arvis` also provides a "frame" to help create such workflows (or plugins).

### Cross-platform

* Arvis is written on cross-platform (Tested on `Windows 10`, `Macos Bigsur`, and `Ubuntu`).

* First, make sure your workflow (or plugins) works on your platform. (Especially careful when using Alfred workflow in platforms other than `MacOS`.)

### Alfred-workflow Compatibility

* By default, `Arvis` is compatible with alfred-workflow and can be installed by importing `alfredworkflow` files.

* However, during the conversion process (process of converting `info.plist` of Alfred workflow to arvis workflow config file), information on the workflow might be lost and is not fully compatible. (Supporting full compatibility with alfred-workflow is not goal of `Arvis`).

* Since alfred-workflow is mostly written assuming that it will run on Macos, operation on other platform is not guaranteed.

* Basically, it is compatible with [alfy](https://github.com/sindresorhus/alfy), but npm install command not install those workflows on `Arvis`. Until now, The only way to install workflow is installing `arvisworkflow` files in preference window.

### Differences between plugins and workflows

* The biggest difference between plugins with workflows is plugins do not have separate items to start a script, such as a keyword or script filter.

* Workflows can be written in any language, but the plug-in is supported only with JavaScript.

## How to install

### Program Install

* [Macos]()
* [Windows]()
* [Linux]()

### Workflow Install

```
Right click tray icon 
-> Click Open Preference Window 
-> Click Workflow icon on sidebar 
-> Click the + icon in the bar below 
-> Click on the file in the arvisworkflow or alfredworkflow file
```

### Plugin Install

## How to use

### How to use workflow

`Workflow` is a set of `Command` that can be executed.

Each `Action` of `Command` can be executed by `keyword`, `scriptfilter`, and `hotkey`.

`Keyword` is to link an action to a command.

`Scriptfilter` connects script to a command.

and the items returned by the script appear in searchWindow, and the action is executed by clicking on them.

`Hotkey` binds a specific key combination to a particular action.

Arvis also supports double modifier key combinations (e.g. double cmd, double ctrl..)

### How to use plugin

## How to write new workflows, plugins

### How to write new workflows



### How to write new plugins

## Build and development

### Template

This package is builded on [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

### Other packages

Packages directly related to this package.

* [arvis-core]()
* [arvis-plist-converter]()

### Build from sources

* [Macos](./documents/build-macos.md)
* [Windows](./documents/build-windows.md)

### iohook config

This package uses [iohook](https://github.com/electron/releases) which depending on the version of the electron and node, has different binaries.

So, If node or electron version is updated, the config should be updated as well.

### config file pathes

#### log files

* on Linux: `~/.config/Arvis/logs/{process type}.log`
* on macOS: `~/Library/Logs/Arvis/{process type}.log`
* on Windows: `%USERPROFILE%\AppData\Roaming\Arvis\logs\{process type}.log`

#### workflow, plugin files

The storage path for all installed workflow files is stored in the `data` path of the [env-paths](https://github.com/sindresorhus/env-paths).
