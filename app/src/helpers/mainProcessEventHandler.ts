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
      properties: ['openFile']
    });
    preferenceWindow.webContents.send('open-wfconf-file-dialog-ret', {
      file
    });
  });

  // Used to automatically change the height of searchWindow
  ipcMain.on('resize-searchwindow-height', (evt: any, itemCount: number) => {
    const maxCount = 9;
    const heightPerItem = 45;
    let heightToSet;

    if (itemCount >= maxCount) {
      heightToSet = maxCount * heightPerItem;
    } else {
      heightToSet = itemCount * heightPerItem;
    }

    const [width] = searchWindow.getSize();
    searchWindow.setSize(width, heightToSet);
  });

  ipcMain.on('hide-search-window', (evt: any) => {
    searchWindow.hide();
  });
};
