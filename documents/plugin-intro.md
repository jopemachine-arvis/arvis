# Plugin introduction

You can replace repetitive task with using `workflow`.

However, `workflow` cannot create tasks such as fuzzy file search in the arvis search window **without trigger**.

`plugin` allows you to customize features that are usually provided as **built-in features**.

## Differences between plugins and workflows

* The biggest difference between `plugin` with `workflow` is `plugin` do not have `Trigger`

* Each plugin item is treated like `keyword`

* `workflow` can be written in any programming language, but `plugin` can be written only in `JavaScript`.

* Because `plugin` is loaded in advance, `plugin` is much faster than `workflow` using process-communication.

* If you should put heavy async operation, consider replacing it with `workflow`

## Async plugin

* You can use async await statement in `plugin`, but do not recommend to put heavy asynchronous operation in the `plugin` if possible.

## Defered async plugin

* If async plugin continues work after `specified time`, the async plugins will be `defered`.

* If there are some plugins that does not return after a certain amount of time, Arvis shows only the items returned by then, And when all the defered plugin ends work, The rest of the items will be shown below.

Note: The results of Deferred plugins are shown below normal items regardless of sorting. (Otherwise, it can cause confusion for users.)

## Action

[Click me to check Action](./action-description.md)

## How to write plugin

[Click me to check how to write new plugin](./plugin-develop.md)

## About Workflow

You can also check other extension type.

[Click me to check Workflow](./workflow-intro.md)

## Plugin links

[Click me to check available arvis-plugins](./plugin-links.md)