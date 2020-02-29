import { Button, Input, Paragraph } from '@aurora_app/ui-library';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Link } from 'dva/router';
import React, { FC, FormEvent, useEffect, useState } from 'react';

import { BasicAuth } from '../../../models/user';
import { Routes } from '../../../routes';

import styles from './FormContent.module.scss';

const { Item } = Form;

interface Props extends FormComponentProps {
  loading: boolean;
  passwdErrorMsg?: string;
  handleSubmit: (params: BasicAuth) => void;
}

export const FormContent: FC<Props> = (props) => {
  const { form, handleSubmit, loading, passwdErrorMsg } = props;
  const { getFieldDecorator, getFieldsValue, validateFields } = form;
  const [state, setState] = useState({ formValid: true, formError: '', fieldsValid: false });

  const clearError = () => {
    setState((state) => ({ ...state, formValid: true, formError: '' }));
  };

  const checkFormValues = () => {
    const data = getFieldsValue();
    if (data.username && data.password) {
      setState({ ...state, fieldsValid: true });
    } else {
      setState({ ...state, fieldsValid: false });
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    validateFields((errors, values) => {
      if (!errors) {
        handleSubmit(values);
      }
    });
  };

  useEffect(() => {
    if (passwdErrorMsg) {
      setState((state) => ({ ...state, formValid: false, formError: passwdErrorMsg }));
    }
  }, [passwdErrorMsg]);

  return (
    <Form className={styles.formContent} hideRequiredMark autoComplete="off" onSubmit={onSubmit}>
      <div style={{ height: '70px' }}>
        {getFieldDecorator('username')(
          <Input
            autoFocus
            label="Email"
            autoComplete="username"
            onChange={clearError}
            onKeyUp={checkFormValues}
            validateStatus={!state.formValid ? 'error' : ''}
          />,
        )}
      </div>
      <div style={{ height: '90px' }}>
        {getFieldDecorator('password')(
          <Input
            password
            label="Password"
            onChange={clearError}
            onKeyUp={checkFormValues}
            autoComplete="new-password"
            validateStatus={!state.formValid ? 'error' : ''}
            help={!state.formValid ? state.formError : ''}
          />,
        )}
      </div>
      <Paragraph className={styles.text}>
        <Link to={Routes.ForgotPassword}>Forgot your password?</Link>
      </Paragraph>
      <Item style={{ marginTop: '32px' }}>
        <Button
          block
          type="primary"
          loading={loading}
          htmlType="submit"
          onClick={onSubmit}
          disabled={!state.fieldsValid || !state.formValid}
        >
          Login
        </Button>
      </Item>
      <Item>
        <Link to="/apply/auth/email">
          <Button type="primary" ghost block>
            Sign Up
          </Button>
        </Link>
      </Item>
    </Form>
  );
};

const CreatedForm = Form.create<Props>()(FormContent);

export default CreatedForm;
