# [Arvis](https://github.com/jopemachine/arvis/releases)
[![CodeFactor](https://www.codefactor.io/repository/github/jopemachine/arvis/badge)](https://www.codefactor.io/repository/github/jopemachine/arvis)
[![Version](https://img.shields.io/github/v/tag/jopemachine/arvis?sort=date)](https://img.shields.io/github/v/tag/jopemachine/arvis?sort=date)
[![Github All Releases](https://img.shields.io/github/downloads/jopemachine/arvis/total.svg)]()
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![PR's Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)
[![GitHub issues](https://img.shields.io/github/issues/jopemachine/arvis.svg)](https://GitHub.com/jopemachine/arvis/issues/)

## 🚧🚧🚧  Note that it's alpha version yet. 🚧 🚧🚧

Arvis is still in the construction and there could be lots of bugs.

* ⚠️ Currently has [severe performance issue](https://github.com/jopemachine/arvis-core/issues/2) on mac

**Table of Contents**

- [1. What is Arvis?](#-what-is-arvis-why-it-is-needed)
- [2. How to Install](#-how-to-install)
- [3. What is Workflow, Plugin?](#-what-is-workflow-plugin)
- [4. Take a look at useful Workflows, Plugins](#-take-a-look-useful-workflows-plugins)
- [5. How to create new Workflows, Plugins](#-how-to-create-new-extensions)
- [6. Build and development](#-build-and-development)

## 💬 What is Arvis? why it is needed?

`Arvis` aims to help you run any scripts or binarys very simple.

I've thought many useful alfred-workflows can run in "cross-platform", that's why I started to work on this.

`Arvis` also aims to provide "librarys" to help create such `workflow`, `plugin` more easily.

`Arvis` is intentionally built similar to Alfred, but there could be some different points.

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

Note that you should install some [Extensions](#take-a-look-at-useful-workflows-plugins) to use Arvis.

* [Windows](./documents/how-to-install-windows.md)

* [Mac](./documents/how-to-install-mac.md)

* [Linux](./documents/how-to-install-linux.md)

## 📓 What is Workflow, Plugin?

* [What is Workflow?](./documents/workflow-intro.md)

* [What is Plugin?](./documents/plugin-intro.md)

## 🌟 Take a look useful Workflows, Plugins

* [Click me to check available Workflows](https://github.com/jopemachine/arvis-store/blob/master/docs/workflow-links.md)

* [Click me to check available Plugins](https://github.com/jopemachine/arvis-store/blob/master/docs/plugin-links.md)

## 🔨 How to create new extensions

* [Click me to check how to create new Workflows](./documents/workflow-develop.md)

* [Click me to check how to create new Plugins](./documents/plugin-develop.md)

### 🔖 Convert alfredworkflow to arvisworkflow

Convert alfred workflow's `info.plist` to `arvis-workflow.json` using [alfred-to-arvis](https://github.com/jopemachine/alfred-to-arvis) 

## 🔧 Build and development

[Build and development](./src/README.md)

## Contribution

* Arvis is opened to all kinds of contributions.

* Please feel free to create `bug`, `feature request` or other things in issue.
