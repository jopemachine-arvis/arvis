export const doubleKeyPressElapse = 200;

export const doubleKeyPressedTimers = {};

export const isDoubleKeyPressed = (doubledKeyModifier: string) => {
  if (
    (doubleKeyPressedTimers as any)[doubledKeyModifier] &&
    Date.now() - (doubleKeyPressedTimers as any)[doubledKeyModifier] <
      doubleKeyPressElapse
  ) {
    return true;
  }
  return false;
};
