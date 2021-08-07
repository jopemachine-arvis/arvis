export const singleKeyPressHandlers = new Map<string, () => void>();

export const doubleKeyPressHandlers: {
  shift?: () => void;
  alt?: () => void;
  ctrl?: () => void;
  cmd?: () => void;
} = {};
