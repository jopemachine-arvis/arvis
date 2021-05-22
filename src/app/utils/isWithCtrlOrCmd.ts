/**
 * @param  {} {isWithCmd
 * @param  {} isWithCtrl
 */
export const isWithCtrlOrCmd = ({
  isWithCmd,
  isWithCtrl,
}: {
  isWithCtrl: boolean;
  isWithCmd: boolean;
}) => {
  if (process.platform === 'darwin') {
    return isWithCmd;
  }
  return isWithCtrl;
};
