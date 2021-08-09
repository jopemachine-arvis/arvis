/**
 * Make range. Return range includes 'from' and 'to' both.
 * @param from
 * @param to
 * @param step
 */
export const range = (from: number, to: number, step = 1) =>
  [...Array(Math.floor((to - from) / step) + 1)].map((_, i) => from + i * step);
