/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IpcMainEvent } from 'electron';
import { Core } from 'arvis-core';
import { registerWorkflowHotkeys as registerHotkeys } from '../../../config/shortcuts/globalShortcutHandler';

/**
 */
export const registerWorkflowHotkeys = (e: IpcMainEvent) => {
  registerHotkeys(Core.findHotkeys());
};
