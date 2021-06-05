# `arvis-plugin-json` format

The json file consists of the following attributes.

## createdby

type: `string`

required: `true`

Required of consisting of bundleId, so cannot change this `createdby` after install the plugin.

## name

type: `string`

required: `true`

Name of the plugin.

Required of consisting of bundleId, so cannot change this `name` after install the plugin.

## main

type: `string`

required: `true`

Entry js file of the plugin.

## defaultIcon

type: `string`

required: `false`

Used to default icon in the plugin.

## category

type: `string`

required: `false`

## description

type: `string`

required: `false`

## readme

type: `string`

required: `false`

## version

type: `string`

required: `false`

## webaddress

type: `string`

required: `false`

## enabled

type: `string`

required: `true`

If `enabled` is false, arvis exclude the plugin from the user search result.

## action

type: `object (Action [])`

required: `true`

### Action

[Click me to check Action](./action-description.md)
