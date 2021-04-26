import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type StateType = {
  globalConfig: {
    hotkey: string;
    launch_at_login: boolean;
    max_item_count_to_show: number;
    max_item_count_to_search: number;
  };
  uiConfig: {
    item_background_color: string;
    item_font_color: string;
    item_height: number;
    item_left_padding: number;
    item_top_padding: number;
    searchbar_font_size: number;
    searchbar_height: number;
    search_window_height: number;
    search_window_width: number;
    selected_item_background_color: string;
    selected_item_font_color: string;
    subtitle_font_size: number;
    title_font_size: number;
  };
};

export type GetState = () => StateType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<StateType, Action<string>>;
