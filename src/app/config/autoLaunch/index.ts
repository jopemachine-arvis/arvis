import AutoLaunch from 'easy-auto-launch';
import { linuxAutoLauncher } from './linux';

/**
 * @summary
 */
const makeLauncher = () => {
  if (process.platform === 'linux') {
    return linuxAutoLauncher;
  }

  return new AutoLaunch({
    name: 'Arvis',
    isHidden: true,
  });
};

export default makeLauncher();
