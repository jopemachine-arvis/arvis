/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ipcMain,
  dialog,
  BrowserWindow,
  nativeImage,
  Notification,
  IpcMainEvent
} from 'electron';

import { getFonts } from 'font-list';
import WorkflowItemMenu from '../components/contextMenus/workflow';
import globalShortcutHandler from './globalShortcutHandler';
import resizeEventHandler from './resizeEventHandler';

export const initIPCHandler = ({
  searchWindow,
  preferenceWindow
}: {
  searchWindow: BrowserWindow;
  preferenceWindow: BrowserWindow;
}) => {
  // Used to select wfconf file
  ipcMain.on('show-error-dialog', (e: IpcMainEvent, { title, content }) => {
    dialog.showErrorBox(title, content);
  });

  // Used to select file to save
  ipcMain.on(
    'save-file',
    async (e: IpcMainEvent, { title, message, defaultPath }) => {
      const file = await dialog.showSaveDialog({
        title,
        defaultPath,
        message: message ?? 'Select the path your file will be saved'
      });

      preferenceWindow.webContents.send('save-file-ret', {
        file
      });
    }
  );

  // Used to select wfconf file
  ipcMain.on('open-wfconf-file-dialog', async (e: IpcMainEvent) => {
    const file: Electron.OpenDialogReturnValue = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {
          name: 'Arvis workflow install files',
          extensions: ['arvisworkflow', 'alfredworkflow']
        }
      ]
    });
    preferenceWindow.webContents.send('open-wfconf-file-dialog-ret', {
      file
    });
  });

  // Used to open yesno modal box
  ipcMain.on(
    'open-yesno-dialog',
    async (e: IpcMainEvent, { msg, icon }: { msg: string; icon?: string }) => {
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
    (e: IpcMainEvent, { title, body }: { title: string; body: string }) => {
      // https://www.electronjs.org/docs/tutorial/notifications
      const notification = {
        title,
        body
      };
      new Notification(notification).show();
    }
  );

  // Used to get all system fonts
  ipcMain.on('get-system-fonts', async (e: IpcMainEvent) => {
    const fonts = await getFonts({ disableQuoting: true });
    preferenceWindow.webContents.send('get-system-fonts-ret', { fonts });
  });

  // Used to automatically change the height of searchWindow
  ipcMain.on(
    'resize-searchwindow-height',
    (
      e: IpcMainEvent,
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
      resizeEventHandler({
        footerHeight,
        itemCount,
        itemHeight,
        maxItemCount,
        searchWindow,
        searchbarHeight
      });
    }
  );

  // Used to hide search window with avoiding afterimage
  ipcMain.on('hide-search-window', (e: IpcMainEvent) => {
    searchWindow.hide();
  });

  // Used to register global shortcuts
  ipcMain.on(
    'set-global-shortcut',
    (e: IpcMainEvent, { callbackTable }: { callbackTable: any }) => {
      globalShortcutHandler({ callbackTable, preferenceWindow, searchWindow });
    }
  );

  // Used to popup context menu
  ipcMain.on(
    'popup-workflowItem-menu',
    (e: IpcMainEvent, { path }: { path: string }) => {
      new WorkflowItemMenu({ path }).popup();
    }
  );

  // When some action is dispatched from some window, the action is not dispatched to other windows.
  // So, therefore, this function should be used to dispatch to target windows via ipc.
  ipcMain.on(
    'dispatch-action',
    (
      e: IpcMainEvent,
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
