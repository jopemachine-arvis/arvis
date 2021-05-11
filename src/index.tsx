import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { IconContext } from 'react-icons';
import RootRouter from './app/navigator/rootRouter';
import { configureStore, history } from './app/store/configureStore';
import initialState from './app/config/initialState';
import './app.global.css';

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
  throw new Error('windowName is not set!');
}
