# 0.8.12

## What’s Changed

* [fix] Bug fixed of Key-dispatching action

# 0.8.11

## What’s Changed

* [feature] Implement [Key-dispatching action](https://github.com/jopemachine/arvis/blob/master/documents/action-description.md#keyDispatching)

# 0.8.10

## What’s Changed

* [feature] Add rehype-raw for handling raw html to markdown renderer
* [feature] Add arvis-plugin org's readme download

# 0.8.9

## What’s Changed

* [fix, revert] Revert window's toggle searchwindow hack causing intermittent freezing. This cause letter afterimage on Windows again.

# 0.8.8

## What’s Changed

* [feature] Implement quicklook resizing
* [fix] Remove useless console comment
* [fix] Remove styled component dynamic created bug
* [fix] Fix Readme page not updated bug on workflow page

# 0.8.7

## What’s Changed

* [fix] Filter not proper withspace items on workflow items
* [fix] Fix plugin items not executed bug occuring since 0.8.4
* [optimize] Optimize webview related feature on quicklook
* [remove] Remove dynamic window height change

# 0.8.6

## What’s Changed

* [hotfix] Fix plugin bug occurred in 0.8.5.

# 0.8.5

## What’s Changed

* [feature] Implement sorting item feature by most recent usage

# 0.8.4

## What’s Changed

* [feature] Add variable debugging support back
* [feature] Implement clipboard variable support

# 0.8.3

## What’s Changed

* [feature] Add scroll bar to markdown renderer of quicklook
* [fix] Fix intermittent delayed async plugin error

# 0.8.2

## What’s Changed

* [fix] Fix scrolling on quicklook bug
* [feature] Implement promise handling in quicklook

# 0.8.1

## What’s Changed

* [fix] Fix icon errors using lru cache (#19) @jopemachine
* [Snyk] Upgrade got from 11.8.0 to 11.8.2 (#16) @snyk-bot
* [feature] Improve readme feature handling on workflow, plugin page
* [feature] Apply dark theme to readme of workflow, plguin page
* [feature] Implement quicklook feature
* [remove] Remove quicklook window feature
* [remove] Remove vertical size change limit of search window

![스크린샷 2021-07-29 오후 5 40 59](https://user-images.githubusercontent.com/18283033/127460823-02115fc9-680a-4e6c-a760-3f9713df1b95.png)
![스크린샷 2021-07-29 오후 5 41 18](https://user-images.githubusercontent.com/18283033/127460829-7b2eaa89-018a-484f-a110-2a8bfc56e1e2.png)
![스크린샷 2021-07-29 오후 5 41 38](https://user-images.githubusercontent.com/18283033/127460834-04dffd68-addd-4869-b412-2023aaa516cc.png)
![스크린샷 2021-07-29 오후 9 09 42](https://user-images.githubusercontent.com/18283033/127489285-34c0a02b-1f68-4240-a015-09669baa3a31.png)

# 0.7.2

## What’s Changed

* [feature] Improve delayed async plugin handling
* [fix] Bug fixed when input string is empty

# 0.7.1

## What’s Changed

* [Snyk] Upgrade regenerator-runtime from 0.13.7 to 0.13.8 (#15) @snyk-bot
* [feature] Support multiple delayed plugins (bug fix)

# 0.7.0

## What’s Changed

* [Snyk] Upgrade electron-util from 0.16.0 to 0.17.0 (#13) @snyk-bot
* [feature] Now Arvis support delayed async plugin.
* [feature] Add alfred-like theme

![Jul-23-2021 13-58-24](https://user-images.githubusercontent.com/18283033/126739073-1f0a620e-810e-47da-977c-112607a9142c.gif)
