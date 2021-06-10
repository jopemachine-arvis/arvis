# Plugin items format

## title

type: `string`

required: `true`

The biggest text in the item.

Plugin items are sorted with `title` in Arvis.

So, `items`'s order is ignored.

If you want to not sort your plugin item, use `nosort` option.

Note that `nosort` is true, your plugin items will be positioned most below position.

## command

type: `string`

required: `false`

If you want to sort your plugin item not using `title`, use `command`.

If command is specified, Arvis sort plugin items by command, not title.

But note that the difference between commands and titles can cause confusion to users.

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

You can forward icon like below way too.

```js
icon: {
  path: `${__dirname}/icon.png`
}
```

## text

type: `string | object`

required: `false`

When user focus the item, press ctrl (or cmd) + c, user get copied `text`.

And when user focus the item, press ctrl (or cmd) + l, the text will be displayed in Large text window.

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

## quicklookurl

type: `string`

required: `false`

You can press the shift key above the item to open the quicklook window.

The window displays the file path or url that was passed on.

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