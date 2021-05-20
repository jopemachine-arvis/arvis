## Scriptfilter

Example:

```json
{
  "type": "scriptfilter",
  "command": "ch > conf",
  "title": "ch > conf",
  "subtitle": "Open config file",
  "script_filter": "./node_modules/.bin/run-node src/openConf.js",
  "running_subtext": "Waiting...",
  "withspace": false,
  "arg_type": "no",
  "action": [
    {
      "modifiers": "normal",
      "type": "open",
      "target": "{query}"
    }
  ]
},
```

### type

type: `string`

required: `true`

### title

type: `string`

required: `true`

The biggest text in the item.

### subtitle

type: `string`

A additional description of the command to display in the search window.

### command

type: `string`

required: `true`

Command string used for searches.

If `title` is not set, command will be `title`.

### script_filter

type: `string`

Each time a query changes, the script specified in script_filter is executed again to update the items.

### withspace

type: `boolean`

Indicates if space is required after the command to execute it

### running_subtext

type: `string`

Indicate `running_subtext` instead of `subtitle` while script_filter is running

### arg_type

type: `string (enum)`

Possible values: `required`, `no`, `optional`.

If `arg_type` is `required`, the action is triggered only when `arg` is given.

If `arg_type` is `no`, the action is triggered only when `arg` is not given.

If `arg_type` is `optional`, the action is triggered with or without arg

### action

type: `Action (object)`

Action to be triggered by the keyword.

[Click to view "action" type](./documents/action-description.md)

### modifiers

type: `string (enum)`

Specific modifier key must be pressed to run

[Click to view "modifiers"](./documents/modifiers-description.md)