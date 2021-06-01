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
    - [4.3 Update your workflow, plugin](#update-your-workflow-plugin)
    - [4.4 Convert alfredworkflow to arvisworkflow](#convert-alfredworkflow-to-arvisworkflow)
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

You can download `arvisworkflow`, `arvisplugin` files.

They are installer files. Just double click on them to install them.

## What is workflow, plugin?

* [What is workflow?](./documents/workflow-intro.md)

* [What is plugin?](./documents/plugin-intro.md)

## How to write new workflows, plugins

* By default, all changes to workflow files are being watched and reflected as soon as changes are made.

### How to write new workflows

* [Click me to check how to write new workflow](./documents/workflow-develop.md)

### How to write new plugins

* [Click me to check how to write new plugin](./documents/plugin-develop.md)

### Update your workflow, plugin

* Installing a package with the same bundle ID removes all existing files. So, reinstall to update the `workflow` or `plugin`

* In workflow, plugin development, updating `arvis-workflow.json`, `arvis-plugin.json (and its js files)` is detected and reloaded by [chokidar](https://github.com/paulmillr/chokidar).

### Convert alfredworkflow to arvisworkflow

Convert alfred's info.plist using [arvis-plist-converter](https://github.com/jopemachine/arvis-plist-converter) 

(Or just install `alfredworkflow` file. This converter will create `arvis-workflow.json` on its own)

## Build and development

[Build and development](./documents/develop-arvis.md)