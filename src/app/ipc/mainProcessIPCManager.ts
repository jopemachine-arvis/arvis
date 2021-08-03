import { ipcMain } from 'electron';
import { IPCRendererEnum } from './ipcEventEnum';

// To prevent SIGSEV errors, each module should be imported directly not through index.ts

import { openExtensionInstallerFile } from './mainProcessEventHandler/openExtensionInstallerFile';
import { reloadApplication } from './mainProcessEventHandler/reloadApplication';
import { reloadPlugin } from './mainProcessEventHandler/reloadPlugin';
import { reloadWorkflow } from './mainProcessEventHandler/reloadWorkflow';
import { showNotification } from './mainProcessEventHandler/showNotification';
import { toggleMacDock } from './mainProcessEventHandler/toggleMacDock';
import { triggerDoubleModifierKey } from './mainProcessEventHandler/triggerDoubleModifierKey';
import { triggerKeyDownEvent } from './mainProcessEventHandler/triggerKeyDownEvent';

import { autoFitSearchWindowSize } from './mainProcessEventHandler/windowManage/autoFitSearchWindowSize';
import { hideSearchWindow } from './mainProcessEventHandler/windowManage/hideSearchWindow';
import { hideLargeTextWindow } from './mainProcessEventHandler/windowManage/hideLargeTextWindow';
import { hideClipboardHistoryWindow } from './mainProcessEventHandler/windowManage/hideClipboardHistoryWindow';
import { resizeSearchWindowHeight } from './mainProcessEventHandler/windowManage/resizeSearchWindowHeight';
import { setSearchWindowWidth } from './mainProcessEventHandler/windowManage/setSearchWindowWidth';
import { showLargeTextWindow } from './mainProcessEventHandler/windowManage/showLargeTextWindow';

import { openPluginInstallFileDialog } from './mainProcessEventHandler/modal/openPluginInstallFileDialog';
import { openWorkflowInstallFileDialog } from './mainProcessEventHandler/modal/openWorkflowInstallFileDialog';
import { openYesnoDialog } from './mainProcessEventHandler/modal/openYesnoDialog';
import { saveFile } from './mainProcessEventHandler/modal/saveFile';
import { showErrorDialog } from './mainProcessEventHandler/modal/showErrorDialog';

import { dispatchAction } from './mainProcessEventHandler/config/dispatchAction';
import { getSystemFont } from './mainProcessEventHandler/config/getSystemFont';
import { importTheme } from './mainProcessEventHandler/config/importTheme';
import { registerAllShortcuts } from './mainProcessEventHandler/config/registerAllShortcuts';
import { resumeFileWatch } from './mainProcessEventHandler/config/resumeFileWatch';
import { setAutoLaunch } from './mainProcessEventHandler/config/setAutoLaunch';
import { setGlobalShortcut } from './mainProcessEventHandler/config/setGlobalShortcut';
import { stopFileWatch } from './mainProcessEventHandler/config/stopFileWatch';
import { unregisterAllShortcuts } from './mainProcessEventHandler/config/unregisterAllShortcuts';
import { getElectronEnvs } from './mainProcessEventHandler/config/getElectronEnvs';

import { popupPluginItemMenu } from './mainProcessEventHandler/contextMenu/popupPluginItemMenu';
import { popupWorkflowItemMenu } from './mainProcessEventHandler/contextMenu/popupWorkflowItemMenu';
import { popupSearchbarItemMenu } from './mainProcessEventHandler/contextMenu/popupSearchbarItemMenu';
import { popupClipboardHistoryContextMenu } from './mainProcessEventHandler/contextMenu/popupClipboardHistoryContextMenu';
import { popupWorkflowTriggerTableItem } from './mainProcessEventHandler/contextMenu/popupWorkflowTriggerTableItem';

/**
 * Register ipc callbacks
 */
export const initIPCHandlers = () => {
  ipcMain.on(IPCRendererEnum.autoFitSearchWindowSize, autoFitSearchWindowSize);
  ipcMain.on(IPCRendererEnum.dispatchAction, dispatchAction);
  ipcMain.on(IPCRendererEnum.getElectronEnvs, getElectronEnvs);
  ipcMain.on(IPCRendererEnum.getSystemFont, getSystemFont);
  ipcMain.on(IPCRendererEnum.hideLargeTextWindow, hideLargeTextWindow);
  ipcMain.on(IPCRendererEnum.hideSearchWindow, hideSearchWindow);
  ipcMain.on(IPCRendererEnum.importTheme, importTheme);
  ipcMain.on(IPCRendererEnum.openYesnoDialog, openYesnoDialog);
  ipcMain.on(IPCRendererEnum.popupPluginItemMenu, popupPluginItemMenu);
  ipcMain.on(IPCRendererEnum.popupSearchbarItemMenu, popupSearchbarItemMenu);
  ipcMain.on(IPCRendererEnum.popupWorkflowItemMenu, popupWorkflowItemMenu);
  ipcMain.on(IPCRendererEnum.registerAllShortcuts, registerAllShortcuts);
  ipcMain.on(IPCRendererEnum.reloadApplication, reloadApplication);
  ipcMain.on(IPCRendererEnum.reloadPlugin, reloadPlugin);
  ipcMain.on(IPCRendererEnum.reloadWorkflow, reloadWorkflow);
  ipcMain.on(IPCRendererEnum.resumeFileWatch, resumeFileWatch);
  ipcMain.on(IPCRendererEnum.saveFile, saveFile);
  ipcMain.on(IPCRendererEnum.setAutoLaunch, setAutoLaunch);
  ipcMain.on(IPCRendererEnum.setGlobalShortcut, setGlobalShortcut);
  ipcMain.on(IPCRendererEnum.setSearchWindowWidth, setSearchWindowWidth);
  ipcMain.on(IPCRendererEnum.showErrorDialog, showErrorDialog);
  ipcMain.on(IPCRendererEnum.showLargeTextWindow, showLargeTextWindow);
  ipcMain.on(IPCRendererEnum.showNotification, showNotification);
  ipcMain.on(IPCRendererEnum.stopFileWatch, stopFileWatch);
  ipcMain.on(IPCRendererEnum.toggleMacDock, toggleMacDock);
  ipcMain.on(IPCRendererEnum.triggerKeyDownEvent, triggerKeyDownEvent);
  ipcMain.on(IPCRendererEnum.unregisterAllShortcuts, unregisterAllShortcuts);

  ipcMain.on(
    IPCRendererEnum.popupWorkflowTriggerTableItem,
    popupWorkflowTriggerTableItem
  );

  ipcMain.on(
    IPCRendererEnum.openExtensionInstallerFile,
    openExtensionInstallerFile
  );

  ipcMain.on(
    IPCRendererEnum.popupClipboardHistoryContextMenu,
    popupClipboardHistoryContextMenu
  );

  ipcMain.on(
    IPCRendererEnum.hideClipboardHistoryWindow,
    hideClipboardHistoryWindow
  );

  ipcMain.on(
    IPCRendererEnum.openWorkflowInstallFileDialog,
    openWorkflowInstallFileDialog
  );

  ipcMain.on(
    IPCRendererEnum.triggerDoubleModifierKey,
    triggerDoubleModifierKey
  );

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
 */
export const cleanUpIPCHandlers = () => {
  ipcMain.removeAllListeners();
};
