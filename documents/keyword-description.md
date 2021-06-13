# Keyword

Example:

```json
{
  "type": "keyword",
  "command": "ch > init",
  "title": "Init your config file",
  "subtitle": "",
  "argType": "no",
  "actions": [
    {
      "modifiers": "normal",
      "type": "script",
      "script": "node src/init.js"
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

## argType

type: `string (enum)`

Possible values: `required`, `no`, `optional`.

If `argType` is `required`, the actions are triggered only when `arg` is given.

If `argType` is `no`, the actions are triggered only when `arg` is not given.

If `argType` is `optional`, the actions are triggered with or without `arg`

## actions

type: `actions (object)`

actions to be triggered by the `keyword`.

[Click to view "actions" type](./documents/actions-description.md)

## modifiers

type: `string (enum)`

Specific modifier key must be pressed to run

If you do not give any modifiers, it would be handled by `normal` which means the actions will be executed with no `modifier` key

Possible modifier values: `shift`, `option (mac)`, `alt`, `cmd (mac)`, `win (windows)`.