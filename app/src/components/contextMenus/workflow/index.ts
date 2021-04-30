/* eslint-disable constructor-super */
import { Menu, MenuItem } from 'electron';
import open from 'open';

class WorkflowItemContextMenu extends Menu {
  path: string;

  setPath(path: string) {
    this.path = path;
  }

  constructor({ path }: { path: string }) {
    super();
    this.path = path;
    super.append(
      new MenuItem({
        type: 'normal',
        label: `Open Directory`,
        toolTip:
          'Opens the installation path of the selected workflow with Explorer',
        click() {
          open(path);
        }
      })
    );
    super.append(new MenuItem({ type: 'separator' }));
  }
}

export default WorkflowItemContextMenu;
