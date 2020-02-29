import { Checkbox, Input, InputCard, MonthPicker, YearPicker } from '@aurora_app/ui-library';
import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { ChangeEvent, useEffect, useState } from 'react';

import { ErrorType } from '../../../utils/constants';
import { formatErrorMessage } from '../../../utils/errorHandle';
import { getMonthName } from '../../../utils/utils';
import { EducationHistory } from '../models/interfaces';

import styles from './EducationHistory.module.scss';

enum EducationHistoryFields {
  SCHOOL_NAME = 'shoolName',
  PROGRAM = 'program',
  START_YEAR = 'startYear',
  START_MONTH = 'startMonth',
  END_MONTH = 'endMonth',
  END_YEAR = 'endYear',
}

interface Props extends FormComponentProps {
  checkValid: boolean;
  educationHistory: EducationHistory;
  focusName: boolean;
  submitData: () => void;
  deleteEducation: () => void;
  stopValidityCheck: () => void;
  setValidity: (value: boolean) => void;
  endDateYearChange: (value: string) => void;
  endDateMonthChange: (value: string) => void;
  startDateYearChange: (value: string) => void;
  startDateMonthChange: (value: string) => void;
  schoolInputOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
  programInputOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleStillStudyingCheckBox: (e: ChangeEvent<HTMLInputElement>) => void;
}

