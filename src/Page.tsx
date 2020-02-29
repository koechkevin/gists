import { connect } from 'dva';
import { Redirect, Route, routerRedux, Switch } from 'dva/router';
import React, { FC, useCallback, useEffect } from 'react';
import { hot } from 'react-hot-loader/root';

import App from './App';
import { __DEV__ } from './env';
import { Dispatch } from './models/dispatch';
import { Auth } from './models/user';
import { AppPages, PublicPages } from './pages';
import { localStorageKey } from './utils/constants';

const { Login, ForgotPassword, FillNewPassword } = AppPages;
const { ConnectedRouter } = routerRedux;
const { ApplyAuth, Error403, Error404, Error500 } = PublicPages;

interface Props {
  app: any;
  auth: Auth;
  history: any;
  logout: () => void;
}

// Global pages router
const Page: FC<Props> = (props) => {
  const { app, auth, history, logout } = props;

  const onStorageChange = useCallback(
    (e: any) => {
      if ((e.key === localStorageKey.APP_KEY_STORE || !e.key) && !e.newValue) {
        logout();
      }
    },
    [logout],
  );

  useEffect(() => {
    // Listen storage change
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, [onStorageChange]);

  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/app/candidate" push />} />
        <Route exact path="/app" render={() => <Redirect to="/app/candidate" push />} />
        <Route path="/login" component={Login} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/fill-new-password" component={FillNewPassword} />
        <Route path="/app/candidate/:companyId?" render={(props: any) => <App app={app} auth={auth} {...props} />} />
        <Route path="/apply/auth/email" render={(props) => <ApplyAuth app={app} auth={auth} {...props} />} />
        <Route path="/exception/403" component={Error403} />
        <Route path="/exception/404" component={Error404} />
        <Route path="/exception/500" component={Error500} />
        <Redirect to="/exception/404" />
      </Switch>
    </ConnectedRouter>
  );
};

const mapStateToProps = ({ global }: any) => ({
  auth: global.auth,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  logout: () => {
    dispatch({ type: 'global/logout' });
  },
});

const EnhancedPage = connect(mapStateToProps, mapDispatchToProps)(Page);

export default __DEV__ ? hot(EnhancedPage) : EnhancedPage;
