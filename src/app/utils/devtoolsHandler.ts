import { WindowManager } from '../windows/windowManager';

export const openSearchWindowDevTools = () => {
  const searchWindow = WindowManager.getInstance().getSearchWindow();

  searchWindow.webContents.openDevTools({
    mode: 'undocked',
    activate: true,
  });

  searchWindow.webContents.devToolsWebContents!.focus();
};
