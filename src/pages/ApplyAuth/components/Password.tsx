import { Input, Paragraph, Text, Title } from '@aurora_app/ui-library';
import { faSpinnerThird } from '@fortawesome/pro-duotone-svg-icons';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { forEach, mapValues } from 'lodash';
import React, { FC, FormEvent, useCallback, useEffect, useState } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { BasicAuth } from '../../../models/user';
import { LowercaseRegex, NumberSpecialCharRegex, UppercaseRegex } from '../../../utils/regTools';
import { ApplyAuthState, RegisterAuth } from '../models/interfaces';
import styles from './FormContent.module.scss';

interface Props extends FormComponentProps {
  loading: boolean;
  applyAuth: ApplyAuthState;
  loginStatus: { success: boolean; message: string };
  loginAction: (params: BasicAuth) => void;
  signUpAction: (params: RegisterAuth) => void;
  setPassValue: (param: string) => void;
  cancelUsernameCheck: () => void;
}

export const FormContent: FC<Props> = (props) => {
  const { form, loading, loginAction, signUpAction, applyAuth, loginStatus, cancelUsernameCheck, setPassValue } = props;
  const { email, exist, message, firstname, lastname } = applyAuth;
  const { getFieldDecorator, getFieldValue, validateFields, getFieldError } = form;

  const [validating, setValidating] = useState<boolean>(false);
  const [textValue, setTextValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [textValid, setTextValid] = useState<boolean>(false);
  const [formValid, setFormValid] = useState<boolean>(true);
  const [textErrors, setTextErrors] = useState({
    characterLen: true,
    lowerCase: true,
    upperCase: true,
    specialChar: true,
  });

  const validateInput = useCallback(() => {
    const updatePasswordChecks = (value: boolean) => {
      const updatedValues = mapValues(textErrors, () => value);
      setTextErrors((textErrors) => ({ ...textErrors, ...updatedValues }));
    };

    const handlePasswordErrors = (errors: any): void => {
      const defaultValues = mapValues(textErrors, () => false);
      const failedChecks = {};

      forEach(errors, (value) => {
        failedChecks[`${value}`] = true;
      });
      setTextErrors({ ...defaultValues, ...failedChecks });
    };

    if (textValue) {
      validateFields((errors) => {
        if (!errors) {
          setTextValid(true);
          updatePasswordChecks(false);
        } else {
          setTextValid(false);
          const errors = getFieldError('password');
          handlePasswordErrors(errors);
        }
      });
    } else {
      updatePasswordChecks(true);
    }
    setValidating(false);
  }, [textValue, textErrors, getFieldError, validateFields]);

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const password = getFieldValue('password');
    setPassValue(password);
    const username = email;
    const signupDetails = { firstname, lastname, password, username };
    exist ? loginAction({ username, password }) : signUpAction(signupDetails);
  };

  useEffect(() => {
    setValidating(true);
    setFormValid(true);
  }, [textValue]);

  useEffect(() => {
    const handleFormErrors = (containsError: boolean = true, message: string = '') => {
      setFormValid(containsError);
      setErrorMessage(message);
    };

    message ? handleFormErrors(false, message) : handleFormErrors();
  }, [message]);

  useEffect(() => {
    if (validating) {
      setFormValid(true);
      setErrorMessage('');
      validateInput();
    }
  }, [validating, validateInput, setErrorMessage]);

  useEffect(() => {
    if (loginStatus.message) {
      setFormValid(loginStatus.success);
      setErrorMessage(loginStatus.message);
    }
  }, [loginStatus.message, loginStatus.success]);

  return (
    <React.Fragment>
      <Row className={styles.logoContainer}>
        <div className={styles.logoSection} />
      </Row>
      <Row className={styles.titleContainer}>
        <Title level={3}>{exist ? 'Welcome Back' : 'Create a password'}</Title>
      </Row>
      {exist && (
        <Row justify="center" className={styles.formDescription}>
          <Paragraph>Seems you have an account already</Paragraph>
          <Paragraph className={styles.codeLink}>
            {email}{' '}
            <Link className={styles.cancelLink} to="#" onClick={() => cancelUsernameCheck()}>
              It's not me!
            </Link>
          </Paragraph>
        </Row>
      )}
      <Form className={styles.formContent} onSubmit={onSubmit} hideRequiredMark>
        <div style={{ height: '80px' }}>
          {getFieldDecorator('password', {
            rules: [
              { min: 8, message: 'characterLen' },
              { max: 25, message: 'characterLen' },
              { pattern: UppercaseRegex, message: 'upperCase' },
              { pattern: LowercaseRegex, message: 'lowerCase' },
              { pattern: NumberSpecialCharRegex, message: 'specialChar' },
            ],
          })(
            <Input
              validateStatus={!formValid && 'error'}
              help={!formValid ? errorMessage : ''}
              label="Password"
              autoComplete="new-password"
              onChange={(e) => setTextValue(e.target.value)}
              password
              autoFocus
            />,
          )}
        </div>
        {!exist && (
          <Form.Item>
            <span className={styles.validationContainer}>
              <span
                className={`${styles.validationItem} ${
                  textErrors.characterLen ? styles.inactiveIcon : styles.activeIcon
                }`}
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                <Text>Between 8 to 25 characters</Text>
              </span>
              <span
                className={`${styles.validationItem} ${textErrors.lowerCase ? styles.inactiveIcon : styles.activeIcon}`}
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                <Text>1 lowercase character</Text>
              </span>
              <span
                className={`${styles.validationItem} ${textErrors.upperCase ? styles.inactiveIcon : styles.activeIcon}`}
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                <Text>1 UPPERCASE</Text>
              </span>
              <span
                className={`${styles.validationItem} ${
                  textErrors.specialChar ? styles.inactiveIcon : styles.activeIcon
                }`}
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                <Text> 1 numbers or special character</Text>
              </span>
            </span>
          </Form.Item>
        )}
        {exist && (
          <Paragraph className={styles.forgetPassword}>
            <Link to="">Forgot your password?</Link>
          </Paragraph>
        )}
        <Form.Item>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            className={styles.button}
            disabled={exist ? false : !textValid}
          >
            {' '}
            {loading ? (
              <FontAwesomeIcon icon={faSpinnerThird} style={{ height: '22px', width: '22px' }} spin />
            ) : !exist ? (
              'Continue'
            ) : (
              'Login'
            )}
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

const mapStateToProps = ({ global, applyAuth, loading }) => ({
  loading:
    loading.effects['global/login'] ||
    loading.effects['global/fetchMyProfiles'] ||
    loading.effects['global/fetchProfile'] ||
    loading.effects['applyAuth/signUp'],
  applyAuth,
  loginStatus: global.loginStatus,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loginAction: (params: BasicAuth) => {
    dispatch({ type: 'global/login', payload: params });
  },
  signUpAction: (params: RegisterAuth) => {
    dispatch({ type: 'applyAuth/signUp', payload: params });
  },
  cancelUsernameCheck: () => {
    dispatch({ type: 'applyAuth/cancelUsernameCheck' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create<Props>()(FormContent));
