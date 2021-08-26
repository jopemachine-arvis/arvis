/* eslint-disable no-restricted-syntax */
/* eslint-disable promise/no-nesting */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import fse from 'fs-extra';
import os from 'os';
import pathExists from 'path-exists';
import { dialog } from 'electron';

export const linuxAutoLauncher = {
  enable: async (): Promise<void | null> => {
    if (!(await pathExists(`${os.homedir()}/Applications`))) {
      dialog.showErrorBox(
        "'/Application' directory not exist!",
        "Please make '/Applications' and copy your Arvis.appimage to the folder before set auto launch"
      );
      return null;
    }

    return fse
      .readdir(`${os.homedir()}/Applications`)
      .then(async (files) => {
        if (!(await pathExists(`${os.homedir}/.config/autostart`))) {
          await fse.mkdir(`${os.homedir}/.config/autostart`);
        }

        for (const fileName of files) {
          if (fileName.startsWith('Arvis')) {
            const data = `[Desktop Entry]
Type=Applicationcd
Version=1.0
Name=Arvis
Comment=Arvis startup script
Exec=${os.homedir()}/Applications/${fileName}
X-GNOME-Autostart-enabled=true
StartupNotify=false
NoDisplay=false
Hide=false
Terminal=false`;
            return fse.writeFile(
              `${os.homedir}/.config/autostart/arvis.desktop`,
              data
            );
          }
        }
        return null;
      })
      .catch(console.error);
  },

  disable: async () => {
    return pathExists(`${os.homedir}/.config/autostart/arvis.desktop`)
      .then((exist) => {
        exist &&
          fse
            .remove(`${os.homedir}/.config/autostart/arvis.desktop`)
            .catch(console.error);
        return null;
      })
      .catch(console.error);
  },
};
