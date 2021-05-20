# Hotkey

Example:

```json
{
  "type": "hotkey",
  "hotkey": "Double ctrl",
  "action": [
    {
      "modifiers": "normal",
      "type": "scriptfilter",
      "script_filter": "./node_modules/.bin/run-node src/selectProvider.js",
      "running_subtext": "Selecting accounts..",
      "withspace": false,
      "action": [
        {
          "modifiers": "normal",
          "type": "scriptfilter",
          "script_filter": "./node_modules/.bin/run-node src/fetchEmails.js 'UNSEEN' '{query}'",
          "running_subtext": "Fetching unread emails..",
          "withspace": false,
          "action": [
            {
              "modifiers": "normal",
              "type": "open",
              "target": "file://{query}"
            }
          ]
        }
      ]
    }
  ]
},
```

## type

type: `string`

required: `true`

## hotkey

type: `string`

required: `true`

Hotkey to register action

## action

type: `Action (object)`

Action to be triggered by the keyword.

[Click to view "action" type](./documents/action-description.md)

## modifiers

type: `string (enum)`

Specific modifier key must be pressed to run

[Click to view "modifiers"](./documents/modifiers-description.md)