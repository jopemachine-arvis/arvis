# Plugin introduction

You can replace repetitive task with using `workflow`.

However, `workflow` cannot create tasks such as fuzzy file search in the arvis search window without trigger.

`plugin` allow you to customize features that are usually provided as `built-in features`.


## Differences between plugins and workflows

* The biggest difference between `plugin` with `workflow` is `plugin` do not have triggering items, such as a keyword or script filter.

* `workflow` can be written in any programming language, but `plugin` can be written only in `JavaScript`.

* Because `plugin` is loaded when Arvis window shows up, `plugin` is much faster than `workflow`.

* `plugin` has cannot define `action` in json file unlike `workflow`

* You can use async await statement in plugin, but do not recommend to put heavy asynchronous logic in the `plugin`.

## Plugin links

[Click me to check arvis-plugins](./plugin-links.md)