import { globalConfigChangeHandler } from './globalConfigChangeHandler';

export const onNumberChangeHandler = (
  e: React.FormEvent<HTMLInputElement>,
  {
    min,
    max,
    actionType,
  }: {
    min: number;
    max: number;
    actionType: string;
  }
) => {
  if (Number(e.currentTarget.value) < min) {
    e.currentTarget.value = min.toString();
  } else if (Number(e.currentTarget.value) > max) {
    e.currentTarget.value = max.toString();
  }

  globalConfigChangeHandler(e, actionType);
};
