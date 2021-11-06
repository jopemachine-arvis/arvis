/* eslint-disable @typescript-eslint/ban-types */
import { BrowserWindow } from 'electron';
import { createLargeTextWindow } from './largeTextWindow';
import { createPreferenceWindow } from './preferenceWindow';
import { createSearchWindow } from './searchWindow';
import { createAssistanceWindow } from './assistanceWindow';

export class WindowManager {
  private static instance: WindowManager;

  private static readonly eventHandlers: Map<string, Function> = new Map();

  private constructor() {
    this.largeTextWindow = createLargeTextWindow();
    this.preferenceWindow = createPreferenceWindow();
    this.searchWindow = createSearchWindow({
      largeTextWindow: this.largeTextWindow,
    });
    this.assistanceWindow = createAssistanceWindow(WindowManager.eventHandlers);
  }

  private largeTextWindow: BrowserWindow;

  private searchWindow: BrowserWindow;

  private preferenceWindow: BrowserWindow;

  private assistanceWindow: BrowserWindow;

  public getAllWindows() {
    return [
      this.largeTextWindow,
      this.preferenceWindow,
      this.searchWindow,
      this.assistanceWindow,
    ];
  }

  public static getEventHandler(windowName: string, eventName: string) {
    if (!WindowManager.eventHandlers.has(`${windowName}#${eventName}`))
      throw new Error(`${eventName} Event Not Registered in ${windowName}`);

    return WindowManager.eventHandlers.get(
      `${windowName}#${eventName}`
    ) as Function;
  }

  public static getInstance() {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  }

  public getLargeTextWindow() {
    return this.largeTextWindow;
  }

  public getSearchWindow() {
    return this.searchWindow;
  }

  public getPreferenceWindow() {
    return this.preferenceWindow;
  }

  public registerFirstRunCallback(callback: any) {
    if (!this.preferenceWindow)
      throw new Error('preference window not registered!');
    this.preferenceWindow.webContents.addListener('did-finish-load', callback);
  }

  public getAssistanceWindow() {
    return this.assistanceWindow;
  }

  public windowAllClose() {
    this.getAllWindows().forEach((window) => {
      if (window && window.closable) {
        window.close();
      }
    });
  }
}
