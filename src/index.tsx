import dva, { onActionFunc } from 'dva';
import createLoading from 'dva-loading';
import { createBrowserHistory } from 'history';
import React from 'react';
import { createLogger } from 'redux-logger';

import { __DEV__ } from './env';
import './index.scss';
import { Global } from './models';
import Page from './Page';
import { errorHandle } from './utils/errorHandle';

// Dva middleware
const middleware: onActionFunc[] = [];

// Only development env need to have redux logger
if (__DEV__) {
  middleware.push(createLogger());
}

const app: any = dva({
  history: createBrowserHistory(),

  onError(error: any) {
    // Catch redux action errors
    errorHandle(error, app._store.dispatch);
  },

  onAction: middleware,
});

// Third party middleware
app.use(createLoading());

app.router((props: any) => <Page {...props} />);

// Register dva global model
app.model(Global);

app.start('#root');
