# Scriptfilter item JSON format

`Arvis` use scriptfilter JSON format same with Alfred-workflow

## title

type: `string`

required: `true`

The biggest text in the item.

## subtitle

type: `string`

required: `false`

A additional description of the command to display in the search window.

## arg

type: `string | object`

required: `false`

Forward argument.

If arg is `string`, replace `{query}` with forwared `arg`.

If arg is `object`, enables the key value pairs to be used like variables

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

The difference with arg is that the key becomes `{var:key}`
