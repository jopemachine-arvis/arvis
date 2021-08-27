import { IpcMainEvent, nativeImage, Notification } from 'electron';
import path from 'path';
import { getArvisAssetsPath } from '../../config/path';

/**
 * Used to show notification
 * @param title
 * @param body
 * @param icon
 */
export const showNotification = (
  e: IpcMainEvent,
  { title, body, icon }: { title: string; body: string; icon?: string }
) => {
  const notification = new Notification({
    title,
    body,
    silent: false,
    hasReply: false,
    urgency: 'critical',
    icon: nativeImage.createFromPath(
      icon ?? path.resolve(getArvisAssetsPath(), 'icon.png')
    ),
  });

  notification.show();
};
