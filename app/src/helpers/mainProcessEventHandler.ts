import { ipcMain, dialog, BrowserWindow } from 'electron';

export const initIPCHandler = ({
  searchWindow,
  preferenceWindow
}: {
  searchWindow: BrowserWindow;
  preferenceWindow: BrowserWindow;
}) => {
  ipcMain.on('open-wfconf-file-dialog', async () => {
    const file: Electron.OpenDialogReturnValue = await dialog.showOpenDialog({
      properties: ['openFile']
    });
    preferenceWindow.webContents.send('open-wfconf-file-dialog-ret', {
      file,
    });
  });
};
