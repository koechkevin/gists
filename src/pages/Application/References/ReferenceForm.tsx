import { Input, InputCard } from '@aurora_app/ui-library';
import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import React, { ChangeEvent, FC, useCallback, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';

import { Dispatch } from '../../../models/dispatch';
import { ErrorType, StepName } from '../../../utils/constants';
import { formatErrorMessage } from '../../../utils/errorHandle';
import { CountryCode, EmailRegex, PhoneRegex } from '../../../utils/regTools';
import { Reference } from '../models/interfaces';

import styles from './Reference.module.scss';

interface MatchParams {
  id: string;
}

interface Props extends FormComponentProps, RouteComponentProps<MatchParams> {
  number: string;
  addFormClicked: boolean;
  application: any;
  references: Reference[];
  referee: Reference;
  update: () => void;
  setIsFormValid: (isFormValid: boolean) => void;
  saveReference: (references: Reference[]) => void;
  updateApplication: (applicationId: string, stepName: string, application: any) => void;
}

const ReferenceForm: FC<Props> = (props) => {
  const {
    form,
    number,
    referee,
    update,
    references,
    saveReference,
    setIsFormValid,
    addFormClicked,
    updateApplication,
    application,
  } = props;
  const { getFieldDecorator, getFieldValue, getFieldError, isFieldTouched, getFieldsValue, getFieldsError } = form;
  const maxLength: number = 127;
  const emailError = getFieldError(`email-${number}`);
  const validPhone = getFieldValue(`phone-${number}`) || getFieldValue(`email-${number}`);
  const invalidName =
    (isFieldTouched(`name-${number}`) || addFormClicked) &&
    (getFieldError(`name-${number}`) || !getFieldValue(`name-${number}`));

  const updateReferee = (ref: Reference): Reference[] => {
    return references.map((each) => (each.number === number ? ref : each));
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formValues = getFieldsValue();
    formValues[e.target.id] = e.target.value;

    const {
      [`email-${number}`]: email,
      [`name-${number}`]: name,
      [`phone-${number}`]: phoneNumber,
      [`phonePrefix-${number}`]: phonePrefix,
      [`title-${number}`]: title,
      [`company-${number}`]: company,
    } = formValues;

    const newReferees = updateReferee({
      email,
      name,
      phone: {
        code: phonePrefix,
        number: phoneNumber,
      },
      title,
      company,
      number,
    });

    saveReference(newReferees);
  };

  const isFormValid = useCallback((): boolean => {
    let isValid = true;
    const errors = getFieldsError();
    const { [`email-${number}`]: email, [`name-${number}`]: name, [`phone-${number}`]: phone } = getFieldsValue();

    Object.keys(errors).forEach((key: string) => {
      const invalidFields: boolean = !name || !(email || phone);
      if (errors[key] || invalidFields) {
        isValid = false;
      }
    });

    return isValid;
  }, [getFieldsError, getFieldsValue, number]);

  const onBlur = (): void => {
    update();
    setIsFormValid(isFormValid());
  };

  const values = getFieldsValue();

  useEffect(() => {
    const valid: boolean = isFormValid();
    setIsFormValid(valid);
  }, [values, setIsFormValid, isFormValid]);

  const deleteReference = () => {
    const newReferee: any = { ...referee, isDeleted: true };
    const deletedReferee = updateReferee(newReferee);
    saveReference(deletedReferee);

    const updatedApplication = {
      references: references.filter((each) => !each.isDeleted && each.number !== number),
    };

    updateApplication(application.applicationId, StepName.references, updatedApplication);

    if (!isFormValid()) {
      setIsFormValid(true);
    }
  };

  const { phone } = referee;

  const code = phone?.code;
  const phonePrefix = code && code.replace(/^\D+/g, '');
  const phoneNum = phone?.number;

  return (
    <InputCard className={styles.inputCard} title={referee.name} onDismiss={deleteReference} removable>
      <Form>
        <Row gutter={12}>
          <Col>
            {getFieldDecorator(`name-${number}`, {
              initialValue: referee.name || '',
              validateTrigger: 'onBlur',
              rules: [{ max: maxLength, message: formatErrorMessage('Name', ErrorType.MAX_LENGTH, maxLength) }],
            })(
              <Input
                label="Name"
                autoComplete="new-value"
                validateStatus={invalidName || getFieldError(`name-${number}`) ? 'error' : ''}
                help={
                  invalidName
                    ? getFieldError(`name-${number}`) || formatErrorMessage('Referee name', ErrorType.REQUIRED)
                    : ''
                }
                onChange={onChange}
                onBlur={onBlur}
                maxLength={128}
              />,
            )}
          </Col>
          <Col sm={24} lg={12}>
            {getFieldDecorator(`title-${number}`, {
              initialValue: referee.title,
              rules: [
                {
                  max: maxLength,
                  message: formatErrorMessage('Job title', ErrorType.MAX_LENGTH, maxLength),
                },
              ],
            })(
              <Input
                maxLength={128}
                onBlur={onBlur}
                validateStatus={getFieldError(`title-${number}`) ? 'error' : ''}
                onChange={onChange}
                label="Job Title"
                autoComplete="off"
              />,
            )}
            {getFieldDecorator(`email-${number}`, {
              rules: [
                { pattern: EmailRegex, message: formatErrorMessage('email', ErrorType.INVALID) },
                {
                  max: maxLength,
                  message: formatErrorMessage('Email', ErrorType.MAX_LENGTH, maxLength),
                },
              ],
              initialValue: referee.email || '',
              validateTrigger: 'onBlur',
            })(
              <Input
                type="email"
                label="Email"
                validateStatus={(addFormClicked && (emailError || !validPhone)) || emailError ? 'error' : ''}
                help={emailError || ''}
                onChange={onChange}
                onBlur={onBlur}
                maxLength={128}
              />,
            )}
          </Col>
          <Col sm={24} lg={12}>
            {getFieldDecorator(`company-${number}`, {
              initialValue: referee.company || '',
              rules: [
                {
                  max: maxLength,
                  message: formatErrorMessage('Company', ErrorType.MAX_LENGTH, maxLength),
                },
              ],
            })(
              <Input
                maxLength={128}
                validateStatus={getFieldError(`company-${number}`) ? 'error' : ''}
                onBlur={onBlur}
                label="Company"
                autoComplete="off"
                onChange={onChange}
              />,
            )}
            <Row type="flex">
              <Col style={{ width: 69, marginRight: 8 }} className={styles.number}>
                {getFieldDecorator(`phonePrefix-${number}`, {
                  initialValue: `+${phonePrefix || '1'}`,
                  validateTrigger: 'onBlur',
                  rules: [{ pattern: CountryCode, message: formatErrorMessage('country code', ErrorType.INVALID) }],
                })(
                  <Input
                    autoComplete="prefix"
                    validateStatus={
                      (addFormClicked && !validPhone) || getFieldError(`phonePrefix-${number}`) ? 'error' : ''
                    }
                  />,
                )}
              </Col>
              <Col style={{ width: 'calc(100% - 77px)' }} className={styles.number}>
                {getFieldDecorator(`phone-${number}`, {
                  initialValue: phoneNum || '',
                  validateTrigger: 'onBlur',
                  rules: [
                    { pattern: PhoneRegex, message: formatErrorMessage('phone number', ErrorType.INVALID) },
                    {
                      max: maxLength,
                      message: formatErrorMessage('Phone number', ErrorType.MAX_LENGTH, maxLength),
                    },
                  ],
                })(
                  <Input
                    validateStatus={(addFormClicked && !validPhone) || getFieldError(`phone-${number}`) ? 'error' : ''}
                    help={
                      addFormClicked && !validPhone
                        ? formatErrorMessage('Email or phone number', ErrorType.REQUIRED)
                        : getFieldError(`phone-${number}`) || ''
                    }
                    type="tel"
                    onBlur={onBlur}
                    onChange={onChange}
                    autoComplete="new-value"
                    maxLength={128}
                  />,
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </InputCard>
  );
};

const mapStateToProps = ({ application: { references, application } }) => ({
  references,
  application,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateApplication: (applicationId: string, stepName: string, application: any) => {
    dispatch({
      type: 'application/updateApplication',
      payload: { applicationId, application, stepName },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ReferenceForm));
