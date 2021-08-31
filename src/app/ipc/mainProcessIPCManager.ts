import { ipcMain } from 'electron';
import { IPCRendererEnum } from './ipcEventEnum';

// To prevent SIGSEV errors, each module should be imported directly not through index.ts

import { openExtensionInstallerFile } from './mainProcessEventHandler/openExtensionInstallerFile';
import { reloadApplication } from './mainProcessEventHandler/reloadApplication';
import { reloadPlugin } from './mainProcessEventHandler/reloadPlugin';
import { reloadWorkflow } from './mainProcessEventHandler/reloadWorkflow';
import { showNotification } from './mainProcessEventHandler/showNotification';
import { toggleMacDock } from './mainProcessEventHandler/toggleMacDock';
import { triggerKeyDownEvent } from './mainProcessEventHandler/triggerKeyDownEvent';
import { applySnippet } from './mainProcessEventHandler/applySnippet';

import { hideSearchWindow } from './mainProcessEventHandler/windowManage/hideSearchWindow';
import { hideLargeTextWindow } from './mainProcessEventHandler/windowManage/hideLargeTextWindow';
import { hideAssistanceWindow } from './mainProcessEventHandler/windowManage/hideAssistanceWindow';
import { resizeSearchWindowHeight } from './mainProcessEventHandler/windowManage/resizeSearchWindowHeight';
import { setSearchWindowWidth } from './mainProcessEventHandler/windowManage/setSearchWindowWidth';
import { showLargeTextWindow } from './mainProcessEventHandler/windowManage/showLargeTextWindow';

import { openPluginInstallFileDialog } from './mainProcessEventHandler/modal/openPluginInstallFileDialog';
import { openWorkflowInstallFileDialog } from './mainProcessEventHandler/modal/openWorkflowInstallFileDialog';
import { openSnippetInstallFileDialog } from './mainProcessEventHandler/modal/openSnippetInstallFileDialog';
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
import { getElectronEnvs } from './mainProcessEventHandler/config/getElectronEnvs';
import { unregisterAllShortcuts } from './mainProcessEventHandler/config/unregisterGlobalShortcuts';
import { registerWorkflowHotkeys } from './mainProcessEventHandler/config/registerWorkflowHotkeys';

import { popupPluginItemMenu } from './mainProcessEventHandler/contextMenu/popupPluginPageItemMenu';
import { popupWorkflowItemMenu } from './mainProcessEventHandler/contextMenu/popupWorkflowPageItemMenu';
import { popupSearchbarItemMenu } from './mainProcessEventHandler/contextMenu/popupSearchbarItemMenu';
import { popupAssistanceWindowContextMenu } from './mainProcessEventHandler/contextMenu/popupAssistanceWindowContextMenu';
import { popupWorkflowTriggerTableItem } from './mainProcessEventHandler/contextMenu/popupWorkflowTriggerTableItem';
import {
  toggleClipboardHistoryWindow,
  toggleUniversalActionWindow,
} from './mainProcessEventHandler/windowManage/toggleAssistanceWindow';
import { toggleSearchWindow } from './mainProcessEventHandler/windowManage/toggleSearchWindow';

/**
 * Register ipc callbacks
 */
export const initIPCHandlers = () => {
  ipcMain.on(IPCRendererEnum.applySnippet, applySnippet);
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
  ipcMain.on(IPCRendererEnum.registerWorkflowHotkeys, registerWorkflowHotkeys);
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
    IPCRendererEnum.toggleClipboardHistoryWindow,
    toggleClipboardHistoryWindow
  );
  ipcMain.on(
    IPCRendererEnum.toggleUniversalActionWindow,
    toggleUniversalActionWindow
  );
  ipcMain.on(IPCRendererEnum.toggleSearchWindow, toggleSearchWindow);

  ipcMain.on(
    IPCRendererEnum.popupWorkflowTriggerTableItem,
    popupWorkflowTriggerTableItem
  );

  ipcMain.on(
    IPCRendererEnum.openExtensionInstallerFile,
    openExtensionInstallerFile
  );

  ipcMain.on(
    IPCRendererEnum.popupAssistanceWindowContextMenu,
    popupAssistanceWindowContextMenu
  );

  ipcMain.on(IPCRendererEnum.hideAssistanceWindow, hideAssistanceWindow);

  ipcMain.on(
    IPCRendererEnum.openWorkflowInstallFileDialog,
    openWorkflowInstallFileDialog
  );

  ipcMain.on(
    IPCRendererEnum.openSnippetInstallFileDialog,
    openSnippetInstallFileDialog
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
