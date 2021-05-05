/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-syntax */
import {
  ipcMain,
  dialog,
  BrowserWindow,
  globalShortcut,
  nativeImage,
  Notification,
  IpcMainEvent
} from 'electron';

import { getFonts } from 'font-list';
import WorkflowItemMenu from '../components/contextMenus/workflow';
import shortcutCallbackTbl from './shortcutCallbackTable';

export const initIPCHandler = ({
  searchWindow,
  preferenceWindow
}: {
  searchWindow: BrowserWindow;
  preferenceWindow: BrowserWindow;
}) => {
  // Used to select wfconf file
  ipcMain.on('open-wfconf-file-dialog', async (evt: IpcMainEvent) => {
    const file: Electron.OpenDialogReturnValue = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'wf-creator setting files', extensions: ['json', 'plist'] }
      ]
    });
    preferenceWindow.webContents.send('open-wfconf-file-dialog-ret', {
      file
    });
  });

  // Used to open yesno modal box
  ipcMain.on(
    'open-yesno-dialog',
    async (
      evt: IpcMainEvent,
      { msg, icon }: { msg: string; icon?: string }
    ) => {
      const ret: Electron.MessageBoxReturnValue = await dialog.showMessageBox({
        type: 'info',
        buttons: ['ok', 'cancel'],
        message: msg,
        icon: icon ? nativeImage.createFromPath(icon) : undefined
      });

      const yesPressed = ret.response === 0;
      preferenceWindow.webContents.send('open-yesno-dialog-ret', {
        yesPressed
      });
    }
  );

  // Used to show notification
  ipcMain.on(
    'show-notification',
    (evt: IpcMainEvent, { title, body }: { title: string; body: string }) => {
      // https://www.electronjs.org/docs/tutorial/notifications
      const notification = {
        title,
        body
      };
      new Notification(notification).show();
    }
  );

  // Used to get all system fonts
  ipcMain.on('get-system-fonts', async (evt: IpcMainEvent) => {
    const fonts = await getFonts({ disableQuoting: true });
    preferenceWindow.webContents.send('get-system-fonts-ret', { fonts });
  });

  // Used to automatically change the height of searchWindow
  ipcMain.on(
    'resize-searchwindow-height',
    (
      evt: IpcMainEvent,
      {
        itemCount,
        maxItemCount,
        itemHeight,
        searchbarHeight,
        footerHeight
      }: {
        itemCount: number;
        maxItemCount: number;
        itemHeight: number;
        searchbarHeight: number;
        footerHeight: number;
      }
    ) => {
      let heightToSet;

      if (itemCount === 0) {
        heightToSet = searchbarHeight;
      } else if (itemCount >= maxItemCount) {
        heightToSet =
          maxItemCount * itemHeight + searchbarHeight + footerHeight;
      } else {
        heightToSet = itemCount * itemHeight + searchbarHeight + footerHeight;
      }

      const [width] = searchWindow.getSize();

      searchWindow.setSize(width, heightToSet);
    }
  );

  // Used to hide search window with avoiding afterimage
  ipcMain.on('hide-search-window', (evt: IpcMainEvent) => {
    searchWindow.hide();
  });

  // Used to register global shortcuts
  ipcMain.on(
    'set-global-shortcut',
    (evt: IpcMainEvent, { callbackTable }: { callbackTable: any }) => {
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

  // Used to popup context menu
  ipcMain.on(
    'popup-workflowItem-menu',
    (evt: IpcMainEvent, { path }: { path: string }) => {
      new WorkflowItemMenu({ path }).popup();
    }
  );

  // When some action is dispatched from some window, the action is not dispatched to other windows.
  // So, therefore, this function should be used to dispatch to target windows via ipc.
  ipcMain.on(
    'dispatch-action',
    (
      evt: IpcMainEvent,
      {
        destWindow,
        actionType,
        args
      }: {
        destWindow: string;
        actionType: string;
        args: any;
      }
    ) => {
      if (destWindow === 'searchWindow') {
        searchWindow.webContents.send('fetch-action', { actionType, args });
      } else if (destWindow === 'preferenceWindow') {
        preferenceWindow.webContents.send('fetch-action', { actionType, args });
      } else {
        throw new Error(`Window name is not properly set up:\n${destWindow}`);
      }
    }
  );
};
