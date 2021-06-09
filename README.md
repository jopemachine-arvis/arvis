# Arvis

## 🚧🚧🚧  Note that it's alpha version yet. 🚧 🚧🚧

Arvis is still in the construction and there could be lots of bugs.

It would be very helpful if you could put bugs on the issue.

* ⚠️ Currently has severe [performance issue]() on mac

**Table of Contents**

- [1. What is Arvis?](#what-is-arvis-why-it-is-needed)
- [2. What is workflow, plugin?](#what-is-workflow-plugins)
- [3. How to write new workflows, plugins](#how-to-write-new-workflows-plugins)
- [4. Build and development](#build-and-development)

## 💬 What is Arvis? why it is needed?

`Arvis` aims to help you run any scripts or binarys very simple.

I've thought many useful alfred-workflows can run in cross-platform So I started to work on this.

`Arvis` also aims to provide a "frame" or "library" to help create such `workflow`, `plugin` more easily.

It is intentionally built similar to Alfred, but there could be some different points.

### 📝 Alfred-workflow Compatibility

* Basically, `Arvis` use same [JSON Scriptfilter Format](https://www.alfredapp.com/help/workflows/inputs/script-filter/) with Alfred-workflows.

* This means you may easily change the alfred-workflow to arvis-workflow. 

* Especially if the workflow is builded on [alfy](https://github.com/sindresorhus/alfy), you can convert workflow more easily using [arvish](https://github.com/jopemachine/arvish), the clone version of alfy. 

### ✨ Change appearance

You can change Arvis search window's appearance to some extent.

Click `Appearance` in the Preference window and import the `arvistheme` file or set values on your own.

## 📓 What is workflow, plugin?

* [What is workflow?](./documents/workflow-intro.md)

* [What is plugin?](./documents/plugin-intro.md)

## 🔨 How to write new extensions

* [Click me to check how to create new workflows](./documents/workflow-develop.md)

* [Click me to check how to create new plugins](./documents/plugin-develop.md)

### 🔖 Convert alfredworkflow to arvisworkflow

Convert alfred workflow's `info.plist` to `arvis-workflow.json` using [arvis-plist-converter](https://github.com/jopemachine/arvis-plist-converter) 

## 🔧 Build and development

[Build and development](./documents/develop-arvis.md)

## Contribution

* Arvis is alpha version, needs contributions to improve quality. Open to all kinds of contributions.

* Please feel free to create `bug`, `feature request` or other things in issue.