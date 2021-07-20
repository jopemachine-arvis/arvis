# How to write workflow

## Support hotload

All changes in workflow, plugin folders's changes are being watched and reflected when they are created.

## Use [arvish](https://github.com/jopemachine/arvish) to build your plugin

1. Write proper `arvis-workflow.json`

2. Write some scripts to use in your `workflow`

3. type `arvish build` on your project root.

## Manual (not recommend)

<details><summary>Manual (not recommend)</summary>
<p>

1. Write proper `arvis-workflow.json`.
2. Write some scripts to use in your `workflow`.
3. Compress the binaries, modules, and scripts used in the `workflow` into a plain `.zip` file with the `arvis-workflow.json`.
4. Change the `.zip` file's extension to `.arvisworkflow`
</p>
</details>

## `arvis-workflow.json` format

[Click me to check arvis-workflow.json format](./workflow-config-format.md)

## JSON Schema

Recommend to use the [JSON schema](https://github.com/jopemachine/arvis-extension-validator/blob/master/workflow-schema.json) below when creating workflows

## Available Environment variable

Both `workflows` and `plugin` set useful environment variables when running scripts.

You can use the variables you want in your script

[Click me to check Environment variables](./extension-env-description.md)

## Alfred-workflow Compatibility

* Basically, `Arvis` use same [JSON Scriptfilter Format](https://www.alfredapp.com/help/workflows/inputs/script-filter/) with Alfred-workflows.

* This means you may easily change the alfred-workflow to arvis-workflow. 

* Especially if the workflow is builded on [alfy](https://github.com/sindresorhus/alfy), you can convert workflow more easily using [arvish](https://github.com/jopemachine/arvish), the clone version of alfy. 

### Convert alfredworkflow to arvisworkflow

Convert alfred workflow's `info.plist` to `arvis-workflow.json` using [alfred-to-arvis](https://github.com/jopemachine/alfred-to-arvis) 

## Scriptfilter JSON format

Check the format of `scriptFilter` to use `scriptFilter` in your `workflow`, `plugin`.

[Click me to check Scriptfilter JSON format](./scriptfilter-json-format-description.md)

## Scriptfilter XML format

Do not recommend using XML format scriptfilter.

Lots of alfred workflow uses XML format's scriptfilter, so I've implemented some functions converting scriptfilter's xml format to json format for compatibility.

This logic is incomplete and not necessary in new extensions.

## Debugging workflow, plugin

[How to debug workflow, plugin](./debugging-description.md)

## Arvish

If you are familiar with `Alfy`, you can try to use [arvish](https://github.com/jopemachine/arvish) in your js scripts.