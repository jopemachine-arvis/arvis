# Plugin introduction

You can replace repetitive task with using `workflow`.

However, `workflow` cannot create tasks such as fuzzy file search in the arvis search window without trigger.

`plugin` allows you to customize features that are usually provided as `built-in features`.

## Differences between plugins and workflows

* The biggest difference between `plugin` with `workflow` is `plugin` do not have `Trigger`

* Each plugin item is treated like `keyword`

* `workflow` can be written in any programming language, but `plugin` can be written only in `JavaScript`.

* Because `plugin` is loaded in advance, `plugin` is much faster than `workflow` using process-communication.

* You can use async await statement in `plugin`, but do not recommend to put heavy asynchronous operation in the `plugin`.

* If async plugin continues work after some specified time (currently, it is set on `100ms`), the plugin async will be forcibly shut down to avoid slowing down arvis performance.

* If you should put heavy async operation, consider replacing it with `workflow`

## Action

[Click me to check Action](./action-description.md)

## How to write plugin

[Click me to check how to write new plugin](./plugin-develop.md)

## About Workflow

[Click me to check Workflow](./workflow-intro.md)

## Plugin links

[Click me to check available arvis-plugins](./plugin-links.md)