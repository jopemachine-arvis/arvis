import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import RootRouter from './src/navigator/rootRouter';
import { configureStore, history } from './src/store/configureStore';
import './app.global.css';
import {} from 'wf-creator-core';

const store = configureStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <RootRouter store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  )
);
