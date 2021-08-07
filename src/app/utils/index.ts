import makeActionCreator from './makeActionCreator';
import { isNumeric } from './isNumeric';
import extractJson from './extractJSON';
import {
  supportedImageFormats,
  isSupportedImageFormat,
} from './isSupportedImage';
import getRandomColor from './getRandomColor';
import { createGlobalConfigChangeHandler } from './createGlobalConfigChangeHandler';
import { sleep } from './sleep';
import { range } from './range';
import { objectFlip } from './objectFlip';
import { applyAlphaColor } from './applyAlphaColor';
import { isWithCtrlOrCmd } from './isWithCtrlOrCmd';
import { hideWindowAndRestoreFocus } from './hideWindowAndRestoreFocus';
import { getHotkeyNameOnThisPlatform } from './getHotkeyNameOnThisPlatform';
import { onNumberChangeHandler } from './onNumberChangeHandler';
import { getGithubReadmeContent } from './getGithubReadme';

export {
  applyAlphaColor,
  createGlobalConfigChangeHandler,
  extractJson,
  getGithubReadmeContent,
  getHotkeyNameOnThisPlatform,
  getRandomColor,
  hideWindowAndRestoreFocus,
  isNumeric,
  isSupportedImageFormat,
  isWithCtrlOrCmd,
  makeActionCreator,
  objectFlip,
  onNumberChangeHandler,
  range,
  sleep,
  supportedImageFormats,
};
