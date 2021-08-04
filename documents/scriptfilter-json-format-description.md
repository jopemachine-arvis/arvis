# Scriptfilter item JSON format

`Arvis` use almost same scriptfilter JSON format with `Alfred-workflow`

Marked `arvisOnly: true` for items that are not supported by alfred.

## title

type: `string`

required: `true`

The most visible text in the item.

## subtitle

type: `string`

required: `false`

A additional description of the command to display in the search window.

## arg

type: `string | object`

required: `false`

Forward argument to next action's `{query}`.

If arg is `string`, replace `{query}` with forwared `arg`.

If arg is `object`, enables the key value pairs to be used.

## icon

type: `string | object`

required: `false`

Image to display on item.

If icon is `string`, it will be treated as file path.

You can forward `icon` like below way too.

```js
icon: {
  path: `${__dirname}/icon.png`
}
```

## text

type: `string | object`

required: `false`

When user focus the item, press `ctrl (or cmd) + c`, user get copied `text`.

And when user focus the item, press `ctrl (or cmd) + l`, the text will be displayed in Large text window.

You can give these texts in below way.

You can forward `text` like below way too.

```js
text: {
  copy: `some-text`,
  largeType: 'some-text`,
}
```

If `text` is `string`, it would be `copy` and `largeType` both.

## valid

type: `boolean`

required: `false`

default value is `true`.

If valid is `false`, the item is treated error messages.

You can show error message through setting `valid` to false.

## quicklook

type: `object`

required: `false`

arvisOnly: `true`

Users can press the `shift + space` key above the item to open the quicklook.

The data handed over is explicitly displayed in the quicklook.

If you do not specify a quicklook, the arvis will infer the data to display.

Recommend specifying `quicklook` value for explicit data display.

### type

type: `string (enum)`

required: `true`

values: `html` | `image` | `markdown` | `text` | `pdf`

### data

type: `string | Promise<string>`

required: `true`

You can forward Promise returning string to data.

Then the promise is resolved when user opens the quicklook.

This is useful you don't want to execute the rendering script because it has some heavy async operations.

* html, image, pdf : file path (or url) to display
* markdown, text: text string

## quicklookurl

type: `string`

required: `false`

Users can press the `shift + space` key above the item to open the quicklook.

You can consider `quicklookurl` as shortcut of `quicklook` object with html type.

## mods

type: `object`

required: `false`

You can replace some attributes with different value while the modifier key is pressed like below way.

```js
mods: {
    "alt": {
        "title: "",
        "subtitle": ""
    },
    "cmd": {
        "title: "",
        "subtitle": ""
    },
}
```

## variables

type: `object`

required: `false`

The key-value pairs in the `variables` object are put in form of `{var:key} = value`.

### Difference with `arg` 

1. In, `variables`, the keys becomes `{var:key}`

2. `variables` is saved in environment variables. So, you can use the variable values in your scripts too. (`arg` cannot be used).

3. You can set `variables` in your config file too.

## uid

type: `string`

Not implemented yet

## match

type: `string`

Not implemented yet

## actions

Not implemented yet

## type

Not implemented yet