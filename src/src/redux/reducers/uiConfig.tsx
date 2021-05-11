import { UIConfigActions } from '../actions';

const { actionTypes: UIConfigActionTypes } = UIConfigActions;

export default (state = {}, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case UIConfigActionTypes.SET_ITEM_BACKGROUND_COLOR:
      return {
        ...state,
        item_background_color: payload.arg
      };
    case UIConfigActionTypes.SET_ITEM_HEIGHT:
      return {
        ...state,
        item_height: payload.arg
      };
    case UIConfigActionTypes.SET_ITEM_LEFT_PADDING:
      return {
        ...state,
        item_left_padding: payload.arg
      };
    case UIConfigActionTypes.SET_TITLE_SUBTITLE_MARGIN:
      return {
        ...state,
        item_title_subtitle_margin: payload.arg
      };
    case UIConfigActionTypes.SET_SEARCH_WINDOW_FOOTER_HEIGHT:
      return {
        ...state,
        search_window_footer_height: payload.arg
      };
    case UIConfigActionTypes.SET_SEARCH_WINDOW_WIDTH:
      return {
        ...state,
        search_window_width: payload.arg
      };
    case UIConfigActionTypes.SET_SELECTED_ITEM_BACKGROUND_COLOR:
      return {
        ...state,
        selected_item_background_color: payload.arg
      };
    case UIConfigActionTypes.SET_ITEM_FONTCOLOR:
      return {
        ...state,
        item_font_color: payload.arg
      };
    case UIConfigActionTypes.SET_SUBTITLE_FONTSIZE:
      return {
        ...state,
        subtitle_font_size: payload.arg
      };
    case UIConfigActionTypes.SET_SELECTED_ITEM_FONTCOLOR:
      return {
        ...state,
        selected_item_font_color: payload.arg
      };
    case UIConfigActionTypes.SET_TITLE_FONTSIZE:
      return {
        ...state,
        title_font_size: payload.arg
      };
    case UIConfigActionTypes.SET_SEARCHBAR_HEIGHT:
      return {
        ...state,
        searchbar_height: payload.arg
      };
    case UIConfigActionTypes.SET_SEARCHBAR_FONTSIZE:
      return {
        ...state,
        searchbar_font_size: payload.arg
      };
    case UIConfigActionTypes.SET_SEARCHBAR_FONTCOLOR:
      return {
        ...state,
        searchbar_font_color: payload.arg
      };
    case UIConfigActionTypes.SET_ICON_RIGHT_MARGIN:
      return {
        ...state,
        icon_right_margin: payload.arg
      };
    case UIConfigActionTypes.SET_SEARCH_WINDOW_TRANSPARENCY:
      return {
        ...state,
        search_window_transparency: payload.arg
      };
    default:
      return state;
  }
};
