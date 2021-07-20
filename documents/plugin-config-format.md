# `arvis-plugin-json` format

The json file consists of the following attributes.

## Usable variable

Certain values in the Json file are replaced by arvis.

### `{query}`, `$1`, `$2`..

`{query}` is replaced with user's input (query not including the `command`).

Example:
```json
{
  "modifier": "normal",
  "type": "clipboard",
  "target": "'{query}'"
}
```

### variables

You can set `variables` in your scriptfilter's script or workflow-config file.

All variable could be used in form of `{var:some_var}`.

## Json schema

**Table of contents**

- [creator](#creator)
- [name](#name)
- [main](#main)
- [defaultIcon](#defaultIcon)
- [category](#category)
- [description](#description)
- [readme](#readme)
- [version](#version)
- [latest](#latest)
- [webAddress](#webAddress)
- [enabled](#enabled)
- [actions](#actions)
- [variables](#variables)

### creator

type: `string`

required: `true`

Required of consisting of bundleId, so cannot change this `creator` after install the plugin.

### name

type: `string`

required: `true`

Name of the plugin.

Required of consisting of bundleId, so cannot change this `name` after install the plugin.

### main

type: `string`

required: `true`

Entry js file of the plugin.

Must return item array of [plugin item format](./plugin-items-format-description.md).

### defaultIcon

type: `string`

required: `false`

Used to default icon in the plugin.

### category

type: `string`

required: `false`

### description

type: `string`

required: `false`

Description item displayed in the Store

### readme

type: `string`

required: `false`

README string.

Users can view README in their README view

### version

type: `string`

required: `false`

Extension's semantic version.

### latest

type: `string`

required: `false`

If `latest` exists, and this is latest than `version`, 

Arvis notify this extension is updatable when user Arvis started up.

### webAddress

type: `string`

required: `false`

Extension's webAddress.

Recommend to set extension's README webpage.

Users can view extension's information from the store on this web page.

### enabled

type: `boolean`

required: `true`

If `enabled` is false, arvis exclude the plugin from the user search result.

### actions

type: `object (Action [])`

required: `true`

Actions to execute when the plugin item is pressed by the enter.

### variables

type: `object`

required: `false`

You can set variables by here

This value can be used in `arvis-plugin.json`, and your scripts in form of environment variables

#### Action

[Click me to check Action](./action-description.md)
