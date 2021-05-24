# Action

You can use below predefined actions.

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

```

## scriptfilter

`scriptfilter` is a trigger, but it can also be used as an `action`.

Example :

```json

```