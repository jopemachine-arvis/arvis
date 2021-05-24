# Action

You can use below predefined actions.

If there is one more action in `action array`, the actions are all executed sequentially.

But don't put other actions together when you put `trigger` in `action`.

## script

Execute script through [execa](https://github.com/sindresorhus/execa)

Example :

```json
"action": [
  {
    "modifiers": "normal",
    "type": "script",
    "script": "./node_modules/.bin/run-node src/clearCache.js",
    "action": [
      {
        "modifiers": "normal",
        "type": "notification",
        "title": "Cache cleared",
        "text": ""
      }
    ]
  }
]
```

### modifiers

type: `string (enum)`

required: `false`

### type

type: `string`

required: `true`

### script

type: `string`

required: `true`


## args

Extract selected `variable` to `query`

Example :

```json
"action": [
  {
    "modifiers": "normal",
    "type": "args",
    "arg": "{var:folder}",
    "action": [
      {
      }
    ]
  }
]
```

### type

type: `string`

required: `true`

### arg

type: `string`

required: `true`

Argument to select.

## cond, if

Example :

```json
"action": [
  {
    "modifiers": "normal",
    "type": "cond",
    "if": {
      "cond": "new RegExp(\".*url.*\").test({query})",
      "action": {
        "then": [
          {
            "modifiers": "normal",
            "type": "clipboard",
            "text": "{var:url}"
          }
        ],
        "else": [
          {
            "modifiers": "normal",
            "type": "clipboard",
            "text": "https://www.google.com/search?q={var:query}"
          }
        ]
      }
    }
  }
]

```

### cond

type: `string (code)`

required: `true`

`cond` codes will be evaluated runtime.

Here you can inspect variable condition to branch out

### then

type: `object`

required: `true`

if `cond` is true, then `action` is executed.

### else

type: `object`

required: `false`

if `cond` is false, else `action` is executed.

## open

Open file path, web url by [open](https://github.com/sindresorhus/open)

Example :

```json
"action": [
  {
    "modifiers": "normal",
    "type": "open",
    "target": "{query}"
  },
]
```

### modifiers

type: `string (enum)`

required: `false`

### type

type: `string`

required: `true`

### target

type: `string`

required: `true`

## notification

Create notification with the notification feature of the OS.

Example :

```json
"action": [
  {
    "modifiers": "normal",
    "type": "notification",
    "title": "Caching completed successfully",
    "text": ""
  }
]
```

### modifiers

type: `string (enum)`

required: `false`

### type

type: `string`

required: `true`

### title

type: `string`

required: `true`

### text

type: `string`

required: `false`

## clipboard

Copy `text` to clipboard

Example :

```json
"action": [
  {
    "modifiers": "normal",
    "type": "clipboard",
    "text": "{var:url}"
  }
]
```

### modifiers

type: `string (enum)`

required: `false`

### type

type: `string`

required: `true`

### text

type: `string`

required: `false`

## keyword

`keyword` is a trigger, but it can also be used as an `action`.

Example :

```json
{
    "type": "scriptfilter",
    "command": "enct",
    "title": "enct",
    "subtitle": "Select tag and enter note content to create.",
    "script_filter": "./node_modules/.bin/run-node searchTag.js '{query}' --create",
    "action": [
        {
            "modifiers": "normal",
            "type": "keyword",
            "title": "Create Note..",
            "subtitle": "Please enter note content to create.",
            "action": [
                {
                    "modifiers": "normal",
                    "type": "script",
                    "script": "./node_modules/.bin/run-node createNoteWithTag.js '{query}'",
                    "action": [
                      ...
                    ]
                }
            ]
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

required: `false`

A additional description of the command to display in the search window.

### modifiers

type: `string (enum)`

required: `false`

### withspace

type: `boolean`

required: `false`

Indicates if space is required after the command to execute it.

If `withspace` is true, the action can only be run if space exists.

### arg_type

type: `string (enum)`

Possible values: `required`, `no`, `optional`.

If `arg_type` is `required`, the action is triggered only when `arg` is given.

If `arg_type` is `no`, the action is triggered only when `arg` is not given.

If `arg_type` is `optional`, the action is triggered with or without `arg`

## scriptfilter

`scriptfilter` is a trigger, but it can also be used as an `action`.

Overlapping scriptfilter might be useful.

Example :

```json
{
    "type": "scriptfilter",
    "command": "chf",
    "subtitle": "Search chrome bookmark folder",
    "script_filter": "node src/fetchBookmarkFolder.js '{query}'",
    "action": [
        {
            "modifiers": "normal",
            "type": "args",
            "arg": "{var:folder}",
            "action": [
                {
                    "modifiers": "normal",
                    "title": "",
                    "type": "scriptfilter",
                    "script_filter": "node src/fetchBookmark.js '{query}'",
                    "action": [
                      ...
                    ]
                }
            ]
        }
    ]
}
```

### type

### title

### subtitle

### action

### modifiers