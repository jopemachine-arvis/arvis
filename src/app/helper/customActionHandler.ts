import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import { WorkManager } from 'arvis-core/dist/core';
import { clipboard, ipcRenderer } from 'electron';

const notificationActionHandler = (action: any) => {
  const workManager = WorkManager.getInstance();
  if (workManager.printActionType) {
    console.log(
      '%c[Action: notification]%c ',
      'color: cyan',
      'color: unset',
      action
    );
  }

  ipcRenderer.send(IPCRendererEnum.showNotification, {
    title: action.title,
    body: action.text,
  });
};

const clipboardActionHandler = (action: any) => {
  const workManager = WorkManager.getInstance();
  if (workManager.printActionType) {
    console.log(
      '%c[Action: clipboard]%c ',
      'color: cyan',
      'color: unset',
      action
    );
  }

  clipboard.writeText(action.text);
};

export { clipboardActionHandler, notificationActionHandler };
