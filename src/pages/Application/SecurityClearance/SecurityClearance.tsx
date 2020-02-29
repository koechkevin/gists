import { Input, InputCard, Loading, MonthPicker, YearPicker } from '@aurora_app/ui-library';
import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { ErrorType, StepName } from '../../../utils/constants';
import { formatErrorMessage } from '../../../utils/errorHandle';
import { checkAllFieldsFilled, getIntegerMonth, getMonth, isEmptyForm } from '../../../utils/utils';
import { ApplicationController, ApplicationHeader } from '../components';
import { Params, SecurityClearance, Step } from '../models/interfaces';

import styles from './Clearance.module.scss';

interface Props extends FormComponentProps, RouteComponentProps<Params> {
  loading: boolean;
  clearance: SecurityClearance[];
  applicationSteps: Step[];
  updateApplication: (applicationId: string, stepName: string, application: any) => void;
}

const SecurityClearances: FC<Props> = (props) => {
  const { form, match, loading, clearance, updateApplication, applicationSteps } = props;
  const { getFieldDecorator, validateFields, setFieldsValue, getFieldsValue, getFieldError } = form;
  const { id, step } = match.params;
  const currentStep = applicationSteps.find((item: Step) => item.stepName === step);

  const [formValid, setFormValid] = useState<boolean>(!!currentStep?.required);
  const [dateValues, setDateValues] = useState({
    issuedMonth: getMonth(clearance && clearance[0] && clearance[0].issuedMonth),
    issuedYear: clearance && clearance[0] && clearance[0].issuedYear,
  });

  const handleOnBlur = (): void => {
    validateFields((errors, values: SecurityClearance) => {
      if (!errors) {
        saveFormData({ ...values, ...dateValues });
      }
    });
  };

  const update = useCallback(
    (data: SecurityClearance) => {
      if (id) {
        const params = {
          applicationId: id,
          resume: {
            securityClearance: [data],
          },
        };
        updateApplication(id, StepName.securityClearance, params);
      }
    },
    [id, updateApplication],
  );

  const saveFormData = useCallback(
    (item: SecurityClearance) => {
      const data = { ...item, issuedMonth: item.issuedMonth ? getIntegerMonth(item.issuedMonth) : undefined };
      update(data);
    },
    [update],
  );

  useEffect(() => {
    setDateValues({
      issuedMonth: getMonth(clearance && clearance[0] && clearance[0].issuedMonth),
      issuedYear: clearance && clearance[0] && clearance[0].issuedYear,
    });
  }, [clearance]);

  const onDateChange: (e: any, label: string) => void = (e: any, label: string) => {
    e.persist();
    setDateValues((s) => ({ ...s, [label]: e.target.value }));
  };

  useEffect(() => {
    const isEmpty: boolean = clearance && clearance[0] ? isEmptyForm(clearance[0]) : true;
    const fieldsValue: object = getFieldsValue();
    const allFieldsFilled: boolean = checkAllFieldsFilled(true, fieldsValue);

    if (currentStep?.required) {
      if (!allFieldsFilled || isEmptyForm(fieldsValue)) {
        setFormValid(false);
      } else {
        setFormValid(true);
      }
    } else {
      !isEmpty && !allFieldsFilled ? setFormValid(false) : setFormValid(true);
    }
  }, [currentStep, clearance, getFieldsValue]);

  return (
    <>
      <ApplicationHeader title="Security Clearance" match={match} />
      <div className={styles.clearancePage} key={id}>
        {loading ? (
          <Loading />
        ) : (
          <InputCard className={styles.inputCard}>
            <Form hideRequiredMark>
              {getFieldDecorator('name', {
                initialValue: clearance && clearance[0] && clearance[0].name ? clearance[0].name : '',
                rules: [{ max: 127, message: formatErrorMessage('Security clearance', ErrorType.MAX_LENGTH, 127) }],
              })(
                <Input
                  label="Security Clearance"
                  autoComplete="off"
                  onBlur={handleOnBlur}
                  validateStatus={getFieldError('name') ? 'error' : ''}
                />,
              )}
              <Row gutter={12} type="flex">
                <Col xs={24} sm={12}>
                  {getFieldDecorator(`issuedMonth`, {
                    initialValue: getMonth(clearance && clearance[0] && clearance[0].issuedMonth),
                  })(
                    <MonthPicker
                      onBlur={handleOnBlur}
                      label="Month"
                      onSelectMonth={(issuedMonth: any) => {
                        setFieldsValue({ issuedMonth });
                        saveFormData({ ...getFieldsValue(), issuedMonth });
                      }}
                      onChange={(e: any) => onDateChange(e, 'issuedMonth')}
                    />,
                  )}
                </Col>
                <Col xs={24} sm={12}>
                  {getFieldDecorator('issuedYear', {
                    initialValue: (clearance && clearance[0] && clearance[0].issuedYear) || '',
                  })(
                    <YearPicker
                      label="Year"
                      onBlur={handleOnBlur}
                      onSelectYear={(issuedYear) => {
                        setFieldsValue({ issuedYear });
                        saveFormData({ ...getFieldsValue(), issuedYear });
                      }}
                      onChange={(e: any) => onDateChange(e, 'issuedYear')}
                    />,
                  )}
                </Col>
              </Row>
            </Form>
          </InputCard>
        )}
      </div>
      <ApplicationController match={match} disableNext={!formValid} />
    </>
  );
};

const mapStateToProps = ({
  application: {
    application: { resume: { securityClearance } },
    applicationSteps,
    loading,
  },
}) => ({
  loading,
  applicationSteps,
  clearance: securityClearance,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateApplication: (applicationId: string, stepName: string, application: any) => {
    dispatch({
      type: 'application/updateApplication',
      payload: { applicationId, application, stepName },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create<Props>()(SecurityClearances));
