import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import { Core } from 'arvis-core';
import { clipboard, ipcRenderer } from 'electron';

export const logCustomAction = (action: Action) => {
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

export const notificationActionHandler = (action: Action) => {
  logCustomAction(action);

  ipcRenderer.send(IPCRendererEnum.showNotification, {
    title: (action as NotiAction).title,
    body: (action as NotiAction).text,
  });
};

export const clipboardActionHandler = (action: Action) => {
  logCustomAction(action);

  clipboard.writeText((action as ClipboardAction).text);
};

export const keyDispatchingActionHandler = (action: Action) => {
  logCustomAction(action);

  ipcRenderer.send(IPCRendererEnum.triggerKeyDownEvent, {
    key: (action as KeyDispatchingAction).target.key,
    modifiers: JSON.stringify(
      (action as KeyDispatchingAction).target.modifiers
    ),
  });
};
