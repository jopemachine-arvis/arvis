/* eslint-disable @typescript-eslint/no-unused-vars */
import { ipcMain } from 'electron';
import { IPCRendererEnum } from './ipcEventEnum';
import {
  dispatchAction,
  getSystemFont,
  hideLargeTextWindow,
  hideQuicklookWindow,
  hideSearchWindow,
  importTheme,
  openPluginInstallFileDialog,
  openWfConfFileDialog,
  openYesnoDialog,
  popupPluginItemMenu,
  popupSearchbarItemMenu,
  popupWorkflowItemMenu,
  renewWorkflow,
  resizeSearchWindowHeight,
  saveFile,
  setAutoLaunch,
  setGlobalShortcut,
  setSearchWindowWidth,
  showErrorDialog,
  showLargeTextWindow,
  showNotification,
  showQuicklookWindow,
} from './mainProcessEventHandler';

/**
 * @summary Register ipc callbacks
 */
export const initIPCHandlers = () => {
  ipcMain.on(IPCRendererEnum.dispatchAction, dispatchAction);
  ipcMain.on(IPCRendererEnum.getSystemFont, getSystemFont);
  ipcMain.on(IPCRendererEnum.hideLargeTextWindow, hideLargeTextWindow);
  ipcMain.on(IPCRendererEnum.hideQuicklookWindow, hideQuicklookWindow);
  ipcMain.on(IPCRendererEnum.hideSearchWindow, hideSearchWindow);
  ipcMain.on(IPCRendererEnum.importTheme, importTheme);
  ipcMain.on(IPCRendererEnum.openWfConfFileDialog, openWfConfFileDialog);
  ipcMain.on(IPCRendererEnum.openYesnoDialog, openYesnoDialog);
  ipcMain.on(IPCRendererEnum.popupPluginItemMenu, popupPluginItemMenu);
  ipcMain.on(IPCRendererEnum.popupSearchbarItemMenu, popupSearchbarItemMenu);
  ipcMain.on(IPCRendererEnum.popupWorkflowItemMenu, popupWorkflowItemMenu);
  ipcMain.on(IPCRendererEnum.renewWorkflow, renewWorkflow);
  ipcMain.on(IPCRendererEnum.saveFile, saveFile);
  ipcMain.on(IPCRendererEnum.setAutoLaunch, setAutoLaunch);
  ipcMain.on(IPCRendererEnum.setGlobalShortcut, setGlobalShortcut);
  ipcMain.on(IPCRendererEnum.setSearchWindowWidth, setSearchWindowWidth);
  ipcMain.on(IPCRendererEnum.showErrorDialog, showErrorDialog);
  ipcMain.on(IPCRendererEnum.showLargeTextWindow, showLargeTextWindow);
  ipcMain.on(IPCRendererEnum.showNotification, showNotification);
  ipcMain.on(IPCRendererEnum.showQuicklookWindow, showQuicklookWindow);
  ipcMain.on(
    IPCRendererEnum.openPluginInstallFileDialog,
    openPluginInstallFileDialog
  );
  ipcMain.on(
    IPCRendererEnum.resizeSearchWindowHeight,
    resizeSearchWindowHeight
  );
};

/**
 * @summary
 */
export const cleanUpIPCHandlers = () => {
  ipcMain.off(IPCRendererEnum.dispatchAction, dispatchAction);
  ipcMain.off(IPCRendererEnum.getSystemFont, getSystemFont);
  ipcMain.off(IPCRendererEnum.hideLargeTextWindow, hideLargeTextWindow);
  ipcMain.off(IPCRendererEnum.hideQuicklookWindow, hideQuicklookWindow);
  ipcMain.off(IPCRendererEnum.hideSearchWindow, hideSearchWindow);
  ipcMain.off(IPCRendererEnum.importTheme, importTheme);
  ipcMain.off(IPCRendererEnum.openWfConfFileDialog, openWfConfFileDialog);
  ipcMain.off(IPCRendererEnum.openYesnoDialog, openYesnoDialog);
  ipcMain.off(IPCRendererEnum.popupPluginItemMenu, popupPluginItemMenu);
  ipcMain.off(IPCRendererEnum.popupSearchbarItemMenu, popupSearchbarItemMenu);
  ipcMain.off(IPCRendererEnum.popupWorkflowItemMenu, popupWorkflowItemMenu);
  ipcMain.off(IPCRendererEnum.renewWorkflow, renewWorkflow);
  ipcMain.off(IPCRendererEnum.saveFile, saveFile);
  ipcMain.off(IPCRendererEnum.setAutoLaunch, setAutoLaunch);
  ipcMain.off(IPCRendererEnum.setGlobalShortcut, setGlobalShortcut);
  ipcMain.off(IPCRendererEnum.setSearchWindowWidth, setSearchWindowWidth);
  ipcMain.off(IPCRendererEnum.showErrorDialog, showErrorDialog);
  ipcMain.off(IPCRendererEnum.showLargeTextWindow, showLargeTextWindow);
  ipcMain.off(IPCRendererEnum.showNotification, showNotification);
  ipcMain.off(IPCRendererEnum.showQuicklookWindow, showQuicklookWindow);
  ipcMain.off(
    IPCRendererEnum.openPluginInstallFileDialog,
    openPluginInstallFileDialog
  );
  ipcMain.off(
    IPCRendererEnum.resizeSearchWindowHeight,
    resizeSearchWindowHeight
  );
};
