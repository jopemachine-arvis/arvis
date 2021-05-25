import { BrowserWindow } from 'electron';
import { createLargeTextWindow } from './largeTextWindow';
import { createPreferenceWindow } from './preferenceWindow';
import { createQuicklookWindow } from './quicklookWindow';
import { createSearchWindow } from './searchWindow';

export class WindowManager {
  private static instance: WindowManager;

  private constructor() {
    this.quicklookWindow = createQuicklookWindow();
    this.largeTextWindow = createLargeTextWindow();
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
  }
}
