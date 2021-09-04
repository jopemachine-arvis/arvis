import { Menu, MenuItem } from 'electron';
import { IPCMainEnum } from '../../../ipc/ipcEventEnum';
import { WindowManager } from '../../../windows';
import {
  deleteSnippet,
  createEmptySnippet,
} from '../../../containers/Preference/Snippet/utils';

class SnippetItemContextMenu extends Menu {
  constructor({ snippet }: { snippet: SnippetItem }) {
    super();

    super.append(
      new MenuItem({
        type: 'normal',
        label: 'Add Snippet',
        toolTip: 'Add Snippet',
        click() {
          createEmptySnippet(snippet.collection).catch(console.error);
        },
      })
    );

    super.append(
      new MenuItem({
        type: 'normal',
        label: 'Delete Snippet',
        toolTip: 'Delete Snippet',
        click() {
          deleteSnippet(snippet).catch(console.error);

          WindowManager.getInstance()
            .getPreferenceWindow()
            .webContents.send(IPCMainEnum.reloadSnippet);
        },
      })
    );
  }
}

export default SnippetItemContextMenu;
