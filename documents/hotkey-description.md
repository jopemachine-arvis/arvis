# Hotkey

Example:

```json
{
  "type": "hotkey",
  "hotkey": "Double ctrl",
  "actions": [
    {
      "modifiers": "normal",
      "type": "scriptfilter",
      "scriptFilter": "node src/selectProvider.js",
      "runningSubtext": "Selecting accounts..",
      "withspace": false,
      "actions": [
        {
          "modifiers": "normal",
          "type": "scriptfilter",
          "scriptFilter": "node src/fetchEmails.js 'UNSEEN' '{query}'",
          "runningSubtext": "Fetching unread emails..",
          "withspace": false,
          "actions": [
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

Hotkey to register actions.

Possible Modifiers used in `hotkey`: `cmd`, `win`, `option`, `ctrl`, `alt`, `shift`

So, `cmd + a`, `option + c`.. keys are available. 

And you can prepend `Double` to Possible modifiers.

So, `Double cmd`, `Double wid`, `Double option`... keys are available.

But `Double cmd + a` is not available.

If there are duplicate hotkeys within user's workflow, user will be notified.

## actions

type: `Action (object)`

Action to be triggered by the `hotkey`.

[Click to view "action" type](./documents/action-description.md)
