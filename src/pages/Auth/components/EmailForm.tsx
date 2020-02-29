import { Button, Input, Text, Title } from '@aurora_app/ui-library';
import { Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { Link } from 'dva/router';
import React, { FC, useEffect } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { Routes } from '../../../routes/Routes';
import { EmailRegex } from '../../../utils/regTools';

import styles from './EmailForm.module.scss';

interface EmailFormProps extends FormComponentProps {
  loading: boolean;
  emailSendingErrors: any[];
  fogotPasswordAction: (email: string) => void;
  resetErrors: () => void;
}

const EmailForm: FC<EmailFormProps> = (props) => {
  const { form, fogotPasswordAction, loading, emailSendingErrors, resetErrors } = props;
  const { getFieldDecorator, getFieldValue, getFieldError, setFields } = form;

  const submit = () => {
    fogotPasswordAction(getFieldValue('email'));
  };

  useEffect(() => {
    if (emailSendingErrors.length) {
      setFields({
        email: {
          value: getFieldValue('email'),
          errors: [new Error(emailSendingErrors[0].message)],
        },
      });
    }
  }, [emailSendingErrors, setFields, getFieldValue]);

  useEffect(() => resetErrors, [resetErrors]);

  return (
    <Row className={styles.align}>
      <Title className={styles.title} level={3}>
        Forgot Password?
      </Title>
      <Text className={styles.text}>
        Enter the email address you used when you joined and we’ll send you instructions to reset your password.
      </Text>
      <Row style={{ marginTop: 32 }}>
        <Form className={styles.form}>
          {getFieldDecorator('email', {
            validateTrigger: 'onBlur',
            rules: [
              {
                pattern: EmailRegex,
                message: 'Please enter a valid email address.',
              },
            ],
          })(<Input validateStatus={getFieldError('email') ? 'error' : ''} label="Your Email" />)}
          <Button
            disabled={!getFieldValue('email') || getFieldError('email')}
            loading={loading}
            onClick={submit}
            style={{ marginTop: 32, width: '100%' }}
            type="primary"
          >
            Get Reset Email
          </Button>
          <Row style={{ marginTop: 32, textAlign: 'center' }}>
            <Link to={Routes.Login}>
              <Text className={`${styles.text} ${styles.login}`}>Back to login</Text>
            </Link>
          </Row>
        </Form>
      </Row>
    </Row>
  );
};

const mapStateToProps = ({ loading, global }: any) => ({
  loading: loading.effects['global/forgotPassword'],
  emailSendingErrors: global.emailSendingErrors,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fogotPasswordAction: (email: string) => dispatch({ type: 'global/forgotPassword', payload: email }),
    resetErrors: () => dispatch({ type: 'global/loadEmailSendingErrors', payload: [] }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create<EmailFormProps>()(EmailForm));
