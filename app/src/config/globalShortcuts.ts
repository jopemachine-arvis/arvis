import { globalShortcut } from 'electron';

const registerGlobalShortcut = (callbackTable: any) => {
  globalShortcut.register('Ctrl+Space', callbackTable.showSearchWindow);
};

export default registerGlobalShortcut;
