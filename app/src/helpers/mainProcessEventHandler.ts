import { ipcMain, dialog, BrowserWindow } from 'electron';

export const initIPCHandler = ({
  searchWindow,
  preferenceWindow
}: {
  searchWindow: BrowserWindow;
  preferenceWindow: BrowserWindow;
}) => {
  // Used to select wfconf file
  ipcMain.on('open-wfconf-file-dialog', async (evt: any) => {
    const file: Electron.OpenDialogReturnValue = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'wf-creator setting files', extensions: ['json'] }]
    });
    preferenceWindow.webContents.send('open-wfconf-file-dialog-ret', {
      file
    });
  });

  // Used to automatically change the height of searchWindow
  ipcMain.on(
    'resize-searchwindow-height',
    (
      evt: any,
      {
        itemCount,
        maxItemCount,
        itemHeight,
        searchbarHeight
      }: {
        itemCount: number;
        maxItemCount: number;
        itemHeight: number;
        searchbarHeight: number;
      }
    ) => {
      let heightToSet;

      if (itemCount === 0) {
        heightToSet = searchbarHeight;
      } else if (itemCount >= maxItemCount) {
        heightToSet = maxItemCount * itemHeight + searchbarHeight;
      } else {
        heightToSet = itemCount * itemHeight + searchbarHeight;
      }

      const [width] = searchWindow.getSize();

      searchWindow.setSize(width, heightToSet);
    }
  );

  ipcMain.on('hide-search-window', (evt: any) => {
    searchWindow.hide();
  });
};
