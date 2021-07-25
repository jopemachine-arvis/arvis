/* eslint-disable @typescript-eslint/ban-types */
import { BrowserWindow } from 'electron';
import { createLargeTextWindow } from './largeTextWindow';
import { createPreferenceWindow } from './preferenceWindow';
import { createSearchWindow } from './searchWindow';
import { createClipboardHistoryWindow } from './clipboardHistoryWindow';

export class WindowManager {
  private static instance: WindowManager;

  private static readonly eventHandlers: Map<string, Function> = new Map();

  private constructor() {
    this.largeTextWindow = createLargeTextWindow();
    this.preferenceWindow = createPreferenceWindow();
    this.clipboardHistoryWindow = createClipboardHistoryWindow(
      WindowManager.eventHandlers
    );
    this.searchWindow = createSearchWindow({
      largeTextWindow: this.largeTextWindow,
    });
  }

  private largeTextWindow: BrowserWindow;

  private searchWindow: BrowserWindow;

  private preferenceWindow: BrowserWindow;

  private clipboardHistoryWindow: BrowserWindow;

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

  public getClipboardHistoryWindow() {
    return this.clipboardHistoryWindow;
  }

  public windowAllClose() {
    if (this.searchWindow && this.searchWindow.closable) {
      this.searchWindow.close();
    }
    if (this.largeTextWindow && this.largeTextWindow.closable) {
      this.largeTextWindow.close();
    }
    if (this.preferenceWindow && this.preferenceWindow.closable) {
      this.preferenceWindow.close();
    }
    if (this.clipboardHistoryWindow && this.clipboardHistoryWindow.closable) {
      this.clipboardHistoryWindow.close();
    }
  }
}
