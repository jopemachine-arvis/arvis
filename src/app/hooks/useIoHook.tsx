import React, { useEffect } from 'react';
import ioHook from 'iohook';

export interface IOHookKeyEvent {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  keycode: number;
  type: string;
}

let started = false;
// const debug = process.env.NODE_ENV === 'development';
const debug = false;

/**
 * Use iohook as singleton
 */
export default (): any => {
  useEffect(() => {
    if (!started) {
      ioHook.start(debug);
      started = true;
    }
  }, []);

  return ioHook;
};
