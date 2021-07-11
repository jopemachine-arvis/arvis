import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import { Core } from 'arvis-core';
import { clipboard, ipcRenderer } from 'electron';

const notificationActionHandler = (action: NotiAction) => {
  const actionFlowManager = Core.ActionFlowManager.getInstance();
  if (actionFlowManager.printActionType) {
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

const clipboardActionHandler = (action: ClipboardAction) => {
  const actionFlowManager = Core.ActionFlowManager.getInstance();
  if (actionFlowManager.printActionType) {
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
