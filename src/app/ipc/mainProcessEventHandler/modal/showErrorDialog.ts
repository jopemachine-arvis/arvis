import { dialog, IpcMainEvent } from 'electron';

/**
 * Used to show errors
 * @param title
 * @param content
 */
export const showErrorDialog = (
  e: IpcMainEvent,
  { title, content }: { title: string; content: string }
) => {
  dialog.showErrorBox(title, content);
};
