import { dialog, IpcMainEvent } from 'electron';

/**
 * @param title
 * @param content
 * @summary Used to show errors
 */
export const showErrorDialog = (
  e: IpcMainEvent,
  { title, content }: { title: string; content: string }
) => {
  dialog.showErrorBox(title, content);
};
