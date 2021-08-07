/* eslint-disable react-hooks/exhaustive-deps */
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
let cleanedUp = false;
// const debug = process.env.NODE_ENV === 'development';
const debug = false;

export default (): any => {
  useEffect(() => {
    if (!started) {
      ioHook.start();
      started = true;
    }

    return () => {
      if (!cleanedUp) {
        ioHook.removeAllListeners();
        ioHook.unload();
        cleanedUp = true;
      }
    };
  }, []);

  ioHook.start(debug);

  return ioHook;
};
