/* eslint-disable no-restricted-syntax */
import { ipcMain, dialog, BrowserWindow, globalShortcut } from 'electron';

import shortcutCallbackTbl from './shortcutCallbackTable';

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

  // Used to hide search window with avoiding afterimage
  ipcMain.on('hide-search-window', (evt: any) => {
    searchWindow.hide();
  });

  // Used to register global shortcuts
  ipcMain.on(
    'set-global-shortcut',
    (evt: any, { callbackTable }: { callbackTable: any }) => {
      const shortcuts = Object.keys(callbackTable);
      for (const shortcut of shortcuts) {
        const action = callbackTable[shortcut];

        globalShortcut.register(
          shortcut,
          shortcutCallbackTbl[action]({ preferenceWindow, searchWindow })
        );
      }
    }
  );
};
