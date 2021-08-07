export const doubleKeyPressElapse = 200;

export const doubleKeyPressedTimers = {};

export const updateDoubleKeyPressedTimer = (
  doubledKeyModifier: string,
  time: number
) => {
  (doubleKeyPressedTimers as any)[doubledKeyModifier] = time;
};

export const isDoubleKeyPressed = (doubledKeyModifier: string) => {
  if (
    (doubleKeyPressedTimers as any)[doubledKeyModifier] &&
    Date.now() - (doubleKeyPressedTimers as any)[doubledKeyModifier] <
      doubleKeyPressElapse
  ) {
    return true;
  }
  updateDoubleKeyPressedTimer(doubledKeyModifier, new Date().getTime());
  return false;
};
