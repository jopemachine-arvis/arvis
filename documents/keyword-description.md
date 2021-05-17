## Keyword

Example:

```json
{
  "type": "keyword",
  "command": "ch > init",
  "text": "Init your config file",
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

### type

type: `string`

required: `true`

### command

type: `string`

required: `true`

Command to search for and execute commands.

### text

type: `string`

### subtitle

type: `string`

A additional description of the command to display in the search window.

### withspace

type: `boolean`

Indicates if space is required after the command to execute it

### arg_type

type: `string (enum)`

### action

type: `Action (object)`

### modifiers

type: `string (enum)`

Specific modifier key must be pressed to run
