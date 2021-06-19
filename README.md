# [Arvis](https://github.com/jopemachine/arvis/releases)
[![CodeFactor](https://www.codefactor.io/repository/github/jopemachine/arvis/badge)](https://www.codefactor.io/repository/github/jopemachine/arvis)
[![Github All Releases](https://img.shields.io/github/downloads/jopemachine/arvis/total.svg)]()
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![PR's Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)
[![GitHub issues](https://img.shields.io/github/issues/jopemachine/arvis.svg)](https://GitHub.com/jopemachine/arvis/issues/)

## 🚧🚧🚧  Note that it's alpha version yet. 🚧 🚧🚧

Arvis is still in the construction and there could be lots of bugs.

It would be very helpful if you could put bugs on the issue.

* ⚠️ Currently has [severe performance issue](https://github.com/jopemachine/arvis-core/issues/2) on mac

* ⚠️ Currently has [cannot auto launch issue](https://github.com/Izurii/easy-auto-launch/issues/2) on linux

**Table of Contents**

- [1. What is Arvis?](#what-is-arvis-why-it-is-needed)
- [2. How to Install](#how-to-install)
- [3. What is Workflow, Plugin?](#what-is-workflow-plugins)
- [4. Take a look at useful Workflows, Plugins](#take-a-look-at-useful-workflows-plugins)
- [5. How to write new Workflows, Plugins](#how-to-write-new-workflows-plugins)
- [6. Build and development](#build-and-development)

## 💬 What is Arvis? why it is needed?

`Arvis` aims to help you run any scripts or binarys very simple.

I've thought many useful alfred-workflows can run in cross-platform So I started to work on this.

`Arvis` also aims to provide a "frame" or "library" to help create such `workflow`, `plugin` more easily.

It is intentionally built similar to Alfred, but there could be some different points.

* [Click me to check basic usage of Arvis](./documents/basic-usage.md)

### 📝 Alfred-workflow Compatibility

* Basically, `Arvis` use same [JSON Scriptfilter Format](https://www.alfredapp.com/help/workflows/inputs/script-filter/) with Alfred-workflows.

* This means you may easily change the alfred-workflow to arvis-workflow. 

* Especially if the workflow is builded on [alfy](https://github.com/sindresorhus/alfy), you can convert workflow more easily using [arvish](https://github.com/jopemachine/arvish), the clone version of alfy. 

### ✨ Change appearance

You can change Arvis search window's appearance to some extent.

Click `Appearance` in the Preference window and import the `arvistheme` file or set values on your own.

## 🌈 How to Install

Click [this link](https://github.com/jopemachine/arvis/releases) and download your platform's binary.

Note that you should install [Extensions](#take-a-look-at-useful-workflows-plugins) to use Arvis.

### mac installation issues

* Open mac's preference and `give appropriate permissions` to Arvis. (Including notification permissions, Full disk access permission)

### linux installation issues

* run `chmod 777 {appimage binary}` to give execute permission to appimage file.

### arvis-linker issues

* If permission error occurs when you try to install extension by npm command, open your shell `as administrator`.

## 📓 What is Workflow, Plugin?

* [What is Workflow?](./documents/workflow-intro.md)

* [What is Plugin?](./documents/plugin-intro.md)

## 🌟 Take a look useful Workflows, Plugins

* [Click me to check available Workflows](./documents/workflow-links.md)

* [Click me to check available Plugins](./documents/plugin-links.md)

## 🔨 How to write new extensions

* [Click me to check how to create new Workflows](./documents/workflow-develop.md)

* [Click me to check how to create new Plugins](./documents/plugin-develop.md)

### 🔖 Convert alfredworkflow to arvisworkflow

Convert alfred workflow's `info.plist` to `arvis-workflow.json` using [alfred-to-arvis](https://github.com/jopemachine/alfred-to-arvis) 

## 🔧 Build and development

[Build and development](./documents/develop-arvis.md)

## Contribution

* Arvis is alpha version, needs contributions to improve quality. Open to all kinds of contributions.

* Please feel free to create `bug`, `feature request` or other things in issue.
