import toggleSearchWindow from './toggleSearchWindow';

/**
 * @summary This is a table of callback functions that always require key binding, such as calling searchWindow.
 */
export default {
  toggleSearchWindow: () => () => {
    toggleSearchWindow({ showsUp: false });
  },
};
