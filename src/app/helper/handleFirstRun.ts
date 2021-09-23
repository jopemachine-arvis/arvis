import chalk from 'chalk';
import { IPCMainEnum } from '../ipc/ipcEventEnum';
import { autoFitSearchWindowSize } from '../windows/utils/autoFitSearchWindowSize';
import { WindowManager } from '../windows/windowManager';

export const handleFirstRun = () => {
  const windowManager = WindowManager.getInstance();
  console.log(
    chalk.yellowBright('Detect first launched. Initilized search window size.')
  );

  autoFitSearchWindowSize();

  windowManager
    .getPreferenceWindow()
    .webContents.send(IPCMainEnum.openWalkThroughModalbox);
};

export const handleThisVersionFirstRun = () => {
  WindowManager.getInstance()
    .getPreferenceWindow()
    .webContents.send(IPCMainEnum.openChangeLogModalbox);
};
