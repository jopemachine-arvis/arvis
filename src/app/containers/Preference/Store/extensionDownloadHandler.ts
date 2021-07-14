import { ipcRenderer } from 'electron';
import execa from 'execa';
import { downloadExtension } from 'arvis-store';
import { Core } from 'arvis-core';
import isAdmin from 'is-admin';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';

const checkPermissionOnWindows = async () => {
  if (process.platform === 'win32') {
    if ((await isAdmin()) === false) {
      ipcRenderer.send(IPCRendererEnum.showErrorDialog, {
        title: 'To install extension, run Arvis by administrator permission',
      });
      return false;
    }
  }
  return true;
};

export const installExtension = async ({
  extensionType,
  bundleId,
  installType,
}: {
  extensionType: 'workflow' | 'plugin';
  bundleId: string;
  installType: string;
}): Promise<void> => {
  if (!(await checkPermissionOnWindows())) return;

  const [creator, name] = bundleId.split('.');
  const env =
    process.platform === 'darwin'
      ? { PATH: Core.getMacPathsEnv() }
      : process.env;

  try {
    switch (installType) {
      case 'npm':
        await execa('npm', ['install', '-g', name], { env, windowsHide: true });
        break;

      case 'local': {
        const dst = await downloadExtension(extensionType, bundleId, {
          path: Core.path.tempPath,
        });
        ipcRenderer.send(IPCRendererEnum.openExtensionInstallerFile, {
          path: dst,
        });
        break;
      }

      default:
        console.error('Unsupported type');
        break;
    }
  } catch (err) {
    ipcRenderer.send(IPCRendererEnum.showErrorDialog, {
      title: 'Error occurs during installation!',
      content: err.message,
    });
  }
};

export const uninstallExtension = async ({
  extensionType,
  bundleId,
  installType,
}: {
  extensionType: string;
  bundleId: string;
  installType: string;
}): Promise<void> => {
  if (!(await checkPermissionOnWindows())) return;

  const [creator, name] = bundleId.split('.');
  const env =
    process.platform === 'darwin'
      ? { PATH: Core.getMacPathsEnv() }
      : process.env;

  try {
    switch (installType) {
      case 'npm':
        await execa('npm', ['uninstall', '-g', name], {
          env,
          windowsHide: true,
        });
        break;

      case 'local':
        break;

      default:
        console.error('Unsupported type');
        break;
    }
  } catch (err) {
    ipcRenderer.send(IPCRendererEnum.showErrorDialog, {
      title: 'Error occurs during installation!',
      content: err.message,
    });
  }
};
