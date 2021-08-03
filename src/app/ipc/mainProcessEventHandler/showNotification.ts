import { IpcMainEvent, Notification } from 'electron';

/**
 * Used to show notification
 * @param title
 * @param body
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
