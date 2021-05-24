import { BrowserWindow, Menu, MenuItem, app } from 'electron';

class SearchbarContextMenu extends Menu {
  constructor({
    preferenceWindow,
    searchWindow,
  }: {
    preferenceWindow: BrowserWindow;
    searchWindow: BrowserWindow;
  }) {
    super();

    super.append(
      new MenuItem({
        type: 'normal',
        label: 'Preferences..',
        toolTip: 'Open Preference window',
        click() {
          preferenceWindow.show();
        },
      })
    );
    super.append(
      new MenuItem({
        type: 'normal',
        label: 'Open Debugger Window',
        toolTip: 'Open Search window Debugger Window',
        click() {
          searchWindow.webContents.openDevTools({
            mode: 'undocked',
            activate: true,
          });
        },
      })
    );
    super.append(new MenuItem({ type: 'separator' }));
    super.append(
      new MenuItem({
        type: 'normal',
        label: 'Quit',
        toolTip: 'Quit Arvis',
        click() {
          app.quit();
        },
      })
    );
  }
}

export default SearchbarContextMenu;
