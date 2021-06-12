# Scriptfilter

Example:

```json
{
  "type": "scriptfilter",
  "command": "ch > conf",
  "title": "ch > conf",
  "subtitle": "Open config file",
  "script_filter": "node src/openConf.js",
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

## type

type: `string`

required: `true`

## title

type: `string`

required: `true`

The biggest text in the item.

## subtitle

type: `string`

A additional description of the command to display in the search window.

## command

type: `string`

required: `true`

Command string used for searches.

If `title` is not set, command will be `title`.

## script_filter

type: `string | object`

Each time a query changes, the script specified in `script_filter` is executed again to update the items.

If the script can run in all platform, just set like below.

```json
"script_filter": "node abc.js"
```

If the script can run in specific platform, you can set like below.

```json
"script_filter": {
  "win32": "node abc.js",
  "darwin": "node def.js",
  "linux": "node ghi.js"
}
```

If the script can run in specific shell of the platform, you can set like below.

You can give `true` or `shell name` to `shell` option

```json
"script_filter": {
  "win32": {
    "script": "node abc.js",
    // "shell": true,
    "shell": "specific shell name",
  }
}
```

## withspace

type: `boolean`

default value: `true`

If `withspace` is true, the command include the first white space.

(So the first whitespace is excluded from the query)

Set this value to false if you do not want to include first space in your query.

## running_subtext

type: `string`

Indicate `running_subtext` instead of `subtitle` while specified `script_filter` is running.

## arg_type

type: `string (enum)`

Possible values: `required`, `no`, `optional`.

If `arg_type` is `required`, the action is triggered only when `arg` is given.

If `arg_type` is `no`, the action is triggered only when `arg` is not given.

If `arg_type` is `optional`, the action could be triggered with or without `arg`.

## action

type: `Action (object)`

Action to be triggered by the `scriptfilter`.

[Click to view "action" type](./action-description.md)

## modifiers

type: `string (enum)`

Specific modifier key must be pressed to run

If you do not give any modifiers, it would be handled by `normal` which means the action will be executed with no `modifier` key

Possible modifier values: `shift`, `option (mac)`, `alt`, `cmd (mac)`, `win (windows)`.
