# Debugging workflow, plugin

1. You can debug your query, workflow, plugin's behaviors through [Chrome Devtools](https://developer.chrome.com/docs/devtools/).

To open SearchWindow's debugger (Devtools), you can click your tray icon and select `Open Debugging Window`.

You can check the debugging information of arvis, including information about `workflow`, `plugin` in the devtools.

![](./imgs/debugging-description-1.png)

2. You can activate or unactivate log types to focus on your debugging on `Advanced > Debugging` page.

You can select

- Action types

- Variables (Arguments, query, variables info)

- Script output

- Trigger stack

- Scriptfilter

- Plugin

![](./imgs/debugging-page.png)

3. The debugger does not display information unrelated to extension development, such as redux state because it is only meaningful in Arvis development. If you want to check this debugging information, clone Arvis and run Arvis in development mode.