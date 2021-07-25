/**
 * @param color
 * @param alpha
 */
export const applyAlphaColor = (color: string, alpha: number) => {
  return color + alpha.toString(16);
};
