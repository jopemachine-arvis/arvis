import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import { Core } from 'arvis-core';
import { clipboard, ipcRenderer } from 'electron';

const logCustomAction = (action: any) => {
  const actionFlowManager = Core.ActionFlowManager.getInstance();
  if (actionFlowManager.printActionType) {
    console.log(
      `%c[Action: ${action.type}]%c `,
      'color: cyan',
      'color: unset',
      action
    );
  }
};

const notificationActionHandler = (action: any) => {
  logCustomAction(action);

  ipcRenderer.send(IPCRendererEnum.showNotification, {
    title: action.title,
    body: action.text,
  });
};

const clipboardActionHandler = (action: any) => {
  logCustomAction(action);

  clipboard.writeText(action.text);
};

const keyDispatchingActionHandler = (action: any) => {
  logCustomAction(action);

  ipcRenderer.send(IPCRendererEnum.triggerKeyDownEvent, {
    key: action.target.key,
    modifiers: JSON.stringify(action.target.modifiers),
  });
};

export {
  clipboardActionHandler,
  notificationActionHandler,
  keyDispatchingActionHandler,
};
