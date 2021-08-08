export {};

declare global {
  export interface IOHookKeyEvent {
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    keycode: number;
    type: string;
  }
}
