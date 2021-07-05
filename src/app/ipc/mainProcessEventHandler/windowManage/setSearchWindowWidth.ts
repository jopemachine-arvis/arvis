import { IpcMainEvent } from 'electron';
import { WindowManager } from '../../../windows';

/**
 * @param  {number} width
 */
export const setSearchWindowWidth = (
  e: IpcMainEvent,
  { width }: { width: number }
) => {
  const searchWindow = WindowManager.getInstance().getSearchWindow();
  searchWindow.setBounds({ width, height: searchWindow.getSize()[1] }, false);
};
