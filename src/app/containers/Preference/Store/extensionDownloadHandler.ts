import { ipcRenderer } from 'electron';
import execa from 'execa';
import { downloadExtension } from 'arvis-store';
import { Core } from 'arvis-core';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';

export const installExtension = async ({
  extensionType,
  bundleId,
  installType,
}: {
  extensionType: 'workflow' | 'plugin';
  bundleId: string;
  installType: string;
}): Promise<void> => {
  const [creator, name] = bundleId.split('.');

  switch (installType) {
    case 'npm':
      await execa('npm', ['install', '-g', name]);
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
  const [creator, name] = bundleId.split('.');

  switch (installType) {
    case 'npm':
      await execa('npm', ['uninstall', '-g', name]);
      break;

    case 'local':
      break;

    default:
      console.error('Unsupported type');
      break;
  }
};
