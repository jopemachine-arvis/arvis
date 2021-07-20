# `arvis-workflow-json` format

The json file consists of the following attributes.

## Usable variable

Certain values in the Json file are replaced by arvis.

### `{query}`, `$1`, `$2`..

`{query}` is replaced with user's input (query not including the `command`).

Example:
```json
{
  "type": "keyword",
  "command": "test",
  "title": "Test",
  "actions": [
    {
      "modifiers": "normal",
      "type": "script",
      "script": "node abc.js '{query}'"
    }
  ]
}
```

In above example, when user input is `test abc def`, `{query}` is `abc def`,

and `$1` is `abc`, `$2` is `def`.

### variables

You can set `variables` in your scriptfilter's script or workflow-config file.

All variable could be used in form of `{var:some_var}`.

Example:
```json
{
  "variable": {
    "some_var": ""
  },
  "actions": [
    {
      "type": "keyword",
      "command": "test",
      "title": "Test",
      "actions": [
        {
          "modifiers": "normal",
          "type": "script",
          "script": "node abc.js '{var:some_var}' '{query}'"
        }
      ]
    }
  ]
}
```

## Json schema

**Table of contents**

- [creator](#creator)
- [name](#name)
- [defaultIcon](#defaultIcon)
- [category](#category)
- [description](#description)
- [readme](#readme)
- [version](#version)
- [latest](#latest)
- [webAddress](#webAddress)
- [enabled](#enabled)
- [commands](#commands)
- [variables](#variables)

### creator

type: `string`

required: `true`

Required of consisting of `bundleId` of the extension, so cannot be changed this `creator` after install the workflow.

### name

type: `string`

required: `true`

Name of the workflow.

Required of consisting of `bundleId` of the extension, so cannot be changed this `name` after install the workflow.

### defaultIcon

type: `string`

required: `false`

Used to default icon in the workflow.

### category

type: `string`

required: `false`

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

If `enabled` is false, arvis exclude the workflow from the user search result.

### commands

type: `array`

required: `true`

commands consist of `trigger-action` pairs.

You can check both in below links.

### variables

type: `object`

required: `false`

You can set variables by here

This value can be used in `arvis-workflow.json`, and your scripts in form of environment variables

#### Trigger

[Click me to check Trigger](./trigger-description.md)

#### Action

[Click me to check Action](./action-description.md)
