/**
 * @summary Events sent from renderer process to main process
 */
export enum IPCRendererEnum {
  dispatchAction = '@ipcRenderer/dispatchAction',
  getSystemFont = '@ipcRenderer/getSystemFont',
  hideLargeTextWindow = '@ipcRenderer/hideLargeTextWindow',
  hideQuicklookWindow = '@ipcRenderer/hideQuicklookWindow',
  hideSearchWindow = '@ipcRenderer/hideSearchWindow',
  importTheme = '@ipcRenderer/importTheme',
  openPluginInstallFileDialog = '@ipcRenderer/openPluginInstallFileDialog',
  openWfConfFileDialog = '@ipcRenderer/openWfConfFileDialog',
  openYesnoDialog = '@ipcRenderer/openYesnoDialog',
  popupPluginItemMenu = '@ipcRenderer/popupPluginItemMenu',
  popupSearchbarItemMenu = '@ipcRenderer/popupSearchbarItemMenu',
  popupWorkflowItemMenu = '@ipcRenderer/popupWorkflowItemMenu',
  renewWorkflow = '@ipcRenderer/renewWorkflow',
  resizeSearchWindowHeight = '@ipcRenderer/resizeSearchWindowHeight',
  resumeFileWatch = '@ipcRenderer/resumeFileWatch',
  saveFile = '@ipcRenderer/saveFile',
  setAutoLaunch = '@ipcRenderer/setAutoLaunch',
  setGlobalShortcut = '@ipcRenderer/setGlobalShortcut',
  setSearchWindowWidth = '@ipcRenderer/setSearchWindowWidth',
  showErrorDialog = '@ipcRenderer/showErrorDialog',
  showLargeTextWindow = '@ipcRenderer/showLargeTextWindow',
  showNotification = '@ipcRenderer/showNotification',
  showQuicklookWindow = '@ipcRenderer/showQuicklookWindow',
  stopFileWatch = '@ipcRenderer/stopFileWatch',
  triggerDoubleModifierKey = '@ipcRenderer/triggerDoubleModifierKey',
}

/**
 * @summary Events sent from main process to renderer process
 */
export enum IPCMainEnum {
  executeAction = '@ipcMain/executeAction',
  fetchAction = '@ipcMain/fetchAction',
  forwardLargeText = '@ipcRenderer/forwardLargeText',
  forwardQuicklookWindowUrl = '@ipcMain/forwardQuicklookWindowUrl',
  getSystemFontRet = '@ipcMain/getSystemFontRet',
  hideSearchWindowByBlurEvent = '@ipcMain/hideSearchWindowByBlurEvent',
  importThemeRet = '@ipcMain/importThemeRet',
  openPluginInstallFileDialogRet = '@ipcMain/openPluginInstallFileDialogRet',
  openWfConfFileDialogRet = '@ipcMain/openWfConfFileDialogRet',
  openYesnoDialogRet = '@ipcMain/openYesnoDialogRet',
  renewPlugin = '@ipcMain/renewPlugin',
  renewWorkflow = '@ipcMain/renewWorkflow',
  saveFileRet = '@ipcMain/saveFileRet',
  searchWindowShowCallback = '@ipcMain/searchWindowShowCallback',
  setPreferencePage = '@ipcMain/setPreferencePage',
  setSearchbarInput = '@ipcMain/setSearchbarInput',
  togglePluginEnabled = '@ipcMain/togglePluginEnabled',
  toggleWorkflowEnabled = '@ipcMain/toggleWorkflowEnabled',
}
