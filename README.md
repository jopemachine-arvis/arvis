# Arvis

**Table of Contents**

- [1. What is Arvis?](#what-is-arvis)
    - [1.1 Cross-platform](#cross-platform)
    - [1.2 Alfred-workflow Compatibility](#alfred-workflow-compatibility)
    - [1.3 Change appearance](#change-appearance)
- [2. What is workflow, plugin?](#what-is-workflow-plugins)
- [3. How to install workflow, plugin on Arvis](#how-to-install-workflow-plugin-on-arvis)
- [4. How to write new workflows, plugins](#how-to-write-new-workflows-plugins)
    - [4.1 How to write new workflows](#how-to-write-new-workflows)
    - [4.2 How to write new plugins](#how-to-write-new-plugins)
    - [4.3 Debugging workflow, plugin](#debugging-workflow-plugin)
    - [4.4 Update your workflow, plugin](#update-your-workflow-plugin)
    - [4.5 Convert alfredworkflow to arvisworkflow](#convert-alfredworkflow-to-arvisworkflow)
- [5. Build and development](#build-and-development)

## What is Arvis?

`Arvis` helps you run any scripts or binarys of your choice for specific keyboard events.

(For example, if you press the Cmd key twice with the appropriate workflow installation, the Chrome History search window might appear or something like that.)

I started to work on this because I wanted to try to cross-platform alfred-workflows.

`Arvis` also aims to provide a "frame" or "library" to help create such `workflow`, `plugin` more easily.

### Cross-platform

* `Arvis` works on cross-platform (Tested on `Windows 10`, `Macos Bigsur`, and `Ubuntu`).

### Alfred-workflow Compatibility

* Basically, `Arvis` use same [scriptfilter format](https://www.alfredapp.com/help/workflows/inputs/script-filter/) with Alfred-workflows.

* This means you can easily change the alfred-workflow to arvis-workflow.

### Change appearance

You can change Arvis search window's appearance to some extent.

Click `Appearance` in the Preference window and import the `arvistheme` file or set values on your own.


## How to install workflow, plugin on Arvis

You can download `arvisworkflow`, `arvisplugin` files to install them.

```
Right click tray icon
-> Click Open Preference Window
-> Click Workflow or Plugin icon on sidebar
-> Click the + icon in the bar below
-> Click on the file in the arvisworkflow or alfredworkflow file
```

## What is workflow, plugin?

* [What is workflow?](./documents/workflow-intro.md)

* [What is plugin?](./documents/plugin-intro.md)

## How to write new workflows, plugins

* By default, all changes to workflow files are being watched and reflected as soon as changes are made.

* In the case of hotkeys, they are registered and applied only when `Arvis` is turned on for the first time, so if there is a change in the hotkeys, `Arvis` must be turned off and on to renew hotkey settings.

### How to write new workflows

1. Create `arvis-workflow.json`.

You can use this workflow's [JSON Schema](https://github.com/jopemachine/arvis-core/blob/master/workflow-schema.json) to create workflow easily.

2. Write some scripts to use in your workflow.

If you are familiar with `Alfy`, you can try to use [arvish](https://github.com/jopemachine/arvish).

3. Compacts the binaries, modules, and scripts used by the workflow into a zip file with the `arvis-workflow.json` file.

4. Change the zip file's extension to `.arvisworkflow`

### How to write new plugins

1. Create `arvis-plugin.json`.

You can use this plugin's [JSON Schema](https://github.com/jopemachine/arvis-core/blob/master/plugin-schema.json) to create plugin easily.

2. Write some scripts to use in your plugin.

3. Compacts the scripts used in the plugin into a zip file with the `arvis-plugin.json` file.

4. Change the zip file's extension to `.arvisplugin`


### Debugging workflow, plugin

[How to debug workflow, plugin](./documents/debugging-description.md)

### Update your workflow, plugin

* Installing a package with the same bundle ID removes all existing files. So, reinstall to update the `workflow` or `plugin`

* In workflow, plugin development, updating `arvis-workflow.json`, `arvis-plugin.json` is detected and reloaded by file-watcher.

(Hotload not yet supported for `hotkey` of workflow)

### Convert alfredworkflow to arvisworkflow

Convert alfred's info.plist using [arvis-plist-converter](https://github.com/jopemachine/arvis-plist-converter) 

(Or just install `alfredworkflow` file. converter will create arvis-workflow.json on its own)

## Build and development

[Build and development](./documents/develop-arvis.md)