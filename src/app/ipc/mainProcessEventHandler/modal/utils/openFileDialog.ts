import { dialog, OpenDialogReturnValue } from 'electron';

/**
 * Used to select file
 */
export const openFileDialog = async ({
  filterName,
  callback,
  extensions,
}: {
  filterName: string;
  extensions: string[];
  callback: (file: OpenDialogReturnValue) => void;
}) => {
  const file: OpenDialogReturnValue = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {
        name: filterName,
        extensions,
      },
    ],
  });

  callback(file);
};
