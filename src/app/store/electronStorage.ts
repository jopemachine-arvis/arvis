import createElectronStorage from 'redux-persist-electron-storage';
import ElectronStore from 'electron-store';

export const electronStore = new ElectronStore({
  clearInvalidConfig: true,
  name: 'arvis-gui-config',
});

export const electronPersistedStore = createElectronStorage({
  electronStore,
}) as any;
