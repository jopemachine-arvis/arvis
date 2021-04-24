import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { IconContext } from 'react-icons';
import RootRouter from './src/navigator/rootRouter';
import { configureStore, history } from './src/store/configureStore';
import './app.global.css';

import initialState from './src/config/initialState';

const { store, persistor } = configureStore(initialState);
const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;
const urlParams = new URLSearchParams(window.location.search);
const windowName = urlParams.get('window');

if (windowName) {
  document.addEventListener('DOMContentLoaded', () =>
    render(
      <AppContainer>
        <IconContext.Provider
          value={{ color: 'white', className: 'global-class-name' }}
        >
          <RootRouter
            store={store}
            persistor={persistor}
            history={history}
            windowName={windowName}
          />
        </IconContext.Provider>
      </AppContainer>,
      document.getElementById('root')
    )
  );
} else {
  // eslint-disable-next-line no-console
  console.error('windowName is not set!!');
}
