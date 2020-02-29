import { connect } from 'dva';

import React, { FC } from 'react';

import AuthPageLayout from './components/AuthPageLayout';
import PasswordsForm from './components/PasswordsForm';

const ForgotPassword: FC<any> = (props) => {
  return (
    <AuthPageLayout>
      <PasswordsForm {...props} />
    </AuthPageLayout>
  );
};

export default connect(() => ({}))(ForgotPassword);
