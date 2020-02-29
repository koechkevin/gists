import { Input, Paragraph, Title } from '@aurora_app/ui-library';
import { faSpinnerThird } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { camelCase, forIn, lowerCase, split, startCase, upperFirst } from 'lodash';
import React, { FC, FormEvent, useCallback, useEffect, useState } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { GeneralLangRegex, WordRegex } from '../../../utils/regTools';
import { ApplyAuthState, FullName } from '../models/interfaces';
import styles from './FormContent.module.scss';

interface Props extends FormComponentProps {
  loading: boolean;
  applyAuth: ApplyAuthState;
  saveName: (params: FullName) => void;
}

export const FormContent: FC<Props> = (props) => {
  const { form, saveName, loading, applyAuth } = props;
  const { getFieldDecorator, validateFields, getFieldError, getFieldsError, getFieldValue, getFieldsValue } = form;
  const [formErrors, setFormErrors] = useState({ firstname: '', lastname: '', form: '' });
  const [formValid, setFormValid] = useState({ firstname: false, lastname: false, form: false, inputs: false });
  const [inputValid, setInputValid] = useState<boolean>(false);

  const updateErrors = useCallback((fieldName: string, errorMessage?: any) => {
    if (fieldName === 'form') {
      setFormValid((formValid) => ({ ...formValid, firstname: true, lastname: true, form: false }));
      setFormErrors((formErrors) => ({
        ...formErrors,
        firstname: '',
        lastname: '',
        form: 'First Name and Last Name are required.',
      }));
    } else {
      setFormValid((formValid) => ({ ...formValid, form: true, [`${fieldName}`]: false }));
      setFormErrors((formErrors) => ({ ...formErrors, [`${fieldName}`]: errorMessage }));
    }
  }, []);

  useEffect(() => {
    setFormValid((formValid) => ({ ...formValid, firstname: true, lastname: true, form: true }));
  }, []);

  useEffect(() => {
    setInputValid(formValid.form && formValid.firstname && formValid.lastname);
  }, [formValid]);

  const validateInput = (fieldName: string): void => {
    validateFields((errors: any) => {
      if (errors && errors[`${fieldName}`]) {
        const fieldError = getFieldError(fieldName);
        updateErrors(fieldName, fieldError && fieldError[0]);
      } else {
        setFormValid((formValid) => ({ ...formValid, [`${fieldName}`]: true }));
        setFormErrors((formErrors) => ({ ...formErrors, [`${fieldName}`]: '' }));
      }
    });
  };

  const clearError = (fieldName: string): void => {
    setFormValid((formValid) => ({ ...formValid, form: true, [`${fieldName}`]: true }));
    setFormErrors((formErrors) => ({ ...formErrors, form: '', [`${fieldName}`]: '' }));
  };

  const handleErrors = (errors: any): void => {
    forIn(errors, (value, key) => {
      if (!value) {
        const data = getFieldValue(key);
        const name = upperFirst(split(key, 'n')[0]);
        data && data
          ? setFormValid((formValid) => ({ ...formValid, [`${key}`]: true }))
          : updateErrors(key, `${name} Name is required`);
      } else {
        updateErrors(key, errors && value[0]);
      }
    });
  };

  const checkInputs = (): void => {
    const { firstname, lastname } = getFieldsValue();
    if (firstname && lastname) {
      setFormValid((formValid) => ({ ...formValid, inputs: true }));
    } else {
      setFormValid((formValid) => ({ ...formValid, inputs: false }));
    }
  };

  const handleInput = (values: any): void => {
    if (values.firstname && values.lastname) {
      saveName({
        firstname: startCase(camelCase(lowerCase(values.firstname))),
        lastname: startCase(camelCase(lowerCase(values.lastname))),
      });
    } else if (values.firstname || values.lastname) {
      forIn(values, (value, key) => {
        if (!value) {
          const name = upperFirst(split(key, 'n')[0]);
          value
            ? setFormValid((formValid) => ({ ...formValid, [`${key}`]: true }))
            : updateErrors(key, `${name} Name is required.`);
        }
      });
    } else {
      updateErrors('form');
    }
  };

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault();
    validateFields((errors, values) => {
      if (!errors) {
        handleInput(values);
      } else {
        const errors = getFieldsError();
        handleErrors(errors && errors);
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
        <Paragraph>Enter Your Required Details Below</Paragraph>
      </Row>
      <Form className={styles.formContent} onSubmit={onSubmit} hideRequiredMark>
        <div style={{ height: '72px' }}>
          {getFieldDecorator('firstname', {
            initialValue: applyAuth.firstname,
            rules: [
              { pattern: GeneralLangRegex, message: 'First Name is invalid.' },
              { pattern: WordRegex, message: 'First Name is invalid.' },
            ],
          })(
            <Input
              onChange={() => clearError('firstname')}
              label="First name"
              autoFocus
              validateStatus={(!formValid.firstname || !formValid.form) && 'error'}
              help={!formValid.firstname ? formErrors.firstname : ''}
              onBlur={() => validateInput('firstname')}
              onKeyUp={checkInputs}
            />,
          )}
        </div>
        <div style={{ height: '72px' }}>
          {getFieldDecorator('lastname', {
            initialValue: applyAuth.lastname,
            rules: [
              { pattern: GeneralLangRegex, message: 'Last Name is invalid.' },
              { pattern: WordRegex, message: 'Last Name is invalid.' },
            ],
          })(
            <Input
              onChange={() => clearError('lastname')}
              label="Last name"
              validateStatus={(!formValid.lastname || !formValid.form) && 'error'}
              help={!formValid.lastname ? formErrors.lastname : !formValid.form ? formErrors.form : ''}
              onBlur={() => validateInput('lastname')}
              onKeyUp={checkInputs}
            />,
          )}
        </div>
        <Form.Item>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            disabled={!inputValid || !formValid.inputs}
            className={styles.button}
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

const mapStateToProps = ({ applyAuth, loading }) => ({
  loading: loading.effects['applyAuth/saveName'],
  applyAuth,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveName: (params: FullName) => {
    dispatch({ type: 'applyAuth/saveName', payload: params });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create<Props>()(FormContent));
