import { IpcMainEvent, Notification } from 'electron';

/**
 * @param title
 * @param body
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
