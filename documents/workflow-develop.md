# How to write workflow

1. Create `arvis-workflow.json`.

You can use this workflow's [JSON Schema](https://github.com/jopemachine/arvis-core/blob/master/workflow-schema.json) to create workflow easily.

2. Write some scripts to use in your workflow.

If you are familiar with `Alfy`, you can try to use [arvish](https://github.com/jopemachine/arvish).

3. Compacts the binaries, modules, and scripts used by the workflow into a zip file with the `arvis-workflow.json` file.

4. Change the zip file's extension to `.arvisworkflow`

## `arvis-workflow.json` format

### Trigger

[Click me to check Trigger](./trigger-description.md)

### Action

[Click me to check Action](./action-description.md)

## Available Environment variable

Both `workflows` and `plugin` set environment variables when running scripts.

You can use these variables in your script if needed.

[Click me to check Environment variables](./extension-env-description.md)

## Scriptfilter JSON format

Check the format of `scriptfilter` to use `scriptfilter` in your `workflow`, `plugin`.

[Click me to check Scriptfilter JSON format](./scriptfilter-json-format-description.md)

## Debugging workflow, plugin

[How to debug workflow, plugin](./debugging-description.md)