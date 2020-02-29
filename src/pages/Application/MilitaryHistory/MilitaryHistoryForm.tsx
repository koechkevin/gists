import { Input, InputCard, MonthPicker, YearPicker } from '@aurora_app/ui-library';
import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import humps from 'humps';
import React, { FC, useEffect } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { ErrorType, FormSectionTypes, StepName } from '../../../utils/constants';
import { formatErrorMessage } from '../../../utils/errorHandle';
import { getIntegerMonth, getMonth, isEmptyForm } from '../../../utils/utils';
import { ApplicationForm, JobApplication, MilitaryHistory } from '../models/interfaces';

import styles from './MilitaryHistory.module.scss';

interface Props extends FormComponentProps {
  application: JobApplication;
  applicationId: string;
  validationErrors: any[];
  applicationForm: ApplicationForm;
  setDisableNext: (payload: boolean) => void;
  updateApplication: (applicationId: string, stepName: string, application: any) => void;
}

const MilitaryHistoryForm: FC<Props> = (props) => {
  const {
    form,
    application,
    applicationId,
    updateApplication,
    setDisableNext,
    validationErrors,
    applicationForm,
  } = props;
  const {
    getFieldDecorator,
    getFieldValue,
    getFieldsValue,
    resetFields,
    getFieldError,
    setFieldsValue,
    setFields,
  } = form;
  const { country, unitDivision, branch, startYear, endYear, startMonth, endMonth } = getFieldsValue();
  const maxLength: number = 127;

  const data: MilitaryHistory | null =
    application.resume.militaryHistory && application.resume.militaryHistory.length
      ? application.resume.militaryHistory[0]
      : null;

  useEffect(() => {
    resetFields();
  }, [applicationId, resetFields]);

  const branchError = getFieldError('branch');
  const countryError = getFieldError('country');
  const unitError = getFieldError('unitDivision');

  const update = (values = {}) => {
    const formData = {
      startMonth: getIntegerMonth(startMonth || ''),
      endMonth: getIntegerMonth(endMonth || ''),
      startYear,
      endYear,
      country,
      unitDivision,
      branch,
      ...values,
    };

    const updatedApplication = { ...application, resume: { militaryHistory: [formData] } };
    updateApplication(applicationId, StepName.militaryHistory, updatedApplication);
  };

  useEffect(() => {
    const allDatesField = getIntegerMonth(startMonth || '') && getIntegerMonth(endMonth || '') && startYear && endYear;
    const isRequiredStep: boolean = applicationForm?.militaryHistory.stepType === FormSectionTypes.REQUIRED;
    const isEmpty: boolean = isEmptyForm(getFieldsValue());
    const isValidForm: boolean = (isEmpty && !isRequiredStep) || !!(country && unitDivision && branch && allDatesField);

    setDisableNext(!isValidForm);
  }, [
    country,
    unitDivision,
    branch,
    startYear,
    endYear,
    startMonth,
    endMonth,
    setDisableNext,
    getFieldsValue,
    applicationForm,
  ]);

  const onselectMonth = (key: string, value: string) => {
    setFieldsValue({ [key]: value });
    update({ [key]: getIntegerMonth(value) });
  };

  const onSelectYear = (key: string, value: string) => {
    setFieldsValue({ [key]: value });
    update({ [key]: value });
  };

  const validateAndUpdate: (field: string, errorMessage: string) => void = (field: string, errorMessage: string) => {
    if (!getFieldValue(field) && !isEmptyForm(getFieldsValue())) {
      setFields({
        [field]: {
          value: '',
          errors: [new Error(errorMessage)],
        },
      });
    }
    update();
  };

  useEffect(() => {
    validationErrors.forEach((error) => {
      const field = humps.camelize(error.field);
      if (field.includes('militaryHistory')) {
        const fieldName = field && field.split('.')[1];
        setFields({
          [fieldName]: {
            errors: [new Error(error.message)],
          },
        });
      }
      return resetFields;
    });
  }, [validationErrors, resetFields, setFields]);

  useEffect(() => {
    const values = { country, unitDivision, branch, startYear, endYear, startMonth, endMonth };
    if (isEmptyForm(values)) {
      Object.keys(values).forEach((key: string) => {
        if (['string', 'number'].includes(typeof values[key])) {
          setFields({
            [key]: {
              value: values[key],
              errors: undefined,
            },
          });
        }
      });
    }
  }, [country, unitDivision, branch, startYear, endYear, startMonth, endMonth, setFields]);

  return (
    <InputCard className={styles.card}>
      <Form hideRequiredMark key={applicationId}>
        <Row gutter={12}>
          <Col sm={12} xs={24}>
            {getFieldDecorator('country', {
              initialValue: data?.country,
              rules: [
                { required: true, message: formatErrorMessage('Country', ErrorType.REQUIRED) },
                {
                  max: maxLength,
                  message: formatErrorMessage('Country', ErrorType.MAX_LENGTH, maxLength),
                },
              ],
            })(
              <Input
                label="Country"
                onBlur={() => validateAndUpdate('country', formatErrorMessage('Country', ErrorType.REQUIRED))}
                onFocus={() => resetFields(['country'])}
                help={getFieldError('country')}
                validateStatus={countryError ? 'error' : ''}
                maxLength={128}
              />,
            )}
          </Col>
          <Col sm={12} xs={24}>
            {getFieldDecorator('branch', {
              initialValue: data?.branch,
              rules: [
                {
                  max: maxLength,
                  message: formatErrorMessage('Branch', ErrorType.MAX_LENGTH, maxLength),
                },
              ],
            })(
              <Input
                help={getFieldError('branch')}
                label="Branch"
                type="text"
                onBlur={() => validateAndUpdate('branch', formatErrorMessage('Branch', ErrorType.REQUIRED))}
                onFocus={() => resetFields(['branch'])}
                validateStatus={branchError ? 'error' : ''}
                maxLength={128}
              />,
            )}
          </Col>
        </Row>
        <Row>
          {getFieldDecorator('unitDivision', {
            initialValue: data?.unitDivision,
            rules: [
              {
                max: maxLength,
                message: formatErrorMessage('Unit/Division', ErrorType.MAX_LENGTH, maxLength),
              },
            ],
          })(
            <Input
              help={getFieldError('unitDivision')}
              onBlur={() => validateAndUpdate('unitDivision', formatErrorMessage('Unit/Division', ErrorType.REQUIRED))}
              onFocus={() => resetFields(['unitDivision'])}
              validateStatus={unitError ? 'error' : ''}
              label="Unit/Division"
              type="text"
              maxLength={128}
            />,
          )}
        </Row>
        <Row gutter={12}>
          <Col xs={24} md={24} lg={12}>
            {getFieldDecorator('startMonth', {
              initialValue: data?.startMonth && getMonth(data.startMonth),
            })(
              <MonthPicker
                onSelectMonth={(startMonth: string) => onselectMonth('startMonth', startMonth)}
                label="Start Month"
                onBlur={() => update()}
                inputProps={{
                  onFocus: () => resetFields(['startMonth']),
                  help: getFieldError('startMonth'),
                  validateStatus: getFieldError('startMonth') ? 'error' : '',
                  maxLength: 10,
                }}
              />,
            )}
          </Col>
          <Col xs={24} md={24} lg={12}>
            {getFieldDecorator('startYear', {
              initialValue: data?.startYear ? data.startYear : '',
            })(
              <YearPicker
                onSelectYear={(startYear: string) => onSelectYear('startYear', startYear)}
                label="Start Year"
                inputProps={{
                  onBlur: () => {
                    resetFields(['startYear']);
                    update();
                  },
                  help: getFieldError('startYear'),
                  validateStatus: getFieldError('startYear') ? 'error' : '',
                  maxLength: 4,
                }}
              />,
            )}
          </Col>
        </Row>
        <Row gutter={12}>
          <Col md={24} lg={12}>
            {getFieldDecorator('endMonth', {
              initialValue: data?.endMonth && getMonth(data.endMonth),
            })(
              <MonthPicker
                onSelectMonth={(endMonth: string) => onselectMonth('endMonth', endMonth)}
                label="End Month"
                onBlur={() => update()}
                inputProps={{
                  onFocus: () => resetFields(['endMonth']),
                  help: getFieldError('endMonth') || '',
                  validateStatus: getFieldError('endMonth') ? 'error' : '',
                  maxLength: 10,
                }}
              />,
            )}
          </Col>
          <Col md={24} lg={12}>
            {getFieldDecorator('endYear', {
              initialValue: data?.endYear ? data.endYear : '',
            })(
              <YearPicker
                onSelectYear={(endYear: string) => onSelectYear('endYear', endYear)}
                label="End Year"
                inputProps={{
                  onBlur: () => {
                    resetFields(['endYear']);
                    update();
                  },
                  help: getFieldError('endYear'),
                  validateStatus: getFieldError('endYear') ? 'error' : '',
                  maxLength: 4,
                }}
              />,
            )}
          </Col>
        </Row>
      </Form>
    </InputCard>
  );
};

const mapStateToProps = ({ application: { application, validationErrors, applicationForm } }) => ({
  application,
  validationErrors,
  applicationForm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateApplication: (applicationId: string, stepName: string, application: any) =>
    dispatch({
      type: 'application/updateApplication',
      payload: { applicationId, application, stepName },
    }),

  setDisableNext: (payload: boolean) => dispatch({ type: 'application/setDisableNext', payload }),
});

const FormContent = Form.create()(MilitaryHistoryForm);

export default connect(mapStateToProps, mapDispatchToProps)(FormContent);
