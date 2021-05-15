import makeActionCreator from '../../utils/makeActionCreator';

export const actionTypes = {
  SET_SEARCH_WINDOW_WIDTH: '@uiConfig/SET_SEARCH_WINDOW_WIDTH',
  SET_SEARCH_WINDOW_FOOTER_HEIGHT: '@uiConfig/SET_SEARCH_WINDOW_FOOTER_HEIGHT',
  SET_SEARCH_WINDOW_TRANSPARENCY: '@uiConfig/SET_SEARCH_WINDOW_TRANSPARENCY',
  SET_SEARCH_WINDOW_BORDER_RADIUS: '@uiConfig/SET_SEARCH_WINDOW_BORDER_RADIUS',

  SET_ITEM_HEIGHT: '@uiConfig/SET_ITEM_HEIGHT',

  SET_ITEM_BACKGROUND_COLOR: '@uiConfig/SET_ITEM_BACKGROUND_COLOR',
  SET_SELECTED_ITEM_BACKGROUND_COLOR:
    '@uiConfig/SET_SELECTED_ITEM_BACKGROUND_COLOR',

  SET_TITLE_FONTSIZE: '@uiConfig/SET_TITLE_FONTSIZE',
  SET_SUBTITLE_FONTSIZE: '@uiConfig/SET_SUBTITLE_FONTSIZE',

  SET_ITEM_FONTCOLOR: '@uiConfig/SET_ITEM_FONTCOLOR',
  SET_SELECTED_ITEM_FONTCOLOR: '@uiConfig/SET_SELECTED_ITEM_FONTCOLOR',

  SET_ITEM_LEFT_PADDING: '@uiConfig/SET_ITEM_LEFT_PADDING',
  SET_TITLE_SUBTITLE_MARGIN: '@uiConfig/SET_TITLE_SUBTITLE_MARGIN',

  SET_SEARCHBAR_HEIGHT: '@uiConfig/SET_SEARCHBAR_HEIGHT',
  SET_SEARCHBAR_FONTSIZE: '@uiConfig/SET_SEARCHBAR_FONTSIZE',
  SET_SEARCHBAR_FONTCOLOR: '@uiConfig/SET_SEARCHBAR_FONTCOLOR',

  SET_ICON_RIGHT_MARGIN: '@uiConfig/SET_ICON_RIGHT_MARGIN',
};

export const setSearchWindowBorderRadius = makeActionCreator(
  actionTypes.SET_SEARCH_WINDOW_BORDER_RADIUS,
  'arg'
);

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

export const setSearchWindowFooterHeight = makeActionCreator(
  actionTypes.SET_SEARCH_WINDOW_FOOTER_HEIGHT,
  'arg'
);

export const setSearchWindowTransparency = makeActionCreator(
  actionTypes.SET_SEARCH_WINDOW_TRANSPARENCY,
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

export const setTitleSubTitleMargin = makeActionCreator(
  actionTypes.SET_TITLE_SUBTITLE_MARGIN,
  'arg'
);

export const setSearchBarFontColor = makeActionCreator(
  actionTypes.SET_SEARCHBAR_FONTCOLOR,
  'arg'
);

export const setIconRightMargin = makeActionCreator(
  actionTypes.SET_ICON_RIGHT_MARGIN,
  'arg'
);
