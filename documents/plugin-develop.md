# How to write plugin

1. Write proper `arvis-plugin.json`.

2. Write some scripts to use in your `plugin`.

3. Compress the scripts used in the `plugin` into a `.zip` file with the `arvis-plugin.json`.

4. Change the `.zip` file's extension to `.arvisplugin`

## `arvis-plugin.json` format

`arvis-plugin.json` format is very similar with `arvis-workflow.json` format.

The only differences are that there is `action` right away instead of `commands` and there is `main`.

### Action

[Click me to check Action](./action-description.md)

### Entry point of plugin

The js file specified in `main` is entry point of the `plugin`, which means this is imported by `Arvis` in runtime.

This file should export below form's function to be properly imported.

You can also use `async-await` syntax to this to handle some async operation.

```js
module.exports = (inputStr, history) => {
  ...
 
  return {
    items: []
  }
};
```

You can check [plugin example](https://github.com/jopemachine/arvis-calculator-plugin-example) here

#### inputStr

type: `string`

String entered by user

#### history

type: `array`

[Click me to check history](./history.md)

## JSON Schema

Recommend to use the [JSON schema](https://github.com/jopemachine/arvis-extension-validator/blob/master/plugin-schema.json) below when creating `plugin`

## Available Environment variable

Both `workflows` and `plugin` set environment variables when running scripts.

You can use these variables in your script if needed.

[Click me to check Environment variables](./extension-env-description.md)

## Debugging workflow, plugin

[How to debug workflow, plugin](./debugging-description.md)

## Arvish

If you are familiar with `Alfy`, you can try to use [arvish](https://github.com/jopemachine/arvish).