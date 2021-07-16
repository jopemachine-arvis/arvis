import makeActionCreator from '@utils/makeActionCreator';

export const actionTypes = {
  SET_ICON_RIGHT_MARGIN: '@UI_CONFIG/SET_ICON_RIGHT_MARGIN',
  SET_ITEM_BACKGROUND_COLOR: '@UI_CONFIG/SET_ITEM_BACKGROUND_COLOR',
  SET_ITEM_FONT_COLOR: '@UI_CONFIG/SET_ITEM_FONT_COLOR',
  SET_ITEM_HEIGHT: '@UI_CONFIG/SET_ITEM_HEIGHT',
  SET_ITEM_LEFT_PADDING: '@UI_CONFIG/SET_ITEM_LEFT_PADDING',
  SET_ITEM_TITLE_SUBTITLE_MARGIN: '@UI_CONFIG/SET_ITEM_TITLE_SUBTITLE_MARGIN',
  SET_SEARCHBAR_AUTOMATCH_FONT_COLOR:
    '@UI_CONFIG/SET_SEARCHBAR_AUTOMATCH_FONT_COLOR',
  SET_SEARCHBAR_FONT_COLOR: '@UI_CONFIG/SET_SEARCHBAR_FONT_COLOR',
  SET_SEARCHBAR_FONT_SIZE: '@UI_CONFIG/SET_SEARCHBAR_FONT_SIZE',
  SET_SEARCHBAR_HEIGHT: '@UI_CONFIG/SET_SEARCHBAR_HEIGHT',
  SET_SEARCHBAR_DRAGGER_COLOR: '@UI_CONFIG/SET_SEARCHBAR_DRAGGER_COLOR',
  SET_SEARCH_WINDOW_BORDER_RADIUS: '@UI_CONFIG/SET_SEARCH_WINDOW_BORDER_RADIUS',
  SET_SEARCH_WINDOW_FOOTER_HEIGHT: '@UI_CONFIG/SET_SEARCH_WINDOW_FOOTER_HEIGHT',
  SET_SEARCH_WINDOW_SCROLLBAR_COLOR:
    '@UI_CONFIG/SET_SEARCHWINDOW_SCROLLBAR_COLOR',
  SET_SEARCH_WINDOW_SCROLLBAR_WIDTH:
    '@UI_CONFIG/SET_SEARCHWINDOW_SCROLLBAR_WIDTH',
  SET_SEARCH_WINDOW_TRANSPARENCY: '@UI_CONFIG/SET_SEARCH_WINDOW_TRANSPARENCY',
  SET_SEARCH_WINDOW_WIDTH: '@UI_CONFIG/SET_SEARCH_WINDOW_WIDTH',
  SET_SELECTED_ITEM_BACKGROUND_COLOR:
    '@UI_CONFIG/SET_SELECTED_ITEM_BACKGROUND_COLOR',
  SET_SELECTED_ITEM_FONT_COLOR: '@UI_CONFIG/SET_SELECTED_ITEM_FONT_COLOR',
  SET_TITLE_FONT_SIZE: '@UI_CONFIG/SET_TITLE_FONT_SIZE',
  SET_SUBTITLE_FONT_SIZE: '@UI_CONFIG/SET_SUBTITLE_FONT_SIZE',
};

export const setSearchWindowScrollbarColor = makeActionCreator(
  actionTypes.SET_SEARCH_WINDOW_SCROLLBAR_COLOR,
  'arg'
);

export const setSearchbarDraggerColor = makeActionCreator(
  actionTypes.SET_SEARCHBAR_DRAGGER_COLOR,
  'arg'
);

export const setSearchbarAutoMatchFontColor = makeActionCreator(
  actionTypes.SET_SEARCHBAR_AUTOMATCH_FONT_COLOR,
  'arg'
);

export const setSearchWindowScrollbarWidth = makeActionCreator(
  actionTypes.SET_SEARCH_WINDOW_SCROLLBAR_WIDTH,
  'arg'
);

export const setSearchWindowBorderRadius = makeActionCreator(
  actionTypes.SET_SEARCH_WINDOW_BORDER_RADIUS,
  'arg'
);

export const setSearchBarFontSize = makeActionCreator(
  actionTypes.SET_SEARCHBAR_FONT_SIZE,
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
  actionTypes.SET_TITLE_FONT_SIZE,
  'arg'
);

export const setItemFontColor = makeActionCreator(
  actionTypes.SET_ITEM_FONT_COLOR,
  'arg'
);

export const setSelectedItemFontColor = makeActionCreator(
  actionTypes.SET_SELECTED_ITEM_FONT_COLOR,
  'arg'
);

export const setSubTitleFontSize = makeActionCreator(
  actionTypes.SET_SUBTITLE_FONT_SIZE,
  'arg'
);

export const setItemLeftPadding = makeActionCreator(
  actionTypes.SET_ITEM_LEFT_PADDING,
  'arg'
);

export const setItemTitleSubTitleMargin = makeActionCreator(
  actionTypes.SET_ITEM_TITLE_SUBTITLE_MARGIN,
  'arg'
);

export const setSearchBarFontColor = makeActionCreator(
  actionTypes.SET_SEARCHBAR_FONT_COLOR,
  'arg'
);

export const setIconRightMargin = makeActionCreator(
  actionTypes.SET_ICON_RIGHT_MARGIN,
  'arg'
);
