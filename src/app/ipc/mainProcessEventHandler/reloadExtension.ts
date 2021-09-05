import { IpcMainEvent } from 'electron';
import { pascalCase } from 'pascal-case';
import { getDestWindow } from '../../windows/utils/getDestWindow';

const reloadExtension = (
  extensionType: 'workflow' | 'plugin' | 'snippet',
  arg: { destWindow?: string; bundleId?: string } | undefined
) => {
  const reloadFunctionName = `@ipcMain/reload${pascalCase(extensionType)}`;

  if (arg && arg.destWindow) {
    getDestWindow(arg.destWindow).webContents.send(reloadFunctionName, {
      bundleId: arg.bundleId,
    });
  } else {
    const bundleId = arg ? arg.bundleId : undefined;

    getDestWindow('searchWindow').webContents.send(reloadFunctionName, {
      bundleId,
    });
    getDestWindow('preferenceWindow').webContents.send(reloadFunctionName, {
      bundleId,
    });
  }
};

export const reloadWorkflow = (
  e: IpcMainEvent,
  arg: { destWindow?: string; bundleId?: string } | undefined
) => {
  reloadExtension('workflow', arg);
};

export const reloadPlugin = (
  e: IpcMainEvent,
  arg: { destWindow?: string; bundleId?: string } | undefined
) => {
  reloadExtension('plugin', arg);
};

export const reloadSnippet = (
  e: IpcMainEvent,
  arg: { destWindow?: string; bundleId?: string } | undefined
) => {
  reloadExtension('snippet', arg);
};
