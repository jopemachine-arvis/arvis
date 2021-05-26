# How to write workflow

1. Write proper `arvis-workflow.json`.

2. Write some scripts to use in your workflow.

3. Compress the binaries, modules, and scripts used in the `workflow` into a plain `.zip` file with the `arvis-workflow.json`.

4. Change the `.zip` file's extension to `.arvisworkflow`

## `arvis-workflow.json` format

[Click me to check arvis-workflow.json format](./workflow-config-format.md)

## JSON Schema

Recommend to use the [JSON schema](https://github.com/jopemachine/arvis-core/blob/master/workflow-schema.json) below when creating workflows

## Available Environment variable

Both `workflows` and `plugin` set environment variables when running scripts.

You can use these variables in your script if needed.

[Click me to check Environment variables](./extension-env-description.md)

## Scriptfilter JSON format

Check the format of `scriptfilter` to use `scriptfilter` in your `workflow`, `plugin`.

[Click me to check Scriptfilter JSON format](./scriptfilter-json-format-description.md)

## Debugging workflow, plugin

[How to debug workflow, plugin](./debugging-description.md)

## Arvish

If you are familiar with `Alfy`, you can try to use [arvish](https://github.com/jopemachine/arvish).