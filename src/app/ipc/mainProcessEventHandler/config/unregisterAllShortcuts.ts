/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
import chalk from 'chalk';
import { IpcMainEvent, globalShortcut } from 'electron';
import { doubleKeyPressHandler } from '../../iohookShortcutCallbacks';

/**
 * @summary
 */
export const unregisterAllShortcuts = (e: IpcMainEvent) => {
  console.log(chalk.magentaBright('All registered shortcuts are released..'));

  globalShortcut.unregisterAll();

  for (const key of Object.keys(doubleKeyPressHandler)) {
    doubleKeyPressHandler[key] = undefined;
  }
};
