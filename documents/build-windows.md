# How to build on Windows 10

## How to build

1. Clone this repository

2. `yarn` to download packages needed

3. `yarn build`

4. Download prebuilt binary files on [here](https://github.com/wilix-team/iohook) and replace it with `src/node_modules/iohook/builds`.

5. `yarn start`

## python 2.7 not found issue

1. when `python 2.7 not found` issue occurs,

Run the command below with administrator privileges

```shell
$ npm --add-python-to-path='true' --debug install --global windows-build-tools
```

2. Add `.npmrc` file with below text

```shell
$ python=C:\Users\User.windows-build-tools\python27\python.exe
```

## How to package app

1. `yarn package`
