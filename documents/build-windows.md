1. python 2.7 not found issue

Run the command below with administrator privileges

```
npm --add-python-to-path='true' --debug install --global windows-build-tools
```

2. Add .npmrc file with below text.

```
python=C:\Users\User.windows-build-tools\python27\python.exe
```

3. Run the command below

```
yarn replace-iohook-prebuilt
```