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
      "script_filter": "node src/selectProvider.js",
      "running_subtext": "Selecting accounts..",
      "withspace": false,
      "action": [
        {
          "modifiers": "normal",
          "type": "scriptfilter",
          "script_filter": "node src/fetchEmails.js 'UNSEEN' '{query}'",
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

Hotkey to register action.

Possible Modifiers used in `hotkey`: `cmd`, `win`, `option`, `ctrl`, `alt`, `shift`

So, `cmd + a`, `option + c`.. keys are available. 

And you can prepend `Double` to Possible modifiers.

So, `Double cmd`, `Double wid`, `Double option`... keys are available.

But `Double cmd + a` is not available.

If there are duplicate hotkeys within user's workflow, user will be notified.

## action

type: `Action (object)`

Action to be triggered by the `hotkey`.

[Click to view "action" type](./documents/action-description.md)
