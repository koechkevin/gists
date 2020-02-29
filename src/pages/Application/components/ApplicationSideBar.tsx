import { Loading, Stepper } from '@aurora_app/ui-library';
import { StepTitle } from '@aurora_app/ui-library/lib/Stepper';
import { Row, Steps as AntdSteps } from 'antd';
import React from 'react';

import { createStepsPath, getApplicationStepNumber } from '../../../utils/utils';
import { MatchParams, Step as StepTyped } from '../models/interfaces';

import styles from './ApplicationSideBar.module.scss';

const { Step } = AntdSteps;

interface StepProps extends StepTyped {
  companyId?: string;
  applicationId?: string;
}

interface Props {
  history: any;
  loading: boolean;
  match: MatchParams;
  steps: StepProps[];
  currentStep?: string;
}

const ApplicationSideBar: React.FC<Props> = (props) => {
  const { loading, history, steps, match, currentStep } = props;
  const { id, companyId } = match.params;

  const handleClick = (current: number): void => {
    const item = steps.find((item: StepProps, index: number) => current === index);
    history.push(createStepsPath(item?.stepName, companyId, id));
  };

  return (
    <Row className={styles.appSideBar}>
      {loading ? (
        <Loading spinning />
      ) : (
        <Stepper
          onChange={handleClick}
          className={styles.stepper}
          current={getApplicationStepNumber(steps, currentStep) - 1}
        >
          {steps.map((item: StepProps, index: number) => {
            return (
              <Step
                key={index}
                disabled={item.disabled}
                title={<StepTitle required={item.required} title={item.name} />}
                status={item.stepName === currentStep ? 'process' : item.done ? 'finish' : 'wait'}
              />
            );
          })}
        </Stepper>
      )}
    </Row>
  );
};

export default ApplicationSideBar;
