import path from 'path';
import { Core } from 'arvis-core';

const arvisReduxStoreResetFlagPath = path.resolve(
  Core.path.tempPath,
  'arvis-redux-store-reset'
);
const arvisRenewExtensionFlagFilePath = path.resolve(
  Core.path.installedDataPath,
  'arvis-extension-renew'
);

export { arvisReduxStoreResetFlagPath, arvisRenewExtensionFlagFilePath };
