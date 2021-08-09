import { Core } from 'arvis-core';

export const executeAction = (bundleId: string, action: Action[]) => {
  const actionFlowManager = Core.ActionFlowManager.getInstance();
  actionFlowManager.isInitialTrigger = false;
  actionFlowManager.handleItemPressEvent(
    {
      actions: action,
      bundleId,
      type: 'hotkey',
      title: '',
    },
    '',
    { normal: true }
  );
};
