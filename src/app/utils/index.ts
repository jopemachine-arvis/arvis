import makeActionCreator from './makeActionCreator';
import { isNumeric } from './isNumeric';
import extractJson from './extractJSON';
import { supportedImageFormats } from './isSupportedImage';
import getRandomColor from './getRandomColor';
import { createGlobalConfigChangeHandler } from './createGlobalConfigChangeHandler';
import { sleep } from './sleep';
import { range } from './range';
import { applyAlphaColor } from './applyAlphaColor';
import { isWithCtrlOrCmd } from './isWithCtrlOrCmd';
import { hideWindowAndRestoreFocus } from './hideWindowAndRestoreFocus';
import { getHotkeyNameOnThisPlatform } from './getHotkeyNameOnThisPlatform';
import { onNumberChangeHandler } from './onNumberChangeHandler';
import { checkIsRendererProc } from './checkProcessType';
import { getGithubReadmeContent } from './getGithubReadme';

export {
  applyAlphaColor,
  checkIsRendererProc,
  createGlobalConfigChangeHandler,
  extractJson,
  getGithubReadmeContent,
  getHotkeyNameOnThisPlatform,
  getRandomColor,
  hideWindowAndRestoreFocus,
  isNumeric,
  isWithCtrlOrCmd,
  makeActionCreator,
  onNumberChangeHandler,
  range,
  sleep,
  supportedImageFormats,
};
