import { Button, Icon, Input, Text, Title } from '@aurora_app/ui-library';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { Redirect, RouteComponentProps } from 'dva/router';
import React, { FC, useEffect } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { Routes } from '../../../routes/Routes';
import { LowerCaseRegex, SpecialCharRegex, UpperCaseRegex } from '../../../utils/regTools';

import styles from './PasswordsForm.module.scss';

const { create } = Form;

interface PasswordsFormProps extends FormComponentProps, RouteComponentProps {
  fillPasswordAction: (data: any, authKey: string) => void;
  resetPasswordRecovered: () => void;
  loading: boolean;
  passwordRecovered: boolean;
}

const PasswordsForm: FC<PasswordsFormProps> = (props) => {
  const {
    form,
    fillPasswordAction,
    loading,
    resetPasswordRecovered,
    passwordRecovered,
    location: { search },
  } = props;
  const { getFieldDecorator, getFieldValue, getFieldsValue } = form;

  const passwordValue = getFieldValue('newPassword');
  const confirmPasswordValue = getFieldValue('confirmNewPassword');

  const charLen: boolean = passwordValue?.length >= 8 && passwordValue?.length <= 25;
  const hasOneLowerCase: boolean = passwordValue && LowerCaseRegex.test(passwordValue);
  const hasOneUpperCase: boolean = passwordValue && UpperCaseRegex.test(passwordValue);
  const hasSpecialChar: boolean = passwordValue && SpecialCharRegex.test(passwordValue);

  const isFormValid: boolean =
    charLen && hasSpecialChar && hasOneUpperCase && hasOneLowerCase && confirmPasswordValue === passwordValue;

  const submit = () => {
    const data = getFieldsValue();
    if (search) {
      fillPasswordAction(data, search);
    }
  };

  useEffect(() => resetPasswordRecovered, [resetPasswordRecovered]);

  if (passwordRecovered) {
    return <Redirect to={Routes.Login} />;
  }

  if (!search.includes('auth_key')) {
    return <Redirect to={Routes.NotFound} />;
  }

  return (
    <Row className={styles.align}>
      <Title className={styles.title} level={3}>
        Password Reset
      </Title>
      <Text className={styles.text}>Enter your new password</Text>
      <Form className={styles.form}>
        <Row>{getFieldDecorator('newPassword', {})(<Input validateStatus="" label="New Password" password />)}</Row>
        <Row>
          <Form.Item style={{ margin: '0 0 24px 0' }}>
            <Row className={styles.item}>
              <Row type="flex" align="middle">
                <Icon color={charLen ? '#009426' : '#d8d8d8'} icon={faCheckCircle} />{' '}
                <Text className={`${styles.normalText} ${charLen ? styles.success : ''}`}>
                  Between 8 to 25 characters
                </Text>
              </Row>
              <Row type="flex" align="middle">
                <Icon color={hasOneLowerCase ? '#009426' : '#d8d8d8'} icon={faCheckCircle} />{' '}
                <Text className={`${styles.normalText} ${hasOneLowerCase ? styles.success : ''}`}>
                  1 lowercase character
                </Text>
              </Row>
              <Row type="flex" align="middle">
                <Icon color={hasOneUpperCase ? '#009426' : '#d8d8d8'} icon={faCheckCircle} />{' '}
                <Text className={`${styles.normalText} ${hasOneUpperCase ? styles.success : ''}`}>1 UPPERCASE</Text>
              </Row>
              <Row type="flex" align="middle">
                <Icon color={hasSpecialChar ? '#009426' : '#d8d8d8'} icon={faCheckCircle} />{' '}
                <Text className={`${styles.normalText} ${hasSpecialChar ? styles.success : ''}`}>
                  1 number or special character
                </Text>
              </Row>
            </Row>
          </Form.Item>
        </Row>
        <Row>
          {getFieldDecorator('confirmNewPassword', {})(<Input validateStatus="" label="New Password" password />)}
        </Row>
        <Row>
          <Button
            loading={loading}
            onClick={submit}
            disabled={!isFormValid}
            style={{ width: '100%', marginTop: 16 }}
            type="primary"
          >
            Reset and Login
          </Button>
        </Row>
      </Form>
    </Row>
  );
};

const mapStateToProps = ({ loading, global }: any) => ({
  loading: loading.effects['global/fillNewPassword'],
  passwordRecovered: global.passwordRecovered,
});
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fillPasswordAction: (data: any, authKey: string) =>
      dispatch({ type: 'global/fillNewPassword', payload: { data, authKey } }),
    resetPasswordRecovered: () => dispatch({ type: 'global/loadPasswordRecovered', payload: false }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(create<PasswordsFormProps>()(PasswordsForm));
