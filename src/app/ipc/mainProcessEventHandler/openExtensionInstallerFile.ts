import { IpcMainEvent } from 'electron';
import { openArvisFile } from '../../helper/openArvisFileHandler';

/**
 */
export const openExtensionInstallerFile = (
  e: IpcMainEvent,
  { path }: { path: string }
) => {
  openArvisFile(path);
};
