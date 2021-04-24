import { globalShortcut } from 'electron';

const registerGlobalShortcut = (callbackTable: any) => {
  globalShortcut.register('Ctrl+Space', callbackTable.showSearchWindow);
  globalShortcut.register('Esc', callbackTable.hideSearchWindow);
};

export default registerGlobalShortcut;
