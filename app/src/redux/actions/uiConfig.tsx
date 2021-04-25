import makeActionCreator from '../../utils/makeActionCreator';

export const actionTypes = {
  SET_SEARCH_WINDOW_WIDTH: '@uiConfig/SET_SEARCH_WINDOW_WIDTH',
  SET_SEARCH_WINDOW_HEIGHT: '@uiConfig/SET_SEARCH_WINDOW_HEIGHT',

  SET_ITEM_HEIGHT: '@uiConfig/SET_ITEM_HEIGHT',

  SET_ITEM_BACKGROUND_COLOR: '@uiConfig/SET_ITEM_BACKGROUND_COLOR',
  SET_SELECTED_ITEM_BACKGROUND_COLOR:
    '@uiConfig/SET_SELECTED_ITEM_BACKGROUND_COLOR',

  SET_TITLE_FONTSIZE: '@uiConfig/SET_TITLE_FONTSIZE',
  SET_SUBTITLE_FONTSIZE: '@uiConfig/SET_SUBTITLE_FONTSIZE',

  SET_ITEM_FONTCOLOR: '@uiConfig/SET_ITEM_FONTCOLOR',
  SET_SELECTED_ITEM_FONTCOLOR: '@uiConfig/SET_SELECTED_ITEM_FONTCOLOR',

  SET_ITEM_LEFT_PADDING: '@uiConfig/SET_ITEM_LEFT_PADDING',
  SET_ITEM_TOP_PADDING: '@uiConfig/SET_ITEM_TOP_PADDING',

  SET_SEARCHBAR_HEIGHT: '@uiConfig/SET_SEARCHBAR_HEIGHT',
  SET_SEARCHBAR_FONTSIZE: '@uiConfig/SET_SEARCHBAR_FONTSIZE'
};

export const setSearchBarFontSize = makeActionCreator(
  actionTypes.SET_SEARCHBAR_FONTSIZE,
  'arg'
);

export const setSearchBarHeight = makeActionCreator(
  actionTypes.SET_SEARCHBAR_HEIGHT,
  'arg'
);

export const setSearchWindowWidth = makeActionCreator(
  actionTypes.SET_SEARCH_WINDOW_WIDTH,
  'arg'
);

export const setSearchWindowHeight = makeActionCreator(
  actionTypes.SET_SEARCH_WINDOW_HEIGHT,
  'arg'
);

export const setItemHeight = makeActionCreator(
  actionTypes.SET_ITEM_HEIGHT,
  'arg'
);

export const setItemBackgroundColor = makeActionCreator(
  actionTypes.SET_ITEM_BACKGROUND_COLOR,
  'arg'
);

export const setSelectedItemBackgroundColor = makeActionCreator(
  actionTypes.SET_SELECTED_ITEM_BACKGROUND_COLOR,
  'arg'
);

export const setTitleFontSize = makeActionCreator(
  actionTypes.SET_TITLE_FONTSIZE,
  'arg'
);

export const setItemFontColor = makeActionCreator(
  actionTypes.SET_ITEM_FONTCOLOR,
  'arg'
);

export const setSelectedItemFontColor = makeActionCreator(
  actionTypes.SET_SELECTED_ITEM_FONTCOLOR,
  'arg'
);

export const setSubTitleFontSize = makeActionCreator(
  actionTypes.SET_SUBTITLE_FONTSIZE,
  'arg'
);

export const setItemLeftPadding = makeActionCreator(
  actionTypes.SET_ITEM_LEFT_PADDING,
  'arg'
);

export const setItemTopPadding = makeActionCreator(
  actionTypes.SET_ITEM_TOP_PADDING,
  'arg'
);
