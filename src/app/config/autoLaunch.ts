/* eslint-disable no-restricted-syntax */

import AutoLaunch from 'easy-auto-launch';
import os from 'os';
import fse from 'fs-extra';

/**
 * @summary
 */
const makeLauncher = () => {
  if (process.platform === 'linux') {
    return {
      enable: () => {
        return fse
          .readdir(`${os.homedir()}/Applications`)
          .then((files) => {
            for (const fileName of files) {
              if (fileName.startsWith('Arvis')) {
                const data =
`[Desktop Entry]
Type=Application
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

      disable: () => {
        fse.remove(`${os.homedir}/.config/autostart/arvis`).catch(() => {});
      },
    };
  }

  return new AutoLaunch({
    name: 'Arvis',
    isHidden: true,
  });
};

export default makeLauncher();
