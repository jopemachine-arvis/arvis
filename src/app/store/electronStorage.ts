import createElectronStorage from 'redux-persist-electron-storage';
import ElectronStore from 'electron-store';

export const electronStore = new ElectronStore({
  clearInvalidConfig: false,
  name: 'arvis-gui-config',
});

export const electronPersistedStore = createElectronStorage({
  electronStore,
  electronStoreOpts: {
    name: 'arvis-gui-config',
    clearInvalidConfig: false,
  },
}) as any;
