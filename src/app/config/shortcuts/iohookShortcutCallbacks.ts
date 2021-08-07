export const singleKeyPressHandlers = new Map<string, () => void>();
export const doubleKeyPressHandlers = new Map<
  'ctrl' | 'shift' | 'alt' | 'cmd',
  () => void
>();

export const initializeKeyHandler = () => {
  singleKeyPressHandlers.clear();
  doubleKeyPressHandlers.clear();
};