const EducationHistoryForm: React.FC<Props> = (props) => {
  const {
    programInputOnChange,
    schoolInputOnChange,
    deleteEducation,
    startDateMonthChange,
    startDateYearChange,
    endDateMonthChange,
    endDateYearChange,
    submitData,
    form,
    educationHistory,
    checkValid,
    setValidity,
    stopValidityCheck,
    handleStillStudyingCheckBox,
    focusName,
  } = props;
  const { getFieldDecorator, setFieldsValue, validateFields, getFieldError, getFieldsValue } = form;
  const [checked, setChecked] = useState<boolean>(educationHistory.stillStudying);
  const [focusOnSchoolName, setSchoolNameFocus] = useState<boolean>(focusName);
  const maxInputLength: number = 100;

  const onSubmit = (fieldName: string) => {
    validateFields([fieldName], (errors: any, values: any) => {
      if (!errors) {
        submitData();
      }
    });
  };

  useEffect(() => {
    if (checkValid) {
      validateFields((errors: any, values: any) => {
        if (errors) {
          setValidity(false);
        } else {
          setValidity(true);
        }

        stopValidityCheck();
      });
    }
  }, [validateFields, checkValid, setValidity, stopValidityCheck]);

  useEffect(() => {
    setChecked(educationHistory.stillStudying);
  }, [educationHistory]);

  useEffect(() => {
    setSchoolNameFocus(focusName);
  }, [focusName]);

  return (
    <Form hideRequiredMark className={styles.educationHistoryForm} style={{ width: '100%' }}>
      <InputCard onDismiss={deleteEducation} title={educationHistory.degreeName} removable className={styles.inputCard}>
        {getFieldDecorator(`${EducationHistoryFields.SCHOOL_NAME}-${educationHistory.index}`, {
          rules: [
            { required: true, message: formatErrorMessage('School/University name', ErrorType.REQUIRED) },
            {
              max: maxInputLength,
              message: formatErrorMessage('School/University name', ErrorType.MAX_LENGTH, maxInputLength),
            },
          ],
          initialValue: educationHistory.schoolName,
        })(
          <Input
            label={'School/University'}
            onChange={schoolInputOnChange}
            onBlur={() => onSubmit(`${EducationHistoryFields.SCHOOL_NAME}-${educationHistory.index}`)}
            validateStatus={
              getFieldError(`${EducationHistoryFields.SCHOOL_NAME}-${educationHistory.index}`) ? 'error' : ''
            }
            autoFocus={focusOnSchoolName}
          />,
        )}
        {getFieldDecorator(`${EducationHistoryFields.PROGRAM}-${educationHistory.index}`, {
          rules: [
            { required: true, message: formatErrorMessage('Program name', ErrorType.REQUIRED) },
            {
              max: maxInputLength,
              message: formatErrorMessage('Program name', ErrorType.MAX_LENGTH, maxInputLength),
            },
          ],
          initialValue: educationHistory.degreeName,
        })(
          <Input
            label={'Program'}
            onChange={programInputOnChange}
            onBlur={() => onSubmit(`program-${educationHistory.index}`)}
            validateStatus={getFieldError(`${EducationHistoryFields.PROGRAM}-${educationHistory.index}`) ? 'error' : ''}
          />,
        )}
        <Row gutter={16}>
          <Col sm={16} xs={24}>
            <Row gutter={16}>
              <Col md={24} lg={12}>
                {getFieldDecorator(`${EducationHistoryFields.START_MONTH}-${educationHistory.index}`, {
                  initialValue: getMonthName(educationHistory.startMonth),
                })(
                  <MonthPicker
                    label="Start Month"
                    onBlur={() =>
                      startDateMonthChange(
                        getFieldsValue()[`${EducationHistoryFields.START_MONTH}-${educationHistory.index}`],
                      )
                    }
                    onSelectMonth={(startMonth: string) => {
                      setFieldsValue({
                        [`${EducationHistoryFields.START_MONTH}-${educationHistory.index}`]: startMonth,
                      });
                      startDateMonthChange(startMonth);
                    }}
                  />,
                )}
              </Col>
              <Col md={24} lg={12}>
                {getFieldDecorator(`${EducationHistoryFields.START_YEAR}-${educationHistory.index}`, {
                  initialValue: educationHistory.startYear ? educationHistory.startYear : '',
                })(
                  <YearPicker
                    label="Start Year"
                    onSelectYear={(startYear: string) => {
                      setFieldsValue({ [`${EducationHistoryFields.START_YEAR}-${educationHistory.index}`]: startYear });
                      startDateYearChange(startYear);
                    }}
                    onBlur={() =>
                      startDateYearChange(
                        getFieldsValue()[`${EducationHistoryFields.START_YEAR}-${educationHistory.index}`],
                      )
                    }
                  />,
                )}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} lg={12}>
                {getFieldDecorator(`${EducationHistoryFields.END_MONTH}-${educationHistory.index}`, {
                  initialValue: getMonthName(educationHistory.endMonth),
                })(
                  <MonthPicker
                    label="End Month"
                    onBlur={() =>
                      endDateMonthChange(
                        getFieldsValue()[`${EducationHistoryFields.END_MONTH}-${educationHistory.index}`],
                      )
                    }
                    disabled={checked}
                    onSelectMonth={(endMonth: string) => {
                      setFieldsValue({ [`${EducationHistoryFields.END_MONTH}-${educationHistory.index}`]: endMonth });
                      endDateMonthChange(endMonth);
                    }}
                  />,
                )}
              </Col>
              <Col md={24} lg={12}>
                {getFieldDecorator(`${EducationHistoryFields.END_YEAR}-${educationHistory.index}`, {
                  initialValue: educationHistory.endYear ? educationHistory.endYear : '',
                })(
                  <YearPicker
                    label="End Year"
                    disabled={checked}
                    onSelectYear={(endYear: string) => {
                      setFieldsValue({ [`${EducationHistoryFields.END_YEAR}-${educationHistory.index}`]: endYear });
                      endDateYearChange(endYear);
                    }}
                    onBlur={() =>
                      endDateYearChange(
                        getFieldsValue()[`${EducationHistoryFields.END_YEAR}-${educationHistory.index}`],
                      )
                    }
                  />,
                )}
              </Col>
            </Row>
          </Col>
          <Col className={styles.stillStudying} sm={8} xs={24}>
            <Checkbox name={'Still Studying'} onChange={handleStillStudyingCheckBox} checked={checked}>
              {'Still Studying'}
            </Checkbox>
          </Col>
        </Row>
      </InputCard>
    </Form>
  );
};

export default Form.create<Props>()(EducationHistoryForm);
