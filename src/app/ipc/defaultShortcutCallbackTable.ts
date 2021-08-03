import toggleSearchWindow from './toggleSearchWindow';
import toggleClipboardHistoryWindow from './toggleClipboardHistoryWindow';

/**
 * This is a table of callback functions that always require key binding, such as calling searchWindow.
 */
export default {
  toggleSearchWindow: () => () => {
    toggleSearchWindow({ showsUp: false });
  },
  toggleClipboardHistoryWindow: () => () => {
    toggleClipboardHistoryWindow({ showsUp: false });
  },
};
