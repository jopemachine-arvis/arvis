# How to build on Macos

## Prerequisite

* [robotjs](https://github.com/octalmage/robotjs#Building) dependencies

## How to build

1. Clone this repository

2. `yarn` to download packages needed

3. `yarn build`

4. Before `yarn start`, Run the command below

```shell
$ yarn replace-prebuilt
```

5. `yarn start`

## How to package app

Some features must also be tested separately in production.

1. `export CSC_IDENTITY_AUTO_DISCOVERY=false && yarn package`

