import { Loading } from '@aurora_app/ui-library';
import * as React from 'react';
import Loadable from 'react-loadable';

const Login = Loadable.Map({
  loader: {
    Login: () => import('./Login'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const Login = loaded.Login.default;

    return <Login {...props} />;
  },
});

const FillNewPassword = Loadable({
  loader: () => import('./FillNewPassword'),
  loading: Loading,
});

const ForgotPassword = Loadable({
  loader: () => import('./ForgotPassword'),
  loading: Loading,
});

export { Login, ForgotPassword, FillNewPassword };
