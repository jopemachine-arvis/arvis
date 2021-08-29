/* eslint-disable @typescript-eslint/ban-types */
import { BrowserWindow } from 'electron';
import path from 'path';
import constants from '../config/constant';

const createAssistanceWindow = (eventHandlers: Map<string, Function>) => {
  const assistanceWindow = new BrowserWindow({
    title: 'AssistanceWindow',
    center: true,
    show: false,
    frame: false,
    resizable: true,
    disableAutoHideCursor: true,
    skipTaskbar: true,
    movable: true,
    fullscreenable: false,
    width: constants.assistanceWindowWidth,
    height: constants.assistanceWindowHeight,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      accessibleTitle: 'arvis-assistance-window',
      contextIsolation: false,
      experimentalFeatures: false,
      nodeIntegration: true,
      plugins: false,
      scrollBounce: false,
      spellcheck: false,
      webviewTag: false,
      enableRemoteModule: true,
    },
  });

  const filePath =
    process.env.NODE_ENV === 'development'
      ? path.join(__dirname, '../../', 'app.html')
      : path.join(__dirname, 'app.html');

  assistanceWindow.loadFile(filePath, {
    query: { window: 'assistanceWindow' },
  });

  assistanceWindow.on('close', (e) => {
    e.preventDefault();
    if (assistanceWindow) {
      assistanceWindow.hide();
    }
  });

  const hideAssistanceWindow = () => {
    assistanceWindow.hide();
  };

  eventHandlers.set('assistanceWindow#blur', hideAssistanceWindow);

  assistanceWindow.on('blur', hideAssistanceWindow);

  return assistanceWindow;
};

export { createAssistanceWindow };
