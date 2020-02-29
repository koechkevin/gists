import { Input, Paragraph, ResendCode, Title } from '@aurora_app/ui-library';
import { faSpinnerThird } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { isEqual, parseInt } from 'lodash';
import React, { FC, FormEvent, useEffect, useState } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { NumberRegex } from '../../../utils/regTools';
import { ActivateAccount, ApplyAuthState } from '../models/interfaces';
import styles from './FormContent.module.scss';

interface Props extends FormComponentProps {
  loading: boolean;
  passValue: string;
  resendCodeLoading: boolean;
  applyAuth: ApplyAuthState;
  resendCode: (data: string) => void;
  activateAccount: (data: ActivateAccount) => void;
}

export const FormContent: FC<Props> = (props) => {
  const { form, resendCode, loading, resendCodeLoading, activateAccount, applyAuth, passValue } = props;
  const { getFieldDecorator, validateFields, getFieldError, getFieldValue } = form;
  const { email, message, userId } = applyAuth;

  const [state, setState] = useState({
    validating: false,
    activated: false,
    formValid: false,
    inputValid: false,
    showModal: false,
    formError: '',
  });

  const updateFormError = (errors?: string[]): void => {
    if (errors) {
      setState((state) => ({ ...state, formValid: false, formError: errors[0] }));
    }
  };

  const clearError = (): void => {
    setState((state) => ({ ...state, validating: true, formError: '' }));
  };

  const showResendCodeModal = () => {
    setState((state) => ({ ...state, showModal: true }));
  };

  const hideResendCodeModal = (): void => {
    setState((state) => ({ ...state, showModal: false }));
  };

  const checkInputValue = (): void => {
    const data = getFieldValue('verificationCode');

    if (data) {
      setState((state) => ({ ...state, inputValid: true }));
    } else {
      setState((state) => ({ ...state, inputValid: false }));
    }
  };

  const validateInput = () => {
    if (state.validating) {
      validateFields((errors) => {
        if (!errors) {
          setState((state) => ({ ...state, formValid: true }));
        } else {
          const codeErrors = getFieldError('verificationCode');
          updateFormError(codeErrors);
        }
      });
      setState((state) => ({ ...state, validating: false }));
    }
  };

  const activateUserAccount = (code: number): void => {
    const username = email;
    activateAccount({ userId, code, username, password: passValue });
  };

  const resendVerifyMessage = (): void => {
    resendCode(email);
  };

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault();
    validateFields((errors) => {
      if (!errors) {
        const code = parseInt(getFieldValue('verificationCode'), 10);
        activateUserAccount(code);
      } else {
        const codeErrors = getFieldError('verificationCode');
        updateFormError(codeErrors);
      }
    });
  };

  useEffect(() => {
    if (state.validating) {
      setState((state) => ({ ...state, formValid: state.validating }));
    }
  }, [state.validating]);

  useEffect(() => {
    if (!state.activated && !isEqual(applyAuth.status, 'active')) {
      setState((state) => ({ ...state, activated: true }));
    }
  }, [applyAuth.status, state.activated, state.validating]);

  useEffect(() => {
    if (message) {
      setState((state) => ({ ...state, formValid: false, showModal: false, formError: message }));
    } else {
      setState((state) => ({ ...state, formValid: true, formError: '' }));
    }
  }, [message]);

  useEffect(() => {
    setState((state) => ({ ...state, formValid: true }));
  }, []);

  useEffect(() => {
    setState((state) => ({ ...state, showModal: applyAuth.showModal }));
  }, [applyAuth.showModal]);

  return (
    <React.Fragment>
      <ResendCode
        email={email}
        visible={state.showModal}
        loading={resendCodeLoading}
        onCancel={hideResendCodeModal}
        onOk={resendVerifyMessage}
      />
      <Row className={styles.logoContainer}>
        <div className={styles.logoSection} />
      </Row>
      <Row className={styles.titleContainer}>
        <Title level={3}>Verify your email</Title>
      </Row>
      <Row className={styles.formDescription}>
        <Paragraph>{`We've sent a code to ${email}`}</Paragraph>
        <Paragraph className={styles.codeLink}>
          <Link to="#" className={styles.cancelLink} onClick={showResendCodeModal}>
            Didn't get the code
          </Link>
        </Paragraph>
      </Row>
      <Form className={styles.formContent} onSubmit={onSubmit} hideRequiredMark>
        <div style={{ height: '72px' }}>
          {getFieldDecorator('verificationCode', {
            rules: [
              { required: true, message: 'Verification code is required.' },
              { pattern: NumberRegex, message: 'The verification code is invalid.' },
            ],
          })(
            <Input
              validateStatus={!state.formValid && 'error'}
              help={!state.formValid ? state.formError : ''}
              onChange={() => clearError()}
              onBlur={() => validateInput()}
              onKeyUp={checkInputValue}
              label="Verification code"
              autoFocus
              autocomplete="off"
            />,
          )}
        </div>
        <Form.Item>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            disabled={!state.formValid || !state.inputValid}
            className={styles.button}
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinnerThird} style={{ height: '22px', width: '22px' }} spin />
            ) : (
              'Verify'
            )}
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

const mapStateToProps = ({ applyAuth, loading }: any) => ({
  loading:
    loading.effects['applyAuth/activateAccount'] ||
    loading.effects['global/login'] ||
    loading.effects['global/fetchMyProfiles'] ||
    loading.effects['global/fetchProfile'],
  resendCodeLoading: loading.effects['applyAuth/resendVerificationMessage'],
  applyAuth,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  resendCode: (email: string) => {
    dispatch({ type: 'applyAuth/resendVerificationMessage', payload: { email } });
  },

  activateAccount: (params: ActivateAccount) => {
    dispatch({ type: 'applyAuth/activateAccount', payload: params });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create<Props>()(FormContent));
