## How to build on Windows 10

### how to build

1. Clone this repository

2. `yarn` to download packages needed

3. `yarn build`

4. Before `yarn dev`, Run the command below

```shell
$ yarn replace-iohook-prebuilt
```

If having trouble with the above step, download or build the [iohook](https://github.com/wilix-team/iohook) prebuilt binary file.

5. `yarn dev` to start on development mode or `yarn start` to start on prod mode.

### python 2.7 not found issue

1. when `python 2.7 not found` issue occurs,

Run the command below with administrator privileges

```shell
$ npm --add-python-to-path='true' --debug install --global windows-build-tools
```

2. Add `.npmrc` file with below text

```shell
$ python=C:\Users\User.windows-build-tools\python27\python.exe
```

