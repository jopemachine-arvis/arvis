import { screen } from 'electron';
import { dispatchAction } from '../../ipc/mainProcessEventHandler/config/dispatchAction';
import { WindowManager } from '../windowManager';

/**
 * Adjust the setting value to match the size of the user screen
 * Only called when arvis run first time.
 */
export const autoFitSearchWindowSize = () => {
  const screenWidth = screen.getPrimaryDisplay().size.width;

  const minWidth = 450;
  const evaluatedWidth = Math.floor(screenWidth * 0.375);
  const maxWidth = 2000;

  let width = evaluatedWidth;

  width = minWidth > evaluatedWidth ? minWidth : evaluatedWidth;
  width = maxWidth < evaluatedWidth ? maxWidth : evaluatedWidth;

  const searchWindow = WindowManager.getInstance().getSearchWindow();
  searchWindow.setBounds({ width, height: searchWindow.getSize()[1] }, false);

  dispatchAction(undefined as any, {
    args: width,
    destWindow: 'preferenceWindow',
    actionType: '@UI_CONFIG/SET_SEARCH_WINDOW_WIDTH',
  });

  dispatchAction(undefined as any, {
    args: width,
    destWindow: 'searchWindow',
    actionType: '@UI_CONFIG/SET_SEARCH_WINDOW_WIDTH',
  });
};
