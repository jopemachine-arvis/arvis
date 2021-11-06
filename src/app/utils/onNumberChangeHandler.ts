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
  const mockEvent = {
    currentTarget: {
      value: e.currentTarget.value,
    },
  } as unknown as React.FormEvent<HTMLInputElement>;

  if (Number(e.currentTarget.value) < min) {
    e.currentTarget.value = min.toString();
    mockEvent.currentTarget.value = min.toString();
  } else if (Number(e.currentTarget.value) > max) {
    e.currentTarget.value = max.toString();
    mockEvent.currentTarget.value = max.toString();
  }

  globalConfigChangeHandler(e, actionType);
};
