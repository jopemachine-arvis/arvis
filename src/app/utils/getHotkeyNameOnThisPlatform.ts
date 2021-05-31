export const getHotkeyNameOnThisPlatform = (hotkey: string) => {
  let result = hotkey;

  if (process.platform === 'win32') {
    result = result.replaceAll('cmd', 'win');
  }
  if (process.platform === 'linux') {
    result = result.replaceAll('cmd', 'meta');
  }
  if (process.platform === 'darwin') {
    result = result.replaceAll('alt', 'opt');
  }

  return result;
};
