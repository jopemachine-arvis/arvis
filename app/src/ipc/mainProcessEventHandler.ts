/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
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
import { IPCRendererEnum, IPCMainEnum } from './ipcEventEnum';

export const initIPCHandler = ({
  searchWindow,
  preferenceWindow
}: {
  searchWindow: BrowserWindow;
  preferenceWindow: BrowserWindow;
}) => {
  const getDestWindow = (windowName: string) => {
    if (windowName === 'searchWindow') {
      return searchWindow;
    } else if (windowName === 'preferenceWindow') {
      return preferenceWindow;
    } else {
      throw new Error(`Window name is not properly set up:\n${windowName}`);
    }
  };

  // Used to select wfconf file
  ipcMain.on(
    IPCRendererEnum.showErrorDialog,
    (e: IpcMainEvent, { title, content }) => {
      dialog.showErrorBox(title, content);
    }
  );

  // Used to select file to save
  ipcMain.on(
    IPCRendererEnum.saveFile,
    async (e: IpcMainEvent, { title, message, defaultPath }) => {
      const file = await dialog.showSaveDialog({
        title,
        defaultPath,
        message: message ?? 'Select the path your file will be saved'
      });

      preferenceWindow.webContents.send(IPCMainEnum.saveFileRet, {
        file
      });
    }
  );

  // Used to select wfconf file
  ipcMain.on(IPCRendererEnum.openWfConfFileDialog, async (e: IpcMainEvent) => {
    const file: Electron.OpenDialogReturnValue = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {
          name: 'Arvis workflow install files',
          extensions: ['arvisworkflow', 'alfredworkflow']
        }
      ]
    });
    preferenceWindow.webContents.send(IPCMainEnum.openWfConfFileDialogRet, {
      file
    });
  });

  // Used to open yesno modal box
  ipcMain.on(
    IPCRendererEnum.openYesnoDialog,
    async (e: IpcMainEvent, { msg, icon }: { msg: string; icon?: string }) => {
      const ret: Electron.MessageBoxReturnValue = await dialog.showMessageBox({
        type: 'info',
        buttons: ['ok', 'cancel'],
        message: msg,
        icon: icon ? nativeImage.createFromPath(icon) : undefined
      });

      const yesPressed = ret.response === 0;
      preferenceWindow.webContents.send(IPCMainEnum.openYesnoDialogRet, {
        yesPressed
      });
    }
  );

  // Used to show notification
  ipcMain.on(
    IPCRendererEnum.showNotification,
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
  ipcMain.on(IPCRendererEnum.getSystemFont, async (e: IpcMainEvent) => {
    const fonts = await getFonts({ disableQuoting: true });
    preferenceWindow.webContents.send(IPCMainEnum.getSystemFontRet, { fonts });
  });

  // Used to automatically change the height of searchWindow
  ipcMain.on(
    IPCRendererEnum.resizeSearchWindowHeight,
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
  ipcMain.on(IPCRendererEnum.hideSearchWindow, (e: IpcMainEvent) => {
    searchWindow.hide();
  });

  // Used to hide search window with avoiding afterimage
  ipcMain.on(
    IPCRendererEnum.renewWorkflow,
    (
      e: IpcMainEvent,
      { destWindow, bundleId }: { destWindow: string; bundleId?: string }
    ) => {
      getDestWindow(destWindow).webContents.send(IPCMainEnum.renewWorkflow, {
        bundleId
      });
    }
  );

  // Used to register global shortcuts
  ipcMain.on(
    IPCRendererEnum.setGlobalShortcut,
    (e: IpcMainEvent, { callbackTable }: { callbackTable: any }) => {
      globalShortcutHandler({ callbackTable, preferenceWindow, searchWindow });
    }
  );

  // Used to popup context menu
  ipcMain.on(
    IPCRendererEnum.popupWorkflowItemMenu,
    (e: IpcMainEvent, { path }: { path: string }) => {
      new WorkflowItemMenu({ path }).popup();
    }
  );

  // When some action is dispatched from some window, the action is not dispatched to other windows.
  // So, therefore, this function should be used to dispatch to target windows via ipc.
  ipcMain.on(
    IPCRendererEnum.dispatchAction,
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
      getDestWindow(destWindow).webContents.send(IPCMainEnum.fetchAction, {
        actionType,
        args
      });
    }
  );
};
