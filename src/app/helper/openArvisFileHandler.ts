import path from 'path';
import { PreferencePage } from '../containers/Preference/preferencePageEnum';
import { IPCMainEnum } from '../ipc/ipcEventEnum';
import { WindowManager } from '../windows';

const pageToOpen = {
  workflow: PreferencePage.Workflow,
  plugin: PreferencePage.Plugin,
  snippet: PreferencePage.Snippet,
  theme: PreferencePage.Appearance,
};

const eventToSend = {
  workflow: IPCMainEnum.openWorkflowInstallFileDialogRet,
  plugin: IPCMainEnum.openPluginInstallFileDialogRet,
  snippet: IPCMainEnum.openSnippetInstallFileDialogRet,
  theme: IPCMainEnum.importThemeRet,
};

const openHandler = (
  type: 'workflow' | 'plugin' | 'snippet' | 'theme',
  file: string
) => {
  const preferenceWindow = WindowManager.getInstance().getPreferenceWindow();

  preferenceWindow.webContents.send(IPCMainEnum.setPreferencePage, {
    pageToOpen: pageToOpen[type],
  });

  setTimeout(() => {
    preferenceWindow.webContents.send(eventToSend[type], {
      file: {
        filePaths: [file],
      },
    });
  }, 100);
};

/**
 * Open Handler for arvis associated files
 * @param file
 */
export const openArvisFile = (file: string) => {
  WindowManager.getInstance().getPreferenceWindow().show();

  switch (path.extname(file)) {
    case '.arvisworkflow':
      openHandler('workflow', file);
      break;
    case '.arvisplugin':
      openHandler('plugin', file);
      break;
    case '.alfredsnippets':
    case '.arvissnippets':
      openHandler('snippet', file);
      break;
    case '.arvistheme':
      openHandler('theme', file);
      break;
    default:
      throw new Error(
        "This file seems not Arvis format. If it is, change the file's extension and try again"
      );
  }
};
