/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ipcMain,
  dialog,
  BrowserWindow,
  nativeImage,
  Notification,
  IpcMainEvent,
} from 'electron';

import { getFonts } from 'font-list';
import {
  WorkflowItemContextMenu,
  SearchbarContextMenu,
} from '../components/contextMenus';
import globalShortcutHandler from './globalShortcutHandler';
import resizeEventHandler from './resizeEventHandler';
import { IPCRendererEnum, IPCMainEnum } from './ipcEventEnum';

/**
 * @param {BrowserWindow} searchWindow
 * @param {BrowserWindow} preferenceWindow
 * @summary Register ipc callbacks
 */
export const initIPCHandler = ({
  searchWindow,
  preferenceWindow,
}: {
  searchWindow: BrowserWindow;
  preferenceWindow: BrowserWindow;
}) => {
  /**
   * @param  {string} windowName
   * @return {BrowserWindow}
   */
  const getDestWindow = (windowName: string): BrowserWindow => {
    if (windowName === 'searchWindow') {
      return searchWindow;
    }
    if (windowName === 'preferenceWindow') {
      return preferenceWindow;
    }
    throw new Error(`Window name is not properly set up:\n${windowName}`);
  };

  /**
   * @param  {string} title
   * @param  {string} content
   * @summary Used to show errors
   */
  const showErrorDialog = (
    e: IpcMainEvent,
    { title, content }: { title: string; content: string }
  ) => {
    dialog.showErrorBox(title, content);
  };

  /**
   * @param  {string} title
   * @param  {string} message
   * @param  {string} defaultPath
   * @summary Used to select file to save
   */
  const saveFile = async (
    e: IpcMainEvent,
    {
      title,
      message,
      defaultPath,
    }: { title: string; message: string; defaultPath: string }
  ) => {
    const file = await dialog.showSaveDialog({
      title,
      defaultPath,
      message: message ?? 'Select the path your file will be saved',
    });

    preferenceWindow.webContents.send(IPCMainEnum.saveFileRet, {
      file,
    });
  };

  /**
   * @summary Used to select wfconf file
   */
  const openWfConfFileDialog = async (
    e: IpcMainEvent,
    { canInstallAlfredWorkflow }: { canInstallAlfredWorkflow: boolean }
  ) => {
    const extensions = ['arvisworkflow'];
    if (canInstallAlfredWorkflow) extensions.push('alfredworkflow');

    const file: Electron.OpenDialogReturnValue = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {
          name: 'Arvis workflow install files',
          extensions,
        },
      ],
    });
    preferenceWindow.webContents.send(IPCMainEnum.openWfConfFileDialogRet, {
      file,
    });
  };

  /**
   * @param  {string} msg
   * @param  {string} icon?
   * @summary Used to open yesno modal box
   */
  const openYesnoDialog = async (
    e: IpcMainEvent,
    { msg, icon }: { msg: string; icon?: string }
  ) => {
    const ret: Electron.MessageBoxReturnValue = await dialog.showMessageBox({
      type: 'info',
      buttons: ['ok', 'cancel'],
      message: msg,
      icon: icon ? nativeImage.createFromPath(icon) : undefined,
    });

    const yesPressed = ret.response === 0;
    preferenceWindow.webContents.send(IPCMainEnum.openYesnoDialogRet, {
      yesPressed,
    });
  };

  /**
   * @param  {string} title
   * @param  {string} body
   * @summary Used to show notification
   */
  const showNotification = (
    e: IpcMainEvent,
    { title, body }: { title: string; body: string }
  ) => {
    const notification = {
      title,
      body,
    };
    new Notification(notification).show();
  };

  /**
   * @summary Used to get all system fonts
   */
  const getSystemFont = async (e: IpcMainEvent) => {
    const fonts = await getFonts({ disableQuoting: true });
    preferenceWindow.webContents.send(IPCMainEnum.getSystemFontRet, { fonts });
  };

  /**
   * @param {number} itemCount
   * @param {number} maxItemCount
   * @param {number} itemHeight
   * @param {number} searchbarHeight
   * @param {number} footerHeight
   * @summary Used to automatically change the height of searchWindow
   */
  const resizeSearchWindowHeight = (
    e: IpcMainEvent,
    {
      itemCount,
      maxItemCount,
      itemHeight,
      searchbarHeight,
      footerHeight,
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
      searchbarHeight,
    });
  };

  /**
   * @summary Used to hide search window with avoiding afterimage
   */
  const hideSearchWindow = (e: IpcMainEvent) => {
    searchWindow.hide();
  };

  /**
   * @param  {string} destWindow
   * @param  {string} bundleId?
   */
  const renewWorkflow = (
    e: IpcMainEvent,
    { destWindow, bundleId }: { destWindow: string; bundleId?: string }
  ) => {
    getDestWindow(destWindow).webContents.send(IPCMainEnum.renewWorkflow, {
      bundleId,
    });
  };

  /**
   * @param  {number} width
   */
  const setSearchWindowWidth = (
    e: IpcMainEvent,
    { width }: { width: number }
  ) => {
    searchWindow.setSize(width, searchWindow.getSize()[1]);
  };

  /**
   * @param  {string} callbackTable
   * @param  {string} workflowHotkeyTbl?
   * @summary Used to register global shortcuts
   */
  const setGlobalShortcut = (
    e: IpcMainEvent,
    {
      callbackTable,
      workflowHotkeyTbl,
    }: { callbackTable: any; workflowHotkeyTbl: string }
  ) => {
    globalShortcutHandler({
      searchWindow,
      preferenceWindow,
      callbackTable,
      workflowHotkeyTbl: JSON.parse(workflowHotkeyTbl),
    });
  };

  /**
   * @param  {string} path
   * @summary Used to popup context menu
   */
  const popupWorkflowItemMenu = (
    e: IpcMainEvent,
    {
      workflowPath,
      workflowEnabled,
    }: { workflowPath: string; workflowEnabled: boolean }
  ) => {
    new WorkflowItemContextMenu({
      workflowPath,
      workflowEnabled,
      preferenceWindow,
    }).popup();
  };

  /**
   * @param  {string} path
   * @summary Used to popup context menu
   */
  const popupSearchbarItemMenu = (e: IpcMainEvent) => {
    new SearchbarContextMenu({ preferenceWindow }).popup();
  };

  /**
   * @param  {string} destWindow
   * @param  {string} actionType
   * @param  {any} args
   * @summary When some action is dispatched from some window, the action is not dispatched to other windows.
   *          So, therefore, this function should be used to dispatch to target windows via ipc.
   */
  const dispatchAction = (
    e: IpcMainEvent,
    {
      destWindow,
      actionType,
      args,
    }: {
      destWindow: string;
      actionType: string;
      args: any;
    }
  ) => {
    getDestWindow(destWindow).webContents.send(IPCMainEnum.fetchAction, {
      actionType,
      args,
    });
  };

  ipcMain.on(IPCRendererEnum.setSearchWindowWidth, setSearchWindowWidth);
  ipcMain.on(IPCRendererEnum.showErrorDialog, showErrorDialog);
  ipcMain.on(IPCRendererEnum.saveFile, saveFile);
  ipcMain.on(IPCRendererEnum.openWfConfFileDialog, openWfConfFileDialog);
  ipcMain.on(IPCRendererEnum.openYesnoDialog, openYesnoDialog);
  ipcMain.on(IPCRendererEnum.showNotification, showNotification);
  ipcMain.on(IPCRendererEnum.getSystemFont, getSystemFont);
  ipcMain.on(IPCRendererEnum.hideSearchWindow, hideSearchWindow);
  ipcMain.on(IPCRendererEnum.renewWorkflow, renewWorkflow);
  ipcMain.on(IPCRendererEnum.setGlobalShortcut, setGlobalShortcut);
  ipcMain.on(IPCRendererEnum.popupSearchbarItemMenu, popupSearchbarItemMenu);
  ipcMain.on(IPCRendererEnum.popupWorkflowItemMenu, popupWorkflowItemMenu);
  ipcMain.on(IPCRendererEnum.dispatchAction, dispatchAction);
  ipcMain.on(
    IPCRendererEnum.resizeSearchWindowHeight,
    resizeSearchWindowHeight
  );
};
