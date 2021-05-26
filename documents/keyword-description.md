# Keyword

Example:

```json
{
  "type": "keyword",
  "command": "ch > init",
  "title": "Init your config file",
  "subtitle": "",
  "withspace": false,
  "arg_type": "no",
  "action": [
    {
      "modifiers": "normal",
      "type": "script",
      "script": "./node_modules/.bin/run-node src/init.js"
    }
  ]
},
```

## type

type: `string`

required: `true`

## command

type: `string`

required: `true`

Command string used for searches.

If `title` is not set, command will be `title`.

## title

type: `string`

The biggest text in the item.

## subtitle

type: `string`

A additional description of the command to display in the search window.

## withspace

type: `boolean`

Indicates if space is required after the command to execute it.

If `withspace` is true, the action can only be run if space exists.

## arg_type

type: `string (enum)`

Possible values: `required`, `no`, `optional`.

If `arg_type` is `required`, the action is triggered only when `arg` is given.

If `arg_type` is `no`, the action is triggered only when `arg` is not given.

If `arg_type` is `optional`, the action is triggered with or without `arg`

## action

type: `Action (object)`

Action to be triggered by the `keyword`.

[Click to view "action" type](./documents/action-description.md)

## modifiers

type: `string (enum)`

Specific modifier key must be pressed to run

If you do not give any modifiers, it would be handled by `normal` which means the action will be executed with no `modifier` key

Possible modifier values: `shift`, `option (mac)`, `alt`, `cmd (mac)`, `win (windows)`.