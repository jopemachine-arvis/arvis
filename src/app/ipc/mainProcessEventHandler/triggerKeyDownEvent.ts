import { IpcMainEvent } from 'electron';
import robot from 'robotjs';

/**
 * @summary
 */
export const triggerKeyDownEvent = (
  e: IpcMainEvent,
  { key, modifiers }: { key: string; modifiers?: string }
) => {
  let targetModifiers = modifiers ? JSON.parse(modifiers) : undefined;
  if (!Array.isArray(targetModifiers) && typeof targetModifiers === 'object') {
    targetModifiers = Object.values(targetModifiers);
  }

  robot.keyTap(key, targetModifiers);
};
