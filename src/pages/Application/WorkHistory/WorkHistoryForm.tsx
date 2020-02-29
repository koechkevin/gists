import { Input, InputCard } from '@aurora_app/ui-library';
import { Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { useCallback, useEffect, useState } from 'react';

import { ErrorType, WorkHistoryFields } from '../../../utils/constants';
import { formatErrorMessage } from '../../../utils/errorHandle';
import { AddItemButton } from '../components';
import { ParamVoidFunc, StatePosition, VoidFunc } from './interfaces';
import JobPosition from './JobPosition';

import styles from './WorkHistoryForm.module.scss';

interface Props extends FormComponentProps {
  companyTitle: string;
  positions: StatePosition[];
  companyNameChange: VoidFunc;
  deletePosition: VoidFunc;
  titleChange: ParamVoidFunc;
  locationChange: ParamVoidFunc;
  experienceChange: ParamVoidFunc;
  stillWorkingChange: ParamVoidFunc;
  startDateMonthChange: ParamVoidFunc;
  startDateYearChange: ParamVoidFunc;
  endDateMonthChange: ParamVoidFunc;
  endDateYearChange: ParamVoidFunc;
  checkCompany: boolean;
  uniqueIndex: number;
  focusName: boolean;
  saveData: () => void;
  deleteHistory: () => void;
  addPosition: () => void;
  checkCompanyFields: (value: boolean) => void;
}

const WorkHistoryForm: React.FC<Props> = (props) => {
  const {
    form,
    saveData,
    positions,
    titleChange,
    uniqueIndex,
    addPosition,
    checkCompany,
    companyTitle,
    deleteHistory,
    deletePosition,
    locationChange,
    experienceChange,
    companyNameChange,
    stillWorkingChange,
    startDateMonthChange,
    startDateYearChange,
    endDateMonthChange,
    endDateYearChange,
    checkCompanyFields,
    focusName,
  } = props;
  const { getFieldDecorator, validateFields, getFieldError } = form;
  const [checkPosition, setCheckPosition] = useState<boolean>(false);
  const [validPositions, setValidPositions] = useState<boolean>(false);
  const [focusCompanyName, setFocusCompanyName] = useState<boolean>(focusName);
  const [focusJobTitle, setFocusJobTitle] = useState<boolean>(false);
  const [AddButtonDisabled, disableAddButton] = useState<boolean>(false);
  const maxNamesLength: number = 100;

  useEffect(() => {
    if (checkCompany) {
      validateFields((errors: any, values: any) => {
        if (!errors) {
          checkCompanyFields(true);
        } else {
          checkCompanyFields(false);
        }
      });
    }
  }, [checkCompany, checkCompanyFields, validateFields]);

  const addJobPosition = useCallback((): void => {
    addPosition();
    setFocusJobTitle(true);
  }, [addPosition]);

  useEffect(() => {
    if (validPositions) {
      addJobPosition();
      setValidPositions(false);
    }
    setCheckPosition(false);
  }, [addJobPosition, validPositions]);

  useEffect(() => {
    if (positions.length) {
      const allPositionsValid: boolean =
        positions.filter((position: StatePosition) => !!position.title).length === positions.length;
      disableAddButton(!allPositionsValid);
    }

    if (checkPosition && !positions.length) {
      addJobPosition();
      setCheckPosition(false);
    }
  }, [addJobPosition, checkPosition, positions]);

  useEffect(() => {
    setFocusCompanyName(focusName);
  }, [focusName]);

  const saveCompanyInfo = (fieldName: string): void =>
    validateFields([fieldName], (errors: any, values: any) => {
      if (!errors) {
        saveData();
      }
    });

  const addCompanyPosition = (): void => {
    setCheckPosition(true);
  };

  const checkValidPosition = (value: boolean): void => setValidPositions(value);

  const changeCheckPositionState = (value: boolean): void => setCheckPosition(value);

  return (
    <Form hideRequiredMark style={{ width: '100%' }}>
      <InputCard title={companyTitle} onDismiss={deleteHistory} removable className={styles.companyCard}>
        {getFieldDecorator(`${WorkHistoryFields.TITLE}-${uniqueIndex}`, {
          rules: [
            { required: true, message: formatErrorMessage('Company name', ErrorType.REQUIRED) },
            { max: maxNamesLength, message: formatErrorMessage('Company name', ErrorType.MAX_LENGTH, maxNamesLength) },
          ],
          initialValue: companyTitle,
        })(
          <Input
            style={{ marginBottom: '24px' }}
            label={'Company Name'}
            onChange={companyNameChange}
            onBlur={() => saveCompanyInfo(`${WorkHistoryFields.TITLE}-${uniqueIndex}`)}
            validateStatus={getFieldError(`${WorkHistoryFields.TITLE}-${uniqueIndex}`) ? 'error' : ''}
            autoFocus={focusCompanyName}
          />,
        )}
        <AddItemButton
          onClick={addCompanyPosition}
          label={'Job Position'}
          className={styles.addButton}
          disabled={AddButtonDisabled}
        />
        <Row>
          {positions
            .sort((positionA: StatePosition, positionB: StatePosition) => positionA.index - positionB.index)
            .map((position: StatePosition, index: number) => (
              <JobPosition
                key={position.index}
                saveData={saveData}
                position={position}
                checkPosition={checkPosition}
                uniqueIndex={position.index + uniqueIndex}
                checkValidPosition={checkValidPosition}
                titleChange={titleChange(position.index)}
                deletePosition={() => deletePosition(position.index)}
                experienceChange={experienceChange(position.index)}
                stillWorkingChange={stillWorkingChange(position.index)}
                startDateMonthChange={startDateMonthChange(position.index)}
                startDateYearChange={startDateYearChange(position.index)}
                endDateMonthChange={endDateMonthChange(position.index)}
                endDateYearChange={endDateYearChange(position.index)}
                changeCheckPositionState={changeCheckPositionState}
                locationChange={locationChange(position.index)}
                focusTitle={index === positions.length - 1 && focusJobTitle}
              />
            ))}
        </Row>
      </InputCard>
    </Form>
  );
};

export default Form.create<Props>()(WorkHistoryForm);
