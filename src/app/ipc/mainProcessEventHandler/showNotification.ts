import { IpcMainEvent, Notification } from 'electron';

/**
 * @param  {string} title
 * @param  {string} body
 * @summary Used to show notification
 */
export const showNotification = (
  e: IpcMainEvent,
  { title, body }: { title: string; body: string }
) => {
  const notification = new Notification({
    title,
    body,
  });

  notification.show();
};
