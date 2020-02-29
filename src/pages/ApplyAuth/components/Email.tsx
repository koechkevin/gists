import { Input, Paragraph, Title } from '@aurora_app/ui-library';
import { faSpinnerThird } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { get } from 'lodash';
import React, { FC, FormEvent, useState } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { BasicUserDetails } from '../../../models/user';
import { EmailRegex } from '../../../utils/regTools';
import { ApplyAuthState } from '../models/interfaces';
import styles from './FormContent.module.scss';

interface Props extends FormComponentProps {
  loading: boolean;
  applyAuth: ApplyAuthState;
  checkUsername: (params: BasicUserDetails) => void;
}

export const FormContent: FC<Props> = (props) => {
  const { form, checkUsername, applyAuth, loading } = props;

  const { getFieldDecorator, getFieldsValue, validateFields } = form;

  const [state, setState] = useState({
    errorMessage: '',
    validForm: true,
    validInput: false,
  });

  const [validating, setValidating] = useState<boolean>(false);

  const handleInputChange = (): void => {
    setValidating(true);
    setState((state) => ({ ...state, validForm: true, errorMessage: '' }));
  };

  const checkValidInput = (): void => {
    const { username } = getFieldsValue();
    if (username) {
      setState((state) => ({ ...state, validInput: true }));
    } else {
      setState((state) => ({ ...state, validInput: false }));
    }
  };

  const displayError = (errors: any): void => {
    const errorMessage = get(errors, ['username', 'errors', '0', 'message']);
    setState((state) => ({ ...state, validForm: false, errorMessage }));
  };

  const handleOnBlur = (): void => {
    if (validating) {
      validateFields((errors) => {
        if (!errors) {
          setState((state) => ({ ...state, validForm: true }));
        } else {
          displayError(errors);
        }
      });
    }
  };

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault();
    validateFields((errors, values) => {
      if (!errors) {
        checkUsername(values);
      } else {
        displayError(errors);
      }
    });
  };

  return (
    <React.Fragment>
      <Row className={styles.logoContainer}>
        <div className={styles.logoSection} />
      </Row>
      <Row className={styles.titleContainer}>
        <Title level={3}>Start Application</Title>
      </Row>
      <Row justify="center" className={styles.formDescription}>
        <Paragraph>Enter your email to start your application</Paragraph>
      </Row>
      <Form className={styles.formContent} onSubmit={onSubmit} hideRequiredMark>
        <div style={{ height: '72px' }}>
          {getFieldDecorator('username', {
            initialValue: applyAuth.email,
            rules: [
              { required: true, message: 'Email address is required.' },
              { pattern: EmailRegex, message: 'The email address is invalid.' },
            ],
          })(
            <Input
              autoFocus
              label="Email"
              autoComplete="username"
              onBlur={handleOnBlur}
              onKeyUp={checkValidInput}
              onChange={handleInputChange}
              validateStatus={!state.validForm ? 'error' : ''}
              help={!state.validForm ? state.errorMessage : ''}
            />,
          )}
        </div>
        <Form.Item>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            className={styles.button}
            disabled={!state.validForm || !state.validInput}
          >
            {' '}
            {loading ? (
              <FontAwesomeIcon icon={faSpinnerThird} style={{ height: '22px', width: '22px' }} spin />
            ) : (
              'Continue'
            )}
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

const mapStateToProps = ({ applyAuth, loading }: any) => ({
  applyAuth,
  loading: loading.effects['applyAuth/checkUsername'],
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  checkUsername: (params: BasicUserDetails) => {
    dispatch({ type: 'applyAuth/checkUsername', payload: params });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create<Props>()(FormContent));
