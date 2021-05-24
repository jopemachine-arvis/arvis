# Plugin introduction

You can replace repetitive task with using `workflow`.

However, `workflow` cannot create tasks such as fuzzy file search in the arvis search window without trigger.

`plugin` allows you to customize features that are usually provided as `built-in features`.

## Differences between plugins and workflows

* The biggest difference between `plugin` with `workflow` is `plugin` do not have triggering items, such as a keyword or script filter.

* `workflow` can be written in any programming language, but `plugin` can be written only in `JavaScript`.

* Because `plugin` is loaded when Arvis window shows up, `plugin` is much faster than `workflow`.

* `plugin` has cannot define `action` in json file unlike `workflow`

* You can use async await statement in `plugin`, but do not recommend to put heavy asynchronous operation in the `plugin`. (it may slow down performance of Arvis)
If you should do, consider replacing it with `workflow`

* Each plugin item is treated like `keyword`.

## arvis-plugin.json format

`arvis-plugin.json` format is very similar with `arvis-workflow.json` format.

The only difference is that there is `action` right away instead of `commands`.

### Action

[Click me to check Action](./action-description.md)

## Available Environment variable

Both `workflows` and `plugin` set environment variables when running scripts.

You can use these variables in your script if needed.

[Click me to check Environment variables](./extension-env-description.md)

## Workflow

[Click me to check Workflow](./workflow-intro.md)

## Plugin links

[Click me to check arvis-plugins](./plugin-links.md)