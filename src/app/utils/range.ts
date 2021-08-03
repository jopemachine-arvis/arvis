/**
 * @param from
 * @param to
 * @param step
 */
export const range = (from: number, to: number, step: number) =>
  [...Array(Math.floor((to - from) / step) + 1)].map((_, i) => from + i * step);
