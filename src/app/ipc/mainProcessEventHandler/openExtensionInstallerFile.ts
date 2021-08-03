/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { IpcMainEvent } from 'electron';
import { openArvisFile } from '../../helper/openArvisFileHandler';

export const openExtensionInstallerFile = (
  e: IpcMainEvent,
  { path }: { path: string }
) => {
  openArvisFile(path);
};
