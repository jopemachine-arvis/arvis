# History

Arvis supports providing `history log`.

In `plugin`, it would be provided as `history` of main function,

In `workflow`, you can access the history file's path with environment variable and use it by reading the history json.

## History file path

Check [Config file paths](./config-file-paths.md)

## History json schema

### timestamp

type: `number`

Timestamp when the action is executed (when the log was saved).

### type

type: `string enum ("action" or "inputStr")`

### action?

type: `object (Action)`

It would be specified only if `type` is `action`

Save the action when it occurs.

The maximum that can be saved can be specified by the users.

Some actions, such as cond, are not saved by itself.

### inputStr?

type: `string`

It would be specified only if `type` is `inputStr`.

Saves the user's input when `enter key` is pressed.