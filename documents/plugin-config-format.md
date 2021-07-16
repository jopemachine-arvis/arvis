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

### readme

type: `string`

required: `false`

### version

type: `string`

required: `false`

Recommend to using semantic versioning.

### latest

type: `string`

required: `false`

If `latest` exists, and this is latest than `version`, 

Arvis notify this extension is updatable when user Arvis started up.

Assume to use semantic versioning.

### webAddress

type: `string`

required: `false`

### enabled

type: `string`

required: `true`

If `enabled` is false, arvis exclude the plugin from the user search result.

### actions

type: `object (Action [])`

required: `true`

### variables

type: `object`

required: `false`

You can set variables by here

This value can be used in `arvis-plugin.json`, and your scripts in form of environment variables

#### Action

[Click me to check Action](./action-description.md)
