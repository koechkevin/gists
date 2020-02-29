import { Input, Paragraph } from '@aurora_app/ui-library';
import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { get } from 'lodash';
import React, { FC, useEffect } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { ErrorType, FormSectionTypes } from '../../../utils/constants';
import { formatErrorMessage } from '../../../utils/errorHandle';
import { CountryCode, EmailRegex, PhoneRegex } from '../../../utils/regTools';
import { ApplicationForm, JobApplication } from '../models/interfaces';

import styles from './ContactDetails.module.scss';

const { create } = Form;

interface Props extends FormComponentProps {
  application: JobApplication;
  applicationId: string;
  applicationForm: ApplicationForm;
  updateApplication: (applicationId: string, application: any) => void;
  disabledNextButton: (value: boolean) => void;
}

const PhoneAndEmailForm: FC<Props> = (props) => {
  const { form, application, applicationId, updateApplication, applicationForm, disabledNextButton } = props;
  const { getFieldDecorator, getFieldError, validateFields, resetFields } = form;

  const onBlur = (): void => {
    validateFields((errors, values) => {
      const { mobilePrefix, homePrefix, mobileNumber, phoneNumber, ...restFields } = values;
      const phone = {
        code: homePrefix,
        number: phoneNumber,
      };
      const mobilePhone = {
        code: mobilePrefix,
        number: mobileNumber,
      };
      const updatedApplication = {
        resume: {
          contactInformation: { ...application.resume.contactInformation, ...restFields, phone, mobilePhone },
        },
      };

      if (!errors) {
        updateApplication(applicationId, updatedApplication);
      } else {
        disabledNextButton(true);
      }
    });
  };

  const mobile =
    get(application, 'resume.contactInformation.mobilePhone', '') &&
    get(application, 'resume.contactInformation.mobilePhone', '');
  const home =
    get(application, 'resume.contactInformation.phone', '') && get(application, 'resume.contactInformation.phone', '');
  const mobilePrefix = mobile && mobile.code && mobile.code.replace(/^\D+/g, '');
  const homePrefix = home && home.code && home.code.replace(/^\D+/g, '');
  const phoneNumber = home && home.number;
  const mobileNumber = mobile && mobile.number;

  useEffect(() => {
    resetFields();
  }, [application, resetFields]);

  return (
    <Form hideRequiredMark>
      <Row className={styles.phoneAndEmail} key={applicationId}>
        <h4>Phone number and email</h4>

        <Col>
          {getFieldDecorator('emailAddress', {
            initialValue: get(application, 'resume.contactInformation.emailAddress', ''),
            validateTrigger: 'onBlur',
            rules: [
              {
                required:
                  applicationForm?.contactInformation.stepFieldsTypes.emailAddress === FormSectionTypes.REQUIRED,
                message: formatErrorMessage('Email', ErrorType.REQUIRED),
              },
              { pattern: EmailRegex, message: formatErrorMessage('email', ErrorType.INVALID) },
            ],
          })(
            <Input
              validateStatus={getFieldError('emailAddress') ? 'error' : ''}
              onBlur={onBlur}
              label="Email"
              type="email"
            />,
          )}
        </Col>

        <Row gutter={16}>
          <Col sm={12}>
            <Col>
              <Paragraph>Mobile Phone</Paragraph>
            </Col>
            <Row type="flex">
              <Col className={styles.prefix}>
                {getFieldDecorator('mobilePrefix', {
                  initialValue: `+${parseInt(mobilePrefix, 10) ? mobilePrefix : '1'}`,
                  rules: [
                    { pattern: CountryCode, message: 'Something went wrong with country code.  Please try again.' },
                    {
                      required:
                        applicationForm?.contactInformation.stepFieldsTypes.mobileNumber === FormSectionTypes.REQUIRED,
                      message: formatErrorMessage('Code', ErrorType.REQUIRED),
                    },
                  ],
                })(
                  <Input
                    className={styles.input}
                    onBlur={onBlur}
                    validateStatus={getFieldError('mobilePrefix') ? 'error' : ''}
                  />,
                )}
              </Col>
              <Col className={styles.number}>
                {getFieldDecorator('mobileNumber', {
                  initialValue: mobileNumber,
                  rules: [
                    { pattern: PhoneRegex, message: 'Something went wrong with mobile number.  Please try again.' },
                    {
                      required:
                        applicationForm?.contactInformation.stepFieldsTypes.mobileNumber === FormSectionTypes.REQUIRED,
                      message: formatErrorMessage('Mobile', ErrorType.REQUIRED),
                    },
                  ],
                })(
                  <Input
                    className={styles.input}
                    help={getFieldError('mobileNumber') || ''}
                    type="tel"
                    onBlur={onBlur}
                    validateStatus={getFieldError('mobileNumber') ? 'error' : ''}
                  />,
                )}
              </Col>
            </Row>
          </Col>

          <Col sm={12}>
            <Col>
              <Paragraph>Home Phone</Paragraph>
            </Col>
            <Row type="flex">
              <Col className={styles.prefix}>
                {getFieldDecorator('homePrefix', {
                  initialValue: `+${parseInt(homePrefix, 10) ? homePrefix : '1'}`,
                  rules: [
                    { pattern: CountryCode, message: 'Something went wrong with country code.  Please try again.' },
                    {
                      required:
                        applicationForm?.contactInformation.stepFieldsTypes.phoneNumber === FormSectionTypes.REQUIRED,
                      message: formatErrorMessage('Code', ErrorType.REQUIRED),
                    },
                  ],
                })(
                  <Input
                    className={styles.input}
                    onBlur={onBlur}
                    validateStatus={getFieldError('homePrefix') ? 'error' : ''}
                  />,
                )}
              </Col>
              <Col className={styles.number}>
                {getFieldDecorator('phoneNumber', {
                  initialValue: phoneNumber,
                  rules: [
                    { pattern: PhoneRegex, message: 'Something went wrong with phone number.  Please try again.' },
                    {
                      required:
                        applicationForm?.contactInformation.stepFieldsTypes.phoneNumber === FormSectionTypes.REQUIRED,
                      message: formatErrorMessage('Phone number', ErrorType.REQUIRED),
                    },
                  ],
                })(
                  <Input
                    className={styles.input}
                    type="tel"
                    onBlur={onBlur}
                    validateStatus={getFieldError('phoneNumber') ? 'error' : ''}
                    help={getFieldError('phoneNumber') || ''}
                  />,
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Row>
    </Form>
  );
};

const mapStateToProps = ({ application: { application, applicationForm } }) => ({
  application,
  applicationForm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateApplication: (applicationId: string, application: any) => {
    dispatch({
      type: 'application/updateApplication',
      payload: { applicationId, application },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(create()(PhoneAndEmailForm));
