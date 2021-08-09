export const doubleKeyPressHandlers = new Map<
  'ctrl' | 'shift' | 'alt' | 'cmd',
  () => void
>();

export const initializeDoubleKeyShortcuts = () => {
  doubleKeyPressHandlers.clear();
};
