# `arvis-workflow-json` format

The json file consists of the following attributes.

## Usable variable

Certain values in the Json file are replaced by arvis.

### `{query}`, `$1`, `$2`..

`{query}` is replaced with user's query without the `command`.

Example:
```json
{
  "type": "keyword",
  "command": "test",
  "title": "Test",
  "action": [
    {
      "modifiers": "normal",
      "type": "script",
      "script": "node abc.js '{query}'"
    }
  ]
}
```

When user input is `test abc def`, `{query}` is `abc def`,

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
  ...
  "action": [
    {
      "type": "keyword",
      "command": "test",
      "title": "Test",
      "action": [
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

### createdby

type: `string`

required: `true`

Required of consisting of `bundleId` of the extension, so cannot be changed this `createdby` after install the workflow.

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
