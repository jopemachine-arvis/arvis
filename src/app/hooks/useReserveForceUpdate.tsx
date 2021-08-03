/* eslint-disable no-restricted-syntax */
import useForceUpdate from 'use-force-update';
import { sleep } from '@utils/index';

/**
 */
export const useReserveForceUpdate = () => {
  const forceUpdate = useForceUpdate();
  return (checkIntervals: number[]) => {
    for (const interval of checkIntervals) {
      sleep(interval)
        .then(() => {
          forceUpdate();
          return null;
        })
        .catch(console.error);
    }
  };
};
