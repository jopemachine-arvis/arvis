/* eslint-disable @typescript-eslint/ban-types */
import { BrowserWindow } from 'electron';
import { createLargeTextWindow } from './largeTextWindow';
import { createPreferenceWindow } from './preferenceWindow';
import { createQuicklookWindow } from './quicklookWindow';
import { createSearchWindow } from './searchWindow';
import { createClipboardHistoryWindow } from './clipboardHistoryWindow';

export class WindowManager {
  private static instance: WindowManager;

  private static readonly eventHandlers: Map<string, Function> = new Map();

  private constructor() {
    this.quicklookWindow = createQuicklookWindow();
    this.largeTextWindow = createLargeTextWindow();
    this.clipboardHistoryWindow = createClipboardHistoryWindow(
      WindowManager.eventHandlers
    );
    this.searchWindow = createSearchWindow({
      quicklookWindow: this.quicklookWindow,
      largeTextWindow: this.largeTextWindow,
    });
    this.preferenceWindow = createPreferenceWindow({
      searchWindow: this.searchWindow,
    });
  }

  private quicklookWindow: BrowserWindow;

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

  public getQuicklookWindow() {
    return this.quicklookWindow;
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
    if (this.quicklookWindow && this.quicklookWindow.closable) {
      this.quicklookWindow.close();
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
