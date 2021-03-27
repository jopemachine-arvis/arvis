import { globalShortcut } from 'electron';

const registerGlobalShortcut = (callback: () => void) => {
  globalShortcut.register('Ctrl+Space', callback);
};

export default registerGlobalShortcut;
