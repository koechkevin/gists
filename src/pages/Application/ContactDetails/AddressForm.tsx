import { Input } from '@aurora_app/ui-library';
import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { get } from 'lodash';
import React, { FC, useEffect } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { ErrorType, FormSectionTypes } from '../../../utils/constants';
import { formatErrorMessage } from '../../../utils/errorHandle';
import { ApplicationForm, JobApplication } from '../models/interfaces';

import styles from './ContactDetails.module.scss';

const { create } = Form;

interface Props extends FormComponentProps {
  applicationId: string;
  application: JobApplication;
  applicationForm: ApplicationForm;
  updateApplication: (applicationId: string, application: any) => void;
  disabledNextButton: (value: boolean) => void;
}

const AddressForm: FC<Props> = (props) => {
  const { form, application, updateApplication, applicationId, disabledNextButton, applicationForm } = props;
  const { getFieldDecorator, resetFields, validateFields } = form;

  const onBlur = (): void => {
    validateFields((errors, values) => {
      const updatedApplication = {
        resume: {
          contactInformation: { ...application.resume.contactInformation, ...values },
        },
      };

      if (!errors) {
        updateApplication(applicationId, updatedApplication);
      } else {
        disabledNextButton(true);
      }
    });
  };

  useEffect(() => {
    resetFields();
  }, [application, resetFields]);

  return (
    <Form hideRequiredMark>
      <Row className={styles.address} key={applicationId}>
        {getFieldDecorator('streetAddress', {
          initialValue: get(application, 'resume.contactInformation.streetAddress', ''),
          rules: [
            {
              required: applicationForm?.contactInformation.stepFieldsTypes.streetAddress === FormSectionTypes.REQUIRED,
              message: formatErrorMessage('Street', ErrorType.REQUIRED),
            },
          ],
        })(<Input validateStatus="" onBlur={onBlur} autoComplete="street-address" label="Street" />)}
        <Row gutter={12}>
          <Col>
            <Row gutter={12}>
              <Col sm={12}>
                {getFieldDecorator('country', {
                  initialValue: get(application, 'resume.contactInformation.country', ''),
                  rules: [
                    {
                      required:
                        applicationForm?.contactInformation.stepFieldsTypes.country === FormSectionTypes.REQUIRED,
                      message: formatErrorMessage('Country', ErrorType.REQUIRED),
                    },
                  ],
                })(<Input validateStatus="" autoComplete="country" onBlur={onBlur} label="Country" />)}
              </Col>
              <Col sm={12}>
                {getFieldDecorator('cityName', {
                  initialValue: get(application, 'resume.contactInformation.cityName'),
                })(<Input validateStatus="" onBlur={onBlur} label="City" />)}
              </Col>
            </Row>
          </Col>
          <Col>
            <Row type="flex" className={styles.inputRow} gutter={12}>
              <Col xs={24} sm={12}>
                {getFieldDecorator('postalCode', {
                  initialValue: get(application, 'resume.contactInformation.postalCode', ''),
                })(<Input validateStatus="" type="tel" onBlur={onBlur} label="Postal Code" />)}
              </Col>
              <Col xs={24} sm={12}>
                {getFieldDecorator('region', {
                  initialValue: get(application, 'resume.contactInformation.region', ''),
                })(<Input validateStatus="" onBlur={onBlur} label="Region" />)}
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

export default connect(mapStateToProps, mapDispatchToProps)(create()(AddressForm));
