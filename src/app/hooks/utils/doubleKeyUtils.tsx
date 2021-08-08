export const doubleKeyPressElapse = 200;

export const updateDoubleKeyPressedTimer = (
  doubleKeyPressedTimers: Record<string, number>,
  doubledKeyModifier: string,
  time: number
) => {
  (doubleKeyPressedTimers as any)[doubledKeyModifier] = time;
};

export const isDoubleKeyPressed = (
  doubleKeyPressedTimers: Record<string, number>,
  doubledKeyModifier: string
) => {
  if (
    (doubleKeyPressedTimers as any)[doubledKeyModifier] &&
    Date.now() - (doubleKeyPressedTimers as any)[doubledKeyModifier] <
      doubleKeyPressElapse
  ) {
    return true;
  }
  updateDoubleKeyPressedTimer(
    doubleKeyPressedTimers,
    doubledKeyModifier,
    new Date().getTime()
  );
  return false;
};
