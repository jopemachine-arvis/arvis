import { IpcMainEvent } from 'electron';
import toggleWindow from '../../../windows/utils/toggleAssistanceWindow';

/**
 */
export const toggleClipboardHistoryWindow = (
  e: IpcMainEvent,
  { showsUp }: { showsUp?: boolean }
) => {
  toggleWindow({ mode: 'clipboardHistory', showsUp: showsUp ?? false });
};

/**
 */
export const toggleUniversalActionWindow = (
  e: IpcMainEvent,
  { showsUp }: { showsUp?: boolean }
) => {
  toggleWindow({ mode: 'universalAction', showsUp: showsUp ?? false });
};

/**
 */
export const toggleSnippetWindow = (
  e: IpcMainEvent,
  { showsUp }: { showsUp?: boolean }
) => {
  toggleWindow({ mode: 'snippet', showsUp: showsUp ?? false });
};
