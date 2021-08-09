import ioHook from 'iohook';

export const unloadIOHook = () => {
  ioHook.removeAllListeners();
  ioHook.unload();
};
