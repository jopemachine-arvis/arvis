import { ipcMain } from 'electron';
import { IPCRendererEnum } from './ipcEventEnum';

// To prevent SIGSEV errors, each module should be imported directly not through index.ts
import { autoFitSearchWindowSize } from './mainProcessEventHandler/windowManage/autoFitSearchWindowSize';
import { hideSearchWindow } from './mainProcessEventHandler/windowManage/hideSearchWindow';
import { hideLargeTextWindow } from './mainProcessEventHandler/windowManage/hideLargeTextWindow';
import { hideQuicklookWindow } from './mainProcessEventHandler/windowManage/hideQuicklookWindow';
import { hideClipboardHistoryWindow } from './mainProcessEventHandler/windowManage/hideClipboardHistoryWindow';
import { resizeSearchWindowHeight } from './mainProcessEventHandler/windowManage/resizeSearchWindowHeight';
import { setSearchWindowWidth } from './mainProcessEventHandler/windowManage/setSearchWindowWidth';
import { showLargeTextWindow } from './mainProcessEventHandler/windowManage/showLargeTextWindow';
import { showQuicklookWindow } from './mainProcessEventHandler/windowManage/showQuicklookWindow';

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

import { renewWorkflow } from './mainProcessEventHandler/renewWorkflow';
import { renewPlugin } from './mainProcessEventHandler/renewPlugin';
import { showNotification } from './mainProcessEventHandler/showNotification';
import { triggerDoubleModifierKey } from './mainProcessEventHandler/triggerDoubleModifierKey';
import { triggerKeyDownEvent } from './mainProcessEventHandler/triggerKeyDownEvent';

import { popupPluginItemMenu } from './mainProcessEventHandler/contextMenu/popupPluginItemMenu';
import { popupWorkflowItemMenu } from './mainProcessEventHandler/contextMenu/popupWorkflowItemMenu';
import { popupSearchbarItemMenu } from './mainProcessEventHandler/contextMenu/popupSearchbarItemMenu';

/**
 * @summary Register ipc callbacks
 */
export const initIPCHandlers = () => {
  ipcMain.on(IPCRendererEnum.autoFitSearchWindowSize, autoFitSearchWindowSize);
  ipcMain.on(IPCRendererEnum.dispatchAction, dispatchAction);
  ipcMain.on(IPCRendererEnum.getSystemFont, getSystemFont);
  ipcMain.on(IPCRendererEnum.hideLargeTextWindow, hideLargeTextWindow);
  ipcMain.on(IPCRendererEnum.hideQuicklookWindow, hideQuicklookWindow);
  ipcMain.on(IPCRendererEnum.hideSearchWindow, hideSearchWindow);
  ipcMain.on(IPCRendererEnum.importTheme, importTheme);
  ipcMain.on(IPCRendererEnum.openYesnoDialog, openYesnoDialog);
  ipcMain.on(IPCRendererEnum.popupPluginItemMenu, popupPluginItemMenu);
  ipcMain.on(IPCRendererEnum.popupSearchbarItemMenu, popupSearchbarItemMenu);
  ipcMain.on(IPCRendererEnum.popupWorkflowItemMenu, popupWorkflowItemMenu);
  ipcMain.on(IPCRendererEnum.registerAllShortcuts, registerAllShortcuts);
  ipcMain.on(IPCRendererEnum.renewPlugin, renewPlugin);
  ipcMain.on(IPCRendererEnum.renewWorkflow, renewWorkflow);
  ipcMain.on(IPCRendererEnum.resumeFileWatch, resumeFileWatch);
  ipcMain.on(IPCRendererEnum.saveFile, saveFile);
  ipcMain.on(IPCRendererEnum.setAutoLaunch, setAutoLaunch);
  ipcMain.on(IPCRendererEnum.setGlobalShortcut, setGlobalShortcut);
  ipcMain.on(IPCRendererEnum.setSearchWindowWidth, setSearchWindowWidth);
  ipcMain.on(IPCRendererEnum.showErrorDialog, showErrorDialog);
  ipcMain.on(IPCRendererEnum.showLargeTextWindow, showLargeTextWindow);
  ipcMain.on(IPCRendererEnum.showNotification, showNotification);
  ipcMain.on(IPCRendererEnum.showQuicklookWindow, showQuicklookWindow);
  ipcMain.on(IPCRendererEnum.stopFileWatch, stopFileWatch);
  ipcMain.on(IPCRendererEnum.triggerKeyDownEvent, triggerKeyDownEvent);
  ipcMain.on(IPCRendererEnum.unregisterAllShortcuts, unregisterAllShortcuts);

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
 * @summary
 */
export const cleanUpIPCHandlers = () => {
  ipcMain.removeAllListeners();
};
