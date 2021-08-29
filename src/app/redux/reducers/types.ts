/* eslint-disable @typescript-eslint/ban-types */
import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type StateType = {
  global_config: {
    global_font: string;
    launch_at_login: boolean;
    max_item_count_to_search: number;
    max_item_count_to_show: number;
    search_window_hotkey: string;
    clipboard_history_window_hotkey: string;
    universal_action_window_hotkey: string;
  };
  ui_config: {
    icon_right_margin: number;
    item_background_color: string;
    item_default_icon_color: string;
    item_font_color: string;
    item_height: number;
    item_left_padding: number;
    item_title_subtitle_margin: number;
    searchbar_automatch_font_color: string;
    searchbar_dragger_color: string;
    searchbar_font_color: string;
    searchbar_font_size: number;
    searchbar_height: number;
    search_window_border_radius: number;
    search_window_footer_height: number;
    search_window_scrollbar_color: string;
    search_window_scrollbar_width: number;
    search_window_transparency: number;
    search_window_width: number;
    selected_item_background_color: string;
    selected_item_font_color: string;
    subtitle_font_size: number;
    title_font_size: number;
  };
  advanced_config: {
    async_plugin_timer: number;
    debugging_action: boolean;
    debugging_variables: boolean;
    debugging_plugin: boolean;
    debugging_script: boolean;
    debugging_scriptfilter: boolean;
    debugging_trigger_stack: boolean;
    max_action_log_count: number;
  };
  clipboard_history: {
    apply_mouse_hover_event: boolean;
    max_show: number;
    max_size: number;
    store: object[];
  };
};

export type GetState = () => StateType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<StateType, Action<string>>;
