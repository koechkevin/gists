import { connect } from 'dva';
import { Redirect } from 'dva/router';
import React, { FC, useEffect, useState } from 'react';

import { Dispatch } from '../../models/dispatch';
import { Auth, BasicAuth, LoginStatus, UserProfile } from '../../models/user';
import FormContent from './components/FormContent';

import AuthPageLayout from './components/AuthPageLayout';

interface Props {
  auth: Auth;
  loginLoading: boolean;
  profile: UserProfile;
  loginStatus: LoginStatus;
  login: (params: BasicAuth) => void;
}

export const Login: FC<Props> = (props) => {
  const { login, loginStatus, loginLoading, profile, auth } = props;
  const [state, setState] = useState({ message: '' });

  useEffect(() => {
    setState((state) => ({ ...state, message: loginStatus.message }));
  }, [loginStatus.message]);

  const handleLogin = (values: BasicAuth) => {
    login({
      ...values,
      passwordCheckOnly: true,
    });
  };

  useEffect(() => {
    document.title = 'Aurora Web App';
  }, []);

  return (
    <>
      {!(auth.isAuthenticated && !!profile.profileId) ? (
        <AuthPageLayout>
          <FormContent loading={loginLoading} handleSubmit={handleLogin} passwdErrorMsg={state.message} />
        </AuthPageLayout>
      ) : (
        <Redirect push to={'/app/candidate'} />
      )}
    </>
  );
};

const mapStateToProps = ({ global, loading }: any) => ({
  auth: global.auth,
  profile: global.profile,
  loginStatus: global.loginStatus,
  loginLoading:
    loading.effects['global/login'] ||
    loading.effects['global/fetchMyProfiles'] ||
    loading.effects['global/fetchProfile'],
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  login: (params: BasicAuth) => {
    dispatch({ type: 'global/login', payload: params });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
