import { globalShortcut } from 'electron';

const registerGlobalShortcut = (callback: () => void) => {
  globalShortcut.register('Alt+X', callback);
};

export default registerGlobalShortcut;
