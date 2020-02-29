import { connect } from 'dva';

import React, { FC, useEffect } from 'react';

import { Dispatch } from '../../models/dispatch';
import AfterEmailSent from './components/AfterEmailSent';
import AuthPageLayout from './components/AuthPageLayout';
import EmailForm from './components/EmailForm';

interface Props {
  isEmailSent: boolean;
  resetEmailSent: () => void;
}
const ForgotPassword: FC<Props> = (props) => {
  const { isEmailSent, resetEmailSent } = props;

  useEffect(() => resetEmailSent, [resetEmailSent]);

  return <AuthPageLayout>{isEmailSent ? <AfterEmailSent /> : <EmailForm />}</AuthPageLayout>;
};

const mapStateToProps = ({ global }: any) => ({
  isEmailSent: global.emailSent,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  resetEmailSent: () => dispatch({ type: 'global/loadEmailSent', payload: false }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);