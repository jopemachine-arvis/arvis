import { IpcMainEvent } from 'electron';
import robot from 'robotjs';

/**
 * @summary
 */
export const triggerKeyDownEvent = (
  e: IpcMainEvent,
  { key, modifiers }: { key: string; modifiers?: string }
) => {
  robot.keyTap(key, modifiers ? JSON.parse(modifiers) : undefined);
};
