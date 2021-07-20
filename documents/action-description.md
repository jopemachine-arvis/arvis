# Action

You can use below `actions` types.

If there is one more action in `actions`, the actions are all executed sequentially.

You can also put `actions` in some `action`.

In case of the `action` is async action, next actions are executed after the async action is ended.

For example, If you put some action in `script` action, the action is triggered when the script execution ends.

**Table of contents**

- [script](#script)
- [args](#args)
- [cond](#cond)
- [open](#open)
- [notification](#notification)
- [clipboard](#clipboard)
- [keyword](#keyword)
- [scriptFilter](#scriptFilter)
- [resetInput](#resetInput)

## script

async: `true`

Execute script through [execa](https://github.com/sindresorhus/execa)

Example :

```json
"actions": [
  {
    "modifiers": "normal",
    "type": "script",
    "script": "node src/clearCache.js",
    "actions": [
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

Specific modifier key must be pressed to run

If you do not give any modifiers, it would be handled by `normal` which means the actions will be executed with no `modifier` key

Possible modifier values: `shift`, `option (mac)`, `alt`, `cmd (mac)`, `win (windows)`.

### type

type: `string`

required: `true`

### script

type: `string | object`

required: `true`

If the script can run in all platform, just set like below.

```json
"script": "node abc.js"
```

If the script can run in specific platform, you can set like below.

```json
"script": {
  "win32": "node abc.js",
  "darwin": "node def.js",
  "linux": "node ghi.js"
}
```

If the script can run in specific shell of the platform, you can set like below.

You can give `true` or `shell name` to `shell` option

```json
"script": {
  "win32": {
    "script": "node abc.js",
    "shell": "specific shell name",
  }
}
```

Note: The first argument is the `program` to run, and the other arguments are parsed into the program's `arguments`.

If you want to use script like in shell, use `shell` option. 

## args

Extract and replace selected `variable` or some value with `query`

Example :

```json
"actions": [
  {
    "modifiers": "normal",
    "type": "args",
    "arg": "{var:some_variable_name}",
    "actions": [
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

This variable is forwarded to `{query}`.

## cond, if

`cond` code is `evaluated` in runtime.

So, you can check some statuses in here and branch your extension's code logic.

This is useful, for example, for executing different actions according to variables.

Example :

```json
"actions": [
  {
    "modifiers": "normal",
    "type": "cond",
    "if": {
      "cond": "new RegExp(\".*url.*\").test({query})",
      "actions": {
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

Here you can inspect variable condition to branch out.

Note: If variables such as `{query}` are not evaluated, `cond` are evaluated as false.

### then

type: `object`

required: `true`

if `cond` is true, then `actions` is executed.

### else

type: `object`

required: `false`

if `cond` is false, else `actions` is executed.

## open

Open file path, web url by [open](https://github.com/sindresorhus/open)

Example :

```json
"actions": [
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

Specific modifier key that must be pressed to run.

If you do not specify any modifiers, it would be handled by `normal` which means the actions will be executed with no `modifier` key

Possible modifier values: `shift`, `option (mac)`, `alt`, `cmd (mac)`, `win (windows)`.

### type

type: `string`

required: `true`

### target

type: `string`

required: `true`

String to Open.

Should be file path or url string.

If `target` is not valid, it is not opened.

## notification

Create notification with the notification feature of the platform.

Example :

```json
"actions": [
  {
    "modifiers": "normal",
    "type": "notification",
    "title": "Some work completed successfully!",
    "text": "{query}"
  }
]
```

### modifiers

type: `string (enum)`

required: `false`

Specific modifier key must be pressed to run

If you do not give any modifiers, it would be handled by `normal` which means the actions will be executed with no `modifier` key

Possible modifier values: `shift`, `option (mac)`, `alt`, `cmd (mac)`, `win (windows)`.

### type

type: `string`

required: `true`

### title

type: `string`

required: `true`

Title string of the notification

### text

type: `string`

required: `false`

Body string of the notification

## clipboard

Copy `text` to clipboard

Example :

```json
"actions": [
  {
    "modifiers": "normal",
    "type": "clipboard",
    "text": "{query}"
  }
]
```

### modifiers

type: `string (enum)`

required: `false`

Specific modifier key must be pressed to run

If you do not give any modifiers, it would be handled by `normal` which means the actions will be executed with no `modifier` key

Possible modifier values: `shift`, `option (mac)`, `alt`, `cmd (mac)`, `win (windows)`.

### type

type: `string`

required: `true`

### text

type: `string`

required: `false`

Text to copy in clipboard.

## keyword

`keyword` is a trigger, but it can also be used as an `actions`.

In this case, you can attach command optionally to the child `keyword`.

If child `keyword` also has command, child `keyword` also belongs to seperate triggers.

Example :

```json
{
    "type": "scriptfilter",
    "command": "enct",
    "title": "enct",
    "subtitle": "Select tag and enter note content to create.",
    "scriptFilter": "node searchTag.js '{query}' --create",
    "actions": [
        {
            "modifiers": "normal",
            "type": "keyword",
            "title": "Create Note..",
            "subtitle": "Please enter note content to create.",
            "actions": [
                {
                    "modifiers": "normal",
                    "type": "script",
                    "script": "node createNoteWithTag.js '{query}'",
                    "actions": [
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

Specific modifier key must be pressed to run

If you do not give any modifiers, it would be handled by `normal` which means the actions will be executed with no `modifier` key

Possible modifier values: `shift`, `option (mac)`, `alt`, `cmd (mac)`, `win (windows)`.

### argType

type: `string (enum)`

Possible values: `required`, `no`, `optional`.

If `argType` is `required`, the actions are triggered only when `arg` is given.

If `argType` is `no`, the actions are triggered only when `arg` is not given.

If `argType` is `optional`, the actions are triggered with or without `arg`

## scriptFilter

`scriptFilter` is a trigger, but it can also be used as an `actions`.

In this case, you can attach command optionally to the child `scriptfilter`.

If child `scriptFilter` also has command, child `scriptFilter` also belongs to seperate triggers.

Example :

```json
{
    "type": "scriptfilter",
    "command": "chf",
    "subtitle": "Search chrome bookmark folder",
    "scriptFilter": "node src/fetchBookmarkFolder.js '{query}'",
    "actions": [
        {
            "modifiers": "normal",
            "type": "args",
            "arg": "{var:folder}",
            "actions": [
                {
                    "modifiers": "normal",
                    "title": "",
                    "type": "scriptfilter",
                    "scriptFilter": "node src/fetchBookmark.js '{query}'",
                    "actions": [
                    ]
                }
            ]
        }
    ]
}
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

Specific modifier key must be pressed to run

If you do not give any modifiers, it would be handled by `normal` which means the actions will be executed with no `modifier` key

Possible modifier values: `shift`, `option (mac)`, `alt`, `cmd (mac)`, `win (windows)`.

## resetInput

Reset user input string.

If there would be scriptfilter in progress, it will be quited.

### newInput

type: `string`

required: `true`

User input is replaced by `newInput`