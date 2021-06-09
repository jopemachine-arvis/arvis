# `arvis-plugin-json` format

The json file consists of the following attributes.

## Usable variable

Certain values in the Json file are replaced by arvis.

### `{query}`, `$1`, `$2`..

`{query}` is replaced with user's query without the `command`.

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

### createdby

type: `string`

required: `true`

Required of consisting of bundleId, so cannot change this `createdby` after install the plugin.

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

### webaddress

type: `string`

required: `false`

### enabled

type: `string`

required: `true`

If `enabled` is false, arvis exclude the plugin from the user search result.

### action

type: `object (Action [])`

required: `true`

### variables

type: `object`

required: `false`

You can set variables by here

This value can be used in `arvis-plugin.json`, and your scripts in form of environment variables

#### Action

[Click me to check Action](./action-description.md)
