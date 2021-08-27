import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import { sleep } from '@utils/sleep';
import { Core } from 'arvis-core';
import { ipcRenderer } from 'electron';
import _ from 'lodash';

export const checkExtensionsUpdate = async () => {
  try {
    const result = await Promise.all([
      Core.checkUpdatableExtensions('workflow'),
      Core.checkUpdatableExtensions('plugin'),
    ]);
    await sleep(100);
    const updatable: any[] = _.flatten(result);

    const updatableTexts = _.map(
      updatable,
      (item) => `${item.name}: ${item.current} → ${item.latest}.`
    ).join('\n');

    if (updatable.length > 0) {
      ipcRenderer.send(IPCRendererEnum.showNotification, {
        title:
          updatable.length === 1
            ? `${updatable.length} extension is updatable`
            : `${updatable.length} extensions are updatable`,
        body: updatableTexts,
      });
    }
    return null;
  } catch (message) {
    return console.error(message);
  }
};
