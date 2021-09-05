import { isNumeric } from './isNumeric';

export const convertNumeric = (value: string): string | number => {
  return isNumeric(value) ? Number(value) : value;
};
