# Arvis

**Table of Contents**

- [1. What is Arvis?](#what-is-arvis)
    - [1.1 Cross-platform](#cross-platform)
    - [1.2 Alfred-workflow Compatibility](#alfred-workflow-compatibility)
    - [1.3 Differences between plugins and workflows](#differences-between-plugins-and-workflows)
- [2. What is workflow, plugin?](#what-is-workflow-plugins)
    - [2.1 How to use workflow](#how-to-use-workflow)
    - [2.2 How to use plugin](#how-to-use-plugin)
- [3. How to install workflow, plugin on Arvis](#how-to-install-workflow-plugin-on-arvis)
    - [3.1 Workflow, Plugin Install](#workflow-plugin-install)
- [4. How to write new workflows, plugins](#how-to-write-new-workflows-plugins)
    - [4.1 How to write new workflows](#how-to-write-new-workflows)
    - [4.2 How to write new plugins](#how-to-write-new-plugins)
    - [4.3 Debugging workflow, plugin](#debugging-workflow-plugin)
    - [4.4 Update your workflow, plugin](#update-your-workflow-plugin)
    - [4.5 Convert alfredworkflow to arvisworkflow](#convert-alfredworkflow-to-arvisworkflow)
- [5. Build and development](#build-and-development)
    - [5.1 Template](#template)
    - [5.2 Other packages](#other-packages)
    - [5.3 Build from sources](#build-from-sources)
    - [5.4 iohook config](#iohook-config)
    - [5.5 config file pathes](#config-file-pathes)

## What is Arvis?

`Arvis` helps you run any scripts or binarys of your choice for specific keyboard events.

(For example, if you press the Cmd key twice with the appropriate workflow installation, the Chrome History search window might appear or something like that.)

I started making `Arvis` because I wanted to use useful alfred-workflows in other OSs.

`Arvis` also provides a "frame" to help create such workflows (or plugins).

### Cross-platform

* Arvis works on cross-platform (Tested on `Windows 10`, `Macos Bigsur`, and `Ubuntu`).

### Alfred-workflow Compatibility

* I started to creating Arvis to use alfred-workflow in other platform, So basically, `Arvis` use same [scriptfilter format](https://www.alfredapp.com/help/workflows/inputs/script-filter/) with Alfred-workflows.

* This means you can easily change the alfred-workflow to arvis-workflow.


### Differences between plugins and workflows

* The biggest difference between `plugin` with `workflow` is `plugin` do not have separate items to start a script, such as a keyword or script filter.

* `workflow` can be written in any language, but the `plugin` can be written only in `JavaScript`.

* Because `plugin` is loaded when Arvis window shows up, `plugin` is much faster than `workflow`.

* `plugin` has cannot define `action` in json file unlike `workflow`

## How to install workflow, plugin on Arvis

### Workflow, Plugin Install

You can download `arvisworkflow`, `arvisplugin` files to install them.

```
Right click tray icon
-> Click Open Preference Window
-> Click Workflow or Plugin icon on sidebar
-> Click the + icon in the bar below
-> Click on the file in the arvisworkflow or alfredworkflow file
```

## What is workflow, plugin?

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

* By default, all changes to workflow files are being watched and reflected as soon as changes are made.

* In the case of hotkeys, they are registered and applied only when `Arvis` is turned on for the first time, so if there is a change in the hotkeys, `Arvis` must be turned off and on to renew hotkey settings.

### How to write new workflows

1. Create `arvis-workflow.json`.

You can use [this json schema](https://github.com/jopemachine/arvis-core/blob/master/workflow-schema.json) to create workflow easily.

2. Write some scripts to use in your workflow.

If you are familiar with `Alfy`, you can try [arvis-workflow-tools](https://github.com/jopemachine/arvis-workflow-tools).

3. Compacts the binaries, modules, and scripts used by the workflow into a zip file with the `arvis-workflow.json` file.

4. Change the zip file's extension to `.arvisworkflow`

### How to write new plugins

1. Create `arvis-plugin.json`.

You can use [this json schema](https://github.com/jopemachine/arvis-core/blob/master/plugin-schema.json) to create plugin easily.

2. Write some scripts to use in your plugin.

3. Compacts the scripts used in the plugin into a zip file with the `arvis-plugin.json` file.

4. Change the zip file's extension to `.arvisplugin`


### Debugging workflow, plugin

1. You can debug your query, workflow, plugin's behaviors through chrome debugger.

2. You can activate and unactivate log types to focus on your debugging on `Advanced` page.


### Update your workflow, plugin

* Installing a package with the same bundle ID removes all existing files. So, reinstall to update the `workflow` or `plugin`

* In workflow, plugin development, updating `arvis-workflow.json`, `arvis-plugin.json` is detected and reloaded by file-watcher.

(Hotload not yet supported for `hotkey` of workflow)

### Convert alfredworkflow to arvisworkflow

Convert alfred's info.plist using [arvis-plist-converter](https://github.com/jopemachine/arvis-plist-converter) 

(Or just install `alfredworkflow` file. converter will create arvis-workflow.json on its own)



## Build and development

### Template

This package is builded on [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

### Other packages

* [arvis-core](https://github.com/jopemachine/arvis-core)

Arvis module not directly related to electron, renderer

### Build from sources

* [Macos](./documents/build-macos.md)
* [Windows](./documents/build-windows.md)

### iohook config

This package uses [iohook](https://github.com/electron/releases) which depending on the version of the electron and node, has different binaries.

So, If `node` or `electron` version is updated, the iohook config of package.json should be updated as well.

### config file pathes

[Click to view config file pathes](./documents/config-file-pathes.md)
