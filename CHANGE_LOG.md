# 0.11.3

* [feature] Create check for update button, improve app update logic
* [fix] LargeText window text cutting bug fix

# 0.11.2

## What’s Changed

* [feature] Implement keydown event handler on Store page, Snippet page (refactoring)
* [feature] Change mouse cursor on largeText window
* [feature] Make default hotkeys could be empty 
* [fix] Fix sidebar submenu collapse related bug
* [fix] Fix style bugs

# 0.11.1

## What’s Changed

* [fix] Minor tweaks

# 0.11.0

## What’s Changed

* [fix] Minor tweaks
* [feature] Improve preference window's overall design
* [feature] Change sidebar's icons
* [feature, experimental] Add Snippet feature, window, preference page
* [feature, experimental] Add Universal action window, preference page

# 0.10.8

## What’s Changed

* [feature] Add icon to clipboardHistory items
* [fix] Fix bug of Alert name in Windows
* [fix] Fix icon not showing bug in Alert
* [fix] Fix bugs of 'Fix-path'

# 0.10.7

## What’s Changed

* [fix] Fix scriptExecutor bug related execa dependencies

# 0.10.6

## What’s Changed

* [fix] Add 'Fix-path' linux support

# 0.10.5

## What’s Changed

* [fix] Minor tweaks, dependencies update

# 0.10.4

## What’s Changed

* [fix] Minor tweaks
* [feature] Improve logger's log styles

# 0.10.3

## What’s Changed

* [hotfix] Fix scriptExecutor bug
* [fix] Improve search window border
* [fix] Fix auto start bug on linux

# 0.10.2

## What’s Changed

* [fix] Fix scriptExecutor bug on linux
* [fix] Fix walkthrough modal box bug

# 0.10.1

## What’s Changed

* [fix] Fix some typos on error messages
* [fix] Fix search window auto fit bug when first launched
* [fix] Add dragger to clipboardHistory window
* [fix] Fix auto launch feature bug on linux
* [fix, optimize] Fix [severe performance issue on script execution on macos](https://github.com/jopemachine/arvis-core/issues/2)
* [fix, revert] Improve search window resizing
* [revert] Revert navigate-preventable quicklook webview
* [feature] Implement open browser feature by clicking link with pressing modifier key in quicklook webview
* [feature] Update search window's spinner style 
* [feature] Indicate search window's spinner when deferred async plugin is executing
* [feature] Add right, bottom border color to search window
* [feature] Implement walkthrough modalbox when first run

# 0.9.0

## What’s Changed

* [fix] Fix bug that some key are not recorded in hotkeyRecordForm
* [fix] Fix option key not working bug in search window
* [fix] Improve quicklook html view resizing
* [feature] Improve quicklook animation
* [feature] Make quicklook webview navigate-preventable (Instead go to external link)

# 0.8.13

## What’s Changed

* [feature] Support pdf viewer in quicklook
* [feature] Add 'About' window to menu
* [fix] Bug fixed of LargeText window mouse wheeling event
* [fix] Fix possible memory lick of clipboardHistory window

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
