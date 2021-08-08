# How to build on Windows

> This is not required for regular users. You should follow this page only if you want to build the source files yourself.

## Prerequisite

* `Node` version should be more than `12.20` to develop Arvis.

* [robotjs](https://github.com/octalmage/robotjs#Building) dependencies

## How to build

1. Clone this repository

2. `yarn` to download packages needed

3. `yarn build`

4. Download prebuilt binary files on [Here](https://github.com/wilix-team/iohook) and replace it with `src/node_modules/iohook/builds`.

5. `yarn start`

## How to package app

Some features must also be tested separately in production.

1. `yarn package`
