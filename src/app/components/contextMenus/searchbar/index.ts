import { BrowserWindow, Menu, MenuItem, app } from 'electron';

class SearchbarContextMenu extends Menu {
  constructor({ preferenceWindow }: { preferenceWindow: BrowserWindow }) {
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
