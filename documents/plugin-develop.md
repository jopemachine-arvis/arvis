# How to write plugin

1. Create `arvis-plugin.json`.

You can use this plugin's [JSON Schema](https://github.com/jopemachine/arvis-core/blob/master/plugin-schema.json) to create plugin easily.

2. Write some scripts to use in your plugin.

3. Compacts the scripts used in the plugin into a zip file with the `arvis-plugin.json` file.

4. Change the zip file's extension to `.arvisplugin`

## `arvis-plugin.json` format

`arvis-plugin.json` format is very similar with `arvis-workflow.json` format.

The only difference is that there is `action` right away instead of `commands`.

### Action

[Click me to check Action](./action-description.md)

## Available Environment variable

Both `workflows` and `plugin` set environment variables when running scripts.

You can use these variables in your script if needed.

[Click me to check Environment variables](./extension-env-description.md)

## Debugging workflow, plugin

[How to debug workflow, plugin](./debugging-description.md)