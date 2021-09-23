import { app } from 'electron';
import fse from 'fs-extra';
import path from 'path';
import pkg from '../config/pkg';

export const isThisVersionFirstLaunching = (): boolean => {
  const checkFile = path.join(
    app.getPath('userData'),
    `.electron-util--has-app-launched-${pkg.version}`
  );

  if (fse.existsSync(checkFile)) {
    return false;
  }

  try {
    fse.writeFileSync(checkFile, '');
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      fse.mkdirSync(app.getPath('userData'));
      return isThisVersionFirstLaunching();
    }
  }

  return true;
};
