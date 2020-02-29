import { Checkbox, Input, InputCard, MonthPicker, TextArea, YearPicker } from '@aurora_app/ui-library';
import { Form } from 'antd';
import { Col, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { useEffect, useState } from 'react';

import { ErrorType, WorkHistoryFields } from '../../../utils/constants';
import { formatErrorMessage } from '../../../utils/errorHandle';
import { Position, VoidFunc } from './interfaces';

import styles from './WorkHistoryForm.module.scss';

export interface Props extends FormComponentProps {
  checkPosition: boolean;
  startDateMonthChange: VoidFunc;
  startDateYearChange: VoidFunc;
  endDateMonthChange: VoidFunc;
  endDateYearChange: VoidFunc;
  titleChange: VoidFunc;
  experienceChange: VoidFunc;
  stillWorkingChange: VoidFunc;
  locationChange: VoidFunc;
  uniqueIndex: number;
  position: Position;
  focusTitle: boolean;
  saveData: () => void;
  deletePosition: () => void;
  checkValidPosition: (value: boolean) => void;
  changeCheckPositionState: (value: boolean) => void;
}

const JobPosition: React.FC<Props> = (props) => {
  const {
    deletePosition,
    form,
    titleChange,
    experienceChange,
    stillWorkingChange,
    saveData,
    startDateMonthChange,
    startDateYearChange,
    endDateMonthChange,
    endDateYearChange,
    checkValidPosition,
    checkPosition,
    changeCheckPositionState,
    uniqueIndex,
    locationChange,
    position,
    focusTitle,
  } = props;
  const { getFieldDecorator, setFieldsValue, validateFields, getFieldError, getFieldsValue } = form;
  const [isChecked, setChecked] = useState(position.stillWorking);
  const [focusJobTitle, setFocusJobTitle] = useState<boolean>(focusTitle);
  const maxExperienceLength: number = 500;
  const maxFieldLength: number = 100;

  useEffect(() => {
    setChecked(position.stillWorking);
  }, [setChecked, position, uniqueIndex]);

  useEffect(() => {
    if (checkPosition) {
      validateFields((errors: any, values: any) => {
        if (!errors) {
          checkValidPosition(true);
        } else {
          checkValidPosition(false);
        }
      });
      changeCheckPositionState(false);
    }
  }, [validateFields, checkValidPosition, checkPosition, changeCheckPositionState]);

  useEffect(() => {
    setFocusJobTitle(focusTitle);
  }, [focusTitle]);

  const savePosition = (fieldName: string): void => {
    validateFields([fieldName], (errors: any, values: any) => {
      if (!errors) {
        saveData();
      }
    });
  };

  const deleteJobPosition = (): void => {
    deletePosition();
    setFocusJobTitle(false);
  };

  return (
    <InputCard onDismiss={deleteJobPosition} title={position.title} removable className={styles.positionCard}>
      {getFieldDecorator(`${WorkHistoryFields.POSITION}-${uniqueIndex}`, {
        rules: [
          { required: true, message: formatErrorMessage('Job title', ErrorType.REQUIRED) },
          {
            max: maxFieldLength,
            message: formatErrorMessage('Job title', ErrorType.MAX_LENGTH, maxFieldLength),
          },
        ],
        initialValue: position.title,
      })(
        <Input
          label={'Job Title'}
          onChange={titleChange}
          onBlur={() => savePosition(`${WorkHistoryFields.POSITION}-${uniqueIndex}`)}
          validateStatus={getFieldError(`${WorkHistoryFields.POSITION}-${uniqueIndex}`) ? 'error' : ''}
          autoFocus={focusJobTitle}
        />,
      )}
      {getFieldDecorator(`${WorkHistoryFields.LOCATION}-${uniqueIndex}`, {
        rules: [
          { required: true, message: formatErrorMessage('Location', ErrorType.REQUIRED) },
          { max: maxFieldLength, message: formatErrorMessage('Location', ErrorType.MAX_LENGTH, maxFieldLength) },
        ],
        initialValue: position.addressCountry,
      })(
        <Input
          label={'Location'}
          onChange={locationChange}
          onBlur={() => savePosition(`${WorkHistoryFields.LOCATION}-${uniqueIndex}`)}
          validateStatus={getFieldError(`${WorkHistoryFields.LOCATION}-${uniqueIndex}`) ? 'error' : ''}
        />,
      )}
      <Row type="flex" className={styles.dateContainer} gutter={16}>
        <Col xs={24} sm={16}>
          <Row gutter={16}>
            <Col md={24} lg={12}>
              {getFieldDecorator(`${WorkHistoryFields.START_MONTH}-${uniqueIndex}`, {
                initialValue: position.startMonth || '',
              })(
                <MonthPicker
                  label="Start Month"
                  onSelectMonth={(startMonth: string) => {
                    setFieldsValue({ [`${WorkHistoryFields.START_MONTH}-${uniqueIndex}`]: startMonth });
                    startDateMonthChange(startMonth);
                  }}
                  onBlur={() =>
                    startDateMonthChange(getFieldsValue()[`${WorkHistoryFields.START_MONTH}-${uniqueIndex}`])
                  }
                />,
              )}
            </Col>
            <Col md={24} lg={12}>
              {getFieldDecorator(`${WorkHistoryFields.START_YEAR}-${uniqueIndex}`, {
                initialValue: position.startYear || '',
              })(
                <YearPicker
                  onSelectYear={(startYear: string) => {
                    setFieldsValue({ [`${WorkHistoryFields.START_YEAR}-${uniqueIndex}`]: startYear });
                    startDateYearChange(startYear);
                  }}
                  onBlur={() => startDateYearChange(getFieldsValue()[`${WorkHistoryFields.START_YEAR}-${uniqueIndex}`])}
                  label="Start Year"
                />,
              )}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={24} lg={12}>
              {getFieldDecorator(`${WorkHistoryFields.END_MONTH}-${uniqueIndex}`, {
                initialValue: position.endMonth || '',
              })(
                <MonthPicker
                  label="End Month"
                  disabled={position.stillWorking}
                  onSelectMonth={(endMonth: string) => {
                    setFieldsValue({ [`${WorkHistoryFields.END_MONTH}-${uniqueIndex}`]: endMonth });
                    endDateMonthChange(endMonth);
                  }}
                  onBlur={() => endDateMonthChange(getFieldsValue()[`${WorkHistoryFields.END_MONTH}-${uniqueIndex}`])}
                />,
              )}
            </Col>
            <Col md={24} lg={12}>
              {getFieldDecorator(`${WorkHistoryFields.END_YEAR}-${uniqueIndex}`, {
                initialValue: position.endYear || '',
              })(
                <YearPicker
                  onSelectYear={(endYear: string) => {
                    setFieldsValue({ [`${WorkHistoryFields.END_YEAR}-${uniqueIndex}`]: endYear });
                    endDateYearChange(endYear);
                  }}
                  onBlur={() => endDateYearChange(getFieldsValue()[`${WorkHistoryFields.END_YEAR}-${uniqueIndex}`])}
                  label="End Year"
                  disabled={position.stillWorking}
                />,
              )}
            </Col>
          </Row>
        </Col>
        <Col className={styles.stillWorking} xs={24} sm={8}>
          <Checkbox name={'Still working'} onChange={stillWorkingChange} checked={isChecked}>
            {'Still Working'}
          </Checkbox>
        </Col>
      </Row>
      <Row className={styles.experience}>
        {getFieldDecorator(`${WorkHistoryFields.EXPERIENCE}-${uniqueIndex}`, {
          rules: [
            {
              max: maxExperienceLength,
              message: formatErrorMessage('Experience', ErrorType.MAX_LENGTH, maxExperienceLength),
            },
          ],
          initialValue: position.experience,
        })(
          <TextArea
            style={{ marginBottom: '0px' }}
            label={!position.experience ? 'Type in your experience here' : ''}
            onChange={experienceChange}
            onBlur={() => savePosition(`${WorkHistoryFields.EXPERIENCE}-${uniqueIndex}`)}
            autoSize
            validateStatus={getFieldError(`${WorkHistoryFields.EXPERIENCE}-${uniqueIndex}`) ? 'error' : ''}
          />,
        )}
      </Row>
    </InputCard>
  );
};

export default Form.create<Props>()(JobPosition);
