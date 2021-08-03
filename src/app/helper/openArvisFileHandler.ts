import { PreferencePage } from '../containers/Preference/preferencePageEnum';
import { IPCMainEnum } from '../ipc/ipcEventEnum';
import { WindowManager } from '../windows';

/**
 * Open Handler for arvisplugin, arvisworkflow, arvistheme files
 * @param file
 */
export const openArvisFile = (file: string) => {
  const preferenceWindow = WindowManager.getInstance().getPreferenceWindow();

  preferenceWindow.show();

  if (file.endsWith('arvisworkflow')) {
    preferenceWindow.webContents.send(IPCMainEnum.setPreferencePage, {
      pageToOpen: PreferencePage.Workflow,
    });

    setTimeout(() => {
      preferenceWindow.webContents.send(
        IPCMainEnum.openWorkflowInstallFileDialogRet,
        {
          file: {
            filePaths: [file],
          },
        }
      );
    }, 100);
  } else if (file.endsWith('arvisplugin')) {
    preferenceWindow.webContents.send(IPCMainEnum.setPreferencePage, {
      pageToOpen: PreferencePage.Plugin,
    });

    setTimeout(() => {
      preferenceWindow.webContents.send(
        IPCMainEnum.openPluginInstallFileDialogRet,
        {
          file: {
            filePaths: [file],
          },
        }
      );
    }, 100);
  } else if (file.endsWith('arvistheme')) {
    preferenceWindow.webContents.send(IPCMainEnum.setPreferencePage, {
      pageToOpen: PreferencePage.Appearance,
    });

    setTimeout(() => {
      preferenceWindow.webContents.send(IPCMainEnum.importThemeRet, {
        file: {
          filePaths: [file],
        },
      });
    }, 100);
  } else {
    throw new Error(
      "This file seems not Arvis format. If it is, change the file's extension and try again"
    );
  }
};
