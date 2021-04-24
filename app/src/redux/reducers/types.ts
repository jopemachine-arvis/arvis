import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type StateType = {
  globalConfig: {
    hotkey: string;
    launch_at_login: boolean;
  };
};

export type GetState = () => StateType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<StateType, Action<string>>;
