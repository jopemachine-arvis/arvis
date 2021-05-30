import { ipcMain } from 'electron';
import { IPCRendererEnum } from './ipcEventEnum';

// To prevent SIGSEV errors, each module should be imported directly not through index.ts
import { hideSearchWindow } from './mainProcessEventHandler/windowManage/hideSearchWindow';
import { hideLargeTextWindow } from './mainProcessEventHandler/windowManage/hideLargeTextWindow';
import { hideQuicklookWindow } from './mainProcessEventHandler/windowManage/hideQuicklookWindow';
import { resizeSearchWindowHeight } from './mainProcessEventHandler/windowManage/resizeSearchWindowHeight';
import { setSearchWindowWidth } from './mainProcessEventHandler/windowManage/setSearchWindowWidth';
import { showLargeTextWindow } from './mainProcessEventHandler/windowManage/showLargeTextWindow';
import { showQuicklookWindow } from './mainProcessEventHandler/windowManage/showQuicklookWindow';

import { openPluginInstallFileDialog } from './mainProcessEventHandler/modal/openPluginInstallFileDialog';
import { openWfConfFileDialog } from './mainProcessEventHandler/modal/openWfConfFIleDialog';
import { openYesnoDialog } from './mainProcessEventHandler/modal/openYesnoDialog';
import { saveFile } from './mainProcessEventHandler/modal/saveFile';
import { showErrorDialog } from './mainProcessEventHandler/modal/showErrorDialog';

import { dispatchAction } from './mainProcessEventHandler/config/dispatchAction';
import { getSystemFont } from './mainProcessEventHandler/config/getSystemFont';
import { importTheme } from './mainProcessEventHandler/config/importTheme';
import { setAutoLaunch } from './mainProcessEventHandler/config/setAutoLaunch';
import { setGlobalShortcut } from './mainProcessEventHandler/config/setGlobalShortcut';

import { renewWorkflow } from './mainProcessEventHandler/renewWorkflow';
import { showNotification } from './mainProcessEventHandler/showNotification';
import { triggerDoubleModifierKey } from './mainProcessEventHandler/triggerDoubleModifierKey';

import { popupPluginItemMenu } from './mainProcessEventHandler/contextMenu/popupPluginItemMenu';
import { popupWorkflowItemMenu } from './mainProcessEventHandler/contextMenu/popupWorkflowItemMenu';
import { popupSearchbarItemMenu } from './mainProcessEventHandler/contextMenu/popupSearchbarItemMenu';

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
  ipcMain.on(IPCRendererEnum.setSearchWindowWidth, setSearchWindowWidth);
  ipcMain.on(IPCRendererEnum.showErrorDialog, showErrorDialog);
  ipcMain.on(IPCRendererEnum.showLargeTextWindow, showLargeTextWindow);
  ipcMain.on(IPCRendererEnum.showNotification, showNotification);
  ipcMain.on(IPCRendererEnum.showQuicklookWindow, showQuicklookWindow);
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

  ipcMain.on(IPCRendererEnum.setGlobalShortcut, setGlobalShortcut);
};

/**
 * @summary
 */
export const cleanUpIPCHandlers = () => {
  ipcMain.removeAllListeners();
};
