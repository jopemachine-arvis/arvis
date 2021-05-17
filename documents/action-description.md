## Action

You can execute below predefined actions.

### script

Example: 

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

### args

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


### if

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


### open

Example: 

```json
"action": [
  {
    "modifiers": "normal",
    "type": "open",
    "target": "{query}"
  },
]
```

### notification

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

### clipboard

```json
"action": [
  {
    "modifiers": "normal",
    "type": "clipboard",
    "text": "{var:url}"
  }
]
```